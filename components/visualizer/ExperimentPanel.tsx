"use client";

import React from "react";
import type { Matrix } from "@/features/math/types";
import { Lightbulb, Play } from "lucide-react";

interface Experiment {
  id: string;
  title: string;
  matrix: Matrix;
  instruction: string;
  observation: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-scale",
    title: "1. Scaling Grid Lines",
    matrix: [
      [2, 0],
      [0, 3],
    ],
    instruction: "Apply a scaling matrix with a = 2 and d = 3.",
    observation: "Notice horizontal spacing doubles, vertical spacing triples, and unit square area expands to 6×.",
  },
  {
    id: "exp-reflect",
    title: "2. Reflection & Orientation",
    matrix: [
      [-1, 0],
      [0, 1],
    ],
    instruction: "Set a = -1 to reflect the plane across the vertical y-axis.",
    observation: "det(A) becomes -1. The area remains 1×, but basis vector e1 flips to the left.",
  },
  {
    id: "exp-shear",
    title: "3. Horizontal Shearing",
    matrix: [
      [1, 1.5],
      [0, 1],
    ],
    instruction: "Set top-right entry b = 1.5 while keeping diagonal entries equal to 1.",
    observation: "Notice rectangular cells deform into tilted parallelograms while total area stays exactly 1× (det = 1).",
  },
  {
    id: "exp-singular",
    title: "4. Singular Plane Collapse",
    matrix: [
      [1, 0],
      [0, 0],
    ],
    instruction: "Set bottom-right entry d = 0 to project onto the x-axis.",
    observation: "det(A) becomes 0. The entire 2D plane collapses onto a 1D line; non-zero vertical vectors map to the zero vector.",
  },
];

interface ExperimentPanelProps {
  onApplyMatrix: (matrix: Matrix) => void;
}

export function ExperimentPanel({ onApplyMatrix }: ExperimentPanelProps) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3.5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Guided Geometric Experiments
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col justify-between p-2.5 rounded-md bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-indigo-300">
                {exp.title}
              </h5>
              <p className="text-[11px] text-slate-300 leading-normal">
                {exp.instruction}
              </p>
              <p className="text-[10px] text-slate-400 italic">
                {exp.observation}
              </p>
            </div>

            <button
              onClick={() => onApplyMatrix(exp.matrix)}
              className="inline-flex items-center justify-center gap-1.5 self-start px-2.5 py-1 text-[11px] font-medium rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Load Experiment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
