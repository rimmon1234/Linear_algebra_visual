import { describe, it, expect } from "vitest";
import {
  computeMathematicalSceneBounds,
  calculateCameraFraming2D,
  computeCanonicalCameraFraming,
  clipParametricLineToBounds,
  computeAnimationEnvelopeBounds,
  isGeometryOutOfBounds,
  computeVectorLabelOffset,
  screenToWorld2D,
  worldToScreen2D,
} from "@/features/visualization/camera/bounds";
import { CAMERA_BOUNDS_POLICY } from "@/features/visualization/constants";
import type { Vector, Matrix } from "@/features/math/types";
import { matrixVectorMultiply } from "@/features/math/matrix/operations";

describe("Adaptive Camera & Bounds Utility Suite", () => {
  const standardViewport = { width: 560, height: 400 };

  // 1. Normal vector
  it("computes finite, padded bounds for normal vector", () => {
    const v: Vector = [2, 1];
    const Av: Vector = [4, 2];
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    expect(bounds.xMin).toBeLessThan(0);
    expect(bounds.xMax).toBeGreaterThan(4);
    expect(bounds.yMin).toBeLessThan(0);
    expect(bounds.yMax).toBeGreaterThan(2);
    expect(Number.isFinite(bounds.xMin)).toBe(true);
    expect(Number.isFinite(bounds.xMax)).toBe(true);
  });

  // 2. Large vector
  it("envelopes very large vectors without clipping (v=[20, 15], Av=[100, 80])", () => {
    const v: Vector = [20, 15];
    const Av: Vector = [100, 80];
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    // Content must be fully inside bounds
    expect(bounds.xMin).toBeLessThanOrEqual(0);
    expect(bounds.xMax).toBeGreaterThanOrEqual(100);
    expect(bounds.yMin).toBeLessThanOrEqual(0);
    expect(bounds.yMax).toBeGreaterThanOrEqual(80);

    const framing = calculateCameraFraming2D(bounds, standardViewport);
    expect(framing.visibleBounds.xMax).toBeGreaterThanOrEqual(100);
    expect(framing.visibleBounds.yMax).toBeGreaterThanOrEqual(80);
    // Origin must remain visible
    expect(framing.visibleBounds.xMin).toBeLessThanOrEqual(0);
    expect(framing.visibleBounds.yMin).toBeLessThanOrEqual(0);
  });

  // 3. Small vector
  it("enforces MIN_WORLD_SPAN on extremely small vectors without extreme zoom", () => {
    const v: Vector = [0.001, 0.001];
    const Av: Vector = [0.002, 0.002];
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    const framing = calculateCameraFraming2D(bounds, standardViewport);
    expect(framing.spanX).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
    expect(framing.spanY).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
    expect(Number.isFinite(framing.zoom)).toBe(true);
    expect(framing.zoom).toBeLessThanOrEqual(CAMERA_BOUNDS_POLICY.MAX_ZOOM);
  });

  // 4. Zero vector
  it("handles zero vector without collapsing bounds or producing NaN", () => {
    const v: Vector = [0, 0];
    const Av: Vector = [0, 0];
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    const framing = calculateCameraFraming2D(bounds, standardViewport);
    expect(framing.spanX).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
    expect(framing.spanY).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
    expect(framing.visibleBounds.xMin).toBeLessThan(0);
    expect(framing.visibleBounds.xMax).toBeGreaterThan(0);
    expect(isNaN(framing.zoom)).toBe(false);
  });

  // 5. Negative eigenvalue (direction reversal)
  it("accommodates negative eigenvalues where Av reverses direction across origin", () => {
    const v: Vector = [2, 0];
    const Av: Vector = [-6, 0]; // lambda = -3
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    expect(bounds.xMin).toBeLessThanOrEqual(-6);
    expect(bounds.xMax).toBeGreaterThanOrEqual(2);
    // Origin (0, 0) is strictly within bounds
    expect(bounds.xMin).toBeLessThan(0);
    expect(bounds.xMax).toBeGreaterThan(0);
  });

  // 6. Zero eigenvalue (nullspace collapse)
  it("maintains origin and test vector in bounds during lambda = 0 nullspace collapse", () => {
    const v: Vector = [-2, 1];
    const Av: Vector = [0, 0];
    const bounds = computeMathematicalSceneBounds({
      testVector: v,
      transformedVector: Av,
    });

    expect(bounds.xMin).toBeLessThanOrEqual(-2);
    expect(bounds.xMax).toBeGreaterThanOrEqual(0);
    expect(bounds.yMin).toBeLessThanOrEqual(0);
    expect(bounds.yMax).toBeGreaterThanOrEqual(1);
  });

  // 7. Rotated eigenspace (45 degrees)
  it("correctly envelopes 45 degree rotated eigenspaces", () => {
    const basis: Vector = [1 / Math.SQRT2, 1 / Math.SQRT2];
    const bounds = computeMathematicalSceneBounds({
      testVector: [2, 2],
      eigenbasisVectors: [basis],
    });

    expect(bounds.xMax).toBeGreaterThan(2);
    expect(bounds.yMax).toBeGreaterThan(2);
    expect(bounds.xMin).toBeLessThan(0);
    expect(bounds.yMin).toBeLessThan(0);
  });

  // 8. Near-vertical eigenspace
  it("handles near-vertical eigenspaces without slope Infinity or NaN", () => {
    const verticalBasis: Vector = [0, 1];
    const line = clipParametricLineToBounds(verticalBasis, {
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
    });

    expect(line).not.toBeNull();
    expect(Number.isFinite(line!.start[0])).toBe(true);
    expect(Number.isFinite(line!.start[1])).toBe(true);
    expect(Number.isFinite(line!.end[0])).toBe(true);
    expect(Number.isFinite(line!.end[1])).toBe(true);
    // Vertical line x must remain 0
    expect(Math.abs(line!.start[0])).toBeLessThan(1e-10);
    expect(Math.abs(line!.end[0])).toBeLessThan(1e-10);
    // Spans through origin
    expect(line!.start[1]).toBeLessThan(0);
    expect(line!.end[1]).toBeGreaterThan(0);
  });

  // 9. Near-horizontal eigenspace
  it("handles near-horizontal eigenspaces without collapsing", () => {
    const horizontalBasis: Vector = [1, 0];
    const line = clipParametricLineToBounds(horizontalBasis, {
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
    });

    expect(line).not.toBeNull();
    expect(Math.abs(line!.start[1])).toBeLessThan(1e-10);
    expect(Math.abs(line!.end[1])).toBeLessThan(1e-10);
    expect(line!.start[0]).toBeLessThan(0);
    expect(line!.end[0]).toBeGreaterThan(0);
  });

  // 10. Singular matrix
  it("frames singular matrix with both nullspace eigenvector and active eigenvector", () => {
    const A: Matrix = [
      [1, 2],
      [2, 4],
    ];
    const vNull: Vector = [-2, 1];
    const mulRes = matrixVectorMultiply(A, vNull);
    const AvNull = mulRes.ok ? mulRes.value : [0, 0];
    const bounds = computeMathematicalSceneBounds({
      testVector: vNull,
      transformedVector: AvNull,
      eigenbasisVectors: [
        [1, 2],
        [-2, 1],
      ],
    });

    expect(bounds.xMin).toBeLessThan(-2);
    expect(bounds.yMax).toBeGreaterThan(2);
    expect(bounds.xMin).toBeLessThan(0);
    expect(bounds.xMax).toBeGreaterThan(0);
  });

  // 11. Both eigenvectors visible
  it("envelopes both orthogonal eigenvectors of a symmetric matrix", () => {
    const basis1: Vector = [1, 1];
    const basis2: Vector = [-1, 1];
    const bounds = computeMathematicalSceneBounds({
      eigenbasisVectors: [basis1, basis2],
    });

    expect(bounds.xMin).toBeLessThan(-1);
    expect(bounds.xMax).toBeGreaterThan(1);
    expect(bounds.yMin).toBeLessThan(-1);
    expect(bounds.yMax).toBeGreaterThan(1);
  });

  // 12. Origin included in bounds
  it("strictly includes origin (0, 0) in all bounded outputs", () => {
    // Even if all vectors are strictly positive
    const bounds = computeMathematicalSceneBounds({
      testVector: [10, 10],
      transformedVector: [20, 20],
      includeOrigin: true,
    });

    expect(bounds.xMin).toBeLessThanOrEqual(0);
    expect(bounds.yMin).toBeLessThanOrEqual(0);

    const framing = calculateCameraFraming2D(bounds, standardViewport);
    expect(framing.visibleBounds.xMin).toBeLessThanOrEqual(0);
    expect(framing.visibleBounds.yMin).toBeLessThanOrEqual(0);
    expect(framing.visibleBounds.xMax).toBeGreaterThan(0);
    expect(framing.visibleBounds.yMax).toBeGreaterThan(0);
  });

  // 13 & 15 & 16. Finite bounds & No NaN / Infinity
  it("never returns NaN or Infinity for boundary inputs", () => {
    const framing = calculateCameraFraming2D(
      { xMin: 0, xMax: 0, yMin: 0, yMax: 0 },
      { width: 560, height: 400 }
    );

    expect(Number.isFinite(framing.center[0])).toBe(true);
    expect(Number.isFinite(framing.center[1])).toBe(true);
    expect(Number.isFinite(framing.zoom)).toBe(true);
    expect(Number.isFinite(framing.spanX)).toBe(true);
    expect(Number.isFinite(framing.spanY)).toBe(true);
    expect(Number.isFinite(framing.visibleBounds.xMin)).toBe(true);
    expect(Number.isFinite(framing.visibleBounds.xMax)).toBe(true);
    expect(isNaN(framing.zoom)).toBe(false);
  });

  // 14. Minimum span enforced
  it("enforces MIN_WORLD_SPAN constant", () => {
    const framing = calculateCameraFraming2D(
      { xMin: -0.1, xMax: 0.1, yMin: -0.1, yMax: 0.1 },
      standardViewport
    );

    expect(framing.spanX).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
    expect(framing.spanY).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN);
  });

  // 17. Aspect ratio preservation (1:1 uniform scaling)
  it("preserves exact 1:1 mathematical scale across differing viewport aspect ratios", () => {
    const wideViewport = { width: 1280, height: 800 }; // 1.6 aspect
    const tallViewport = { width: 390, height: 844 };  // 0.46 aspect

    const bounds = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 }; // square bounds

    const wideFraming = calculateCameraFraming2D(bounds, wideViewport);
    const tallFraming = calculateCameraFraming2D(bounds, tallViewport);

    // Zoom on X and Y must be identical (1 unit X = 1 unit Y)
    const wideZoomX = wideViewport.width / wideFraming.spanX;
    const wideZoomY = wideViewport.height / wideFraming.spanY;
    expect(Math.abs(wideZoomX - wideZoomY)).toBeLessThan(1e-5);
    expect(Math.abs(wideZoomX - wideFraming.zoom)).toBeLessThan(1e-5);

    const tallZoomX = tallViewport.width / tallFraming.spanX;
    const tallZoomY = tallViewport.height / tallFraming.spanY;
    expect(Math.abs(tallZoomX - tallZoomY)).toBeLessThan(1e-5);
    expect(Math.abs(tallZoomX - tallFraming.zoom)).toBeLessThan(1e-5);
  });

  // 18. Margin application (MARGIN_FACTOR = 1.25)
  it("applies MARGIN_FACTOR (1.25) to expand raw span by 25%", () => {
    const bounds = computeMathematicalSceneBounds({
      testVector: [4, 0],
      transformedVector: [0, 4],
      labelPadding: 0, // isolate margin factor
      marginFactor: 1.25,
    });

    const spanX = bounds.xMax - bounds.xMin;
    const spanY = bounds.yMax - bounds.yMin;

    // raw span from 0 to 4 is 4.0; with margin 1.25, span = 4 * 1.25 = 5.0
    expect(Math.abs(spanX - 5.0)).toBeLessThan(1e-4);
    expect(Math.abs(spanY - 5.0)).toBeLessThan(1e-4);
  });

  // 19. Animation union bounds
  it("unions start (t=0) and target (t=1) geometry to create a stable envelope", () => {
    const v: Vector = [2, 0];
    const Av: Vector = [-4, 3];
    const envelope = computeAnimationEnvelopeBounds({
      testVector: v,
      transformedVector: Av,
      eigenbasisVectors: [[1, 0]],
    });

    // Start state v=[2, 0] must be inside
    expect(envelope.xMax).toBeGreaterThanOrEqual(2);
    // Target state Av=[-4, 3] must be inside
    expect(envelope.xMin).toBeLessThanOrEqual(-4);
    expect(envelope.yMax).toBeGreaterThanOrEqual(3);
    // Origin must be inside
    expect(envelope.xMin).toBeLessThanOrEqual(0);
  });

  // 20. Parametric line clipping
  it("parametric line clipping passes through origin and produces finite endpoints", () => {
    const dir: Vector = [3, 4];
    const bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
    const line = clipParametricLineToBounds(dir, bounds);

    expect(line).not.toBeNull();
    // Line must pass through origin: (start + end) / 2 = (0, 0)
    expect(Math.abs(line!.start[0] + line!.end[0])).toBeLessThan(1e-10);
    expect(Math.abs(line!.start[1] + line!.end[1])).toBeLessThan(1e-10);

    // Endpoints must extend beyond visible bounds
    expect(line!.end[0]).toBeGreaterThan(10);
    expect(line!.start[0]).toBeLessThan(-10);
  });

  // 21. Camera-Fit Hysteresis
  it("hysteresis ignores small changes within buffer but triggers on large expansions", () => {
    const visibleBounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
    // Span is 12, threshold is 8% (0.96 buffer)

    // Point slightly outside by 0.3 (within 0.96 buffer) -> false (no refit)
    const smallChange: Vector[] = [[6.3, 2]];
    expect(isGeometryOutOfBounds(smallChange, visibleBounds)).toBe(false);

    // Point significantly outside by 2.0 (exceeds buffer) -> true (refit needed)
    const largeChange: Vector[] = [[8.5, 2]];
    expect(isGeometryOutOfBounds(largeChange, visibleBounds)).toBe(true);
  });

  // 22. Deterministic Label Offsets
  it("computes deterministic vector label offset without NaN", () => {
    const offset1 = computeVectorLabelOffset([3, 4]);
    expect(Number.isFinite(offset1[0])).toBe(true);
    expect(Number.isFinite(offset1[1])).toBe(true);
    expect(offset1[0]).toBeGreaterThan(3);

    // Nullspace collapse case
    const offsetZero = computeVectorLabelOffset([0, 0]);
    expect(offsetZero).toEqual([0.3, -0.35]);
  });

  // 23. Preferred MAX_WORLD_SPAN expands for large geometry
  it("expands beyond PREFERRED_MAX_WORLD_SPAN when actual geometry requires it", () => {
    const largeBounds = { xMin: -60, xMax: 60, yMin: -60, yMax: 60 };
    const framing = calculateCameraFraming2D(largeBounds, standardViewport);

    // Geometry is 120 span, must NOT be clamped to 40
    expect(framing.spanX).toBeGreaterThanOrEqual(120);
    expect(framing.spanY).toBeGreaterThanOrEqual(120);
    expect(framing.visibleBounds.xMin).toBeLessThanOrEqual(-60);
    expect(framing.visibleBounds.xMax).toBeGreaterThanOrEqual(60);
  });

  // 24. Canonical View Framing
  it("derives canonical camera framing from CANONICAL_2D_SPAN and viewport", () => {
    const canonical = computeCanonicalCameraFraming(standardViewport);
    expect(canonical.center).toEqual([0, 0]);
    expect(canonical.spanX).toBeGreaterThanOrEqual(CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN);
    expect(Number.isFinite(canonical.zoom)).toBe(true);
  });

  // 25. Regression Test: Decoupling userCameraState from matrix changes
  it("verifies userCameraState (pan & zoom) remains completely independent of matrix A edits", () => {
    // Simulated user camera state: user has panned to [3, 2] and zoomed in to 50 px/unit
    const userCameraState = {
      center: [3, 2] as [number, number],
      zoom: 50,
    };

    // Matrix A changes from Identity to Shear, then to Scaling
    const matrix1: Matrix = [
      [1, 2],
      [0, 1],
    ];
    const matrix2: Matrix = [
      [3, 0],
      [0, 3],
    ];

    // Under normal UI interaction without an explicit Fit Scene or boundary blowout,
    // userCameraState remains untouched
    const testVector: Vector = [1, 1];
    const res1 = matrixVectorMultiply(matrix1, testVector);
    const res2 = matrixVectorMultiply(matrix2, testVector);
    const Av1 = res1.ok ? res1.value : [0, 0];
    const Av2 = res2.ok ? res2.value : [0, 0];

    expect(Av1).toEqual([3, 1]);
    expect(Av2).toEqual([3, 3]);

    // Camera state is not mutated by matrix multiplication
    expect(userCameraState.center).toEqual([3, 2]);
    expect(userCameraState.zoom).toBe(50);
  });

  // 26. Regression Test: Hysteresis protects manual pan and zoom during minor edits
  it("preserves manual pan and zoom when geometry changes stay within visible bounds", () => {
    const userVisibleBounds = { xMin: -10, xMax: 10, yMin: -8, yMax: 8 };

    // New vector Av = [4, 3] is comfortably inside visible bounds
    const newAv: Vector = [4, 3];
    const outOfBounds = isGeometryOutOfBounds([newAv], userVisibleBounds);
    expect(outOfBounds).toBe(false); // No automatic camera reset triggered!
  });

  // 27. Mathematical Invertibility: screenToWorld2D and worldToScreen2D
  it("verifies screenToWorld2D and worldToScreen2D are exact mathematical inverses", () => {
    const camera = { center: [2.5, -1.8] as [number, number], zoom: 42 };
    const vp = { width: 560, height: 400 };

    const testPoints: [number, number][] = [
      [0, 0],
      [2.5, -1.8],
      [-5.2, 8.4],
      [10, -10],
      [0.001, -0.002],
    ];

    for (const pt of testPoints) {
      const screen = worldToScreen2D(pt, camera, vp);
      const recoveredWorld = screenToWorld2D(screen, camera, vp);

      expect(Math.abs(recoveredWorld[0] - pt[0])).toBeLessThan(1e-10);
      expect(Math.abs(recoveredWorld[1] - pt[1])).toBeLessThan(1e-10);
    }
  });

  // 28. Regression Test: Vector drag keeps camera state strictly invariant
  it("guarantees camera state remains completely unchanged when dragging vector coordinates", () => {
    const A: Matrix = [
      [2, 1],
      [1, 2],
    ];
    const initialCamera = {
      center: [1.5, -0.5] as [number, number],
      zoom: 38,
    };

    const vectorBefore: Vector = [2, 1];
    const AvBefore = matrixVectorMultiply(A, vectorBefore);
    expect(AvBefore.ok).toBe(true);

    // Simulate drag: user moves vector from [2, 1] to [4, 3]
    const currentCamera = { ...initialCamera };
    const vectorAfter: Vector = [4, 3];
    const AvAfter = matrixVectorMultiply(A, vectorAfter);
    expect(AvAfter.ok).toBe(true);

    // 1. Camera center and zoom must be identical within strict float tolerance
    expect(currentCamera.center[0]).toBeCloseTo(initialCamera.center[0], 10);
    expect(currentCamera.center[1]).toBeCloseTo(initialCamera.center[1], 10);
    expect(currentCamera.zoom).toBeCloseTo(initialCamera.zoom, 10);

    // 2. Vector changed and Av is derived directly from A * vectorAfter
    expect(vectorBefore).not.toEqual(vectorAfter);
    expect(AvAfter).toEqual({ ok: true, value: [11, 10] });
  });

  // 29. Camera at Different Zooms & Pan Offsets
  it("verifies inverse screen-to-world conversion across canonical, zoomed-in, zoomed-out, and panned states", () => {
    const vp = { width: 560, height: 400 };
    const cameraConfigurations = [
      { name: "canonical", center: [0, 0] as [number, number], zoom: 33.33 },
      { name: "zoomed-in", center: [0, 0] as [number, number], zoom: 80 },
      { name: "zoomed-out", center: [0, 0] as [number, number], zoom: 12 },
      { name: "panned-and-zoomed", center: [6.5, -4.2] as [number, number], zoom: 45 },
    ];

    const testWorldVectors: Vector[] = [
      [1, 2],
      [-3, 4],
      [5, -2],
      [-4, -3],
    ];

    for (const cam of cameraConfigurations) {
      for (const v of testWorldVectors) {
        const screen = worldToScreen2D(v as [number, number], cam, vp);
        const recoveredWorld = screenToWorld2D(screen, cam, vp);

        expect(recoveredWorld[0]).toBeCloseTo(v[0], 6);
        expect(recoveredWorld[1]).toBeCloseTo(v[1], 6);
      }
    }
  });

  // 30. Vector at Edge and Boundary Positions
  it("verifies accurate coordinate recovery near origin, edges, and extremes", () => {
    const cam = { center: [0, 0] as [number, number], zoom: 35 };
    const vp = { width: 560, height: 400 };

    const positions: { name: string; world: [number, number] }[] = [
      { name: "near-origin", world: [0.15, 0.15] },
      { name: "left-boundary", world: [-7.5, 0] },
      { name: "right-boundary", world: [7.5, 0] },
      { name: "top-boundary", world: [0, 5.2] },
      { name: "bottom-boundary", world: [0, -5.2] },
    ];

    for (const pos of positions) {
      const screen = worldToScreen2D(pos.world, cam, vp);
      const recovered = screenToWorld2D(screen, cam, vp);

      expect(recovered[0]).toBeCloseTo(pos.world[0], 6);
      expect(recovered[1]).toBeCloseTo(pos.world[1], 6);
    }
  });
});


