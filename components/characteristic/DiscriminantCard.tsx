"use client";

import React from "react";
import type { CharacteristicPolynomial2D } from "@/features/math/eigen/characteristic-equation";
import { formatMathNumber } from "@/features/math/eigen/characteristic-equation";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";

interface DiscriminantCardProps {
  polynomialData: CharacteristicPolynomial2D;
}

/**
 * Discriminant and Invariant Analysis Card
 * Explains Δ = tr(A)² - 4det(A) and explicitly distinguishes it from det(A) = 0 using KaTeX.
 */
export function DiscriminantCard({ polynomialData }: DiscriminantCardProps) {
  const { trace, determinant, discriminant, eigenvalues } = polynomialData;

  const isSingular = Math.abs(determinant) < 1e-7;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Invariants & Discriminant Analysis
        </h4>
        <div className="text-xs text-indigo-400">
          <MathFormula math="\Delta = \text{tr}(A)^2 - 4\det(A)" inline={true} />
        </div>
      </div>

      {/* 3 Metric Badges: Trace, Determinant, Discriminant */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Trace</span>
          <div className="text-sm font-bold text-slate-100">
            <MathFormula math={`\\text{tr}(A) = ${formatMathNumber(trace)}`} inline={true} />
          </div>
          <span className="text-[9px] text-slate-500 block mt-0.5">a + d</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">Determinant</span>
          <div className="text-sm font-bold text-slate-100">
            <MathFormula math={`\\det(A) = ${formatMathNumber(determinant)}`} inline={true} />
          </div>
          <span className="text-[9px] text-slate-500 block mt-0.5">ad - bc</span>
        </div>

        <div
          className={`p-2.5 rounded-lg border ${
            discriminant > 1e-7
              ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-300"
              : Math.abs(discriminant) <= 1e-7
              ? "bg-amber-950/40 border-amber-900/60 text-amber-300"
              : "bg-rose-950/40 border-rose-900/60 text-rose-300"
          }`}
        >
          <span className="text-[10px] opacity-80 block mb-0.5">Discriminant</span>
          <div className="text-sm font-bold">
            <MathFormula math={`\\Delta = ${formatMathNumber(discriminant)}`} inline={true} />
          </div>
          <span className="text-[9px] opacity-75 block mt-0.5">
            {discriminant > 1e-7 ? "Δ > 0" : Math.abs(discriminant) <= 1e-7 ? "Δ = 0" : "Δ < 0"}
          </span>
        </div>
      </div>

      {/* Classification Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          {discriminant > 1e-7 ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : Math.abs(discriminant) <= 1e-7 ? (
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-semibold text-slate-200 block">
              {eigenvalues.type === "distinct-real"
                ? "Two Distinct Real Eigenvalues"
                : eigenvalues.type === "repeated-real"
                ? "One Repeated Real Eigenvalue (Multiplicity 2)"
                : "Complex Conjugate Eigenvalues"}
            </span>
            <div className="text-slate-400 leading-relaxed text-xs">
              <MathText
                text={
                  eigenvalues.type === "distinct-real"
                    ? "The characteristic polynomial crosses the horizontal $\\lambda$-axis at two distinct real points."
                    : eigenvalues.type === "repeated-real"
                    ? "The characteristic polynomial touches the horizontal $\\lambda$-axis tangentially at its minimum vertex."
                    : "The characteristic polynomial floats above the real $\\lambda$-axis; the transformation involves rotation without invariant real directions."
                }
              />
            </div>
          </div>
        </div>

        {/* Explicit Separation of det(A)=0 from Δ=0 */}
        {isSingular && (
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-indigo-300 text-xs flex items-start gap-2.5">
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Singular Matrix (det(A) = 0):</span>
              <div className="text-indigo-200/90 leading-relaxed">
                <MathText text="Since $\det(A) = 0$, the constant term vanishes: $p(\lambda) = \lambda(\lambda - \text{tr}(A)) = 0$. Therefore, $\lambda = 0$ is guaranteed to be an eigenvalue, collapsing the transformation along a nullspace kernel direction." />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
