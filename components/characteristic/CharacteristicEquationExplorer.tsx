"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Matrix } from "@/features/math/types";
import {
  computeCharacteristicPolynomial2D,
} from "@/features/math/eigen/characteristic-equation";
import { getTopicById } from "@/features/curriculum";
import { MatrixEditor } from "@/components/visualizer/MatrixEditor";
import { PolynomialCurveVisualizer } from "./PolynomialCurveVisualizer";
import { DerivationStepsCard } from "./DerivationStepsCard";
import { DiscriminantCard } from "./DiscriminantCard";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Calculator,
} from "lucide-react";

export interface CharacteristicPreset {
  id: string;
  name: string;
  category: string;
  matrix: Matrix;
  description: string;
}

export const CHARACTERISTIC_PRESETS: CharacteristicPreset[] = [
  {
    id: "diagonal-distinct",
    name: "Diagonal Matrix",
    category: "Distinct Real (Δ > 0)",
    matrix: [
      [2, 0],
      [0, 3],
    ],
    description: "Eigenvalues are the diagonal entries: λ₁ = 3, λ₂ = 2.",
  },
  {
    id: "symmetric-distinct",
    name: "Symmetric Matrix",
    category: "Distinct Real (Δ > 0)",
    matrix: [
      [2, 1],
      [1, 2],
    ],
    description: "Coupled coordinates with distinct real eigenvalues: λ₁ = 3, λ₂ = 1.",
  },
  {
    id: "shear-repeated",
    name: "Shear Matrix",
    category: "Repeated Root (Δ = 0)",
    matrix: [
      [1, 1.5],
      [0, 1],
    ],
    description: "Parabola touches axis at vertex λ = 1 (algebraic multiplicity 2).",
  },
  {
    id: "rotation-complex",
    name: "90° Rotation Matrix",
    category: "Complex Roots (Δ < 0)",
    matrix: [
      [0, -1],
      [1, 0],
    ],
    description: "No real invariant directions: complex conjugate eigenvalues λ = ±i.",
  },
  {
    id: "singular-projection",
    name: "Singular Matrix",
    category: "Zero Determinant (det = 0)",
    matrix: [
      [1, 2],
      [2, 4],
    ],
    description: "det(A) = 0 guarantees λ = 0 is an eigenvalue, with λ₂ = tr(A) = 5.",
  },
  {
    id: "arbitrary-golden",
    name: "Generic 2x2 Matrix",
    category: "General Case",
    matrix: [
      [1, 2],
      [3, 4],
    ],
    description: "Characteristic equation λ² - 5λ - 2 = 0 with irrational real roots.",
  },
];

export function CharacteristicEquationExplorer() {
  const [matrix, setMatrix] = useState<Matrix>([
    [2, 1],
    [1, 2],
  ]);

  // Dynamically resolve the Module IV Linear Transformations topic from the curriculum registry
  const module4Topic = useMemo(() => {
    return getTopicById("mod4-linear-transformations");
  }, []);

  // Compute full mathematical characteristic polynomial data from canonical math layer
  const polyResult = useMemo(() => {
    return computeCharacteristicPolynomial2D(matrix);
  }, [matrix]);

  const polyData = polyResult.ok
    ? polyResult.value
    : {
        matrix,
        trace: 4,
        determinant: 3,
        discriminant: 4,
        coefficients: { c2: 1, c1: -4, c0: 3 },
        eigenvalues: {
          type: "distinct-real" as const,
          roots: [3, 1] as [number, number],
          multiplicities: [1, 1] as [1, 1],
        },
        symbolic: {
          matrixMinusLambdaI: "\\begin{bmatrix} 2 - \\lambda & 1 \\\\ 1 & 2 - \\lambda \\end{bmatrix}",
          determinantExpansion: "(2 - \\lambda)(2 - \\lambda) - (1)(1)",
          characteristicPolynomial: "p(\\lambda) = \\lambda^2 - 4\\lambda + 3",
          characteristicEquation: "\\lambda^2 - 4\\lambda + 3 = 0",
          discriminantCalculation: "\\Delta = 4^2 - 4(3) = 4",
          solutionsSummary: "\\lambda_1 = 3, \\quad \\lambda_2 = 1",
        },
        derivationSteps: [],
      };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm backdrop-blur-sm space-y-6">
      {/* 1. Header & Motivation */}
      <div className="border-b border-slate-800 pb-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Calculator className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Characteristic Equations & Eigenvalue Determination
            </h3>
          </div>
          <div className="rounded-full bg-indigo-950 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-800">
            <MathFormula math="\det(A - \lambda I) = 0" inline={true} />
          </div>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <MathText text="Why does $\det(A - \lambda I) = 0$ matter? For $(A - \lambda I)v = 0$ to possess non-zero eigenvector solutions ($v \neq 0$), the matrix $(A - \lambda I)$ must be singular (non-invertible), requiring its determinant to vanish." />
        </div>
      </div>

      {/* 2. Step 1: Matrix Input & Guided Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
              1
            </span>
            <h4 className="text-sm font-semibold text-slate-200">
              Interactive Matrix Input
            </h4>
          </div>
          <div className="text-xs text-slate-400">
            <MathText text="Modify entries $a, b, c, d$ to observe live algebraic updates" />
          </div>
        </div>

        {/* Guided Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            <span>Presets:</span>
          </div>
          {CHARACTERISTIC_PRESETS.map((preset) => {
            const isSelected =
              matrix[0][0] === preset.matrix[0][0] &&
              matrix[0][1] === preset.matrix[0][1] &&
              matrix[1][0] === preset.matrix[1][0] &&
              matrix[1][1] === preset.matrix[1][1];

            return (
              <button
                key={preset.id}
                onClick={() => setMatrix(preset.matrix)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors border text-left ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        <MatrixEditor matrix={matrix} onChange={(m) => setMatrix(m)} />
      </div>

      {/* 3. Steps 2 & 3: Two-Column Live Algebraic Construction & Polynomial Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Left Column: Build (A - λI) and Determinant Expansion (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                2
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <span>Construct Matrix</span>
                <MathFormula math="(A - \lambda I)" inline={true} />
              </h4>
            </div>

            {/* A - λI Display */}
            <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 text-center">
              <div className="text-[11px] text-slate-400 block mb-1">
                <MathText text="Subtract scalar $\lambda$ along main diagonal:" />
              </div>
              <MathFormula
                math={`A - \\lambda I = ${polyData.symbolic.matrixMinusLambdaI}`}
                inline={false}
              />
            </div>

            {/* Determinant Expansion */}
            <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 text-center space-y-1.5">
              <div className="text-[11px] text-slate-400 block">
                <MathText text="Expand Determinant $(a - \lambda)(d - \lambda) - bc$:" />
              </div>
              <MathFormula
                math={`\\det(A - \\lambda I) = ${polyData.symbolic.determinantExpansion}`}
                inline={false}
              />
            </div>

            {/* Invariants Summary */}
            <DiscriminantCard polynomialData={polyData} />
          </div>
        </div>

        {/* Right Column: 3. Characteristic Polynomial Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                3
              </span>
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Characteristic Polynomial Curve</span>
                <MathFormula math="p(\lambda)" inline={true} />
              </h4>
            </div>
            <PolynomialCurveVisualizer polynomialData={polyData} />
          </div>
        </div>
      </div>

      {/* 4. Steps 4 & 5: Characteristic Equation & Eigenvalue Results */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
              4 & 5
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Characteristic Equation & Eigenvalue Solutions
            </h4>
          </div>
          <div className="text-xs text-indigo-400 font-medium">
            <MathFormula math="p(\lambda) = 0" inline={true} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Equation Box */}
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400 block">
              Characteristic Equation:
            </span>
            <MathFormula
              math={polyData.symbolic.characteristicEquation}
              inline={false}
            />
          </div>

          {/* Solution Box */}
          <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-center space-y-1">
            <span className="text-xs text-indigo-300 font-medium block">
              Eigenvalue Candidates (Roots):
            </span>
            <div className="text-emerald-300 font-bold text-base my-1">
              <MathFormula
                math={polyData.symbolic.solutionsSummary}
                inline={true}
              />
            </div>
          </div>
        </div>

        {/* Guided Discriminant Experiment */}
        <div className="rounded-lg bg-slate-900/60 border border-slate-800/80 p-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Discriminant Classification Experiment (</span>
              <MathFormula math="\Delta = \text{tr}(A)^2 - 4\det(A)" inline={true} />
              <span>)</span>
            </h5>
          </div>
          <div className="text-xs text-slate-400">
            <MathText text="Click to observe how the parabola moves relative to the horizontal $\lambda$-axis:" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              onClick={() =>
                setMatrix([
                  [3, 1],
                  [0, 1],
                ])
              }
              className="p-2.5 rounded bg-slate-950 border border-slate-800 hover:border-emerald-700 text-left transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span className="flex items-center gap-1">
                  <span>Case 1:</span>
                  <MathFormula math="\Delta > 0" inline={true} />
                </span>
                <ArrowRight className="h-3 w-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 block mt-0.5">
                <MathText text="Two real crossings: $\lambda = 3, 1$." />
              </div>
            </button>

            <button
              onClick={() =>
                setMatrix([
                  [2, 1],
                  [0, 2],
                ])
              }
              className="p-2.5 rounded bg-slate-950 border border-slate-800 hover:border-amber-700 text-left transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                <span className="flex items-center gap-1">
                  <span>Case 2:</span>
                  <MathFormula math="\Delta = 0" inline={true} />
                </span>
                <ArrowRight className="h-3 w-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 block mt-0.5">
                <MathText text="One tangent vertex at $\lambda = 2$." />
              </div>
            </button>

            <button
              onClick={() =>
                setMatrix([
                  [1, -2],
                  [2, 1],
                ])
              }
              className="p-2.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-700 text-left transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                <span className="flex items-center gap-1">
                  <span>Case 3:</span>
                  <MathFormula math="\Delta < 0" inline={true} />
                </span>
                <ArrowRight className="h-3 w-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 block mt-0.5">
                <MathText text="Complex roots $\lambda = 1 \pm 2i$." />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Complete Step-by-Step Derivation Accordion */}
      <DerivationStepsCard polynomialData={polyData} />

      {/* 6. Contextual Link to Geometric Foundation */}
      <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-indigo-200">
              Geometric Foundation: How Eigenvalues Connect to Transformations
            </h4>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <MathText text="Eigenvalues describe the scaling factor along special lines where $Av = \lambda v \iff (A - \lambda I)v = 0$. The geometric foundation behind this action is explored in detail in the **Linear Transformations** topic." />
          </div>
        </div>

        {module4Topic && (
          <Link
            href={`/learn/${module4Topic.module.slug}/${module4Topic.topic.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shrink-0 group"
          >
            <span>Explore Matrix Transformations</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
