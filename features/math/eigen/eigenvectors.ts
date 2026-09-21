/**
 * Eigenvectors and Eigensystems Computation Layer
 * Pure TypeScript, zero React/Three.js dependencies.
 * Adheres strictly to MATH_ENGINE_SPEC.md and NUMERICAL_POLICY.md.
 */

import { Matrix, Vector, Result, ok, err } from "../types";
import { ZERO_TOLERANCE } from "../constants";
import { validateMatrix, getMatrixDimensions, matrixVectorMultiply } from "../matrix/operations";
import { computeCharacteristicPolynomial2D, formatMathNumber } from "./characteristic-equation";
import { vectorNorm, vectorScale, dotProduct } from "../vector/operations";

export interface Eigenpair {
  eigenvalue: number;
  algebraicMultiplicity: number;
  geometricMultiplicity: number;
  eigenspaceBasis: Vector[]; // Representative non-zero basis vectors for Null(A - λI)
  lineEquation?: string;     // e.g. "y = x", "y = -0.5x", "x = 0"
  description: string;
}

export interface ComplexEigenpair {
  real: number;
  imag: number;
  algebraicMultiplicity: number;
  message: string;
}

export interface EigensystemDerivationStep {
  lambda: number;
  matrixMinusLambdaI: string;
  systemEquation: string;
  rref: string;
  parametricSolution: string;
  basisVectors: string;
}

export interface Eigensystem {
  dimension: number;
  matrix: Matrix;
  distinctRealEigenvalues: Array<{
    value: number;
    algebraicMultiplicity: number;
    geometricMultiplicity: number;
  }>;
  eigenpairs: Eigenpair[];
  complexPairs?: ComplexEigenpair[];
  isDefective: boolean;
  isFullyReal: boolean;
  allVectorsAreEigenvectors: boolean; // True when A = cI (uniform scaling across entire space)
  symbolicDerivations: EigensystemDerivationStep[];
}

/**
 * Computes the eigensystem for a 2x2 matrix.
 */
export function computeEigensystem2D(A: Matrix): Result<Eigensystem> {
  const valid = validateMatrix(A);
  if (!valid.ok) return valid;

  const { rows, cols } = getMatrixDimensions(A);
  if (rows !== 2 || cols !== 2) {
    return err({
      code: "INVALID_DIMENSION",
      message: `computeEigensystem2D requires a 2x2 matrix, received ${rows}x${cols}.`,
    });
  }

  const polyResult = computeCharacteristicPolynomial2D(A);
  if (!polyResult.ok) return polyResult;

  const poly = polyResult.value;
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];

  // Case 1: Complex conjugate eigenvalues (Δ < 0)
  if (poly.eigenvalues.type === "complex-conjugate") {
    const root1 = poly.eigenvalues.roots[0];
    const root2 = poly.eigenvalues.roots[1];

    return ok({
      dimension: 2,
      matrix: A,
      distinctRealEigenvalues: [],
      eigenpairs: [],
      complexPairs: [
        {
          real: root1.real,
          imag: Math.abs(root1.imag),
          algebraicMultiplicity: 1,
          message: "No real eigenvectors exist for this transformation in ℝ².",
        },
        {
          real: root2.real,
          imag: -Math.abs(root2.imag),
          algebraicMultiplicity: 1,
          message: "No real eigenvectors exist for this transformation in ℝ².",
        },
      ],
      isDefective: false,
      isFullyReal: false,
      allVectorsAreEigenvectors: false,
      symbolicDerivations: [],
    });
  }

  // Determine distinct real eigenvalues and their algebraic multiplicities
  const distinctEigenvalues: Array<{ value: number; am: number }> = [];

  if (poly.eigenvalues.type === "distinct-real") {
    distinctEigenvalues.push(
      { value: poly.eigenvalues.roots[0], am: 1 },
      { value: poly.eigenvalues.roots[1], am: 1 }
    );
  } else {
    // repeated-real
    distinctEigenvalues.push({ value: poly.eigenvalues.root, am: 2 });
  }

  const eigenpairs: Eigenpair[] = [];
  const derivations: EigensystemDerivationStep[] = [];
  let totalGeometricMultiplicity = 0;
  let isUniformScaling = false;

  for (const { value: lambda, am } of distinctEigenvalues) {
    // Construct M = A - λI
    const m11 = a - lambda;
    const m12 = b;
    const m21 = c;
    const m22 = d - lambda;

    // Check if M is identically the zero matrix (M ≈ 0)
    const isZeroMatrix =
      Math.abs(m11) < ZERO_TOLERANCE &&
      Math.abs(m12) < ZERO_TOLERANCE &&
      Math.abs(m21) < ZERO_TOLERANCE &&
      Math.abs(m22) < ZERO_TOLERANCE;

    let basis: Vector[] = [];
    let gm = 1;
    let lineEq = "";
    let paramSolution = "";
    let rrefLatex = "";

    if (isZeroMatrix) {
      // Eigenspace is all of ℝ²: gm = 2
      gm = 2;
      isUniformScaling = true;
      basis = [
        [1, 0],
        [0, 1],
      ];
      lineEq = "Entire ℝ² Plane";
      paramSolution = "\\mathbf{x} = s \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + t \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}, \\quad (s, t) \\neq (0, 0)";
      rrefLatex = "\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}";
    } else {
      // Rank of M is 1, so gm = 2 - 1 = 1
      gm = 1;

      // Find non-zero vector (v_x, v_y) satisfying (A - λI)v = 0
      // Row 1: m11 * x + m12 * y = 0 => if m12 != 0: v = [-m12, m11]
      let vx = 0;
      let vy = 0;

      if (Math.abs(m12) > ZERO_TOLERANCE) {
        vx = -m12;
        vy = m11;
      } else if (Math.abs(m21) > ZERO_TOLERANCE) {
        vx = m22;
        vy = -m21;
      } else if (Math.abs(m11) > ZERO_TOLERANCE) {
        // m11 * x = 0 => x = 0, y free
        vx = 0;
        vy = 1;
      } else if (Math.abs(m22) > ZERO_TOLERANCE) {
        // m22 * y = 0 => y = 0, x free
        vx = 1;
        vy = 0;
      } else {
        vx = 1;
        vy = 0;
      }

      // Normalize representation for clean visualization
      const norm = Math.hypot(vx, vy);
      if (norm > ZERO_TOLERANCE) {
        vx /= norm;
        vy /= norm;
      }

      // Ensure consistent canonical sign (positive x, or positive y if x=0)
      if (vx < -ZERO_TOLERANCE || (Math.abs(vx) <= ZERO_TOLERANCE && vy < 0)) {
        vx = -vx;
        vy = -vy;
      }

      // Round clean rational approximations if very close
      vx = Math.abs(vx) < ZERO_TOLERANCE ? 0 : vx;
      vy = Math.abs(vy) < ZERO_TOLERANCE ? 0 : vy;

      basis = [[vx, vy]];

      // Compute line equation string
      if (Math.abs(vx) < ZERO_TOLERANCE) {
        lineEq = "x = 0 \\quad (y\\text{-axis})";
      } else if (Math.abs(vy) < ZERO_TOLERANCE) {
        lineEq = "y = 0 \\quad (x\\text{-axis})";
      } else {
        const slope = vy / vx;
        lineEq = `y = ${formatMathNumber(slope)}x`;
      }

      paramSolution = `\\mathbf{v} = t \\begin{bmatrix} ${formatMathNumber(vx)} \\\\ ${formatMathNumber(vy)} \\end{bmatrix}, \\quad t \\neq 0`;
      rrefLatex = `\\begin{bmatrix} 1 & ${formatMathNumber(-vx / (vy || 1))} \\\\ 0 & 0 \\end{bmatrix}`;
    }

    totalGeometricMultiplicity += gm;

    eigenpairs.push({
      eigenvalue: lambda,
      algebraicMultiplicity: am,
      geometricMultiplicity: gm,
      eigenspaceBasis: basis,
      lineEquation: lineEq,
      description:
        gm === 2
          ? `λ = ${formatMathNumber(lambda)} (am = 2, gm = 2): Eigenspace is all of ℝ². Every non-zero vector in ℝ² is an eigenvector scaled by ${formatMathNumber(lambda)}.`
          : `λ = ${formatMathNumber(lambda)} (am = ${am}, gm = 1): 1D eigenspace along invariant line ${lineEq}. Any non-zero scalar multiple is an eigenvector.`,
    });

    // Generate symbolic LaTeX derivation
    const matMinusLambdaLatex = `\\begin{bmatrix} ${formatMathNumber(a)} - (${formatMathNumber(lambda)}) & ${formatMathNumber(b)} \\\\ ${formatMathNumber(c)} & ${formatMathNumber(d)} - (${formatMathNumber(lambda)}) \\end{bmatrix} = \\begin{bmatrix} ${formatMathNumber(m11)} & ${formatMathNumber(m12)} \\\\ ${formatMathNumber(m21)} & ${formatMathNumber(m22)} \\end{bmatrix}`;
    const sysEqLatex = `\\begin{bmatrix} ${formatMathNumber(m11)} & ${formatMathNumber(m12)} \\\\ ${formatMathNumber(m21)} & ${formatMathNumber(m22)} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}`;
    const basisLatex = basis
      .map(
        (v) =>
          `\\mathbf{v} = \\begin{bmatrix} ${formatMathNumber(v[0])} \\\\ ${formatMathNumber(v[1])} \\end{bmatrix}`
      )
      .join(", \\quad ");

    derivations.push({
      lambda,
      matrixMinusLambdaI: matMinusLambdaLatex,
      systemEquation: sysEqLatex,
      rref: rrefLatex,
      parametricSolution: paramSolution,
      basisVectors: basisLatex,
    });
  }

  // isDefective is true when the sum of gm over DISTINCT real eigenvalues < dimension (2)
  const isDefective = totalGeometricMultiplicity < 2;

  return ok({
    dimension: 2,
    matrix: A,
    distinctRealEigenvalues: distinctEigenvalues.map((d, i) => ({
      value: d.value,
      algebraicMultiplicity: d.am,
      geometricMultiplicity: eigenpairs[i]?.geometricMultiplicity ?? 1,
    })),
    eigenpairs,
    isDefective,
    isFullyReal: true,
    allVectorsAreEigenvectors: isUniformScaling,
    symbolicDerivations: derivations,
  });
}

/**
 * Computes the eigensystem for a 3x3 diagonal or triangular matrix.
 */
export function computeEigensystem3D(A: Matrix): Result<Eigensystem> {
  const valid = validateMatrix(A);
  if (!valid.ok) return valid;

  const { rows, cols } = getMatrixDimensions(A);
  if (rows !== 3 || cols !== 3) {
    return err({
      code: "INVALID_DIMENSION",
      message: `computeEigensystem3D requires a 3x3 matrix, received ${rows}x${cols}.`,
    });
  }

  // Handle standard diagonal 3x3 matrices: diag(d1, d2, d3)
  const isDiagonal =
    Math.abs(A[0][1]) < ZERO_TOLERANCE &&
    Math.abs(A[0][2]) < ZERO_TOLERANCE &&
    Math.abs(A[1][0]) < ZERO_TOLERANCE &&
    Math.abs(A[1][2]) < ZERO_TOLERANCE &&
    Math.abs(A[2][0]) < ZERO_TOLERANCE &&
    Math.abs(A[2][1]) < ZERO_TOLERANCE;

  if (isDiagonal) {
    const rawLambdas = [A[0][0], A[1][1], A[2][2]];
    const standardBases: Vector[] = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];

    // Group distinct eigenvalues
    const lambdaMap = new Map<number, { am: number; basis: Vector[] }>();

    for (let i = 0; i < 3; i++) {
      const val = rawLambdas[i];
      // Find existing within tolerance
      let foundKey: number | undefined;
      for (const key of lambdaMap.keys()) {
        if (Math.abs(key - val) < ZERO_TOLERANCE) {
          foundKey = key;
          break;
        }
      }

      if (foundKey !== undefined) {
        const item = lambdaMap.get(foundKey)!;
        item.am += 1;
        item.basis.push(standardBases[i]);
      } else {
        lambdaMap.set(val, { am: 1, basis: [standardBases[i]] });
      }
    }

    const eigenpairs: Eigenpair[] = [];
    const distinctRealEigenvalues: Array<{ value: number; algebraicMultiplicity: number; geometricMultiplicity: number }> = [];

    for (const [val, data] of lambdaMap.entries()) {
      const gm = data.basis.length;
      distinctRealEigenvalues.push({
        value: val,
        algebraicMultiplicity: data.am,
        geometricMultiplicity: gm,
      });

      eigenpairs.push({
        eigenvalue: val,
        algebraicMultiplicity: data.am,
        geometricMultiplicity: gm,
        eigenspaceBasis: data.basis,
        lineEquation:
          gm === 1
            ? `Axis direction ${data.basis[0].map(formatMathNumber).join(", ")}`
            : `${gm}D Subspace`,
        description: `λ = ${formatMathNumber(val)} (am = ${data.am}, gm = ${gm}): Eigenspace spanned by coordinate axis basis vectors.`,
      });
    }

    const isAllEigen = lambdaMap.size === 1 && lambdaMap.values().next().value?.am === 3;

    return ok({
      dimension: 3,
      matrix: A,
      distinctRealEigenvalues,
      eigenpairs,
      isDefective: false,
      isFullyReal: true,
      allVectorsAreEigenvectors: isAllEigen,
      symbolicDerivations: [],
    });
  }

  // Fallback for general 3x3
  return err({
    code: "UNSUPPORTED_OPERATION",
    message: "General non-diagonal 3x3 eigensystem computation is scheduled for advanced modules.",
  });
}

/**
 * Unified dimension-independent eigensystem solver.
 */
export function computeEigensystem(A: Matrix): Result<Eigensystem> {
  const valid = validateMatrix(A);
  if (!valid.ok) return valid;

  const { rows, cols } = getMatrixDimensions(A);
  if (rows !== cols) {
    return err({
      code: "NON_SQUARE_MATRIX",
      message: `Eigensystem requires a square matrix, received ${rows}x${cols}.`,
    });
  }

  if (rows === 2) {
    return computeEigensystem2D(A);
  }
  if (rows === 3) {
    return computeEigensystem3D(A);
  }

  return err({
    code: "UNSUPPORTED_OPERATION",
    message: `Eigensystem solver currently supports 2x2 and 3x3 matrices; received ${rows}x${cols}.`,
  });
}

/**
 * Tests whether an arbitrary candidate vector v is an eigenvector of matrix A.
 * Computes Av, residual ||Av - λv||, and angle between v and Av.
 * Treats both angle ≈ 0° (positive λ) and angle ≈ 180° (negative λ) as the SAME invariant line!
 */
export function isEigenvector(
  A: Matrix,
  v: Vector,
  tolerance = ZERO_TOLERANCE
): {
  isEigen: boolean;
  lambda?: number;
  residual: number;
  angleDegrees: number;
  isSameLine: boolean;
  message: string;
} {
  const normV = vectorNorm(v);
  if (normV < tolerance) {
    return {
      isEigen: false,
      residual: 0,
      angleDegrees: 0,
      isSameLine: false,
      message: "The zero vector is NEVER an eigenvector by mathematical definition.",
    };
  }

  const AvResult = matrixVectorMultiply(A, v);
  if (!AvResult.ok) {
    return {
      isEigen: false,
      residual: NaN,
      angleDegrees: NaN,
      isSameLine: false,
      message: "Matrix-vector dimension mismatch.",
    };
  }

  const Av = AvResult.value;
  const normAv = vectorNorm(Av);

  // Case 1: Av is zero vector (λ = 0)
  if (normAv < tolerance * 100) {
    return {
      isEigen: true,
      lambda: 0,
      residual: normAv,
      angleDegrees: 0,
      isSameLine: true,
      message: "Eigenvector with λ = 0 (Vector collapses into the origin).",
    };
  }

  // Compute angle between v and Av
  const dotRes = dotProduct(v, Av);
  const dot = dotRes.ok ? dotRes.value : 0;
  const cosTheta = Math.max(-1, Math.min(1, dot / (normV * normAv)));
  const angleRad = Math.acos(cosTheta);
  const angleDeg = (angleRad * 180) / Math.PI;

  // An invariant line occurs if angle is 0° (same direction, λ > 0) OR 180° (opposite direction, λ < 0)
  const isParallel = angleDeg < 0.5 || Math.abs(angleDeg - 180) < 0.5;

  if (isParallel) {
    // Determine sign and magnitude of lambda
    const lambda = angleDeg < 90 ? normAv / normV : -normAv / normV;
    const scaledVRes = vectorScale(v, lambda);
    const scaledV = scaledVRes.ok ? scaledVRes.value : v;
    const diff = Av.map((val, i) => val - scaledV[i]);
    const residual = Math.hypot(...diff);

    return {
      isEigen: residual < tolerance * 10,
      lambda,
      residual,
      angleDegrees: angleDeg,
      isSameLine: true,
      message:
        lambda > 0
          ? `Eigenvector: Preserves direction, scaled by factor λ = ${formatMathNumber(lambda)}.`
          : `Eigenvector: Reverses direction along the same invariant line, scaled by λ = ${formatMathNumber(lambda)}.`,
    };
  }

  // Not on an invariant line
  return {
    isEigen: false,
    residual: normAv,
    angleDegrees: angleDeg,
    isSameLine: false,
    message: `Ordinary Vector: Matrix A rotates the vector by ${formatMathNumber(angleDeg)}° away from its original line.`,
  };
}

/**
 * Checks if a candidate eigenpair (λ, v) satisfies Av = λv within tolerance.
 */
export function verifyEigenpair(
  A: Matrix,
  lambda: number,
  v: Vector,
  tolerance = ZERO_TOLERANCE * 10
): boolean {
  const norm = vectorNorm(v);
  if (norm < tolerance) return false;

  const Av = matrixVectorMultiply(A, v);
  if (!Av.ok) return false;

  const lambdaV = vectorScale(v, lambda);
  if (!lambdaV.ok) return false;

  const diff = Av.value.map((val, i) => val - lambdaV.value[i]);
  const residual = Math.hypot(...diff);

  return residual < tolerance;
}
