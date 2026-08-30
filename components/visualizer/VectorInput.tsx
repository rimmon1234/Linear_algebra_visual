"use client";

import React from "react";
import type { Vector } from "@/features/math/types";

interface VectorInputProps {
  vector: Vector;
  onChange: (newVector: Vector) => void;
  disabled?: boolean;
}

export function VectorInput({
  vector,
  onChange,
  disabled = false,
}: VectorInputProps) {
  const x = vector[0] ?? 2;
  const y = vector[1] ?? 1;

  const handleChange = (index: 0 | 1, valStr: string) => {
    const parsed = parseFloat(valStr);
    const safeVal = Number.isFinite(parsed) ? parsed : 0;
    const next: Vector = [
      index === 0 ? safeVal : x,
      index === 1 ? safeVal : y,
    ];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">
          Input Vector <span className="font-mono text-amber-400 font-semibold">v</span>
        </label>
        <span className="text-[10px] text-amber-400/80 font-mono">Custom Vector</span>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <input
              id="vector-entry-x"
              aria-label="Vector x component"
              type="number"
              step="0.5"
              value={x}
              disabled={disabled}
              onChange={(e) => handleChange(0, e.target.value)}
              className="w-14 h-8 text-center text-sm font-mono font-medium rounded border border-amber-500/40 bg-slate-900 text-amber-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-slate-400 mt-0.5">x</span>
          </div>

          <div className="flex flex-col items-center">
            <input
              id="vector-entry-y"
              aria-label="Vector y component"
              type="number"
              step="0.5"
              value={y}
              disabled={disabled}
              onChange={(e) => handleChange(1, e.target.value)}
              className="w-14 h-8 text-center text-sm font-mono font-medium rounded border border-amber-500/40 bg-slate-900 text-amber-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-slate-400 mt-0.5">y</span>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
          v = [{x}, {y}]
        </div>
      </div>
    </div>
  );
}
