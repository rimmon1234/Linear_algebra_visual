/**
 * Camera Bounds & 2D Orthographic Framing Engine
 *
 * Implements:
 * 1. Two-stage mathematical scene bounds calculation
 * 2. Strict 1:1 aspect-ratio-aware framing (1 unit X = 1 unit Y)
 * 3. Origin (0, 0) visibility preservation
 * 4. Parametric eigenspace line clipping (p(t) = origin + t*u)
 * 5. Animation envelope union (start, target, eigenspaces, labels)
 * 6. Camera-fit hysteresis to prevent jitter on small adjustments
 * 7. Decoupled user camera state vs recommended framing
 *
 * Zero dependencies on React, SVG, or Three.js.
 */

import type { Vector } from "@/features/math/types";
import { CAMERA_BOUNDS_POLICY } from "../constants";

export interface WorldBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface CameraFraming2D {
  center: [number, number];
  zoom: number; // pixels per world unit (strictly uniform along X and Y)
  visibleBounds: WorldBounds;
  spanX: number;
  spanY: number;
}

export interface MathematicalSceneInput {
  origin?: [number, number];
  testVector?: Vector;
  transformedVector?: Vector;
  eigenbasisVectors?: Vector[];
  labelAnchors?: Vector[];
  extraPoints?: Vector[];
  includeOrigin?: boolean;
  marginFactor?: number;
  labelPadding?: number;
}

/**
 * 1. Compute Mathematical Scene Envelope
 * Priority 1: Keep important geometry visible.
 * Priority 2: Keep origin visible.
 * Priority 4: Add reasonable padding.
 */
export function computeMathematicalSceneBounds(
  input: MathematicalSceneInput
): WorldBounds {
  const {
    origin = [0, 0],
    testVector,
    transformedVector,
    eigenbasisVectors = [],
    labelAnchors = [],
    extraPoints = [],
    includeOrigin = true,
    marginFactor = CAMERA_BOUNDS_POLICY.MARGIN_FACTOR,
    labelPadding = CAMERA_BOUNDS_POLICY.LABEL_PADDING,
  } = input;

  const points: [number, number][] = [];

  // Priority 2: Origin is always included whenever requested (default true)
  if (includeOrigin) {
    points.push([origin[0], origin[1]]);
  }

  // Add test vector
  if (
    testVector &&
    Number.isFinite(testVector[0]) &&
    Number.isFinite(testVector[1])
  ) {
    points.push([testVector[0], testVector[1]]);
  }

  // Add transformed vector
  if (
    transformedVector &&
    Number.isFinite(transformedVector[0]) &&
    Number.isFinite(transformedVector[1])
  ) {
    points.push([transformedVector[0], transformedVector[1]]);
  }

  // Add representative endpoints for eigenbasis directions
  const representativeRadius = Math.max(
    2.5,
    testVector ? Math.hypot(testVector[0], testVector[1]) : 0,
    transformedVector ? Math.hypot(transformedVector[0], transformedVector[1]) : 0
  );

  for (const basis of eigenbasisVectors) {
    if (
      basis &&
      Number.isFinite(basis[0]) &&
      Number.isFinite(basis[1])
    ) {
      const len = Math.hypot(basis[0], basis[1]);
      if (len > 1e-6) {
        const ux = basis[0] / len;
        const uy = basis[1] / len;
        points.push([
          origin[0] + ux * representativeRadius,
          origin[1] + uy * representativeRadius,
        ]);
        points.push([
          origin[0] - ux * representativeRadius,
          origin[1] - uy * representativeRadius,
        ]);
      }
    }
  }

  // Add label anchors
  for (const la of labelAnchors) {
    if (la && Number.isFinite(la[0]) && Number.isFinite(la[1])) {
      points.push([la[0], la[1]]);
    }
  }

  // Add extra points
  for (const ep of extraPoints) {
    if (ep && Number.isFinite(ep[0]) && Number.isFinite(ep[1])) {
      points.push([ep[0], ep[1]]);
    }
  }

  // Fallback if no valid points
  if (points.length === 0) {
    return {
      xMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      xMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      yMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      yMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // Expand with label padding
  minX -= labelPadding;
  maxX += labelPadding;
  minY -= labelPadding;
  maxY += labelPadding;

  const rawSpanX = Math.max(maxX - minX, 1e-4);
  const rawSpanY = Math.max(maxY - minY, 1e-4);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Apply explicit margin factor: paddedSpan = rawSpan * MARGIN_FACTOR
  const paddedSpanX = rawSpanX * marginFactor;
  const paddedSpanY = rawSpanY * marginFactor;

  return {
    xMin: centerX - paddedSpanX / 2,
    xMax: centerX + paddedSpanX / 2,
    yMin: centerY - paddedSpanY / 2,
    yMax: centerY + paddedSpanY / 2,
  };
}

/**
 * 2. Calculate 2D Camera Framing
 * Preserves Priority 1 (Visible geometry), Priority 2 (Origin), Priority 3 (1:1 X/Y Scale).
 * Expands smaller dimension to match viewport aspect ratio without geometric distortion.
 * MAX_WORLD_SPAN is a preferred limit that expands when actual geometry demands it.
 */
export function calculateCameraFraming2D(
  envelopeBounds: WorldBounds,
  viewport: ViewportDimensions
): CameraFraming2D {
  const vpWidth = Math.max(viewport.width, 1);
  const vpHeight = Math.max(viewport.height, 1);
  const vpAspect = vpWidth / vpHeight;

  let spanX = Math.max(envelopeBounds.xMax - envelopeBounds.xMin, 1e-4);
  let spanY = Math.max(envelopeBounds.yMax - envelopeBounds.yMin, 1e-4);
  let centerX = (envelopeBounds.xMin + envelopeBounds.xMax) / 2;
  let centerY = (envelopeBounds.yMin + envelopeBounds.yMax) / 2;

  // Enforce minimum world span (prevents zooming infinitely close on tiny vectors)
  if (spanX < CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN) {
    spanX = CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN;
  }
  if (spanY < CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN) {
    spanY = CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN;
  }

  // Aspect-Ratio Aware Fitting (Priority 3: Strict 1:1 scale)
  // Expand the smaller dimension symmetrically to match viewport aspect ratio
  let fittedSpanX = spanX;
  let fittedSpanY = spanY;

  if (spanX / spanY < vpAspect) {
    // Viewport is wider than content: expand horizontal span
    fittedSpanY = spanY;
    fittedSpanX = spanY * vpAspect;
  } else {
    // Viewport is taller than content: expand vertical span
    fittedSpanX = spanX;
    fittedSpanY = spanX / vpAspect;
  }

  // Ensure origin (0, 0) remains comfortably inside visible bounds (Priority 2)
  const halfX = fittedSpanX / 2;
  const halfY = fittedSpanY / 2;

  let adjustedCenterX = centerX;
  let adjustedCenterY = centerY;

  if (adjustedCenterX - halfX > 0) {
    // Origin is off to the left; shift center left to include origin
    adjustedCenterX = halfX - CAMERA_BOUNDS_POLICY.LABEL_PADDING;
  } else if (adjustedCenterX + halfX < 0) {
    // Origin is off to the right; shift center right to include origin
    adjustedCenterX = -halfX + CAMERA_BOUNDS_POLICY.LABEL_PADDING;
  }

  if (adjustedCenterY - halfY > 0) {
    // Origin is below; shift center down
    adjustedCenterY = halfY - CAMERA_BOUNDS_POLICY.LABEL_PADDING;
  } else if (adjustedCenterY + halfY < 0) {
    // Origin is above; shift center up
    adjustedCenterY = -halfY + CAMERA_BOUNDS_POLICY.LABEL_PADDING;
  }

  // Calculate uniform 1:1 zoom (pixels per world unit)
  // zoomX === zoomY === zoom strictly guaranteed
  let zoom = vpWidth / fittedSpanX;

  // Clamp zoom to safety bounds: only clamp MAX_ZOOM (preventing extreme zoom-in)
  // Never clamp zoom down if mathematical geometry demands a larger span (Priority 1)
  if (zoom > CAMERA_BOUNDS_POLICY.MAX_ZOOM) {
    zoom = CAMERA_BOUNDS_POLICY.MAX_ZOOM;
    fittedSpanX = vpWidth / zoom;
    fittedSpanY = vpHeight / zoom;
  }


  const visibleBounds: WorldBounds = {
    xMin: adjustedCenterX - fittedSpanX / 2,
    xMax: adjustedCenterX + fittedSpanX / 2,
    yMin: adjustedCenterY - fittedSpanY / 2,
    yMax: adjustedCenterY + fittedSpanY / 2,
  };

  return {
    center: [adjustedCenterX, adjustedCenterY],
    zoom,
    visibleBounds,
    spanX: fittedSpanX,
    spanY: fittedSpanY,
  };
}

/**
 * 3. Canonical 2D Viewport Framing
 * Derives the standard default camera view from CANONICAL_2D_SPAN and viewport dimensions.
 */
export function computeCanonicalCameraFraming(
  viewport: ViewportDimensions
): CameraFraming2D {
  const bounds: WorldBounds = {
    xMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
    xMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
    yMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
    yMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
  };

  return calculateCameraFraming2D(bounds, viewport);
}

/**
 * 4. Parametric Eigenspace Line Clipping
 * p(t) = origin + t*u where u is the normalized unit direction vector.
 * Completely eliminates slope m = y/x to avoid division by zero on vertical/horizontal lines.
 * Computes finite line endpoints that cleanly cross visible bounds plus an outer margin.
 */
export function clipParametricLineToBounds(
  direction: Vector,
  bounds: WorldBounds,
  origin: [number, number] = [0, 0],
  outerMarginFactor: number = 1.25
): { start: [number, number]; end: [number, number] } | null {
  const dx = direction[0];
  const dy = direction[1];

  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return null;

  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return null; // zero vector cannot define a line

  const ux = dx / len;
  const uy = dy / len;

  // Maximum distance from origin to visible bounds corners
  const maxCornerDist = Math.max(
    Math.hypot(bounds.xMin - origin[0], bounds.yMin - origin[1]),
    Math.hypot(bounds.xMax - origin[0], bounds.yMin - origin[1]),
    Math.hypot(bounds.xMin - origin[0], bounds.yMax - origin[1]),
    Math.hypot(bounds.xMax - origin[0], bounds.yMax - origin[1])
  );

  const t = Math.max(maxCornerDist * outerMarginFactor, 6);

  return {
    start: [origin[0] - t * ux, origin[1] - t * uy],
    end: [origin[0] + t * ux, origin[1] + t * uy],
  };
}

/**
 * 5. Animation Envelope Calculation
 * Unions start state (t = 0), target state (t = 1), eigenspace geometry,
 * persistent objects, and label anchors to lock camera framing during animation.
 */
export function computeAnimationEnvelopeBounds(input: {
  testVector: Vector;
  transformedVector: Vector;
  eigenbasisVectors?: Vector[];
  persistentPoints?: Vector[];
  origin?: [number, number];
}): WorldBounds {
  const {
    testVector,
    transformedVector,
    eigenbasisVectors = [],
    persistentPoints = [],
    origin = [0, 0],
  } = input;

  const extraPoints: Vector[] = [...persistentPoints];

  // Start state test vector
  if (testVector) extraPoints.push(testVector);
  // Target state transformed vector
  if (transformedVector) extraPoints.push(transformedVector);

  return computeMathematicalSceneBounds({
    origin,
    testVector,
    transformedVector,
    eigenbasisVectors,
    extraPoints,
    includeOrigin: true,
    marginFactor: CAMERA_BOUNDS_POLICY.MARGIN_FACTOR,
  });
}

/**
 * 6. Camera-Fit Hysteresis Check
 * Checks if geometry exceeds current visible bounds by more than the hysteresis threshold.
 * Returns true only if refit is genuinely required, preventing jitter on tiny changes.
 */
export function isGeometryOutOfBounds(
  points: Vector[],
  visibleBounds: WorldBounds,
  threshold: number = CAMERA_BOUNDS_POLICY.HYSTERESIS_THRESHOLD
): boolean {
  const spanX = visibleBounds.xMax - visibleBounds.xMin;
  const spanY = visibleBounds.yMax - visibleBounds.yMin;

  const bufferX = spanX * threshold;
  const bufferY = spanY * threshold;

  for (const pt of points) {
    if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) continue;

    if (
      pt[0] < visibleBounds.xMin - bufferX ||
      pt[0] > visibleBounds.xMax + bufferX ||
      pt[1] < visibleBounds.yMin - bufferY ||
      pt[1] > visibleBounds.yMax + bufferY
    ) {
      return true;
    }
  }

  return false;
}

/**
 * 7. Deterministic Vector Label Offset
 * Computes deterministic label position along vector direction with perpendicular shift.
 */
export function computeVectorLabelOffset(
  vector: Vector,
  distance: number = 0.45,
  perpendicularOffset: number = 0.2
): [number, number] {
  const x = vector[0];
  const y = vector[1];
  const len = Math.hypot(x, y);

  if (len < 1e-4) {
    // Special nullspace collapse / origin offset
    return [0.3, -0.35];
  }

  const ux = x / len;
  const uy = y / len;

  // Perpendicular vector (-uy, ux)
  const px = -uy;
  const py = ux;

  return [
    x + ux * distance + px * perpendicularOffset,
    y + uy * distance + py * perpendicularOffset,
  ];
}

/**
 * 8. Screen to World 2D Coordinate Conversion
 * Inverts the orthographic camera transformation:
 * worldX = (screenX - width / 2) / zoom + centerX
 * worldY = (height / 2 - screenY) / zoom + centerY
 */
export function screenToWorld2D(
  screenPos: [number, number],
  cameraState: { center: [number, number]; zoom: number },
  viewport: ViewportDimensions
): [number, number] {
  const worldX =
    (screenPos[0] - viewport.width / 2) / cameraState.zoom + cameraState.center[0];
  const worldY =
    (viewport.height / 2 - screenPos[1]) / cameraState.zoom + cameraState.center[1];
  return [worldX, worldY];
}

/**
 * 9. World to Screen 2D Coordinate Conversion
 * Direct orthographic camera transformation:
 * screenX = width / 2 + (worldX - centerX) * zoom
 * screenY = height / 2 - (worldY - centerY) * zoom
 */
export function worldToScreen2D(
  worldPos: [number, number],
  cameraState: { center: [number, number]; zoom: number },
  viewport: ViewportDimensions
): [number, number] {
  const screenX =
    viewport.width / 2 + (worldPos[0] - cameraState.center[0]) * cameraState.zoom;
  const screenY =
    viewport.height / 2 - (worldPos[1] - cameraState.center[1]) * cameraState.zoom;
  return [screenX, screenY];
}

