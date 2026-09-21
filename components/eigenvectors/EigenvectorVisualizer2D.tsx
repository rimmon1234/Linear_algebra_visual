"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { Matrix, Vector } from "@/features/math/types";
import type { Eigensystem } from "@/features/math/eigen/eigenvectors";
import { isEigenvector } from "@/features/math/eigen/eigenvectors";
import { matrixVectorMultiply } from "@/features/math/matrix/operations";
import { formatMathNumber } from "@/features/math/eigen/characteristic-equation";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import {
  Play,
  RotateCcw,
  Compass,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  computeMathematicalSceneBounds,
  calculateCameraFraming2D,
  computeCanonicalCameraFraming,
  clipParametricLineToBounds,
  computeAnimationEnvelopeBounds,
  isGeometryOutOfBounds,
  screenToWorld2D,
} from "@/features/visualization/camera/bounds";
import { CAMERA_BOUNDS_POLICY } from "@/features/visualization/constants";

interface EigenvectorVisualizer2DProps {
  matrix: Matrix;
  eigensystem: Eigensystem;
  selectedEigenvalue?: number;
  externalAngleDeg?: number;
  onAngleChange?: (angle: number) => void;
}

type InteractionMode = "idle" | "panning-camera" | "dragging-vector";

export function EigenvectorVisualizer2D({
  matrix,
  eigensystem,
  externalAngleDeg,
  onAngleChange,
}: EigenvectorVisualizer2DProps) {
  // SVG logical viewBox dimensions
  const width = 560;
  const height = 400;

  // Test vector polar state: angle in degrees [0, 360) and radius r
  const [internalAngleDeg, setInternalAngleDeg] = useState<number>(45);
  const [vectorRadius, setVectorRadius] = useState<number>(2.0);

  // Directly consume external angle when provided, falling back to internal state
  const currentAngleDeg = externalAngleDeg !== undefined ? externalAngleDeg : internalAngleDeg;
  const lastAngleDegRef = useRef<number>(currentAngleDeg);
  const lastRadiusRef = useRef<number>(vectorRadius);
  lastAngleDegRef.current = currentAngleDeg;
  lastRadiusRef.current = vectorRadius;

  const onAngleChangeRef = useRef(onAngleChange);
  onAngleChangeRef.current = onAngleChange;
  const externalAngleDegRef = useRef(externalAngleDeg);
  externalAngleDegRef.current = externalAngleDeg;

  const setAngle = useCallback((newAngle: number) => {
    lastAngleDegRef.current = newAngle;
    if (externalAngleDegRef.current === undefined) {
      setInternalAngleDeg(newAngle);
    }
    onAngleChangeRef.current?.(newAngle);
    setAnimProgress((prev) => (prev === 1 ? prev : 1));
  }, []);

  // Animation state: t in [0, 1] for transformation animation
  const [animProgress, setAnimProgress] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Calculate current test vector v in world coordinates
  const rad = (currentAngleDeg * Math.PI) / 180;
  const testVector: Vector = useMemo(() => {
    return [
      vectorRadius * Math.cos(rad),
      vectorRadius * Math.sin(rad),
    ];
  }, [vectorRadius, rad]);

  // Compute transformed vector Av
  const transformedVector: Vector = useMemo(() => {
    const res = matrixVectorMultiply(matrix, testVector);
    return res.ok ? res.value : [0, 0];
  }, [matrix, testVector]);

  // Active basis vectors from eigensystem
  const activeBasisVectors = useMemo(() => {
    return eigensystem.eigenpairs
      .map((p) => p.eigenspaceBasis[0])
      .filter((b): b is Vector => b !== undefined);
  }, [eigensystem]);

  // Check if transformed vector is zero (λ = 0 nullspace collapse)
  const isTransformedZero = useMemo(() => {
    return Math.hypot(transformedVector[0], transformedVector[1]) < 1e-4;
  }, [transformedVector]);

  // Interpolated vector during animation: (1 - t)v + t(Av)
  const currentDisplayedVector: Vector = useMemo(() => {
    const vx = (1 - animProgress) * testVector[0] + animProgress * transformedVector[0];
    const vy = (1 - animProgress) * testVector[1] + animProgress * transformedVector[1];
    return [vx, vy];
  }, [testVector, transformedVector, animProgress]);

  // Check if the currently displayed animated vector has collapsed into the origin
  const isCurrentDisplayedZero = useMemo(() => {
    return Math.hypot(currentDisplayedVector[0], currentDisplayedVector[1]) < 0.05;
  }, [currentDisplayedVector]);

  // Check if test vector v is currently an eigenvector
  const eigenStatus = useMemo(() => {
    return isEigenvector(matrix, testVector);
  }, [matrix, testVector]);

  // =========================================================================
  // CAMERA FRAMING & STATE MANAGEMENT (ADR-017)
  // Decoupled userCameraState vs recommendedFraming
  // =========================================================================

  const canonicalFraming = useMemo(() => {
    return computeCanonicalCameraFraming({ width, height });
  }, [width, height]);

  // Independent User Camera State (camera stays fixed during vector drag)
  const [cameraState, setCameraState] = useState<{
    center: [number, number];
    zoom: number;
  }>({
    center: [0, 0],
    zoom: canonicalFraming.zoom,
  });

  // Recommended Mathematical Scene Bounds
  const recommendedBounds = useMemo(() => {
    return computeMathematicalSceneBounds({
      origin: [0, 0],
      testVector,
      transformedVector,
      eigenbasisVectors: activeBasisVectors,
      includeOrigin: true,
    });
  }, [testVector, transformedVector, activeBasisVectors]);

  const recommendedFraming = useMemo(() => {
    return calculateCameraFraming2D(recommendedBounds, { width, height });
  }, [recommendedBounds, width, height]);

  // Visible bounds under current userCameraState
  const currentVisibleBounds = useMemo(() => {
    const spanX = width / cameraState.zoom;
    const spanY = height / cameraState.zoom;
    return {
      xMin: cameraState.center[0] - spanX / 2,
      xMax: cameraState.center[0] + spanX / 2,
      yMin: cameraState.center[1] - spanY / 2,
      yMax: cameraState.center[1] + spanY / 2,
    };
  }, [cameraState, width, height]);

  // Smooth camera animation helper
  const cameraAnimRef = useRef<number | null>(null);
  const animateCameraTo = useCallback(
    (targetCenter: [number, number], targetZoom: number, duration: number = 350) => {
      if (cameraAnimRef.current) cancelAnimationFrame(cameraAnimRef.current);
      const startCenter = cameraState.center;
      const startZoom = cameraState.zoom;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        const curX = startCenter[0] + (targetCenter[0] - startCenter[0]) * ease;
        const curY = startCenter[1] + (targetCenter[1] - startCenter[1]) * ease;
        const curZoom = startZoom + (targetZoom - startZoom) * ease;

        setCameraState({
          center: [curX, curY],
          zoom: curZoom,
        });

        if (progress < 1) {
          cameraAnimRef.current = requestAnimationFrame(step);
        } else {
          cameraAnimRef.current = null;
        }
      };

      cameraAnimRef.current = requestAnimationFrame(step);
    },
    [cameraState]
  );

  // =========================================================================
  // INTERACTION ARCHITECTURE: STRICT EVENT OWNERSHIP
  // 1. Vector Dragging: pointerdown on vector -> VECTOR OWNS POINTER -> camera stays fixed
  // 2. Canvas Panning: pointerdown on canvas -> CANVAS OWNS POINTER -> camera pans
  // =========================================================================
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("idle");
  const interactionModeRef = useRef<InteractionMode>("idle");
  const svgRef = useRef<SVGSVGElement>(null);
  const cameraStateRef = useRef(cameraState);
  cameraStateRef.current = cameraState;

  // Throttling and deduplication refs for high-frequency drag events
  const dragRafRef = useRef<number | null>(null);
  const panRafRef = useRef<number | null>(null);
  const latestPointerRef = useRef<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 });
  const lastProcessedPointerRef = useRef<{ clientX: number; clientY: number }>({ clientX: -9999, clientY: -9999 });
  const lastReportedAngleRef = useRef<number>(currentAngleDeg);

  // Helper: Convert pointer client coordinates to SVG screen coordinates
  const getSvgCoordinates = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { screenX: width / 2, screenY: height / 2 };
    const rect = svg.getBoundingClientRect();
    const rectWidth = rect.width > 0 ? rect.width : width;
    const rectHeight = rect.height > 0 ? rect.height : height;
    const screenX = ((clientX - rect.left) / rectWidth) * width;
    const screenY = ((clientY - rect.top) / rectHeight) * height;
    return { screenX, screenY };
  }, [width, height]);

  // Core: Convert pointer to world coordinates and update vector state
  const updateVectorFromCoordinates = useCallback((clientX: number, clientY: number) => {
    const { screenX, screenY } = getSvgCoordinates(clientX, clientY);
    const [worldX, worldY] = screenToWorld2D(
      [screenX, screenY],
      cameraStateRef.current,
      { width, height }
    );

    const len = Math.hypot(worldX, worldY);
    if (len < 0.1) return; // avoid division by zero or collapse to origin

    const angleRad = Math.atan2(worldY, worldX);
    let deg = (angleRad * 180) / Math.PI;
    if (deg < 0) deg += 360;

    const roundedDeg = Number(deg.toFixed(2));
    const roundedRadius = Number(Math.max(0.5, len).toFixed(2));

    // Threshold check: Only trigger state update if mathematical values meaningfully change
    const angleDelta = Math.abs(roundedDeg - lastAngleDegRef.current);
    const radiusDelta = Math.abs(roundedRadius - lastRadiusRef.current);

    if (angleDelta >= 0.05 || radiusDelta >= 0.02) {
      lastAngleDegRef.current = roundedDeg;
      lastRadiusRef.current = roundedRadius;
      lastProcessedPointerRef.current = { clientX, clientY };

      if (externalAngleDegRef.current === undefined) {
        setInternalAngleDeg((prev) => (prev === roundedDeg ? prev : roundedDeg));
      }
      setVectorRadius((prev) => (prev === roundedRadius ? prev : roundedRadius));
      if (onAngleChangeRef.current && roundedDeg !== lastReportedAngleRef.current) {
        lastReportedAngleRef.current = roundedDeg;
        onAngleChangeRef.current(roundedDeg);
      }
      setAnimProgress((prev) => (prev === 1 ? prev : 1));
    }
  }, [getSvgCoordinates, width, height]);

  // VECTOR DRAG HANDLER: Event ownership captured strictly by vector layer
  const handleVectorPointerDown = useCallback((e: React.PointerEvent<SVGElement>) => {
    e.stopPropagation(); // Stop event from reaching canvas pan handler!
    e.preventDefault();

    interactionModeRef.current = "dragging-vector";
    setInteractionMode("dragging-vector");

    if (svgRef.current) {
      try {
        svgRef.current.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
    updateVectorFromCoordinates(e.clientX, e.clientY);
  }, [updateVectorFromCoordinates]);

  // CANVAS PAN HANDLER: Owned strictly when pointer is on empty canvas
  const panStartRef = useRef<{
    clientX: number;
    clientY: number;
    center: [number, number];
  }>({
    clientX: 0,
    clientY: 0,
    center: [0, 0],
  });

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent<SVGElement>) => {
    // If vector owns pointer or event originated from vector, never pan
    if (interactionModeRef.current === "dragging-vector") return;
    const target = e.target as SVGElement | null;
    if (target?.closest && target.closest("#test-vector-v")) return;

    interactionModeRef.current = "panning-camera";
    setInteractionMode("panning-camera");

    if (svgRef.current) {
      try {
        svgRef.current.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      center: [...cameraStateRef.current.center],
    };
  }, []);

  // UNIFIED POINTER MOVE HANDLER: Dispatches exclusively to active mode with rAF throttling
  const handleSvgPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (interactionModeRef.current === "dragging-vector") {
      // Ignore synthetic duplicate events when pointer hasn't moved
      if (
        e.clientX === lastProcessedPointerRef.current.clientX &&
        e.clientY === lastProcessedPointerRef.current.clientY
      ) {
        return;
      }

      latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

      if (dragRafRef.current === null) {
        dragRafRef.current = requestAnimationFrame(() => {
          dragRafRef.current = null;
          if (interactionModeRef.current === "dragging-vector") {
            updateVectorFromCoordinates(
              latestPointerRef.current.clientX,
              latestPointerRef.current.clientY
            );
          }
        });
      }
      return;
    }

    if (interactionModeRef.current === "panning-camera") {
      latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

      if (panRafRef.current === null) {
        panRafRef.current = requestAnimationFrame(() => {
          panRafRef.current = null;
          if (interactionModeRef.current === "panning-camera") {
            const zoom = cameraStateRef.current.zoom > 0 ? cameraStateRef.current.zoom : 1;
            const dx = (latestPointerRef.current.clientX - panStartRef.current.clientX) / zoom;
            const dy = (latestPointerRef.current.clientY - panStartRef.current.clientY) / zoom;

            // SVG Y is inverted relative to Cartesian world coordinates
            setCameraState((prev) => ({
              ...prev,
              center: [
                panStartRef.current.center[0] - dx,
                panStartRef.current.center[1] + dy,
              ],
            }));
          }
        });
      }
      return;
    }
  }, [updateVectorFromCoordinates]);

  // UNIFIED POINTER UP / CANCEL HANDLER
  const handleSvgPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement | SVGElement>) => {
    if (dragRafRef.current !== null) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    if (panRafRef.current !== null) {
      cancelAnimationFrame(panRafRef.current);
      panRafRef.current = null;
    }
    if (svgRef.current && e.pointerId !== undefined) {
      try {
        if (svgRef.current.hasPointerCapture(e.pointerId)) {
          svgRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    interactionModeRef.current = "idle";
    setInteractionMode("idle");
  }, []);

  // Wheel to zoom listener on SVG container
  const svgContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = svgContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setCameraState((prev) => {
        const newZoom = Math.min(
          CAMERA_BOUNDS_POLICY.MAX_ZOOM,
          Math.max(CAMERA_BOUNDS_POLICY.MIN_ZOOM, prev.zoom * factor)
        );
        return {
          ...prev,
          zoom: newZoom,
        };
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Auto-fit hysteresis: Only refit when matrix preset changes cause geometry blowout
  const lastMatrixRef = useRef<Matrix>(matrix);
  useEffect(() => {
    const mChanged =
      lastMatrixRef.current[0][0] !== matrix[0][0] ||
      lastMatrixRef.current[0][1] !== matrix[0][1] ||
      lastMatrixRef.current[1][0] !== matrix[1][0] ||
      lastMatrixRef.current[1][1] !== matrix[1][1];

    if (mChanged) {
      lastMatrixRef.current = matrix;

      const pts: Vector[] = [[0, 0], testVector, transformedVector];
      for (const b of activeBasisVectors) {
        pts.push(b);
      }

      if (
        isGeometryOutOfBounds(
          pts,
          currentVisibleBounds,
          CAMERA_BOUNDS_POLICY.HYSTERESIS_THRESHOLD
        )
      ) {
        animateCameraTo(recommendedFraming.center, recommendedFraming.zoom);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix]);

  // Clean up all animation frames on unmount
  useEffect(() => {
    return () => {
      if (dragRafRef.current !== null) cancelAnimationFrame(dragRafRef.current);
      if (panRafRef.current !== null) cancelAnimationFrame(panRafRef.current);
      if (cameraAnimRef.current !== null) cancelAnimationFrame(cameraAnimRef.current);
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Explicit Fit Scene action
  const handleFitScene = () => {
    animateCameraTo(recommendedFraming.center, recommendedFraming.zoom);
  };

  // Explicit Reset Camera action
  const handleResetCamera = () => {
    animateCameraTo([0, 0], canonicalFraming.zoom);
  };

  // Manual Zoom controls (+ / -)
  const handleZoom = (factor: number) => {
    const newZoom = Math.min(
      CAMERA_BOUNDS_POLICY.MAX_ZOOM,
      Math.max(CAMERA_BOUNDS_POLICY.MIN_ZOOM, cameraState.zoom * factor)
    );
    animateCameraTo(cameraState.center, newZoom, 150);
  };

  // Transformation Animation Loop
  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic easing
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setAnimProgress(eased);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAnimating]);

  const handlePlayAnimation = () => {
    // 1. Calculate animation envelope union before playback
    const animEnvelope = computeAnimationEnvelopeBounds({
      testVector,
      transformedVector,
      eigenbasisVectors: activeBasisVectors,
      origin: [0, 0],
    });
    const animFraming = calculateCameraFraming2D(animEnvelope, { width, height });

    // 2. If target geometry is clipped, adapt camera framing before playback starts
    if (
      isGeometryOutOfBounds(
        [testVector, transformedVector],
        currentVisibleBounds,
        0.05
      )
    ) {
      setCameraState({
        center: animFraming.center,
        zoom: animFraming.zoom,
      });
    }

    // 3. Keep camera framing fixed during animation playback: zero chasing, zero jitter!
    setAnimProgress(0);
    setIsAnimating(true);
  };

  const handleResetVector = () => {
    setAngle(45);
    setVectorRadius(2.0);
    setAnimProgress(1);
    setIsAnimating(false);
  };

  // Snap test vector to an exact eigenvector
  const handleSnapToEigenvector = (basisVector: Vector) => {
    const bAngleRad = Math.atan2(basisVector[1], basisVector[0]);
    let bAngleDeg = (bAngleRad * 180) / Math.PI;
    if (bAngleDeg < 0) bAngleDeg += 360;
    setAngle(Number(bAngleDeg.toFixed(4)));
    setAnimProgress(1);
  };

  // =========================================================================
  // 1:1 UNIFORM COORDINATE MAPPING (Strictly preserves 1 unit X = 1 unit Y)
  // =========================================================================
  const toSvgX = (x: number) =>
    width / 2 + (x - cameraState.center[0]) * cameraState.zoom;
  const toSvgY = (y: number) =>
    height / 2 - (y - cameraState.center[1]) * cameraState.zoom;

  const originSvgX = toSvgX(0);
  const originSvgY = toSvgY(0);

  // Dynamic Cartesian Grid ticks adapting to visible world bounds
  const gridTicks = useMemo(() => {
    const spanX = currentVisibleBounds.xMax - currentVisibleBounds.xMin;
    const step = spanX > 30 ? 5 : spanX > 16 ? 2 : 1;

    const xMin = Math.floor(currentVisibleBounds.xMin / step) * step;
    const xMax = Math.ceil(currentVisibleBounds.xMax / step) * step;
    const yMin = Math.floor(currentVisibleBounds.yMin / step) * step;
    const yMax = Math.ceil(currentVisibleBounds.yMax / step) * step;

    const vTicks: number[] = [];
    for (let x = xMin; x <= xMax; x += step) {
      if (x !== 0) vTicks.push(x);
    }

    const hTicks: number[] = [];
    for (let y = yMin; y <= yMax; y += step) {
      if (y !== 0) hTicks.push(y);
    }

    return { vTicks, hTicks, step };
  }, [currentVisibleBounds]);

  // Dynamic description of the transformation action
  const getActionDescription = () => {
    if (isTransformedZero) {
      return {
        title: "λ = 0 Eigenspace (Nullspace Collapse)",
        details: "v → Av = [0, 0] (Vector collapses completely into origin)",
        color: "rose",
      };
    }
    if (eigenStatus.isSameLine && eigenStatus.lambda !== undefined) {
      const lam = eigenStatus.lambda;
      if (lam < 0) {
        return {
          title: `λ = ${formatMathNumber(lam)} Invariant Direction (Direction Reversal)`,
          details: `v → Av = ${formatMathNumber(lam)}v (θ = 180°, flips across origin on same line)`,
          color: "amber",
        };
      } else if (lam > 1) {
        return {
          title: `λ = ${formatMathNumber(lam)} Invariant Direction (Stretch)`,
          details: `v → Av = ${formatMathNumber(lam)}v (Stretches away from origin on same line)`,
          color: "emerald",
        };
      } else if (lam > 0 && lam < 1) {
        return {
          title: `λ = ${formatMathNumber(lam)} Invariant Direction (Shrink)`,
          details: `v → Av = ${formatMathNumber(lam)}v (Contracts toward origin without collapsing)`,
          color: "cyan",
        };
      } else if (Math.abs(lam - 1) < 1e-4) {
        return {
          title: `λ = 1 Invariant Direction (Identity Scale)`,
          details: `v → Av = v (Vector is completely unchanged)`,
          color: "emerald",
        };
      }
    }
    return {
      title: "Ordinary (Non-Eigen) Vector",
      details: `Rotates by ${formatMathNumber(eigenStatus.angleDegrees)}° away from line`,
      color: "slate",
    };
  };

  const actionInfo = getActionDescription();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-sm">
      {/* Visualizer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-200">
            Interactive Invariant Direction (Eigenspace) Canvas
          </h4>
        </div>

        {/* Toolbar: Transformation Playback, Fit Scene, Reset Camera, and Reset Vector */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handlePlayAnimation}
            disabled={isAnimating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isAnimating ? "Transforming..." : "Animate Av"}</span>
          </button>

          <button
            onClick={handleFitScene}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Intelligently fit mathematical geometry into viewport"
          >
            <Maximize2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Fit Scene</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset camera view to canonical origin view"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Camera</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => handleZoom(1.2)}
              className="p-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetVector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset vector angle and magnitude"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main 2D Canvas Display with Pan & Zoom */}
      <div
        ref={svgContainerRef}
        className="relative w-full rounded-lg overflow-hidden border border-slate-800/90 bg-slate-950 flex flex-col items-center justify-center p-2 select-none"
        style={{ touchAction: "none" }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-auto max-h-[440px] select-none ${
            interactionMode === "panning-camera"
              ? "cursor-grabbing"
              : interactionMode === "dragging-vector"
              ? "cursor-grabbing"
              : "cursor-default"
          }`}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerCancel={handleSvgPointerUp}
          onLostPointerCapture={handleSvgPointerUp}
          style={{ touchAction: "none" }}
        >
          <defs>
            {/* Arrowheads */}
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
            </marker>

            <marker
              id="arrow-purple"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#a855f7" />
            </marker>

            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#06b6d4" />
            </marker>

            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Background hit target for empty canvas panning */}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            style={{ pointerEvents: "all" }}
            data-testid="canvas-background"
            className={
              interactionMode === "panning-camera"
                ? "cursor-grabbing"
                : "cursor-grab"
            }
            onPointerDown={handleCanvasPointerDown}
          />

          {/* Dynamic Reference Grid Lines */}
          {gridTicks.vTicks.map((x) => (
            <g key={`grid-v-${x}`} className="pointer-events-none">
              <line
                x1={toSvgX(x)}
                y1={0}
                x2={toSvgX(x)}
                y2={height}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
              <text
                x={toSvgX(x)}
                y={Math.min(Math.max(originSvgY + 12, 14), height - 6)}
                fill="#475569"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {x}
              </text>
            </g>
          ))}

          {gridTicks.hTicks.map((y) => (
            <g key={`grid-h-${y}`} className="pointer-events-none">
              <line
                x1={0}
                y1={toSvgY(y)}
                x2={width}
                y2={toSvgY(y)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
              <text
                x={Math.min(Math.max(originSvgX - 8, 12), width - 12)}
                y={toSvgY(y) + 3}
                fill="#475569"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                {y}
              </text>
            </g>
          ))}

          {/* Coordinate Axes (Fixed World Space, anchored at origin) */}
          <line
            x1={0}
            y1={originSvgY}
            x2={width}
            y2={originSvgY}
            stroke="#475569"
            strokeWidth="1.5"
            className="pointer-events-none"
          />
          <line
            x1={originSvgX}
            y1={0}
            x2={originSvgX}
            y2={height}
            stroke="#475569"
            strokeWidth="1.5"
            className="pointer-events-none"
          />

          {/* Axis Labels */}
          <text
            x={width - 15}
            y={Math.min(Math.max(originSvgY - 8, 15), height - 15)}
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            className="pointer-events-none select-none"
          >
            x
          </text>
          <text
            x={Math.min(Math.max(originSvgX + 8, 8), width - 20)}
            y={15}
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            className="pointer-events-none select-none"
          >
            y
          </text>

          {/* Parametric Finite Eigenspace Lines (Invariant directions span(v_i)) */}
          {eigensystem.eigenpairs.map((pair, idx) => {
            const basis = pair.eigenspaceBasis[0];
            if (!basis) return null;

            const isZeroEigenvalue = Math.abs(pair.eigenvalue) < 1e-4;
            const strokeColor = isZeroEigenvalue
              ? "#f43f5e"
              : idx === 0
              ? "#06b6d4"
              : "#f59e0b";

            // Finite parametric line clipping based on current visible bounds
            const lineSegment = clipParametricLineToBounds(
              basis,
              currentVisibleBounds,
              [0, 0]
            );
            if (!lineSegment) return null;

            const x1 = toSvgX(lineSegment.start[0]);
            const y1 = toSvgY(lineSegment.start[1]);
            const x2 = toSvgX(lineSegment.end[0]);
            const y2 = toSvgY(lineSegment.end[1]);

            // Deterministic label position along invariant line
            const labelDistance = Math.min(
              (currentVisibleBounds.xMax - currentVisibleBounds.xMin) * 0.35,
              6
            );
            const labelX = toSvgX(basis[0] * labelDistance);
            const labelY = toSvgY(basis[1] * labelDistance) - 8;

            return (
              <g
                key={`eigenspace-line-${idx}`}
                data-testid={`eigenspace-line-${idx}`}
                className="pointer-events-none"
              >
                {/* Glow boundary */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeOpacity="0.15"
                />
                {/* Eigenspace Ray */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                {/* Eigenspace Label */}
                <text
                  x={labelX}
                  y={labelY}
                  fill={strokeColor}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {isZeroEigenvalue
                    ? `E(λ=0 Nullspace)`
                    : `E(λ=${formatMathNumber(pair.eigenvalue)})`}
                </text>
              </g>
            );
          })}

          {/* Interactive Test Vector v (Emerald) with Large Hit Region */}
          <g
            id="test-vector-v"
            data-testid="test-vector-v"
            onPointerDown={handleVectorPointerDown}
            onPointerUp={handleSvgPointerUp}
            onPointerCancel={handleSvgPointerUp}
            className={`transition-opacity ${
              interactionMode === "dragging-vector" ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ touchAction: "none" }}
          >
            {/* Invisible thick stroke for easy dragging along vector body */}
            <line
              x1={originSvgX}
              y1={originSvgY}
              x2={toSvgX(testVector[0])}
              y2={toSvgY(testVector[1])}
              stroke="transparent"
              strokeWidth="28"
              strokeLinecap="round"
              style={{ pointerEvents: "stroke" }}
              className={
                interactionMode === "dragging-vector"
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }
              onPointerDown={handleVectorPointerDown}
            />

            {/* Visible Vector Line */}
            <line
              x1={originSvgX}
              y1={originSvgY}
              x2={toSvgX(testVector[0])}
              y2={toSvgY(testVector[1])}
              stroke="#10b981"
              strokeWidth="3"
              markerEnd="url(#arrow-emerald)"
              className="pointer-events-none"
            />

            {/* Draggable Tip Handle */}
            <circle
              cx={toSvgX(testVector[0])}
              cy={toSvgY(testVector[1])}
              r="18"
              fill="transparent"
              style={{ pointerEvents: "all" }}
              className={`hover:stroke-emerald-400 hover:stroke-2 ${
                interactionMode === "dragging-vector"
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }`}
              data-testid="vector-drag-handle"
              onPointerDown={handleVectorPointerDown}
            />
            <circle
              cx={toSvgX(testVector[0])}
              cy={toSvgY(testVector[1])}
              r="4.5"
              fill="#10b981"
              className="pointer-events-none"
            />

            {/* Vector Coordinate Label */}
            <text
              x={toSvgX(testVector[0]) + 8}
              y={toSvgY(testVector[1]) - 8}
              fill="#10b981"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              className="pointer-events-none select-none"
            >
              v = [{formatMathNumber(testVector[0])},{" "}
              {formatMathNumber(testVector[1])}]
            </text>
          </g>

          {/* Transformed Vector Av (Purple) - Derived, strictly non-draggable */}
          {animProgress > 0 && (
            <g className="pointer-events-none">
              {isCurrentDisplayedZero ? (
                /* When collapsed to origin (λ = 0 final state) */
                <g id="av-collapsed-origin" data-testid="av-collapsed-origin">
                  <circle
                    cx={originSvgX}
                    cy={originSvgY}
                    r="8"
                    fill="#a855f7"
                    fillOpacity="0.25"
                    stroke="#c084fc"
                    strokeWidth="2"
                  />
                  <circle cx={originSvgX} cy={originSvgY} r="4" fill="#a855f7" />
                  <text
                    x={originSvgX + 12}
                    y={originSvgY + 16}
                    fill="#c084fc"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none"
                  >
                    Av = [0, 0]
                  </text>
                </g>
              ) : (
                /* Non-zero transformed vector */
                <g id="av-vector-arrow" data-testid="av-vector-arrow">
                  <line
                    x1={originSvgX}
                    y1={originSvgY}
                    x2={toSvgX(currentDisplayedVector[0])}
                    y2={toSvgY(currentDisplayedVector[1])}
                    stroke="#a855f7"
                    strokeWidth="3"
                    markerEnd="url(#arrow-purple)"
                  />
                  <text
                    x={toSvgX(currentDisplayedVector[0]) + 8}
                    y={toSvgY(currentDisplayedVector[1]) + 14}
                    fill="#c084fc"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none"
                  >
                    Av = [{formatMathNumber(currentDisplayedVector[0])},{" "}
                    {formatMathNumber(currentDisplayedVector[1])}]
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Dashed trajectory line between v and Av when ordinary vector */}
          {!eigenStatus.isSameLine && !isTransformedZero && (
            <line
              x1={toSvgX(testVector[0])}
              y1={toSvgY(testVector[1])}
              x2={toSvgX(transformedVector[0])}
              y2={toSvgY(transformedVector[1])}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}

          {/* Center Origin Dot (Strictly guaranteed visible in all framings) */}
          <circle
            cx={originSvgX}
            cy={originSvgY}
            r="4"
            fill="#64748b"
            data-testid="origin-marker"
            className="pointer-events-none"
          />
        </svg>

        {/* Floating Alignment Status Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs shadow-lg backdrop-blur-md ${
              actionInfo.color === "rose"
                ? "bg-rose-950/90 border-rose-500/80 text-rose-200"
                : actionInfo.color === "emerald"
                ? "bg-emerald-950/90 border-emerald-500/80 text-emerald-200"
                : actionInfo.color === "amber"
                ? "bg-amber-950/90 border-amber-500/80 text-amber-200"
                : actionInfo.color === "cyan"
                ? "bg-cyan-950/90 border-cyan-500/80 text-cyan-200"
                : "bg-slate-900/90 border-slate-700 text-slate-300"
            }`}
          >
            {actionInfo.color === "slate" ? (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="font-bold">{actionInfo.title}</div>
              <div className="text-[11px] opacity-90 font-mono">
                {actionInfo.details}
              </div>
            </div>
          </div>
        </div>

        {/* Legend Overlay Bottom Left */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 text-[11px] bg-slate-950/85 p-2 rounded-lg border border-slate-800 text-slate-400 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Test Vector (v) [Drag arrow/tip]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>Transformed Vector (Av)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 border-b-2 border-dashed border-cyan-400" />
            <span>Eigenspace Line</span>
          </div>
        </div>

        {/* Pan / Zoom instructions hint */}
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono pointer-events-none">
          Drag vector to rotate/scale · Drag empty canvas to pan
        </div>
      </div>

      {/* Interactive Controls & Snapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Angle Slider */}
        <div className="space-y-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span>Rotate Vector Angle (θ)</span>
            </div>
            <span className="font-mono text-indigo-300 font-bold">
              {currentAngleDeg}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={currentAngleDeg}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="text-[11px] text-slate-400">
            <MathText text="Rotate vector $\mathbf{v}$ around the circle to test which directions preserve their line." />
          </div>
        </div>

        {/* Snap Buttons to Exact Eigenvectors */}
        <div className="space-y-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300">
            Snap Directly to Invariant Directions:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {eigensystem.eigenpairs.length > 0 ? (
              eigensystem.eigenpairs.map((pair, idx) => {
                const basis = pair.eigenspaceBasis[0];
                const isZero = Math.abs(pair.eigenvalue) < 1e-4;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSnapToEigenvector(basis)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors border ${
                      isZero
                        ? "bg-rose-950/70 border-rose-700 text-rose-300 hover:bg-rose-900"
                        : idx === 0
                        ? "bg-cyan-950/70 border-cyan-700 text-cyan-300 hover:bg-cyan-900"
                        : "bg-amber-950/70 border-amber-700 text-amber-300 hover:bg-amber-900"
                    }`}
                  >
                    <span>Snap to</span>
                    <MathFormula math={`\\mathbf{v}_${idx + 1}`} inline={true} />
                    <span className="font-mono text-[10px]">
                      ({isZero ? "λ=0 Nullspace" : `λ=${formatMathNumber(pair.eigenvalue)}`})
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-rose-400">
                No real eigenvectors to snap to.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
