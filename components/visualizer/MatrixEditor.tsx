"use client";

import React from "react";
import type { Matrix } from "@/features/math/types";

interface MatrixEditorProps {
  matrix: Matrix;
  onChange: (newMatrix: Matrix) => void;
  disabled?: boolean;
}

/**
 * Accessible 2x2 Matrix Editor
 * Provides visual matrix bracket styling, column color cues matching basis vectors (col 1 cyan, col 2 pink),
 * keyboard accessibility, and finite number validation.
 */
export function MatrixEditor({
  matrix,
  onChange,
  disabled = false,
}: MatrixEditorProps) {
  const a = matrix[0]?.[0] ?? 1;
  const b = matrix[0]?.[1] ?? 0;
  const c = matrix[1]?.[0] ?? 0;
  const d = matrix[1]?.[1] ?? 1;

  const handleCellChange = (row: 0 | 1, col: 0 | 1, valStr: string) => {
    const parsed = parseFloat(valStr);
    const safeVal = Number.isFinite(parsed) ? parsed : 0;

    const next: Matrix = [
      [row === 0 && col === 0 ? safeVal : a, row === 0 && col === 1 ? safeVal : b],
      [row === 1 && col === 0 ? safeVal : c, row === 1 && col === 1 ? safeVal : d],
    ];

    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">
          Transformation Matrix <span className="font-mono text-indigo-400 font-semibold">A</span>
        </label>
        <span className="text-[10px] text-slate-400 font-mono">2×2 Matrix</span>
      </div>

      <div className="relative inline-flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
        {/* Left bracket */}
        <div className="w-1.5 self-stretch rounded-l border-l-2 border-y-2 border-indigo-400/80" />

        {/* 2x2 Grid of inputs */}
        <div className="grid grid-cols-2 gap-2 p-1">
          {/* Row 1, Col 1 (e1 x) */}
          <div className="flex flex-col items-center">
            <input
              id="matrix-entry-a"
              aria-label="Matrix entry a (row 1, column 1)"
              type="number"
              step="0.5"
              value={a}
              disabled={disabled}
              onChange={(e) => handleCellChange(0, 0, e.target.value)}
              className="w-16 h-8 text-center text-sm font-mono font-medium rounded border border-cyan-500/40 bg-slate-900 text-cyan-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-cyan-400/80 mt-0.5">Ae₁ (x)</span>
          </div>

          {/* Row 1, Col 2 (e2 x) */}
          <div className="flex flex-col items-center">
            <input
              id="matrix-entry-b"
              aria-label="Matrix entry b (row 1, column 2)"
              type="number"
              step="0.5"
              value={b}
              disabled={disabled}
              onChange={(e) => handleCellChange(0, 1, e.target.value)}
              className="w-16 h-8 text-center text-sm font-mono font-medium rounded border border-pink-500/40 bg-slate-900 text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-pink-400/80 mt-0.5">Ae₂ (x)</span>
          </div>

          {/* Row 2, Col 1 (e1 y) */}
          <div className="flex flex-col items-center">
            <input
              id="matrix-entry-c"
              aria-label="Matrix entry c (row 2, column 1)"
              type="number"
              step="0.5"
              value={c}
              disabled={disabled}
              onChange={(e) => handleCellChange(1, 0, e.target.value)}
              className="w-16 h-8 text-center text-sm font-mono font-medium rounded border border-cyan-500/40 bg-slate-900 text-cyan-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-cyan-400/80 mt-0.5">Ae₁ (y)</span>
          </div>

          {/* Row 2, Col 2 (e2 y) */}
          <div className="flex flex-col items-center">
            <input
              id="matrix-entry-d"
              aria-label="Matrix entry d (row 2, column 2)"
              type="number"
              step="0.5"
              value={d}
              disabled={disabled}
              onChange={(e) => handleCellChange(1, 1, e.target.value)}
              className="w-16 h-8 text-center text-sm font-mono font-medium rounded border border-pink-500/40 bg-slate-900 text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors disabled:opacity-50"
            />
            <span className="text-[9px] font-mono text-pink-400/80 mt-0.5">Ae₂ (y)</span>
          </div>
        </div>

        {/* Right bracket */}
        <div className="w-1.5 self-stretch rounded-r border-r-2 border-y-2 border-indigo-400/80" />
      </div>
    </div>
  );
}
