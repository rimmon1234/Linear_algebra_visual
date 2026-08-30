"use client";

import React from "react";
import type { Matrix } from "@/features/math/types";
import {
  TRANSFORMATION_PRESETS,
  type TransformationPreset,
} from "@/features/math/transformation/transformation-2d";
import { areMatricesEqual } from "@/features/math/matrix/operations";

interface PresetSelectorProps {
  currentMatrix: Matrix;
  onSelectPreset: (preset: TransformationPreset) => void;
}

export function PresetSelector({
  currentMatrix,
  onSelectPreset,
}: PresetSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-300">
        Transformation Presets
      </label>
      <div className="flex flex-wrap gap-1.5">
        {TRANSFORMATION_PRESETS.map((preset) => {
          const isSelected = areMatricesEqual(currentMatrix, preset.matrix);
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-slate-100 border border-slate-700/60"
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
