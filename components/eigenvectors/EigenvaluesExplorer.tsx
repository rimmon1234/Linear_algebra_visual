"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Matrix, Vector } from "@/features/math/types";
import { computeEigensystem2D } from "@/features/math/eigen/eigenvectors";
import { getTopicById } from "@/features/curriculum";
import { MatrixEditor } from "@/components/visualizer/MatrixEditor";
import { EigenvalueSummaryCard } from "./EigenvalueSummaryCard";
import { EigenvectorVisualizer2D } from "./EigenvectorVisualizer2D";
import { EigenvectorVisualizer3D } from "./EigenvectorVisualizer3D";
import { EigenvectorDerivationCard } from "./EigenvectorDerivationCard";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface EigenPreset {
  id: string;
  name: string;
  category: string;
  matrix: Matrix;
  defaultAngleDeg?: number;
  description: string;
}

export const EIGEN_PRESETS: EigenPreset[] = [
  {
    id: "symmetric-distinct",
    name: "Symmetric Matrix",
    category: "Orthogonal Eigenspaces (λ₁=3, λ₂=1)",
    matrix: [
      [2, 1],
      [1, 2],
    ],
    defaultAngleDeg: 45, // y = x
    description:
      "Distinct real eigenvalues with mutually orthogonal invariant lines y = x and y = -x.",
  },
  {
    id: "diagonal-distinct",
    name: "Diagonal Matrix",
    category: "Coordinate Axes (λ₁=3, λ₂=2)",
    matrix: [
      [2, 0],
      [0, 3],
    ],
    defaultAngleDeg: 0, // x-axis
    description: "Invariant directions align exactly with the Cartesian x and y axes.",
  },
  {
    id: "uniform-scaling",
    name: "Uniform Scaling (2I)",
    category: "Full ℝ² Eigenspace (am=2, gm=2)",
    matrix: [
      [2, 0],
      [0, 2],
    ],
    defaultAngleDeg: 30,
    description: "Every non-zero vector in ℝ² is an eigenvector scaled by factor λ = 2.",
  },
  {
    id: "shear-defective",
    name: "Shear Matrix",
    category: "Defective (am=2, gm=1)",
    matrix: [
      [1, 1.5],
      [0, 1],
    ],
    defaultAngleDeg: 0, // x-axis
    description:
      "Defective: only 1 independent invariant direction (x-axis); all other vectors tilt.",
  },
  {
    id: "reflection-negative",
    name: "Negative Eigenvalue",
    category: "Direction Reversal (λ₁=-2, λ₂=1)",
    matrix: [
      [-2, 0],
      [0, 1],
    ],
    defaultAngleDeg: 0, // x-axis (λ = -2)
    description: "λ = -2 reverses vectors across the origin along the exact same invariant line.",
  },
  {
    id: "singular-projection",
    name: "Singular Matrix",
    category: "Nullspace (λ₁=5, λ₂=0)",
    matrix: [
      [1, 2],
      [2, 4],
    ],
    defaultAngleDeg: 153.4349, // Nullspace E_0 basis [-2, 1]
    description:
      "λ₂ = 0 eigenspace spans the nullspace; vectors on this line are crushed completely to [0, 0].",
  },
  {
    id: "rotation-complex",
    name: "90° Rotation",
    category: "Complex Roots (λ=±i)",
    matrix: [
      [0, -1],
      [1, 0],
    ],
    defaultAngleDeg: 45,
    description: "Rotates all vectors by 90°; zero real invariant lines in ℝ².",
  },
];

export function EigenvaluesExplorer() {
  const [matrix, setMatrix] = useState<Matrix>([
    [2, 1],
    [1, 2],
  ]);
  const [selectedEigenvalue, setSelectedEigenvalue] = useState<number | undefined>(undefined);
  const [dimensionMode, setDimensionMode] = useState<2 | 3>(2);
  const [testVectorAngle, setTestVectorAngle] = useState<number>(45);

  // Dynamically resolve Topic 3 (Diagonalization) from curriculum registry
  const topic3 = useMemo(() => {
    return getTopicById("mod1-diagonalization");
  }, []);

  // Compute eigensystem from math layer
  const eigensystemResult = useMemo(() => {
    return computeEigensystem2D(matrix);
  }, [matrix]);

  const eigensystem = eigensystemResult.ok
    ? eigensystemResult.value
    : {
        dimension: 2,
        matrix,
        distinctRealEigenvalues: [],
        eigenpairs: [],
        isDefective: false,
        isFullyReal: true,
        allVectorsAreEigenvectors: false,
        symbolicDerivations: [],
      };

  // Helper to snap to an eigenpair basis vector angle
  const getAngleForBasis = (basis: Vector): number => {
    const rad = Math.atan2(basis[1], basis[0]);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Number(deg.toFixed(4));
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm backdrop-blur-sm space-y-6">
      {/* 1. Header & Mathematical Motivation */}
      <div className="border-b border-slate-800 pb-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Eigenvalues, Eigenvectors & Invariant Directions
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-950 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-800">
              <MathFormula math="A\mathbf{v} = \lambda \mathbf{v}, \quad \mathbf{v} \neq \mathbf{0}" inline={true} />
            </div>

            {/* 2D vs 3D View Toggle */}
            <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => setDimensionMode(2)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  dimensionMode === 2
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2D Visualizer
              </button>
              <button
                onClick={() => setDimensionMode(3)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  dimensionMode === 3
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                3D Demo
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <MathText text="When a matrix $A$ acts on space, most vectors change their direction. However, special non-zero vectors $\mathbf{v}$ satisfy $A\mathbf{v} = \lambda \mathbf{v}$, remaining on the exact same line through the origin while scaled by scalar $\lambda$. The vector $\mathbf{v}$ is an **eigenvector**, and $\lambda$ is its **eigenvalue**." />
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
              Interactive Matrix Editor & Guided Presets
            </h4>
          </div>
          <div className="text-xs text-slate-400">
            <MathText text="Edit matrix entries to observe real-time eigenspace shifts" />
          </div>
        </div>

        {/* Guided Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            <span>Presets:</span>
          </div>
          {EIGEN_PRESETS.map((preset) => {
            const isSelected =
              matrix[0][0] === preset.matrix[0][0] &&
              matrix[0][1] === preset.matrix[0][1] &&
              matrix[1][0] === preset.matrix[1][0] &&
              matrix[1][1] === preset.matrix[1][1];

            return (
              <button
                key={preset.id}
                onClick={() => {
                  setMatrix(preset.matrix);
                  setSelectedEigenvalue(undefined);
                  if (preset.defaultAngleDeg !== undefined) {
                    setTestVectorAngle(preset.defaultAngleDeg);
                  }
                }}
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

      {/* 3. Eigenspace & Multiplicity Summary Card */}
      <EigenvalueSummaryCard
        eigensystem={eigensystem}
        selectedEigenvalue={selectedEigenvalue}
        onSelectEigenvalue={(lam) => {
          setSelectedEigenvalue(lam);
          const matchPair = eigensystem.eigenpairs.find((p) => p.eigenvalue === lam);
          if (matchPair && matchPair.eigenspaceBasis[0]) {
            setTestVectorAngle(getAngleForBasis(matchPair.eigenspaceBasis[0]));
          }
        }}
      />

      {/* 4. Interactive Invariant Direction Visualizer (2D vs 3D) */}
      {dimensionMode === 2 ? (
        <EigenvectorVisualizer2D
          matrix={matrix}
          eigensystem={eigensystem}
          selectedEigenvalue={selectedEigenvalue}
          externalAngleDeg={testVectorAngle}
          onAngleChange={setTestVectorAngle}
        />
      ) : (
        <EigenvectorVisualizer3D />
      )}

      {/* 5. Dedicated "Eigenvector vs Ordinary Vector" Experiment Comparison */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Required Experiment: Eigenvector vs. Ordinary Vector
            </h4>
          </div>
          <div className="text-xs text-slate-400">
            <span>Direct Comparison</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Snap to Valid Eigenvector */}
          <button
            onClick={() => {
              if (eigensystem.eigenpairs.length > 0 && eigensystem.eigenpairs[0].eigenspaceBasis[0]) {
                setTestVectorAngle(getAngleForBasis(eigensystem.eigenpairs[0].eigenspaceBasis[0]));
              }
            }}
            className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/60 hover:bg-emerald-950/40 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Test Invariant Eigenvector (</span>
                <MathFormula math="A\mathbf{v} = \lambda \mathbf{v}" inline={true} />
                <span>)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              <MathText text="Snaps $\mathbf{v}$ onto an invariant eigenspace line. $\mathbf{v}$ and $A\mathbf{v} = \lambda \mathbf{v}$ remain on the **exact same line** through the origin." />
            </div>
          </button>

          {/* Test Ordinary Vector */}
          <button
            onClick={() => {
              // Set angle to 30° which is an ordinary (non-eigen) angle for symmetric/shear/diagonal matrices
              setTestVectorAngle(30);
            }}
            className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-900 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Test Ordinary Vector (</span>
                <MathFormula math="\mathbf{v} \to A\mathbf{v}" inline={true} />
                <span> changes direction)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              <MathText text="Sets $\mathbf{v}$ at an arbitrary non-invariant angle ($30^\circ$). Under transformation, $A\mathbf{v}$ **rotates away** from the line of $\mathbf{v}$." />
            </div>
          </button>
        </div>
      </div>

      {/* 6. Geometric Taxonomy Experiments */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Geometric Taxonomy: How the Sign & Magnitude of λ Shape Transformation
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Experiment 1: lambda > 1 */}
          <button
            onClick={() => {
              setMatrix([
                [2.5, 0],
                [0, 1.5],
              ]);
              setTestVectorAngle(0); // Snap to v1 = [1, 0]
            }}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-600 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
              <span className="flex items-center gap-1">
                <span>1.</span>
                <MathFormula math="\lambda > 1" inline={true} />
                <span>(Stretch)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <MathText text="Vectors on invariant lines stretch outward away from the origin ($\lambda = 2.5$)." />
            </div>
          </button>

          {/* Experiment 2: 0 < lambda < 1 */}
          <button
            onClick={() => {
              setMatrix([
                [0.5, 0],
                [0, 0.8],
              ]);
              setTestVectorAngle(0); // Snap to v1 = [1, 0]
            }}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-600 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
              <span className="flex items-center gap-1">
                <span>2.</span>
                <MathFormula math="0 < \lambda < 1" inline={true} />
                <span>(Shrink)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <MathText text="Vectors on invariant lines contract inward toward origin without collapsing ($\lambda = 0.5$)." />
            </div>
          </button>

          {/* Experiment 3: lambda < 0 */}
          <button
            onClick={() => {
              setMatrix([
                [-2, 0],
                [0, 1],
              ]);
              setTestVectorAngle(0); // Snap to v1 = [1, 0]
            }}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-600 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 group-hover:text-amber-200">
              <span className="flex items-center gap-1">
                <span>3.</span>
                <MathFormula math="\lambda < 0" inline={true} />
                <span>(Direction Reversal)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <MathText text="Angle is $180^\circ$: vectors flip across origin on the SAME line ($\lambda = -2$)." />
            </div>
          </button>

          {/* Experiment 4: lambda = 0 (Collapse to origin) */}
          <button
            onClick={() => {
              setMatrix([
                [1, 2],
                [2, 4],
              ]);
              setTestVectorAngle(153.4349); // Snap to Nullspace basis [-2, 1]
            }}
            className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/70 hover:border-rose-500 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 group-hover:text-rose-200">
              <span className="flex items-center gap-1">
                <span>4.</span>
                <MathFormula math="\lambda = 0" inline={true} />
                <span>(Collapse to Origin)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-rose-200/90 mt-1">
              <MathText text="Eigenvector in nullspace: matrix completely crushes $\mathbf{v} \to A\mathbf{v} = [0, 0]$ into the origin." />
            </div>
          </button>

          {/* Experiment 5: Defective Shear */}
          <button
            onClick={() => {
              setMatrix([
                [1, 1.5],
                [0, 1],
              ]);
              setTestVectorAngle(0); // Snap to x-axis
            }}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-600 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-purple-200">
              <span className="flex items-center gap-1">
                <span>5.</span>
                <span>Defective Shear (</span>
                <MathFormula math="gm < am" inline={true} />
                <span>)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <MathText text="Repeated root $\lambda = 1$ ($am=2$), but only 1 independent eigenvector ($gm=1$)." />
            </div>
          </button>

          {/* Experiment 6: Uniform Scaling */}
          <button
            onClick={() => {
              setMatrix([
                [2, 0],
                [0, 2],
              ]);
              setTestVectorAngle(45);
            }}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-emerald-600 text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
              <span className="flex items-center gap-1">
                <span>6.</span>
                <span>Uniform Scaling (</span>
                <MathFormula math="A = 2I" inline={true} />
                <span>)</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <MathText text="Entire $\mathbb{R}^2$ plane is eigenspace: every non-zero vector is an eigenvector scaled by 2!" />
            </div>
          </button>
        </div>
      </div>

      {/* 7. Step-by-Step Eigenspace Derivation Accordion */}
      <EigenvectorDerivationCard eigensystem={eigensystem} />

      {/* 8. Contextual Preview Bridge to Topic 3 (Diagonalization) */}
      <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-indigo-200">
              Bridge to Topic 3: Matrix Diagonalization
            </h4>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <MathText text="When an $n \times n$ matrix has $n$ linearly independent eigenvectors, we can assemble them as the columns of an invertible basis matrix $P$, uncoupling the matrix into a pure diagonal scaling matrix: $A = PDP^{-1}$." />
          </div>
        </div>

        {topic3 && (
          <Link
            href={`/learn/${topic3.module.slug}/${topic3.topic.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shrink-0 group"
          >
            <span>Preview Diagonalization</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
