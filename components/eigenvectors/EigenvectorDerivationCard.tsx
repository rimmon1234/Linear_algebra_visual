"use client";

import React, { useState } from "react";
import type { Eigensystem } from "@/features/math/eigen/eigenvectors";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import { ChevronDown, ChevronUp, FileCode2 } from "lucide-react";
import { formatMathNumber } from "@/features/math/eigen/characteristic-equation";

interface EigenvectorDerivationCardProps {
  eigensystem: Eigensystem;
}

export function EigenvectorDerivationCard({ eigensystem }: EigenvectorDerivationCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (eigensystem.symbolicDerivations.length === 0) {
    return null;
  }

  const toggleIndex = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Step-by-Step Eigenspace Derivation: Solving (A - λI)v = 0
          </h4>
        </div>
        <div className="text-xs text-slate-400">
          <MathText text="Homogeneous Nullspace System" />
        </div>
      </div>

      <div className="space-y-2.5">
        {eigensystem.symbolicDerivations.map((step, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-lg border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-colors"
            >
              {/* Header */}
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-950 text-[10px] font-bold text-indigo-400 border border-indigo-800">
                    {idx + 1}
                  </span>
                  <div className="text-xs font-semibold text-slate-200">
                    <span>Solve for Eigenspace of</span>{" "}
                    <MathFormula math={`\\lambda_{${idx + 1}} = ${formatMathNumber(step.lambda)}`} inline={true} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[11px] font-medium hidden sm:inline text-slate-500">
                    {isExpanded ? "Hide Derivation" : "Show Derivation"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4 text-xs">
                  {/* Step A: Substitute λ into (A - λI) */}
                  <div className="space-y-1.5">
                    <span className="font-semibold text-indigo-300 block">
                      <MathText text="Step A: Substitute $\lambda$ into the matrix $(A - \lambda I)$:" />
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-center">
                      <MathFormula
                        math={`A - (${formatMathNumber(step.lambda)})I = ${step.matrixMinusLambdaI}`}
                        inline={false}
                      />
                    </div>
                  </div>

                  {/* Step B: Set up homogeneous linear system */}
                  <div className="space-y-1.5">
                    <span className="font-semibold text-indigo-300 block">
                      <MathText text="Step B: Form the homogeneous equation $(A - \lambda I)\mathbf{v} = \mathbf{0}$:" />
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-center">
                      <MathFormula math={step.systemEquation} inline={false} />
                    </div>
                  </div>

                  {/* Step C: Parameterize general solution and basis */}
                  <div className="space-y-1.5">
                    <span className="font-semibold text-indigo-300 block">
                      <MathText text="Step C: Eigenspace Solution and Basis Vector:" />
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-center space-y-2">
                      <div className="text-[11px] text-slate-400">
                        <MathText text="General Parametric Solution:" />
                      </div>
                      <MathFormula math={step.parametricSolution} inline={false} />
                      <div className="text-[11px] text-slate-400 pt-1">
                        <MathText text="Representative Basis Vector:" />
                      </div>
                      <MathFormula math={step.basisVectors} inline={false} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
