"use client";

import React from "react";
import type { Matrix, Vector } from "@/features/math/types";
import { determinant2x2, matrixVectorMultiply } from "@/features/math/matrix/operations";

interface NumericalPanelProps {
  matrix: Matrix;
  vector: Vector;
  progress: number;
}

export function NumericalPanel({
  matrix,
  vector,
  progress,
}: NumericalPanelProps) {
  const a = matrix[0]?.[0] ?? 1;
  const b = matrix[0]?.[1] ?? 0;
  const c = matrix[1]?.[0] ?? 0;
  const d = matrix[1]?.[1] ?? 1;

  const vx = vector[0] ?? 2;
  const vy = vector[1] ?? 1;

  // Exact math calculation: Av = [ax + by, cx + dy]
  const avResult = matrixVectorMultiply(matrix, vector);
  const av = avResult.ok ? avResult.value : [0, 0];

  // Exact determinant: ad - bc
  const detResult = determinant2x2(matrix);
  const det = detResult.ok ? detResult.value : 1;
  const area = Math.abs(det);

  return (
    <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Mathematical Breakdown
        </h4>
        <span className="text-[10px] font-mono text-indigo-400">
          t = {progress.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Basis Vectors Images (Columns of A) */}
        <div className="space-y-1.5 p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Transformed Basis Vectors
          </span>
          <div className="font-mono space-y-1">
            <div className="text-cyan-300 flex items-center justify-between">
              <span>Ae₁ = col₁(A):</span>
              <span className="font-bold">[{a}, {c}]ᵀ</span>
            </div>
            <div className="text-pink-300 flex items-center justify-between">
              <span>Ae₂ = col₂(A):</span>
              <span className="font-bold">[{b}, {d}]ᵀ</span>
            </div>
          </div>
        </div>

        {/* Vector Transformation v -> Av */}
        <div className="space-y-1.5 p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Vector Transformation
          </span>
          <div className="font-mono space-y-1">
            <div className="text-slate-300 flex items-center justify-between">
              <span>Input v:</span>
              <span>[{vx}, {vy}]ᵀ</span>
            </div>
            <div className="text-amber-300 flex items-center justify-between">
              <span>Output Av:</span>
              <span className="font-bold">[{av[0].toFixed(1)}, {av[1].toFixed(1)}]ᵀ</span>
            </div>
          </div>
        </div>

        {/* Determinant & Area */}
        <div className="space-y-1.5 p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Determinant & Area
          </span>
          <div className="font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">det(A) = ad - bc:</span>
              <span
                className={`font-bold ${
                  det === 0
                    ? "text-slate-400"
                    : det < 0
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                {det.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Area Scaling:</span>
              <span className="font-bold">{area.toFixed(2)}×</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
