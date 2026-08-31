import { describe, it, expect } from "vitest";
import {
  computeCharacteristicPolynomial2D,
  evaluateCharacteristicPolynomial,
} from "@/features/math/eigen/characteristic-equation";

describe("Mathematics Layer: Characteristic Polynomial & Equation Engine", () => {
  it("computes characteristic polynomial for 2x2 Identity Matrix", () => {
    const A = [
      [1, 0],
      [0, 1],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(2);
    expect(data.determinant).toBe(1);
    expect(data.discriminant).toBe(0); // 2^2 - 4(1) = 0
    expect(data.coefficients).toEqual({ c2: 1, c1: -2, c0: 1 });

    expect(data.eigenvalues.type).toBe("repeated-real");
    if (data.eigenvalues.type === "repeated-real") {
      expect(data.eigenvalues.root).toBe(1);
      expect(data.eigenvalues.multiplicity).toBe(2);
    }

    expect(evaluateCharacteristicPolynomial(data, 1)).toBe(0);
    expect(data.symbolic.characteristicPolynomial).toContain("\\lambda^2 - 2\\lambda + 1");
  });

  it("computes distinct real eigenvalues for diagonal matrix A = [[2, 0], [0, 3]]", () => {
    const A = [
      [2, 0],
      [0, 3],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(5);
    expect(data.determinant).toBe(6);
    expect(data.discriminant).toBe(1); // 25 - 24 = 1

    expect(data.eigenvalues.type).toBe("distinct-real");
    if (data.eigenvalues.type === "distinct-real") {
      expect(data.eigenvalues.roots[0]).toBe(3);
      expect(data.eigenvalues.roots[1]).toBe(2);
    }

    expect(evaluateCharacteristicPolynomial(data, 3)).toBe(0);
    expect(evaluateCharacteristicPolynomial(data, 2)).toBe(0);
  });

  it("computes distinct real eigenvalues for symmetric matrix A = [[2, 1], [1, 2]]", () => {
    const A = [
      [2, 1],
      [1, 2],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(4);
    expect(data.determinant).toBe(3);
    expect(data.discriminant).toBe(4); // 16 - 12 = 4

    expect(data.eigenvalues.type).toBe("distinct-real");
    if (data.eigenvalues.type === "distinct-real") {
      expect(data.eigenvalues.roots[0]).toBe(3);
      expect(data.eigenvalues.roots[1]).toBe(1);
    }

    expect(evaluateCharacteristicPolynomial(data, 3)).toBe(0);
    expect(evaluateCharacteristicPolynomial(data, 1)).toBe(0);
  });

  it("computes complex-conjugate eigenvalues for 90° rotation matrix A = [[0, -1], [1, 0]]", () => {
    const A = [
      [0, -1],
      [1, 0],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(0);
    expect(data.determinant).toBe(1);
    expect(data.discriminant).toBe(-4); // 0 - 4 = -4 (Δ < 0)

    expect(data.eigenvalues.type).toBe("complex-conjugate");
    if (data.eigenvalues.type === "complex-conjugate") {
      const [r1, r2] = data.eigenvalues.roots;
      expect(r1.real).toBe(0);
      expect(r1.imag).toBe(1); // +i
      expect(r2.real).toBe(0);
      expect(r2.imag).toBe(-1); // -i
    }

    // Parabola is strictly above zero for real numbers: p(0) = 1 > 0
    expect(evaluateCharacteristicPolynomial(data, 0)).toBe(1);
    expect(evaluateCharacteristicPolynomial(data, 2)).toBe(5);
  });

  it("computes singular matrix with zero eigenvalue: A = [[1, 2], [2, 4]]", () => {
    const A = [
      [1, 2],
      [2, 4],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(5);
    expect(data.determinant).toBe(0); // Singular matrix: det = 0
    expect(data.discriminant).toBe(25); // 25 - 0 = 25

    expect(data.eigenvalues.type).toBe("distinct-real");
    if (data.eigenvalues.type === "distinct-real") {
      expect(data.eigenvalues.roots[0]).toBe(5);
      expect(data.eigenvalues.roots[1]).toBe(0); // Must include zero eigenvalue
    }

    expect(evaluateCharacteristicPolynomial(data, 5)).toBe(0);
    expect(evaluateCharacteristicPolynomial(data, 0)).toBe(0);
  });

  it("GOLDEN TEST CASE (Correction 9): Non-special arbitrary 2x2 matrix A = [[1, 2], [3, 4]]", () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(5);
    expect(data.determinant).toBe(-2); // 1*4 - 2*3 = -2
    expect(data.discriminant).toBe(33); // 25 - 4(-2) = 33

    expect(data.eigenvalues.type).toBe("distinct-real");
    if (data.eigenvalues.type === "distinct-real") {
      const [r1, r2] = data.eigenvalues.roots;
      const expectedR1 = (5 + Math.sqrt(33)) / 2;
      const expectedR2 = (5 - Math.sqrt(33)) / 2;
      expect(Math.abs(r1 - expectedR1)).toBeLessThan(1e-7);
      expect(Math.abs(r2 - expectedR2)).toBeLessThan(1e-7);
    }

    // Verify p(λ) = 0 at the roots
    if (data.eigenvalues.type === "distinct-real") {
      expect(Math.abs(evaluateCharacteristicPolynomial(data, data.eigenvalues.roots[0]))).toBeLessThan(1e-7);
      expect(Math.abs(evaluateCharacteristicPolynomial(data, data.eigenvalues.roots[1]))).toBeLessThan(1e-7);
    }
  });

  it("handles zero matrix safely without NaN or Infinity", () => {
    const A = [
      [0, 0],
      [0, 0],
    ];
    const res = computeCharacteristicPolynomial2D(A);

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const data = res.value;
    expect(data.trace).toBe(0);
    expect(data.determinant).toBe(0);
    expect(data.discriminant).toBe(0);
    expect(data.eigenvalues.type).toBe("repeated-real");
    if (data.eigenvalues.type === "repeated-real") {
      expect(data.eigenvalues.root).toBe(0);
    }
  });

  it("rejects non-square or invalid matrix dimensions", () => {
    const nonSquare = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const res = computeCharacteristicPolynomial2D(nonSquare);
    expect(res.ok).toBe(false);
  });
});
