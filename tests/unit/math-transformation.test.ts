import { describe, it, expect } from "vitest";
import {
  interpolateMatrix2D,
  evaluateTransformation2D,
  verifyLinearity2D,
  TRANSFORMATION_PRESETS,
  STANDARD_BASIS_2D,
} from "@/features/math/transformation/transformation-2d";
import { determinant2x2 } from "@/features/math/matrix/operations";

describe("Math Layer: 2D Matrix Transformations & Invariants", () => {
  it("interpolates matrix operator correctly: A(0) = I, A(1) = A", () => {
    const A = [
      [2, 3],
      [4, 5],
    ];

    const at0 = interpolateMatrix2D(A, 0);
    expect(at0.ok).toBe(true);
    if (at0.ok) {
      expect(at0.value).toEqual([
        [1, 0],
        [0, 1],
      ]);
    }

    const at1 = interpolateMatrix2D(A, 1);
    expect(at1.ok).toBe(true);
    if (at1.ok) {
      expect(at1.value).toEqual(A);
    }

    const atHalf = interpolateMatrix2D(A, 0.5);
    expect(atHalf.ok).toBe(true);
    if (atHalf.ok) {
      expect(atHalf.value).toEqual([
        [1.5, 1.5],
        [2, 3],
      ]);
    }
  });

  it("satisfies the Column Invariant: Basis images match matrix columns at all t", () => {
    const A = [
      [2, -1],
      [3, 4],
    ];

    // Check at t = 1
    const stateAt1 = evaluateTransformation2D(A, 1);
    expect(stateAt1.ok).toBe(true);
    if (stateAt1.ok) {
      expect(stateAt1.value.basis1).toEqual([2, 3]); // Column 1
      expect(stateAt1.value.basis2).toEqual([-1, 4]); // Column 2
      expect(stateAt1.value.determinant).toBe(11); // 2*4 - (-1*3) = 11
      expect(stateAt1.value.area).toBe(11);
    }

    // Check at t = 0 (Identity)
    const stateAt0 = evaluateTransformation2D(A, 0);
    expect(stateAt0.ok).toBe(true);
    if (stateAt0.ok) {
      expect(stateAt0.value.basis1).toEqual([1, 0]);
      expect(stateAt0.value.basis2).toEqual([0, 1]);
      expect(stateAt0.value.determinant).toBe(1);
      expect(stateAt0.value.area).toBe(1);
    }
  });

  it("verifies mathematical Linearity: A(u + v) = Au + Av and A(cu) = c(Au)", () => {
    const A = [
      [2.5, -1.2],
      [0.8, 3.4],
    ];
    const u = [2, 1];
    const v = [-1, 3];
    const c = 2.5;

    const linearity = verifyLinearity2D(A, u, v, c);
    expect(linearity.isAdditive).toBe(true);
    expect(linearity.isHomogeneous).toBe(true);
    expect(linearity.Au_plus_v[0]).toBeCloseTo(linearity.Au_plus_Av[0], 5);
    expect(linearity.Au_plus_v[1]).toBeCloseTo(linearity.Au_plus_Av[1], 5);
    expect(linearity.A_cu[0]).toBeCloseTo(linearity.c_Au[0], 5);
    expect(linearity.A_cu[1]).toBeCloseTo(linearity.c_Au[1], 5);
  });

  it("transforms custom vector correctly: v -> Av", () => {
    const A = [
      [2, 1],
      [0, 1],
    ];
    const v = [1, 2];

    const state = evaluateTransformation2D(A, 1, v);
    expect(state.ok).toBe(true);
    if (state.ok) {
      expect(state.value.transformedVector).toEqual([4, 2]); // [2*1+1*2, 0*1+1*2]
    }
  });

  it("handles zero vectors and very small vectors safely", () => {
    const A = [
      [2, 0],
      [0, 3],
    ];
    const zeroVec = [0, 0];
    const stateZero = evaluateTransformation2D(A, 1, zeroVec);
    expect(stateZero.ok).toBe(true);
    if (stateZero.ok) {
      expect(stateZero.value.transformedVector).toEqual([0, 0]);
    }

    const smallVec = [1e-8, -1e-8];
    const stateSmall = evaluateTransformation2D(A, 1, smallVec);
    expect(stateSmall.ok).toBe(true);
    if (stateSmall.ok) {
      expect(stateSmall.value.transformedVector?.[0]).toBeCloseTo(2e-8, 10);
      expect(stateSmall.value.transformedVector?.[1]).toBeCloseTo(-3e-8, 10);
    }
  });

  it("handles singular matrix and zero determinant: Projection onto x-axis", () => {
    const projection = [
      [1, 0],
      [0, 0],
    ];
    const state = evaluateTransformation2D(projection, 1, [2, 5]);
    expect(state.ok).toBe(true);
    if (state.ok) {
      expect(state.value.determinant).toBe(0);
      expect(state.value.area).toBe(0);
      expect(state.value.basis1).toEqual([1, 0]);
      expect(state.value.basis2).toEqual([0, 0]);
      // (2, 5) projected onto x-axis is (2, 0)
      expect(state.value.transformedVector).toEqual([2, 0]);
    }
  });

  it("handles reflection and negative determinant accurately", () => {
    const reflectionY = [
      [-1, 0],
      [0, 1],
    ];
    const state = evaluateTransformation2D(reflectionY, 1, [3, 4]);
    expect(state.ok).toBe(true);
    if (state.ok) {
      expect(state.value.determinant).toBe(-1);
      expect(state.value.area).toBe(1); // |det| = 1
      expect(state.value.transformedVector).toEqual([-3, 4]);
    }
  });

  it("verifies all canonical presets produce valid mathematical states", () => {
    expect(TRANSFORMATION_PRESETS.length).toBeGreaterThanOrEqual(5);

    for (const preset of TRANSFORMATION_PRESETS) {
      const state = evaluateTransformation2D(preset.matrix, 1);
      expect(state.ok).toBe(true);
      if (state.ok) {
        expect(state.value.unitSquareCorners).toHaveLength(4);
        expect(Number.isFinite(state.value.determinant)).toBe(true);
        expect(state.value.area).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
