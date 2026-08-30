"use client";

import React from "react";
import { useVisualizerStore } from "@/features/visualization/store/visualizer-store";
import { Play, Pause, RotateCcw, Camera, Layers, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisualizationToolbarProps {
  showAnimationControls?: boolean;
  onDimensionChange?: (dim: 2 | 3) => void;
}

export function VisualizationToolbar({
  showAnimationControls = false,
  onDimensionChange,
}: VisualizationToolbarProps) {
  const dimension = useVisualizerStore((s) => s.dimension);
  const setDimension = useVisualizerStore((s) => s.setDimension);
  const triggerCameraReset = useVisualizerStore((s) => s.triggerCameraReset);
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const togglePlayback = useVisualizerStore((s) => s.togglePlayback);
  const resetAnimation = useVisualizerStore((s) => s.resetAnimation);
  const speed = useVisualizerStore((s) => s.speed);
  const setSpeed = useVisualizerStore((s) => s.setSpeed);

  const handleDimensionToggle = () => {
    const nextDim = dimension === 2 ? 3 : 2;
    setDimension(nextDim);
    if (onDimensionChange) {
      onDimensionChange(nextDim);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
      {/* Dimension & Camera Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDimensionToggle}
          className="h-7 px-2.5 text-xs flex items-center gap-1.5 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
          title="Toggle between 2D Cartesian plane and 3D space"
        >
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Switch to {dimension === 2 ? "3D" : "2D"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={triggerCameraReset}
          className="h-7 px-2 text-xs flex items-center gap-1.5 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300"
          title="Reset camera center and zoom"
        >
          <Camera className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset View</span>
        </Button>
      </div>

      {/* Interaction Mode Hint */}
      <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
        <Info className="h-3 w-3 text-slate-500" />
        <span>
          {dimension === 2
            ? "2D Mode: Drag to Pan • Scroll to Zoom"
            : "3D Mode: Drag to Rotate • Right-click to Pan • Scroll to Zoom"}
        </span>
      </div>

      {/* Animation Controls (if enabled) */}
      {showAnimationControls && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlayback}
            className="h-7 px-2.5 text-xs flex items-center gap-1 border-indigo-900/60 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Play</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetAnimation}
            className="h-7 px-2 text-xs text-slate-400 hover:text-slate-200"
            title="Reset Animation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Speed Selector */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-7 rounded border border-slate-800 bg-slate-900 px-1.5 text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>
      )}
    </div>
  );
}
