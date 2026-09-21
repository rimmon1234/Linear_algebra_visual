"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { VisualizationSpec } from "@/features/visualization/schema";
import { VisualizationFallback } from "@/components/visualizer/VisualizationFallback";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import { Box } from "lucide-react";

// Dynamic import of the R3F Canvas and Renderer to ensure clean client-side WebGL mounting
const LinearAlgebraCanvas = dynamic(
  () =>
    import("@/features/visualization/engine/LinearAlgebraCanvas").then(
      (m) => m.LinearAlgebraCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <VisualizationFallback
        title="Loading 3D Eigenspace Canvas..."
        type="vector"
        dimension={3}
      />
    ),
  }
);

const VisualizationRenderer = dynamic(
  () =>
    import("@/features/visualization/engine/VisualizationRenderer").then(
      (m) => m.VisualizationRenderer
    ),
  { ssr: false }
);

export function EigenvectorVisualizer3D() {
  const [activeVector, setActiveVector] = useState<"all" | "e1" | "e2" | "e3">("all");

  const spec3D: VisualizationSpec = {
    version: 1,
    type: "vector",
    dimension: 3,
    coordinateSystem: {
      dimension: 3,
      showAxes: true,
      showGrid: true,
      showLabels: true,
      bounds: {
        xMin: -5,
        xMax: 5,
        yMin: -5,
        yMax: 5,
        zMin: -5,
        zMax: 5,
      },
    },
    camera: {
      mode: "perspective",
      position: [7, 6, 8],
      target: [0, 0, 0],
    },
    objects: [
      // Invariant lines along the 3 coordinate axes
      {
        type: "line",
        id: "axis-x-line",
        start: [-4.5, 0, 0],
        end: [4.5, 0, 0],
        color: "#06b6d4",
        dashed: true,
      },
      {
        type: "line",
        id: "axis-y-line",
        start: [0, -4.5, 0],
        end: [0, 4.5, 0],
        color: "#f59e0b",
        dashed: true,
      },
      {
        type: "line",
        id: "axis-z-line",
        start: [0, 0, -4.5],
        end: [0, 0, 4.5],
        color: "#10b981",
        dashed: true,
      },
      // Eigenvector 1: e1 along x-axis (λ = 2) -> Av = [2, 0, 0]
      {
        type: "vector",
        id: "v1_3d",
        label: "v₁ = [1, 0, 0]  (λ₁ = 2)",
        color: "#06b6d4",
        value: [2, 0, 0],
        origin: [0, 0, 0],
        visible: activeVector === "all" || activeVector === "e1",
      },
      // Eigenvector 2: e2 along y-axis (λ = 3) -> Av = [0, 3, 0]
      {
        type: "vector",
        id: "v2_3d",
        label: "v₂ = [0, 1, 0]  (λ₂ = 3)",
        color: "#f59e0b",
        value: [0, 3, 0],
        origin: [0, 0, 0],
        visible: activeVector === "all" || activeVector === "e2",
      },
      // Eigenvector 3: e3 along z-axis (λ = 1) -> Av = [0, 0, 1]
      {
        type: "vector",
        id: "v3_3d",
        label: "v₃ = [0, 0, 1]  (λ₃ = 1)",
        color: "#10b981",
        value: [0, 0, 1],
        origin: [0, 0, 0],
        visible: activeVector === "all" || activeVector === "e3",
      },
    ],
    controls: [],
    metadata: {
      title: "3D Diagonal Eigenspace Demo (A = diag(2, 3, 1))",
      description: "3D coordinate axes forming orthogonal invariant eigenspaces.",
    },
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-200">
            3D Eigenspace Demonstration: <MathFormula math="A = \text{diag}(2, 3, 1)" inline={true} />
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveVector("all")}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
              activeVector === "all"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Show All 3 Axes
          </button>
          <button
            onClick={() => setActiveVector("e1")}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
              activeVector === "e1"
                ? "bg-cyan-600 text-white border-cyan-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            x-axis (λ=2)
          </button>
          <button
            onClick={() => setActiveVector("e2")}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
              activeVector === "e2"
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            y-axis (λ=3)
          </button>
          <button
            onClick={() => setActiveVector("e3")}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
              activeVector === "e3"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            z-axis (λ=1)
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-300 leading-relaxed">
        <MathText text="In $\mathbb{R}^3$, the diagonal matrix $A = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ has the 3 standard coordinate axes as its invariant directions, scaled by $\lambda_1 = 2$, $\lambda_2 = 3$, and $\lambda_3 = 1$ respectively." />
      </div>

      <div className="relative min-h-[380px] h-[400px] w-full rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950">
        <LinearAlgebraCanvas
          dimension={3}
          cameraMode="perspective"
          fallbackTitle="3D Eigenspace Demo"
        >
          <VisualizationRenderer spec={spec3D} />
        </LinearAlgebraCanvas>
      </div>
    </div>
  );
}
