"use client";

import React from "react";
import type { Eigensystem } from "@/features/math/eigen/eigenvectors";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import { CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { formatMathNumber } from "@/features/math/eigen/characteristic-equation";

interface EigenvalueSummaryCardProps {
  eigensystem: Eigensystem;
  selectedEigenvalue?: number;
  onSelectEigenvalue?: (lambda: number) => void;
}

export function EigenvalueSummaryCard({
  eigensystem,
  selectedEigenvalue,
  onSelectEigenvalue,
}: EigenvalueSummaryCardProps) {
  const { isFullyReal, eigenpairs, complexPairs, isDefective, allVectorsAreEigenvectors } = eigensystem;

  if (!isFullyReal && complexPairs && complexPairs.length > 0) {
    return (
      <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertCircle className="h-5 w-5" />
          <h4 className="text-sm font-semibold">Complex Conjugate Eigenvalues (No Real Invariant Directions in ℝ²)</h4>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <MathText text="The characteristic equation yields complex roots $\lambda = \alpha \pm i\beta$. Because every non-zero vector in $\mathbb{R}^2$ is rotated away from its original trajectory, **no real eigenvectors exist for this transformation in $\mathbb{R}^2$**." />
        </div>
        <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-900/40 text-center space-y-1">
          <div className="text-xs text-rose-300 font-medium">
            <MathFormula
              math={`\\lambda_{1, 2} = ${formatMathNumber(complexPairs[0].real)} \\pm ${formatMathNumber(complexPairs[0].imag)}i`}
              inline={true}
            />
          </div>
          <span className="text-[11px] text-slate-400 block">
            Complex eigenvectors exist in ℂ², but there are no invariant 1D real lines in ℝ².
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Eigenspace & Multiplicity Analysis
          </h4>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          {isDefective ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
              Defective Matrix (gm &lt; am)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Complete Eigenbasis
            </span>
          )}
        </div>
      </div>

      {allVectorsAreEigenvectors && (
        <div className="rounded-lg bg-indigo-950/40 border border-indigo-900/60 p-3 text-xs text-indigo-200 leading-relaxed">
          <div className="font-semibold text-indigo-300 mb-0.5 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-indigo-400" />
            <span>Uniform Isotropic Scaling ($A = cI$):</span>
          </div>
          <MathText text="Because $A = cI$, the geometric multiplicity is $gm = 2$. The eigenspace is **all of $\mathbb{R}^2$**, and **every non-zero vector in $\mathbb{R}^2$ is an eigenvector** scaled by factor $\lambda$." />
        </div>
      )}

      {/* Grid of Eigenpairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {eigenpairs.map((pair, idx) => {
          const isSelected = selectedEigenvalue === pair.eigenvalue;
          const colorClass =
            idx === 0
              ? "border-cyan-800/60 bg-cyan-950/20 text-cyan-200"
              : "border-amber-800/60 bg-amber-950/20 text-amber-200";

          return (
            <div
              key={idx}
              onClick={() => onSelectEigenvalue?.(pair.eigenvalue)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${colorClass} ${
                isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-sm">
                  <MathFormula math={`\\lambda_{${idx + 1}} = ${formatMathNumber(pair.eigenvalue)}`} inline={true} />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                    am = {pair.algebraicMultiplicity}
                  </span>
                  <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                    gm = {pair.geometricMultiplicity}
                  </span>
                </div>
              </div>

              {/* Basis vectors */}
              <div className="space-y-1 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Eigenspace Basis <MathFormula math={`E_{\\lambda}`} inline={true} />:
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-center font-mono">
                  {pair.eigenspaceBasis.map((v, vIdx) => (
                    <span key={vIdx} className="inline-block mx-1">
                      <MathFormula
                        math={`\\mathbf{v}_{${idx + 1}${pair.eigenspaceBasis.length > 1 ? `.${vIdx + 1}` : ""}} = \\begin{bmatrix} ${formatMathNumber(v[0])} \\\\ ${formatMathNumber(v[1])} \\end{bmatrix}`}
                        inline={true}
                      />
                    </span>
                  ))}
                </div>

                {pair.lineEquation && (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Invariant Line:</span>
                    <span className="font-mono text-slate-200">
                      <MathFormula math={pair.lineEquation} inline={true} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
