/**
 * 2D Matrix Transformation Mathematics (ADR-015)
 * Pure TypeScript, zero React/Three.js dependencies.
 * Computes time-dependent linear operator A(t) = (1-t)I + tA,
 * standard basis images, transformed points/vectors, and unit square parallelogram.
 */

import { Matrix, Vector, Result, ok, err } from "../types";
import {
  createMatrix2x2,
  identityMatrix2x2,
  matrixVectorMultiply,
  determinant2x2,
  validateMatrix,
  getMatrixColumn,
} from "../matrix/operations";
import { vectorAdd, validateVector } from "../vector/operations";

export interface Transformation2DState {
  matrix: Matrix;               // 2x2 target matrix A
  progress: number;             // t in [0, 1]
  interpolatedMatrix: Matrix;   // A(t) = (1-t)I + tA
  basis1: Vector;               // A(t) e1
  basis2: Vector;               // A(t) e2
  transformedVector?: Vector;   // A(t) v
  determinant: number;          // det(A(t))
  area: number;                 // |det(A(t))|
  unitSquareCorners: Vector[];  // [[0,0], e1(t), e1(t)+e2(t), e2(t)]
}

export interface TransformationPreset {
  id: string;
  name: string;
  category: "basic" | "geometric" | "singular";
  matrix: Matrix;
  description: string;
  geometricEffect: string;
}

/**
 * Standard basis vectors for R^2
 */
export const STANDARD_BASIS_2D = {
  e1: [1, 0] as Vector,
  e2: [0, 1] as Vector,
};

/**
 * Computes the interpolated 2x2 matrix A(t) = (1 - t)I + tA for t in [0, 1].
 */
export function interpolateMatrix2D(A: Matrix, t: number): Result<Matrix> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;

  if (typeof t !== "number" || !Number.isFinite(t)) {
    return err({
      code: "INVALID_INPUT",
      message: `Animation progress t must be a finite number: ${t}`,
    });
  }

  const clampedT = Math.max(0, Math.min(1, t));
  const I = identityMatrix2x2();

  const a = (1 - clampedT) * I[0][0] + clampedT * A[0][0];
  const b = (1 - clampedT) * I[0][1] + clampedT * A[0][1];
  const c = (1 - clampedT) * I[1][0] + clampedT * A[1][0];
  const d = (1 - clampedT) * I[1][1] + clampedT * A[1][1];

  return ok(createMatrix2x2(a, b, c, d));
}

/**
 * Evaluates the full mathematical state of a 2D matrix transformation at time t.
 */
export function evaluateTransformation2D(
  A: Matrix,
  t: number,
  customVector?: Vector
): Result<Transformation2DState> {
  const interpResult = interpolateMatrix2D(A, t);
  if (!interpResult.ok) return interpResult;

  const At = interpResult.value;

  // The fundamental theorem: columns of At are exactly At * e1 and At * e2
  const col1Result = getMatrixColumn(At, 0);
  const col2Result = getMatrixColumn(At, 1);
  if (!col1Result.ok) return col1Result;
  if (!col2Result.ok) return col2Result;

  const basis1 = col1Result.value;
  const basis2 = col2Result.value;

  // Determinant & Area
  const detResult = determinant2x2(At);
  if (!detResult.ok) return detResult;

  const determinant = detResult.value;
  const area = Math.abs(determinant);

  // Parallelogram corners of the transformed unit square:
  // [0, 0] -> e1(t) -> e1(t) + e2(t) -> e2(t) -> [0, 0]
  const sumResult = vectorAdd(basis1, basis2);
  const sumCorner = sumResult.ok ? sumResult.value : [basis1[0] + basis2[0], basis1[1] + basis2[1]];

  const unitSquareCorners: Vector[] = [
    [0, 0],
    basis1,
    sumCorner,
    basis2,
  ];

  // Optional custom vector transformation: A(t) * v
  let transformedVector: Vector | undefined = undefined;
  if (customVector) {
    const vValid = validateVector(customVector);
    if (vValid.ok && customVector.length === 2) {
      const vResult = matrixVectorMultiply(At, customVector);
      if (vResult.ok) {
        transformedVector = vResult.value;
      }
    }
  }

  return ok({
    matrix: A,
    progress: Math.max(0, Math.min(1, t)),
    interpolatedMatrix: At,
    basis1,
    basis2,
    transformedVector,
    determinant,
    area,
    unitSquareCorners,
  });
}

/**
 * Checks linearity condition: A(u + v) = Au + Av and A(c u) = c(Au).
 */
export function verifyLinearity2D(
  A: Matrix,
  u: Vector,
  v: Vector,
  scalar: number
): {
  isAdditive: boolean;
  isHomogeneous: boolean;
  Au_plus_v: Vector;
  Au_plus_Av: Vector;
  A_cu: Vector;
  c_Au: Vector;
} {
  const validA = validateMatrix(A);
  if (!validA.ok) throw new Error(validA.error.message);

  const u_plus_v = [u[0] + v[0], u[1] + v[1]];
  const cu = [scalar * u[0], scalar * u[1]];

  const Au_plus_v = matrixVectorMultiply(A, u_plus_v).ok
    ? (matrixVectorMultiply(A, u_plus_v) as { ok: true; value: Vector }).value
    : [0, 0];

  const Au = matrixVectorMultiply(A, u).ok
    ? (matrixVectorMultiply(A, u) as { ok: true; value: Vector }).value
    : [0, 0];

  const Av = matrixVectorMultiply(A, v).ok
    ? (matrixVectorMultiply(A, v) as { ok: true; value: Vector }).value
    : [0, 0];

  const Au_plus_Av = [Au[0] + Av[0], Au[1] + Av[1]];

  const A_cu = matrixVectorMultiply(A, cu).ok
    ? (matrixVectorMultiply(A, cu) as { ok: true; value: Vector }).value
    : [0, 0];

  const c_Au = [scalar * Au[0], scalar * Au[1]];

  const isAdditive =
    Math.abs(Au_plus_v[0] - Au_plus_Av[0]) < 1e-6 &&
    Math.abs(Au_plus_v[1] - Au_plus_Av[1]) < 1e-6;

  const isHomogeneous =
    Math.abs(A_cu[0] - c_Au[0]) < 1e-6 &&
    Math.abs(A_cu[1] - c_Au[1]) < 1e-6;

  return {
    isAdditive,
    isHomogeneous,
    Au_plus_v,
    Au_plus_Av,
    A_cu,
    c_Au,
  };
}

/**
 * Educational Transformation Presets
 */
export const TRANSFORMATION_PRESETS: TransformationPreset[] = [
  {
    id: "identity",
    name: "Identity",
    category: "basic",
    matrix: [
      [1, 0],
      [0, 1],
    ],
    description: "Leaves every vector and coordinate line completely unchanged.",
    geometricEffect: "det(A) = 1. Basis vectors remain at [1, 0] and [0, 1].",
  },
  {
    id: "scale",
    name: "Scale (2x, 1.5y)",
    category: "geometric",
    matrix: [
      [2, 0],
      [0, 1.5],
    ],
    description: "Stretches the x-axis by factor 2 and y-axis by factor 1.5.",
    geometricEffect: "det(A) = 3. All areas are scaled by exactly factor 3.",
  },
  {
    id: "reflection-y",
    name: "Reflection across y-axis",
    category: "geometric",
    matrix: [
      [-1, 0],
      [0, 1],
    ],
    description: "Flips the horizontal coordinate while preserving vertical position.",
    geometricEffect: "det(A) = -1. Area is preserved but orientation is reversed.",
  },
  {
    id: "rotation-90",
    name: "Rotation (90° counter-clockwise)",
    category: "geometric",
    matrix: [
      [0, -1],
      [1, 0],
    ],
    description: "Rotates all vectors and grid lines by 90° counter-clockwise.",
    geometricEffect: "det(A) = 1. Rigid rotation: preserves lengths, angles, and area.",
  },
  {
    id: "rotation-45",
    name: "Rotation (45° counter-clockwise)",
    category: "geometric",
    matrix: [
      [0.7071, -0.7071],
      [0.7071, 0.7071],
    ],
    description: "Rotates the entire 2D plane by 45° counter-clockwise.",
    geometricEffect: "det(A) = 1. Orthogonal transformation.",
  },
  {
    id: "shear-x",
    name: "Horizontal Shear (k = 1.5)",
    category: "geometric",
    matrix: [
      [1, 1.5],
      [0, 1],
    ],
    description: "Slides horizontal grid lines parallel to the x-axis proportional to y-height.",
    geometricEffect: "det(A) = 1. Area is strictly preserved while rectangular cells deform into parallelograms.",
  },
  {
    id: "projection-x",
    name: "Projection onto x-axis",
    category: "singular",
    matrix: [
      [1, 0],
      [0, 0],
    ],
    description: "Collapses all vectors onto the horizontal x-axis, annihilating the y-component.",
    geometricEffect: "det(A) = 0. Singular / rank-deficient: 2D area collapses to 1D line.",
  },
];
