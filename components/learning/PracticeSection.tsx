"use client";

import React, { useState } from "react";
import type { Exercise } from "@/features/curriculum/types";
import {
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { MathText } from "@/components/math/MathText";

interface PracticeSectionProps {
  exercises: Exercise[];
}

export function PracticeSection({ exercises }: PracticeSectionProps) {
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});

  if (!exercises || exercises.length === 0) {
    return null;
  }

  const toggleHint = (exerciseId: string) => {
    setShowHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const toggleSolution = (exerciseId: string) => {
    setShowSolutions((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Interactive Practice & Mastery Problems
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {exercises.length} Questions
        </span>
      </div>

      <div className="space-y-4">
        {exercises.map((ex, idx) => {
          return (
            <div
              key={ex.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3.5 backdrop-blur-sm shadow-sm"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Problem {idx + 1}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 uppercase">
                  {ex.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-sm font-medium text-slate-200 leading-relaxed">
                <MathText text={ex.question} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {ex.hints && ex.hints.length > 0 && (
                  <button
                    onClick={() => toggleHint(ex.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{showHints[ex.id] ? "Hide Hint" : "Show Hint"}</span>
                  </button>
                )}

                <button
                  onClick={() => toggleSolution(ex.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {showSolutions[ex.id] ? "Hide Solution" : "Show Solution"}
                  </span>
                </button>
              </div>

              {/* Hints Box */}
              {showHints[ex.id] && ex.hints && ex.hints.length > 0 && (
                <div className="rounded-lg bg-amber-950/30 border border-amber-900/50 p-3 text-xs text-amber-200/90 space-y-1">
                  <span className="font-semibold text-amber-300 block">
                    Hint:
                  </span>
                  <ul className="list-disc list-inside space-y-1">
                    {ex.hints.map((h, hIdx) => (
                      <li key={hIdx}>
                        <MathText text={h} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solution & Explanation Box */}
              {showSolutions[ex.id] && (
                <div className="rounded-lg bg-indigo-950/30 border border-indigo-900/50 p-3.5 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                    <span>Worked Solution & Step-by-Step Derivation:</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <MathText text={ex.solution} />
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
