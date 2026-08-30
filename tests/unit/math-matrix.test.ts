import { describe, it, expect } from "vitest";
import {
  createMatrix2x2,
  identityMatrix2x2,
  identityMatrix,
  matrixAdd,
  matrixScale,
  matrixVectorMultiply,
  matrixMultiply,
  transposeMatrix,
  determinant2x2,
  isMatrixSingular,
  getMatrixColumn,
  validateMatrix,
  areMatricesEqual,
} from "@/features/math/matrix/operations";

describe("Math Layer: Matrix Operations", () => {
  it("creates and validates 2x2 and generic matrices", () => {
    const A = createMatrix2x2(1, 2, 3, 4);
    expect(A).toEqual([
      [1, 2],
      [3, 4],
    ]);

    const valid = validateMatrix(A);
    expect(valid.ok).toBe(true);

    const I2 = identityMatrix2x2();
    expect(I2).toEqual([
      [1, 0],
      [0, 1],
    ]);

    const I3 = identityMatrix(3);
    expect(I3.ok).toBe(true);
    if (I3.ok) {
      expect(I3.value).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    }
  });

  it("extracts matrix columns as vectors", () => {
    const A = [
      [2, 5],
      [3, 7],
    ];
    const col0 = getMatrixColumn(A, 0);
    const col1 = getMatrixColumn(A, 1);

    expect(col0.ok).toBe(true);
    if (col0.ok) expect(col0.value).toEqual([2, 3]);

    expect(col1.ok).toBe(true);
    if (col1.ok) expect(col1.value).toEqual([5, 7]);

    const outOfBounds = getMatrixColumn(A, 2);
    expect(outOfBounds.ok).toBe(false);
  });

  it("performs matrix-vector multiplication correctly: A * v", () => {
    const A = [
      [2, 1],
      [0, 3],
    ];
    const v = [4, 5];
    const res = matrixVectorMultiply(A, v);

    expect(res.ok).toBe(true);
    if (res.ok) {
      // 2*4 + 1*5 = 13, 0*4 + 3*5 = 15
      expect(res.value).toEqual([13, 15]);
    }
  });

  it("satisfies the Column Invariant: A * e1 = col1(A), A * e2 = col2(A)", () => {
    const A = [
      [3.5, -2.1],
      [4.8, 1.9],
    ];
    const e1 = [1, 0];
    const e2 = [0, 1];

    const Ae1 = matrixVectorMultiply(A, e1);
    const Ae2 = matrixVectorMultiply(A, e2);
    const col1 = getMatrixColumn(A, 0);
    const col2 = getMatrixColumn(A, 1);

    expect(Ae1.ok).toBe(true);
    expect(col1.ok).toBe(true);
    if (Ae1.ok && col1.ok) {
      expect(Ae1.value).toEqual(col1.value);
      expect(Ae1.value).toEqual([3.5, 4.8]);
    }

    expect(Ae2.ok).toBe(true);
    expect(col2.ok).toBe(true);
    if (Ae2.ok && col2.ok) {
      expect(Ae2.value).toEqual(col2.value);
      expect(Ae2.value).toEqual([-2.1, 1.9]);
    }
  });

  it("performs matrix multiplication: A * B", () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [2, 0],
      [1, 2],
    ];
    const res = matrixMultiply(A, B);

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toEqual([
        [4, 4],
        [10, 8],
      ]);
    }
  });

  it("computes 2x2 determinants and detects singular matrices", () => {
    const invertible = [
      [4, 2],
      [1, 3],
    ];
    const det1 = determinant2x2(invertible);
    expect(det1.ok).toBe(true);
    if (det1.ok) {
      expect(det1.value).toBe(10); // 4*3 - 2*1 = 10
    }
    expect(isMatrixSingular(invertible)).toBe(false);

    const singular = [
      [2, 4],
      [1, 2],
    ];
    const det2 = determinant2x2(singular);
    expect(det2.ok).toBe(true);
    if (det2.ok) {
      expect(det2.value).toBe(0); // 2*2 - 4*1 = 0
    }
    expect(isMatrixSingular(singular)).toBe(true);

    const negativeDet = [
      [-1, 0],
      [0, 1],
    ];
    const det3 = determinant2x2(negativeDet);
    expect(det3.ok).toBe(true);
    if (det3.ok) {
      expect(det3.value).toBe(-1);
    }
  });

  it("transposes matrices correctly", () => {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const At = transposeMatrix(A);
    expect(At.ok).toBe(true);
    if (At.ok) {
      expect(At.value).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
    }
  });

  it("rejects non-finite and malformed matrices safely", () => {
    const malformed = [
      [1, 2],
      [3],
    ];
    const res1 = validateMatrix(malformed);
    expect(res1.ok).toBe(false);

    const nonFinite = [
      [1, Infinity],
      [0, 1],
    ];
    const res2 = validateMatrix(nonFinite);
    expect(res2.ok).toBe(false);
  });
});
