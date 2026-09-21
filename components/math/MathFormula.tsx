"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathFormulaProps {
  children?: string;
  math?: string;
  inline?: boolean;
  className?: string;
}

/**
 * Shared Mathematical Formula Renderer (KaTeX abstraction)
 * Renders LaTeX mathematical expressions into beautiful, textbook-quality math typography.
 * Supports inline mode (\(...\) / $...$) and display block mode ($$...$$ / \[...\]).
 */
export function MathFormula({
  children,
  math,
  inline = false,
  className = "",
}: MathFormulaProps) {
  const formula = math ?? children ?? "";

  const html = useMemo(() => {
    if (!formula) return "";
    try {
      return katex.renderToString(formula, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return formula;
    }
  }, [formula, inline]);

  if (!formula) return null;

  if (inline) {
    return (
      <span
        className={`inline-math font-normal text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={`display-math my-2.5 overflow-x-auto py-1 text-center font-normal text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
