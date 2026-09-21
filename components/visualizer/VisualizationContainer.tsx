"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { VisualizationToolbar } from "./VisualizationToolbar";
import { VisualizationFallback } from "./VisualizationFallback";
import { MatrixTransformationVisualizer } from "./MatrixTransformationVisualizer";
import { CharacteristicEquationExplorer } from "@/components/characteristic/CharacteristicEquationExplorer";
import { EigenvaluesExplorer } from "@/components/eigenvectors/EigenvaluesExplorer";
import type { VisualizationSpec } from "@/features/visualization/schema";
import {
  CANONICAL_2D_DEMO_SPEC,
  CANONICAL_3D_DEMO_SPEC,
} from "@/features/visualization/presets/canonical-presets";
import { useVisualizerStore } from "@/features/visualization/store/visualizer-store";

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
        title="Loading Visualization Engine..."
        type="vector"
        dimension={2}
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

interface VisualizationContainerProps {
  title?: string;
  presetId?: string;
  type?: string;
  dimension?: 2 | 3;
  spec?: VisualizationSpec;
}

export function VisualizationContainer({
  title = "Geometric Visualization",
  presetId,
  type = "vector",
  dimension: initialDimension = 2,
  spec: initialSpec,
}: VisualizationContainerProps) {
  const [mounted, setMounted] = useState(false);
  const storeDimension = useVisualizerStore((s) => s.dimension);
  const setStoreDimension = useVisualizerStore((s) => s.setDimension);

  useEffect(() => {
    setMounted(true);
    setStoreDimension(initialDimension);
  }, [initialDimension, setStoreDimension]);

  // If this is a characteristic equation or polynomial topic, mount CharacteristicEquationExplorer
  const isCharacteristicEquation =
    type === "characteristic-equation" ||
    type === "characteristic-polynomial" ||
    presetId === "characteristic-polynomial-2d" ||
    presetId === "characteristic-equation-2d" ||
    initialSpec?.type === "characteristic-equation" ||
    initialSpec?.type === "characteristic-polynomial";

  if (isCharacteristicEquation) {
    return <CharacteristicEquationExplorer />;
  }

  // If this is an eigenvector or eigenvalue topic, mount EigenvaluesExplorer
  const isEigenvectors =
    type === "eigenvectors" ||
    type === "eigenvalue-transformation" ||
    presetId === "eigenvectors-2d" ||
    initialSpec?.type === "eigenvectors" ||
    initialSpec?.type === "eigenvalue-transformation";

  if (isEigenvectors) {
    return <EigenvaluesExplorer />;
  }

  // If this is a matrix or linear transformation topic, mount the interactive MatrixTransformationVisualizer
  const isMatrixTransformation =
    type === "matrix-transformation" ||
    type === "linear-transformation" ||
    initialSpec?.type === "matrix-transformation" ||
    initialSpec?.type === "linear-transformation";

  if (isMatrixTransformation) {
    return <MatrixTransformationVisualizer />;
  }

  // Determine active spec based on dimension toggle for general canonical presets
  const activeSpec: VisualizationSpec =
    initialSpec ??
    (storeDimension === 3 ? CANONICAL_3D_DEMO_SPEC : CANONICAL_2D_DEMO_SPEC);

  const displayTitle = activeSpec.metadata?.title ?? title;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm backdrop-blur-sm space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-100">{displayTitle}</h3>
          <Badge variant="accent" className="text-[10px] uppercase">
            {storeDimension}D Canvas
          </Badge>
          {presetId && (
            <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
              preset: {presetId}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Controls Toolbar */}
      <VisualizationToolbar
        showAnimationControls={Boolean(activeSpec.animation?.enabled)}
      />

      {/* 3D / 2D WebGL Canvas Area */}
      <div className="relative min-h-[440px] h-[460px] w-full rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950">
        {!mounted ? (
          <VisualizationFallback
            title={displayTitle}
            dimension={storeDimension}
          />
        ) : (
          <LinearAlgebraCanvas
            dimension={storeDimension}
            cameraMode={activeSpec.camera?.mode}
            fallbackTitle={displayTitle}
          >
            <VisualizationRenderer spec={activeSpec} />
          </LinearAlgebraCanvas>
        )}
      </div>
    </div>
  );
}
