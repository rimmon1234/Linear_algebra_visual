"use client";

import React from "react";
import type { Matrix } from "@/features/math/types";
import { determinant2x2 } from "@/features/math/matrix/operations";

interface DeterminantCardProps {
  matrix: Matrix;
}

export function DeterminantCard({ matrix }: DeterminantCardProps) {
  const detResult = determinant2x2(matrix);
  const det = detResult.ok ? detResult.value : 1;
  const absDet = Math.abs(det);

  const isSingular = absDet < 1e-6;
  const isNegative = det < -1e-6;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-200">
          Geometric Meaning of Determinant
        </span>
        <span
          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
            isSingular
              ? "bg-slate-800 text-slate-300"
              : isNegative
              ? "bg-rose-950 text-rose-300 border border-rose-800/60"
              : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
          }`}
        >
          det(A) = {det.toFixed(2)}
        </span>
      </div>

      <p className="text-slate-300 leading-relaxed">
        {isSingular ? (
          <>
            <strong className="text-amber-400">Singular Matrix (det = 0):</strong> The transformation collapses the entire 2D plane into a 1D line or point. The unit square has an area of <strong className="text-white">0</strong>.
          </>
        ) : isNegative ? (
          <>
            <strong className="text-rose-400">Orientation Reversal (det &lt; 0):</strong> The plane is flipped/reflected. Any 2D region&apos;s area is scaled by <strong className="text-white">{absDet.toFixed(2)}×</strong>, but standard basis orientation turns clockwise.
          </>
        ) : (
          <>
            <strong className="text-emerald-400">Orientation Preserved (det &gt; 0):</strong> The transformation scales every 2D area by factor <strong className="text-white">{absDet.toFixed(2)}×</strong> while preserving counter-clockwise orientation.
          </>
        )}
      </p>
    </div>
  );
}
