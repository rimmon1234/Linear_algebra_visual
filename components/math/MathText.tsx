"use client";

import React, { useMemo } from "react";
import { MathFormula } from "./MathFormula";

interface MathTextProps {
  children?: string;
  text?: string;
  className?: string;
}

/**
 * Parses a string containing prose and mathematical delimiters:
 * - Block math: $$...$$ or \[...\]
 * - Inline math: $...$ or \(...\)
 * - Raw LaTeX commands: \det, \lambda, \begin{bmatrix}, etc.
 * Renders prose mixed with beautiful KaTeX MathFormula components.
 */
export function MathText({ children, text, className = "" }: MathTextProps) {
  const content = text ?? children ?? "";

  const elements = useMemo(() => {
    if (!content) return [];

    // Split by block math first: $$...$$
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    const parts: Array<{ type: "text" | "block-math" | "inline-math"; value: string }> = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: content.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: "block-math",
        value: match[1].trim(),
      });
      lastIndex = blockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        value: content.slice(lastIndex),
      });
    }

    // Now process inline math in text parts: $...$
    const result: Array<{ type: "text" | "block-math" | "inline-math"; value: string }> = [];

    for (const part of parts) {
      if (part.type === "block-math") {
        result.push(part);
        continue;
      }

      const inlineRegex = /\$([^\$]+?)\$/g;
      let inlineLastIndex = 0;
      let inlineMatch: RegExpExecArray | null;

      while ((inlineMatch = inlineRegex.exec(part.value)) !== null) {
        if (inlineMatch.index > inlineLastIndex) {
          result.push({
            type: "text",
            value: part.value.slice(inlineLastIndex, inlineMatch.index),
          });
        }
        result.push({
          type: "inline-math",
          value: inlineMatch[1].trim(),
        });
        inlineLastIndex = inlineRegex.lastIndex;
      }

      if (inlineLastIndex < part.value.length) {
        result.push({
          type: "text",
          value: part.value.slice(inlineLastIndex),
        });
      }
    }

    return result;
  }, [content]);

  if (!content) return null;

  return (
    <div className={`leading-relaxed ${className}`}>
      {elements.map((el, i) => {
        if (el.type === "block-math") {
          return <MathFormula key={i} math={el.value} inline={false} />;
        }
        if (el.type === "inline-math") {
          return <MathFormula key={i} math={el.value} inline={true} />;
        }
        // Plain text with preserved linebreaks
        return (
          <span key={i} className="whitespace-pre-line">
            {el.value}
          </span>
        );
      })}
    </div>
  );
}
