import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { VisualizationFallback } from "./VisualizationFallback";
import { RefreshCw } from "lucide-react";

interface VisualizationContainerProps {
  title?: string;
  presetId?: string;
  type?: string;
  dimension?: 2 | 3;
  children?: React.ReactNode;
}

export function VisualizationContainer({
  title = "Geometric Visualization",
  presetId,
  type = "matrix-transformation",
  dimension = 2,
  children,
}: VisualizationContainerProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm backdrop-blur-sm">
      {/* Visualizer header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <Badge variant="accent" className="text-[10px] uppercase">
            {dimension}D Canvas
          </Badge>
          {presetId && (
            <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
              preset: {presetId}
            </span>
          )}
        </div>
        <button
          disabled
          className="flex items-center gap-1 text-xs text-slate-500 cursor-not-allowed"
          title="Reset scene controls (Active in Milestone 2)"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative min-h-[300px] w-full rounded-lg overflow-hidden flex items-center justify-center">
        {children || (
          <VisualizationFallback title={title} type={type} dimension={dimension} />
        )}
      </div>
    </div>
  );
}
