"use client";

import React, { useMemo } from "react";
import type { CharacteristicPolynomial2D } from "@/features/math/eigen/characteristic-equation";
import { formatMathNumber } from "@/features/math/eigen/characteristic-equation";
import { MathFormula } from "@/components/math/MathFormula";

interface PolynomialCurveVisualizerProps {
  polynomialData: CharacteristicPolynomial2D;
}

/**
 * 2D Characteristic Polynomial Curve Visualizer (SVG)
 * Plots p(λ) = λ² - tr(A)λ + det(A) against scalar λ.
 * Accurately shows x-axis intercepts (eigenvalues) and vertex.
 * Pure 2D graphic, decoupled from Three.js.
 */
export function PolynomialCurveVisualizer({
  polynomialData,
}: PolynomialCurveVisualizerProps) {
  const { trace, discriminant, eigenvalues, coefficients } =
    polynomialData;

  // SVG coordinate system mapping
  const width = 540;
  const height = 300;
  const padding = 40;

  // Determine viewing range for λ (x-axis) and p(λ) (y-axis)
  const { xMin, xMax, yMin, yMax, points, vertex, rootPoints } = useMemo(() => {
    // Determine center of interest around vertex λ = trace / 2
    const vertexLambda = trace / 2;
    const vertexP = -(discriminant / 4); // p(trace/2) = det - tr^2/4 = -Δ/4

    let minL = vertexLambda - 3.5;
    let maxL = vertexLambda + 3.5;

    // Expand to include real roots if they exist
    if (eigenvalues.type === "distinct-real") {
      minL = Math.min(minL, eigenvalues.roots[1] - 1.5);
      maxL = Math.max(maxL, eigenvalues.roots[0] + 1.5);
    } else if (eigenvalues.type === "repeated-real") {
      minL = Math.min(minL, eigenvalues.root - 2);
      maxL = Math.max(maxL, eigenvalues.root + 2);
    }

    // Always include origin λ = 0
    minL = Math.min(minL, -1);
    maxL = Math.max(maxL, 1);

    // Compute range of p(λ)
    let minP = Math.min(0, vertexP - 2);
    let maxP = Math.max(6, vertexP + 8);

    // Sample points along the quadratic curve
    const pts: { lambda: number; p: number; x: number; y: number }[] = [];
    const numSamples = 120;
    const step = (maxL - minL) / numSamples;

    for (let i = 0; i <= numSamples; i++) {
      const l = minL + i * step;
      const p = coefficients.c2 * l * l + coefficients.c1 * l + coefficients.c0;
      minP = Math.min(minP, p);
      maxP = Math.max(maxP, p);
    }

    // Add padding to Y bounds
    minP = Math.min(minP, -2);
    maxP = Math.max(maxP, 8);

    // Mapping helpers
    const scaleX = (l: number) =>
      padding + ((l - minL) / (maxL - minL)) * (width - 2 * padding);
    const scaleY = (p: number) =>
      height - padding - ((p - minP) / (maxP - minP)) * (height - 2 * padding);

    // Generate mapped SVG points
    for (let i = 0; i <= numSamples; i++) {
      const l = minL + i * step;
      const p = coefficients.c2 * l * l + coefficients.c1 * l + coefficients.c0;
      pts.push({
        lambda: l,
        p,
        x: scaleX(l),
        y: scaleY(p),
      });
    }

    // Real roots mapped to SVG coordinates
    const roots: { lambda: number; x: number; y: number; label: string }[] = [];
    if (eigenvalues.type === "distinct-real") {
      roots.push({
        lambda: eigenvalues.roots[0],
        x: scaleX(eigenvalues.roots[0]),
        y: scaleY(0),
        label: `λ₁ = ${formatMathNumber(eigenvalues.roots[0])}`,
      });
      roots.push({
        lambda: eigenvalues.roots[1],
        x: scaleX(eigenvalues.roots[1]),
        y: scaleY(0),
        label: `λ₂ = ${formatMathNumber(eigenvalues.roots[1])}`,
      });
    } else if (eigenvalues.type === "repeated-real") {
      roots.push({
        lambda: eigenvalues.root,
        x: scaleX(eigenvalues.root),
        y: scaleY(0),
        label: `λ = ${formatMathNumber(eigenvalues.root)}`,
      });
    }

    const vPoint = {
      lambda: vertexLambda,
      p: vertexP,
      x: scaleX(vertexLambda),
      y: scaleY(vertexP),
    };

    return {
      xMin: minL,
      xMax: maxL,
      yMin: minP,
      yMax: maxP,
      points: pts,
      vertex: vPoint,
      rootPoints: roots,
    };
  }, [trace, discriminant, eigenvalues, coefficients]);

  // Construct SVG path d string
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, pt, idx) => {
      const cmd = idx === 0 ? "M" : "L";
      return `${acc} ${cmd} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }, "");
  }, [points]);

  // Zero-axis pixel positions
  const zeroAxisY = useMemo(() => {
    return (
      height - padding - ((0 - yMin) / (yMax - yMin)) * (height - 2 * padding)
    );
  }, [yMin, yMax]);

  const zeroAxisX = useMemo(() => {
    return padding + ((0 - xMin) / (xMax - xMin)) * (width - 2 * padding);
  }, [xMin, xMax]);

  // Ticks along λ-axis
  const lambdaTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.ceil(xMin);
    const end = Math.floor(xMax);
    for (let t = start; t <= end; t++) {
      ticks.push(t);
    }
    return ticks;
  }, [xMin, xMax]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Characteristic Polynomial Curve
          </h4>
          <div className="text-xs text-slate-300">
            <MathFormula math={polynomialData.symbolic.characteristicPolynomial} inline={true} />
          </div>
        </div>

        {/* Discriminant Tag */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
            discriminant > 1e-7
              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
              : Math.abs(discriminant) <= 1e-7
              ? "bg-amber-950/60 text-amber-300 border-amber-800"
              : "bg-rose-950/60 text-rose-300 border-rose-800"
          }`}
        >
          {discriminant > 1e-7
            ? "Δ > 0 (Two Real Roots)"
            : Math.abs(discriminant) <= 1e-7
            ? "Δ = 0 (One Repeated Root)"
            : "Δ < 0 (Complex Conjugate Roots)"}
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-xl h-auto select-none"
        >
          <defs>
            {/* Gradient fill under the parabola */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {lambdaTicks.map((t) => {
            const xPos =
              padding + ((t - xMin) / (xMax - xMin)) * (width - 2 * padding);
            return (
              <line
                key={`grid-x-${t}`}
                x1={xPos}
                y1={padding}
                x2={xPos}
                y2={height - padding}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Reference Axis: p(λ) = 0 (Horizontal λ-Axis) */}
          <line
            x1={padding}
            y1={zeroAxisY}
            x2={width - padding}
            y2={zeroAxisY}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <text
            x={width - padding + 8}
            y={zeroAxisY + 4}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
          >
            λ
          </text>

          {/* Reference Axis: λ = 0 (Vertical p(λ)-Axis) */}
          {zeroAxisX >= padding && zeroAxisX <= width - padding && (
            <>
              <line
                x1={zeroAxisX}
                y1={padding}
                x2={zeroAxisX}
                y2={height - padding}
                stroke="#475569"
                strokeWidth="1"
              />
              <text
                x={zeroAxisX - 4}
                y={padding - 8}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                p(λ)
              </text>
            </>
          )}

          {/* Numeric Ticks on λ-Axis */}
          {lambdaTicks.map((t) => {
            const xPos =
              padding + ((t - xMin) / (xMax - xMin)) * (width - 2 * padding);
            return (
              <g key={`tick-${t}`}>
                <line
                  x1={xPos}
                  y1={zeroAxisY - 3}
                  x2={xPos}
                  y2={zeroAxisY + 3}
                  stroke="#64748b"
                  strokeWidth="1"
                />
                <text
                  x={xPos}
                  y={zeroAxisY + 14}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Parabola Curve p(λ) */}
          <path
            d={pathD}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Real Root Points (Intersections with p(λ) = 0) */}
          {rootPoints.map((rt, idx) => (
            <g key={`root-${idx}`}>
              {/* Highlight Pulse Ring */}
              <circle
                cx={rt.x}
                cy={rt.y}
                r="7"
                fill="#10b981"
                fillOpacity="0.25"
              />
              {/* Core Root Dot */}
              <circle
                cx={rt.x}
                cy={rt.y}
                r="4"
                fill="#10b981"
                stroke="#064e3b"
                strokeWidth="1.5"
              />
              {/* Root Tag */}
              <text
                x={rt.x}
                y={rt.y - 12}
                fill="#34d399"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {rt.label}
              </text>
            </g>
          ))}

          {/* Complex Roots Visual Callout (when Δ < 0) */}
          {eigenvalues.type === "complex-conjugate" && (
            <g>
              <rect
                x={width / 2 - 120}
                y={padding + 10}
                width="240"
                height="34"
                rx="6"
                fill="#0f172a"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={width / 2}
                y={padding + 24}
                fill="#fb7185"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                No Real Intersections (Δ &lt; 0)
              </text>
              <text
                x={width / 2}
                y={padding + 36}
                fill="#fda4af"
                fontSize="9"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {`λ = ${eigenvalues.roots[0].real !== 0 ? formatMathNumber(eigenvalues.roots[0].real) + " " : ""}± ${formatMathNumber(Math.abs(eigenvalues.roots[0].imag))}i`}
              </text>
            </g>
          )}

          {/* Vertex Point */}
          <circle
            cx={vertex.x}
            cy={vertex.y}
            r="3"
            fill="#a855f7"
            stroke="#3b0764"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Legend & Interpretation Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
            <span className="text-slate-300 flex items-center gap-1">
              <span>Curve:</span>
              <MathFormula math="p(\lambda) = \det(A - \lambda I)" inline={true} />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300 flex items-center gap-1">
              <span>Roots:</span>
              <MathFormula math="p(\lambda) = 0" inline={true} />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span className="text-slate-400 flex items-center gap-1">
              <span>Vertex:</span>
              <MathFormula math="\lambda = \frac{\text{tr}(A)}{2}" inline={true} />
            </span>
          </div>
        </div>

        <div className="text-xs text-indigo-300 font-semibold">
          <MathFormula math={`p(${formatMathNumber(vertex.lambda)}) = ${formatMathNumber(vertex.p)}`} inline={true} />
        </div>
      </div>
    </div>
  );
}
