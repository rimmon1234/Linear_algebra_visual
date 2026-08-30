import { Box } from "lucide-react";

interface VisualizationFallbackProps {
  title?: string;
  type?: string;
  dimension?: 2 | 3;
}

export function VisualizationFallback({
  title = "Interactive Scene",
  type = "matrix-transformation",
  dimension = 2,
}: VisualizationFallbackProps) {
  return (
    <div className="flex h-72 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-indigo-400 mb-3">
        <Box className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <p className="mt-1 text-xs text-slate-400 max-w-sm">
        {dimension}D visualizer boundary established for <code className="text-indigo-300 font-mono">{type}</code>. Interactive rendering engine connects in Milestone 2.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {dimension}D Coordinate Frame
        </span>
        <span className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-800">
          Zod Schema Ready
        </span>
      </div>
    </div>
  );
}
