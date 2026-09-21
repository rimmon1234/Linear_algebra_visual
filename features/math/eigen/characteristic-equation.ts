/**
 * Characteristic Polynomial and Equation Engine (ADR-003, ADR-016)
 * Pure TypeScript mathematics layer, zero UI / React / Three.js dependencies.
 *
 * CANONICAL CONVENTION (Project Standard):
 * p(λ) = det(A - λI)
 * For a 2x2 matrix A = [[a, b], [c, d]]:
 *   A - λI = [[a - λ, b], [c, d - λ]]
 *   p(λ) = (a - λ)(d - λ) - bc = λ^2 - (a + d)λ + (ad - bc)
 *   p(λ) = λ^2 - tr(A)λ + det(A)
 *
 * Characteristic Equation:
 *   p(λ) = 0  <=>  λ^2 - tr(A)λ + det(A) = 0
 *
 * Discriminant:
 *   Δ = tr(A)^2 - 4 * det(A)
 *   - Δ > 0: Two distinct real roots
 *   - |Δ| <= ZERO_TOLERANCE: One repeated real root (algebraic multiplicity 2)
 *   - Δ < 0: Complex conjugate roots: α ± iβ
 */

import { Matrix, Result, ok, err } from "../types";
import { ZERO_TOLERANCE } from "../constants";
import { validateMatrix, determinant2x2, getMatrixDimensions } from "../matrix/operations";

export interface ComplexNumber {
  real: number;
  imag: number;
}

export type EigenvalueRoots =
  | {
      type: "distinct-real";
      roots: [number, number]; // [λ1, λ2] sorted descending
      multiplicities: [1, 1];
    }
  | {
      type: "repeated-real";
      root: number; // λ
      multiplicity: 2;
    }
  | {
      type: "complex-conjugate";
      roots: [ComplexNumber, ComplexNumber]; // [α + iβ, α - iβ] with β > 0
      multiplicities: [1, 1];
    };

export interface DerivationStep {
  stepNumber: number;
  title: string;
  description: string;
  formula: string;
}

export interface CharacteristicPolynomial2D {
  matrix: Matrix;
  trace: number;
  determinant: number;
  discriminant: number;
  coefficients: {
    c2: number; // Coefficient of λ^2 (always 1 for det(A - λI) in 2x2)
    c1: number; // Coefficient of λ (-tr(A))
    c0: number; // Constant term (det(A))
  };
  eigenvalues: EigenvalueRoots;
  symbolic: {
    matrixMinusLambdaI: string;
    determinantExpansion: string;
    characteristicPolynomial: string;
    characteristicEquation: string;
    discriminantCalculation: string;
    solutionsSummary: string;
  };
  derivationSteps: DerivationStep[];
}

/**
 * Formats a number cleanly for mathematical LaTeX display:
 * Integer-like floats appear as integers, otherwise rounded to up to 2 decimal places.
 */
export function formatMathNumber(n: number): string {
  if (Math.abs(n) < ZERO_TOLERANCE) return "0";
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < ZERO_TOLERANCE) {
    return `${Math.round(n)}`;
  }
  return Number(n.toFixed(2)).toString();
}

/**
 * Evaluates the characteristic polynomial p(λ) = λ^2 - tr(A)λ + det(A) at a given scalar λ.
 */
export function evaluateCharacteristicPolynomial(
  poly: CharacteristicPolynomial2D,
  lambda: number
): number {
  const { c2, c1, c0 } = poly.coefficients;
  return c2 * lambda * lambda + c1 * lambda + c0;
}

/**
 * Computes the complete characteristic polynomial, characteristic equation,
 * discriminant, roots, and step-by-step symbolic derivation for a 2x2 matrix.
 */
export function computeCharacteristicPolynomial2D(
  A: Matrix
): Result<CharacteristicPolynomial2D> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;

  const { rows, cols } = getMatrixDimensions(A);
  if (rows !== 2 || cols !== 2) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Characteristic polynomial 2D requires a 2x2 matrix, got ${rows}x${cols}.`,
    });
  }

  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];

  const trace = a + d;

  const detResult = determinant2x2(A);
  if (!detResult.ok) return detResult;
  const determinant = detResult.value;

  // Discriminant: Δ = tr(A)^2 - 4 * det(A)
  const discriminant = trace * trace - 4 * determinant;

  // Roots calculation based on discriminant
  let eigenvalues: EigenvalueRoots;

  if (Math.abs(discriminant) <= ZERO_TOLERANCE) {
    // Repeated real root
    const root = trace / 2;
    eigenvalues = {
      type: "repeated-real",
      root: Math.abs(root) < ZERO_TOLERANCE ? 0 : root,
      multiplicity: 2,
    };
  } else if (discriminant > ZERO_TOLERANCE) {
    // Two distinct real roots
    const sqrtDisc = Math.sqrt(discriminant);
    const r1 = (trace + sqrtDisc) / 2;
    const r2 = (trace - sqrtDisc) / 2;
    eigenvalues = {
      type: "distinct-real",
      roots: [
        Math.abs(r1) < ZERO_TOLERANCE ? 0 : r1,
        Math.abs(r2) < ZERO_TOLERANCE ? 0 : r2,
      ],
      multiplicities: [1, 1],
    };
  } else {
    // Complex conjugate roots: α ± iβ
    const realPart = trace / 2;
    const imagPart = Math.sqrt(-discriminant) / 2;
    eigenvalues = {
      type: "complex-conjugate",
      roots: [
        {
          real: Math.abs(realPart) < ZERO_TOLERANCE ? 0 : realPart,
          imag: imagPart,
        },
        {
          real: Math.abs(realPart) < ZERO_TOLERANCE ? 0 : realPart,
          imag: -imagPart,
        },
      ],
      multiplicities: [1, 1],
    };
  }

  // Formatting strings for LaTeX
  const aStr = formatMathNumber(a);
  const bStr = formatMathNumber(b);
  const cStr = formatMathNumber(c);
  const dStr = formatMathNumber(d);
  const trStr = formatMathNumber(trace);
  const detStr = formatMathNumber(determinant);
  const discStr = formatMathNumber(discriminant);

  // LaTeX matrix A - λI
  const matrixMinusLambdaI = `\\begin{bmatrix} ${aStr} - \\lambda & ${bStr} \\\\ ${cStr} & ${dStr} - \\lambda \\end{bmatrix}`;

  // Determinant expansion: (a - λ)(d - λ) - bc
  const bcVal = b * c;
  const bcStr = formatMathNumber(bcVal);
  const determinantExpansion = `(${aStr} - \\lambda)(${dStr} - \\lambda) - (${bStr})(${cStr})`;

  // Polynomial: λ^2 - tr(A)λ + det(A)
  const trTerm =
    Math.abs(trace) < ZERO_TOLERANCE
      ? ""
      : trace > 0
      ? ` - ${trStr}\\lambda`
      : ` + ${formatMathNumber(-trace)}\\lambda`;

  const detTerm =
    Math.abs(determinant) < ZERO_TOLERANCE
      ? ""
      : determinant > 0
      ? ` + ${detStr}`
      : ` - ${formatMathNumber(-determinant)}`;

  const characteristicPolynomial = `p(\\lambda) = \\lambda^2${trTerm}${detTerm || (trTerm ? "" : " + 0")}`;
  const characteristicEquation = `\\lambda^2${trTerm}${detTerm || (trTerm ? "" : " + 0")} = 0`;
  const discriminantCalculation = `\\Delta = (\\text{tr}(A))^2 - 4\\det(A) = (${trStr})^2 - 4(${detStr}) = ${discStr}`;

  // Solutions summary string
  let solutionsSummary = "";
  if (eigenvalues.type === "distinct-real") {
    const [r1, r2] = eigenvalues.roots;
    solutionsSummary = `\\lambda_1 = ${formatMathNumber(r1)}, \\quad \\lambda_2 = ${formatMathNumber(r2)}`;
  } else if (eigenvalues.type === "repeated-real") {
    solutionsSummary = `\\lambda = ${formatMathNumber(eigenvalues.root)} \\quad (\\text{algebraic multiplicity } 2)`;
  } else {
    const { real, imag } = eigenvalues.roots[0];
    const realFmt = Math.abs(real) < ZERO_TOLERANCE ? "" : formatMathNumber(real);
    const imagFmt = Math.abs(imag - 1) < ZERO_TOLERANCE ? "" : formatMathNumber(imag);
    solutionsSummary = realFmt
      ? `\\lambda = ${realFmt} \\pm ${imagFmt}i`
      : `\\lambda = \\pm ${imagFmt}i`;
  }

  // Step-by-step derivation array
  const derivationSteps: DerivationStep[] = [
    {
      stepNumber: 1,
      title: "Construct (A - λI)",
      description:
        "Subtract the scalar λ along the main diagonal of matrix A to form the matrix whose singularity we must test.",
      formula: `A - \\lambda I = ${matrixMinusLambdaI}`,
    },
    {
      stepNumber: 2,
      title: "Set det(A - λI) = 0",
      description:
        "For (A - λI)v = 0 to have non-trivial (non-zero) solutions, the matrix (A - λI) must be singular (non-invertible), requiring its determinant to vanish.",
      formula: `\\det(A - \\lambda I) = \\det\\left(${matrixMinusLambdaI}\\right) = 0`,
    },
    {
      stepNumber: 3,
      title: "Expand the 2x2 Determinant",
      description:
        "Multiply the diagonal elements and subtract the product of the off-diagonal elements: (a - λ)(d - λ) - bc.",
      formula: `\\det(A - \\lambda I) = ${determinantExpansion} = 0`,
    },
    {
      stepNumber: 4,
      title: "Standard Characteristic Equation Form",
      description:
        "Combine terms into the standard monic quadratic polynomial: λ² - tr(A)λ + det(A) = 0.",
      formula: characteristicEquation,
    },
    {
      stepNumber: 5,
      title: "Calculate Discriminant and Solve for Eigenvalues",
      description:
        "Apply the quadratic formula to find the roots (eigenvalues). The discriminant Δ classifies the roots as distinct real, repeated, or complex.",
      formula: `${discriminantCalculation} \\implies ${solutionsSummary}`,
    },
  ];

  return ok({
    matrix: A,
    trace,
    determinant,
    discriminant,
    coefficients: {
      c2: 1,
      c1: -trace,
      c0: determinant,
    },
    eigenvalues,
    symbolic: {
      matrixMinusLambdaI,
      determinantExpansion,
      characteristicPolynomial,
      characteristicEquation,
      discriminantCalculation,
      solutionsSummary,
    },
    derivationSteps,
  });
}
