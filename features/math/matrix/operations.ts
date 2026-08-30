/**
 * Matrix Operations (Mathematics Layer)
 * Pure TypeScript, zero React/Three.js dependencies.
 * Generic matrix representation with 2x2 convenience constructors.
 * Tolerances derived strictly from NUMERICAL_POLICY.md.
 */

import { Matrix, Vector, Result, ok, err } from "../types";
import { ZERO_TOLERANCE } from "../constants";
import { validateVector } from "../vector/operations";

/**
 * Validates that a matrix is a non-empty 2D array of finite numbers with uniform row lengths.
 */
export function validateMatrix(A: Matrix): Result<Matrix> {
  if (!Array.isArray(A) || A.length === 0) {
    return err({
      code: "INVALID_DIMENSION",
      message: "Matrix must be a non-empty 2D array.",
    });
  }

  const numCols = A[0]?.length;
  if (!numCols || numCols === 0) {
    return err({
      code: "INVALID_DIMENSION",
      message: "Matrix rows must contain at least one column.",
    });
  }

  for (let r = 0; r < A.length; r++) {
    const row = A[r];
    if (!Array.isArray(row) || row.length !== numCols) {
      return err({
        code: "INVALID_DIMENSION",
        message: `Matrix has inconsistent row lengths at row ${r}: expected ${numCols}, got ${row?.length}.`,
      });
    }

    for (let c = 0; c < numCols; c++) {
      const val = row[c];
      if (typeof val !== "number" || !Number.isFinite(val)) {
        return err({
          code: "INVALID_INPUT",
          message: `Matrix entry at [${r}, ${c}] is not a finite number: ${val}`,
        });
      }
    }
  }

  return ok(A);
}

/**
 * Returns matrix row and column dimensions.
 */
export function getMatrixDimensions(A: Matrix): { rows: number; cols: number } {
  return {
    rows: Array.isArray(A) ? A.length : 0,
    cols: Array.isArray(A) && Array.isArray(A[0]) ? A[0].length : 0,
  };
}

/**
 * Checks if a matrix is square (N x N).
 */
export function isMatrixSquare(A: Matrix): boolean {
  const { rows, cols } = getMatrixDimensions(A);
  return rows > 0 && rows === cols;
}

/**
 * Convenience constructor for a 2x2 matrix:
 * [ a  b ]
 * [ c  d ]
 */
export function createMatrix2x2(a: number, b: number, c: number, d: number): Matrix {
  return [
    [a, b],
    [c, d],
  ];
}

/**
 * Convenience constructor for 2x2 Identity matrix.
 */
export function identityMatrix2x2(): Matrix {
  return [
    [1, 0],
    [0, 1],
  ];
}

/**
 * Generic N x N Identity matrix constructor.
 */
export function identityMatrix(n: number): Result<Matrix> {
  if (!Number.isInteger(n) || n <= 0) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Identity matrix dimension must be a positive integer, got ${n}.`,
    });
  }

  const I: Matrix = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => (r === c ? 1 : 0))
  );

  return ok(I);
}

/**
 * Extracts a column from a matrix as a Vector:
 * colIndex = 0 gives col 1, colIndex = 1 gives col 2, etc.
 */
export function getMatrixColumn(A: Matrix, colIndex: number): Result<Vector> {
  const valid = validateMatrix(A);
  if (!valid.ok) return valid;

  const { rows, cols } = getMatrixDimensions(A);
  if (colIndex < 0 || colIndex >= cols) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Column index ${colIndex} out of bounds for matrix with ${cols} columns.`,
    });
  }

  const col: Vector = [];
  for (let r = 0; r < rows; r++) {
    col.push(A[r][colIndex]);
  }

  return ok(col);
}

/**
 * Matrix addition: A + B
 */
export function matrixAdd(A: Matrix, B: Matrix): Result<Matrix> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;
  const validB = validateMatrix(B);
  if (!validB.ok) return validB;

  const dimA = getMatrixDimensions(A);
  const dimB = getMatrixDimensions(B);

  if (dimA.rows !== dimB.rows || dimA.cols !== dimB.cols) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Matrix addition dimension mismatch: ${dimA.rows}x${dimA.cols} vs ${dimB.rows}x${dimB.cols}.`,
    });
  }

  const result: Matrix = A.map((row, r) => row.map((val, c) => val + B[r][c]));
  return ok(result);
}

/**
 * Scalar matrix multiplication: scalar * A
 */
export function matrixScale(A: Matrix, scalar: number): Result<Matrix> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;

  if (typeof scalar !== "number" || !Number.isFinite(scalar)) {
    return err({
      code: "INVALID_INPUT",
      message: `Scalar must be a finite number: ${scalar}`,
    });
  }

  const result: Matrix = A.map((row) => row.map((val) => val * scalar));
  return ok(result);
}

/**
 * Matrix-Vector multiplication: A * v
 * For 2x2 matrix A and 2-vector v:
 * [ a  b ] [ x ]   [ ax + by ]
 * [ c  d ] [ y ] = [ cx + dy ]
 */
export function matrixVectorMultiply(A: Matrix, v: Vector): Result<Vector> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;
  const validV = validateVector(v);
  if (!validV.ok) return validV;

  const { rows, cols } = getMatrixDimensions(A);
  if (cols !== v.length) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Matrix columns (${cols}) must match vector length (${v.length}).`,
    });
  }

  const result: Vector = new Array(rows);
  for (let r = 0; r < rows; r++) {
    let sum = 0;
    for (let c = 0; c < cols; c++) {
      sum += A[r][c] * v[c];
    }
    result[r] = sum;
  }

  return ok(result);
}

/**
 * Matrix-Matrix multiplication: A * B
 */
export function matrixMultiply(A: Matrix, B: Matrix): Result<Matrix> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;
  const validB = validateMatrix(B);
  if (!validB.ok) return validB;

  const dimA = getMatrixDimensions(A);
  const dimB = getMatrixDimensions(B);

  if (dimA.cols !== dimB.rows) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Matrix multiplication inner dimension mismatch: ${dimA.rows}x${dimA.cols} * ${dimB.rows}x${dimB.cols}.`,
    });
  }

  const result: Matrix = Array.from({ length: dimA.rows }, () => new Array(dimB.cols).fill(0));
  for (let r = 0; r < dimA.rows; r++) {
    for (let c = 0; c < dimB.cols; c++) {
      let sum = 0;
      for (let k = 0; k < dimA.cols; k++) {
        sum += A[r][k] * B[k][c];
      }
      result[r][c] = sum;
    }
  }

  return ok(result);
}

/**
 * Matrix transpose: A^T
 */
export function transposeMatrix(A: Matrix): Result<Matrix> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;

  const { rows, cols } = getMatrixDimensions(A);
  const transposed: Matrix = Array.from({ length: cols }, () => new Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      transposed[c][r] = A[r][c];
    }
  }

  return ok(transposed);
}

/**
 * Determinant of a 2x2 matrix: det(A) = ad - bc
 */
export function determinant2x2(A: Matrix): Result<number> {
  const validA = validateMatrix(A);
  if (!validA.ok) return validA;

  const { rows, cols } = getMatrixDimensions(A);
  if (rows !== 2 || cols !== 2) {
    return err({
      code: "INVALID_DIMENSION",
      message: `determinant2x2 requires a 2x2 matrix, received ${rows}x${cols}.`,
    });
  }

  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];

  const det = a * d - b * c;
  return ok(det);
}

/**
 * Checks if a 2x2 matrix is singular (|det(A)| < ZERO_TOLERANCE).
 */
export function isMatrixSingular(A: Matrix, tolerance = ZERO_TOLERANCE): boolean {
  const detResult = determinant2x2(A);
  if (!detResult.ok) return true;
  return Math.abs(detResult.value) < tolerance;
}

/**
 * Checks if two matrices are element-wise equal within tolerance.
 */
export function areMatricesEqual(A: Matrix, B: Matrix, tolerance = ZERO_TOLERANCE): boolean {
  const dimA = getMatrixDimensions(A);
  const dimB = getMatrixDimensions(B);

  if (dimA.rows !== dimB.rows || dimA.cols !== dimB.cols) return false;

  for (let r = 0; r < dimA.rows; r++) {
    for (let c = 0; c < dimA.cols; c++) {
      if (Math.abs(A[r][c] - B[r][c]) >= tolerance) {
        return false;
      }
    }
  }

  return true;
}
