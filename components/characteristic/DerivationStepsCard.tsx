"use client";

import React, { useState } from "react";
import type { CharacteristicPolynomial2D } from "@/features/math/eigen/characteristic-equation";
import { ChevronDown, ChevronUp, CheckCircle, Calculator } from "lucide-react";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";

interface DerivationStepsCardProps {
  polynomialData: CharacteristicPolynomial2D;
}

/**
 * Step-by-Step Symbolic Derivation Component
 * Displays the 5 clear pedagogical steps from matrix A to its eigenvalues with KaTeX math rendering.
 */
export function DerivationStepsCard({
  polynomialData,
}: DerivationStepsCardProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { derivationSteps, symbolic } = polynomialData;

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Step-by-Step Mathematical Derivation
          </h4>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Canonical Form:</span>
          <MathFormula math="\det(A - \lambda I) = 0" inline={true} />
        </div>
      </div>

      <div className="space-y-2.5">
        {derivationSteps.map((step) => {
          const isExpanded = expandedStep === step.stepNumber;
          return (
            <div
              key={step.stepNumber}
              className="rounded-lg border border-slate-800/80 bg-slate-950/60 overflow-hidden transition-colors"
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-950 text-[10px] font-bold text-indigo-400 border border-indigo-800/80">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {step.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[11px] font-medium hidden sm:inline text-slate-500">
                    {isExpanded ? "Hide Details" : "Show Step"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="p-3.5 pt-1 border-t border-slate-800/60 space-y-3 text-xs">
                  <div className="text-slate-300 leading-relaxed">
                    <MathText text={step.description} />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-center overflow-x-auto">
                    <MathFormula math={step.formula} inline={false} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="rounded-lg bg-indigo-950/30 border border-indigo-900/50 p-3.5 flex items-start gap-2.5">
        <CheckCircle className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
        <div className="space-y-1.5 text-xs w-full">
          <span className="font-semibold text-indigo-200 block">
            Characteristic Equation & Eigenvalue Results:
          </span>
          <div className="p-2 rounded bg-slate-950/70 border border-indigo-900/40">
            <MathFormula math={symbolic.characteristicEquation} inline={false} />
          </div>
          <div className="text-emerald-300 font-medium pt-1">
            <span>Eigenvalues: </span>
            <MathFormula math={symbolic.solutionsSummary} inline={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
