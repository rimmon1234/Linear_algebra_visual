"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import type { Matrix, Vector } from "@/features/math/types";
import {
  identityMatrix2x2,
  areMatricesEqual,
} from "@/features/math/matrix/operations";
import {
  buildTransformationSpec,
} from "@/features/visualization/model/transformation-model";
import { type TransformationPreset } from "@/features/math/transformation/transformation-2d";
import { useVisualizerStore } from "@/features/visualization/store/visualizer-store";
import { MatrixEditor } from "./MatrixEditor";
import { PresetSelector } from "./PresetSelector";
import { VectorInput } from "./VectorInput";
import { NumericalPanel } from "./NumericalPanel";
import { DeterminantCard } from "./DeterminantCard";
import { ExperimentPanel } from "./ExperimentPanel";
import { VisualizationFallback } from "./VisualizationFallback";
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

// Dynamic import of the R3F Canvas and Renderer
const LinearAlgebraCanvas = dynamic(
  () =>
    import("@/features/visualization/engine/LinearAlgebraCanvas").then(
      (m) => m.LinearAlgebraCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <VisualizationFallback
        title="Loading Matrix Transformation Engine..."
        type="matrix-transformation"
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

interface MatrixTransformationVisualizerProps {
  initialMatrix?: Matrix;
  initialVector?: Vector;
}

export function MatrixTransformationVisualizer({
  initialMatrix = identityMatrix2x2(),
  initialVector = [2, 1],
}: MatrixTransformationVisualizerProps) {
  const [matrix, setMatrix] = useState<Matrix>(initialMatrix);
  const [vector, setVector] = useState<Vector>(initialVector);
  const [progress, setProgress] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showLinearityDemo, setShowLinearityDemo] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const triggerCameraReset = useVisualizerStore((s) => s.triggerCameraReset);
  const triggerFitScene = useVisualizerStore((s) => s.triggerFitScene);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation Loop: animates progress from 0 to 1 with zero camera jitter
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
      return;
    }

    const duration = 2000 / speed; // 2 seconds at 1x speed

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      const elapsed = currentTime - lastTimeRef.current;
      const nextProgress = Math.min(1, progress + elapsed / duration);

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setIsPlaying(false);
        lastTimeRef.current = null;
      } else {
        lastTimeRef.current = currentTime;
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, progress, speed]);

  // Derived Visualization Spec from mathematical state
  const currentSpec = useMemo(() => {
    return buildTransformationSpec({
      matrix,
      progress,
      customVector: vector,
      showLinearityDemo,
      title: "2D Matrix Transformation",
      description: "Interactive linear grid transformation and vector mapping.",
    });
  }, [matrix, progress, vector, showLinearityDemo]);

  // Preset Handler
  const handleSelectPreset = (preset: TransformationPreset) => {
    setMatrix(preset.matrix);
    setProgress(0); // Reset animation to 0 to observe transition
    setIsPlaying(true);
  };

  // Experiment Handler
  const handleApplyExperiment = (expMatrix: Matrix) => {
    setMatrix(expMatrix);
    setProgress(0);
    setIsPlaying(true);
  };

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (progress >= 1) {
      setProgress(0); // Restart from 0 if at end
    }
    setIsPlaying(!isPlaying);
  };

  // Independent Reset Handlers
  const handleResetMatrix = () => {
    setMatrix(identityMatrix2x2());
    setProgress(1);
    setIsPlaying(false);
  };

  const handleResetVector = () => {
    setVector([2, 1]);
  };

  const isIdentity = areMatricesEqual(matrix, identityMatrix2x2());

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm backdrop-blur-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-100">
            2D Matrix Transformation Visualizer
          </h3>
          <span className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-800">
            Active Linear Map
          </span>
        </div>

        {/* Linearity Demo Switch */}
        <button
          onClick={() => setShowLinearityDemo(!showLinearityDemo)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors border ${
            showLinearityDemo
              ? "bg-indigo-900/60 text-indigo-200 border-indigo-500/80 shadow-sm"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>Demonstrate Linearity: A(u + v) = Au + Av</span>
        </button>
      </div>

      {/* Main Content Grid: Interactive Controls & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Matrix & Vector Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Preset Selector */}
          <PresetSelector
            currentMatrix={matrix}
            onSelectPreset={handleSelectPreset}
          />

          {/* Matrix Editor & Vector Input Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MatrixEditor
              matrix={matrix}
              onChange={(m) => {
                setMatrix(m);
                setProgress(1); // Immediate visual feedback on edit without moving camera
                setIsPlaying(false);
              }}
            />

            {!showLinearityDemo ? (
              <VectorInput
                vector={vector}
                onChange={(v) => setVector(v)}
              />
            ) : (
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-indigo-300">Linearity Mode Active</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Showing vectors <strong>u</strong> (blue), <strong>v</strong> (green), and sum <strong>u+v</strong> (amber). Notice A(u+v) perfectly completes the parallelogram.
                </p>
              </div>
            )}
          </div>

          {/* Action Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetMatrix}
              disabled={isIdentity && progress === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Matrix to Identity (I)</span>
            </button>

            <button
              onClick={handleResetVector}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              Reset Vector
            </button>
          </div>

          {/* Determinant Card */}
          <DeterminantCard matrix={matrix} />
        </div>

        {/* Right Column: 2D WebGL Canvas & Camera Framing Tools (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          {/* Canvas Floating Toolbar: Fit Scene & Reset Camera */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-slate-400">
              Interactive 2D Canvas (Drag to Pan, Scroll to Zoom)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerFitScene(currentSpec.coordinateSystem?.bounds)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="Fit all current vectors into visible camera view"
              >
                <Maximize2 className="h-3 w-3 text-indigo-400" />
                <span>Fit Scene</span>
              </button>
              <button
                onClick={triggerCameraReset}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="Reset camera zoom and pan to canonical origin view"
              >
                <RotateCcw className="h-3 w-3 text-slate-400" />
                <span>Reset Camera</span>
              </button>
            </div>
          </div>

          {/* WebGL Canvas Area */}
          <div className="relative min-h-[480px] h-[520px] w-full rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950">
            <LinearAlgebraCanvas
              dimension={2}
              cameraMode="orthographic"
              fallbackTitle="2D Matrix Transformation"
            >
              <VisualizationRenderer spec={currentSpec} />
            </LinearAlgebraCanvas>
          </div>

          {/* Animation Scrubber & Playback Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? "Pause" : progress >= 1 ? "Replay Transformation" : "Play"}</span>
              </button>

              <button
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Reset progress to identity (t = 0)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Scrubber Slider */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <span className="font-mono text-[11px] text-slate-400">t = 0 (I)</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={progress}
                onChange={(e) => {
                  setProgress(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="font-mono text-[11px] text-indigo-400 font-bold">
                t = {progress.toFixed(2)}
              </span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1">
              <Sliders className="h-3 w-3 text-slate-400" />
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    speed === s
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Value Breakdown */}
      <NumericalPanel
        matrix={matrix}
        vector={vector}
        progress={progress}
      />

      {/* Guided Experiments */}
      <ExperimentPanel onApplyMatrix={handleApplyExperiment} />
    </div>
  );
}
