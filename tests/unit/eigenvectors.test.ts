import { describe, it, expect } from "vitest";
import {
  computeEigensystem2D,
  computeEigensystem3D,
  computeEigensystem,
  isEigenvector,
  verifyEigenpair,
} from "@/features/math/eigen/eigenvectors";
import { ZERO_TOLERANCE } from "@/features/math/constants";

describe("Math Engine: Eigenvectors & Eigensystems", () => {
  describe("Golden Cases (2D & 3D)", () => {
    it("Case 1: Symmetric Coupled Matrix A = [[2, 1], [1, 2]]", () => {
      const A = [
        [2, 1],
        [1, 2],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { eigenpairs, isDefective, isFullyReal } = res.value;
      expect(isFullyReal).toBe(true);
      expect(isDefective).toBe(false);
      expect(eigenpairs).toHaveLength(2);

      // Eigenvalue 3 (am=1, gm=1)
      const pair3 = eigenpairs.find((p) => Math.abs(p.eigenvalue - 3) < ZERO_TOLERANCE);
      expect(pair3).toBeDefined();
      expect(pair3?.algebraicMultiplicity).toBe(1);
      expect(pair3?.geometricMultiplicity).toBe(1);
      expect(pair3?.eigenspaceBasis).toHaveLength(1);

      // Eigenvalue 1 (am=1, gm=1)
      const pair1 = eigenpairs.find((p) => Math.abs(p.eigenvalue - 1) < ZERO_TOLERANCE);
      expect(pair1).toBeDefined();
      expect(pair1?.algebraicMultiplicity).toBe(1);
      expect(pair1?.geometricMultiplicity).toBe(1);
      expect(pair1?.eigenspaceBasis).toHaveLength(1);

      // Verify orthogonality of eigenvectors for real symmetric matrix
      const v1 = pair3!.eigenspaceBasis[0];
      const v2 = pair1!.eigenspaceBasis[0];
      const dot = v1[0] * v2[0] + v1[1] * v2[1];
      expect(Math.abs(dot)).toBeLessThan(ZERO_TOLERANCE);

      // Verify Av = λv
      expect(verifyEigenpair(A, 3, v1)).toBe(true);
      expect(verifyEigenpair(A, 1, v2)).toBe(true);
    });

    it("Case 2: Diagonal Matrix A = [[2, 0], [0, 3]]", () => {
      const A = [
        [2, 0],
        [0, 3],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { eigenpairs, isDefective } = res.value;
      expect(isDefective).toBe(false);
      expect(eigenpairs).toHaveLength(2);

      const pair3 = eigenpairs.find((p) => Math.abs(p.eigenvalue - 3) < ZERO_TOLERANCE);
      const pair2 = eigenpairs.find((p) => Math.abs(p.eigenvalue - 2) < ZERO_TOLERANCE);

      expect(pair3?.geometricMultiplicity).toBe(1);
      expect(pair2?.geometricMultiplicity).toBe(1);

      // Basis lies on coordinate axes
      expect(Math.abs(pair3!.eigenspaceBasis[0][0])).toBeLessThan(ZERO_TOLERANCE); // y-axis
      expect(Math.abs(pair2!.eigenspaceBasis[0][1])).toBeLessThan(ZERO_TOLERANCE); // x-axis
    });

    it("Case 3: Uniform Scaling A = 2I = [[2, 0], [0, 2]]", () => {
      const A = [
        [2, 0],
        [0, 2],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { distinctRealEigenvalues, eigenpairs, allVectorsAreEigenvectors, isDefective } = res.value;
      expect(isDefective).toBe(false);
      expect(allVectorsAreEigenvectors).toBe(true);
      expect(distinctRealEigenvalues).toHaveLength(1);
      expect(distinctRealEigenvalues[0].value).toBe(2);
      expect(distinctRealEigenvalues[0].algebraicMultiplicity).toBe(2);
      expect(distinctRealEigenvalues[0].geometricMultiplicity).toBe(2);

      // Full plane eigenspace spanned by 2 basis vectors
      expect(eigenpairs[0].eigenspaceBasis).toHaveLength(2);

      // Verify that ANY random non-zero vector in R2 is an eigenvector of 2I
      const testVec = [3.7, -5.2];
      const check = isEigenvector(A, testVec);
      expect(check.isEigen).toBe(true);
      expect(check.lambda).toBeCloseTo(2, 5);
      expect(check.isSameLine).toBe(true);
    });

    it("Case 4: Shear Matrix (Defective) A = [[1, 1.5], [0, 1]]", () => {
      const A = [
        [1, 1.5],
        [0, 1],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { distinctRealEigenvalues, eigenpairs, isDefective } = res.value;
      expect(isDefective).toBe(true); // am = 2 > gm = 1
      expect(distinctRealEigenvalues).toHaveLength(1);
      expect(distinctRealEigenvalues[0].value).toBe(1);
      expect(distinctRealEigenvalues[0].algebraicMultiplicity).toBe(2);
      expect(distinctRealEigenvalues[0].geometricMultiplicity).toBe(1);
      expect(eigenpairs[0].eigenspaceBasis).toHaveLength(1);
    });

    it("Case 5: Singular Matrix A = [[1, 2], [2, 4]]", () => {
      const A = [
        [1, 2],
        [2, 4],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { eigenpairs } = res.value;
      const zeroPair = eigenpairs.find((p) => Math.abs(p.eigenvalue) < ZERO_TOLERANCE);
      expect(zeroPair).toBeDefined();
      expect(zeroPair?.eigenvalue).toBe(0);

      // λ = 0 eigenvector lies in the kernel (nullspace): Av = 0
      const nullVector = zeroPair!.eigenspaceBasis[0];
      const Av = [
        A[0][0] * nullVector[0] + A[0][1] * nullVector[1],
        A[1][0] * nullVector[0] + A[1][1] * nullVector[1],
      ];
      expect(Math.hypot(...Av)).toBeLessThan(ZERO_TOLERANCE);
    });

    it("Case 6: 90° Rotation Matrix (Complex Conjugate Roots) A = [[0, -1], [1, 0]]", () => {
      const A = [
        [0, -1],
        [1, 0],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { isFullyReal, eigenpairs, complexPairs } = res.value;
      expect(isFullyReal).toBe(false);
      expect(eigenpairs).toHaveLength(0); // Zero real eigenvectors in R²
      expect(complexPairs).toHaveLength(2);
      expect(complexPairs![0].message).toContain("No real eigenvectors exist for this transformation in ℝ²");
    });

    it("Case 7: Generic Real Upper Triangular A = [[1, 2], [0, 3]]", () => {
      const A = [
        [1, 2],
        [0, 3],
      ];
      const res = computeEigensystem2D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { eigenpairs, isDefective } = res.value;
      expect(isDefective).toBe(false);
      expect(eigenpairs).toHaveLength(2);
      expect(verifyEigenpair(A, 3, eigenpairs.find((p) => p.eigenvalue === 3)!.eigenspaceBasis[0])).toBe(true);
      expect(verifyEigenpair(A, 1, eigenpairs.find((p) => p.eigenvalue === 1)!.eigenspaceBasis[0])).toBe(true);
    });

    it("Case 8 (3D): 3x3 Diagonal Matrix A = diag(2, 3, 1)", () => {
      const A = [
        [2, 0, 0],
        [0, 3, 0],
        [0, 0, 1],
      ];
      const res = computeEigensystem3D(A);
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const { distinctRealEigenvalues, eigenpairs, isDefective } = res.value;
      expect(isDefective).toBe(false);
      expect(distinctRealEigenvalues).toHaveLength(3);
      expect(eigenpairs).toHaveLength(3);

      const e1Pair = eigenpairs.find((p) => p.eigenvalue === 2);
      const e2Pair = eigenpairs.find((p) => p.eigenvalue === 3);
      const e3Pair = eigenpairs.find((p) => p.eigenvalue === 1);

      expect(e1Pair?.eigenspaceBasis[0]).toEqual([1, 0, 0]);
      expect(e2Pair?.eigenspaceBasis[0]).toEqual([0, 1, 0]);
      expect(e3Pair?.eigenspaceBasis[0]).toEqual([0, 0, 1]);
    });
  });

  describe("Eigenvector Testing & Invariant Line Recognition", () => {
    it("recognizes positive eigenvalue invariant line (angle ≈ 0°)", () => {
      const A = [
        [3, 0],
        [0, 1],
      ];
      const v = [2, 0]; // on x-axis, λ = 3
      const check = isEigenvector(A, v);
      expect(check.isEigen).toBe(true);
      expect(check.lambda).toBeCloseTo(3, 5);
      expect(check.angleDegrees).toBeCloseTo(0, 3);
      expect(check.isSameLine).toBe(true);
    });

    it("recognizes negative eigenvalue invariant line (angle ≈ 180°)", () => {
      const A = [
        [-2, 0],
        [0, 1],
      ];
      const v = [1.5, 0]; // on x-axis, λ = -2
      const check = isEigenvector(A, v);
      expect(check.isEigen).toBe(true);
      expect(check.lambda).toBeCloseTo(-2, 5);
      expect(check.angleDegrees).toBeCloseTo(180, 3);
      expect(check.isSameLine).toBe(true);
    });

    it("identifies ordinary vectors that rotate away from their original line", () => {
      const A = [
        [2, 1],
        [1, 2],
      ];
      const vOrdinary = [1, 0]; // Not an eigenvector of [[2,1],[1,2]]
      const check = isEigenvector(A, vOrdinary);
      expect(check.isEigen).toBe(false);
      expect(check.isSameLine).toBe(false);
      expect(check.angleDegrees).toBeGreaterThan(5); // Rotates away
    });

    it("strictly rejects the zero vector as an eigenvector", () => {
      const A = [
        [2, 0],
        [0, 3],
      ];
      const zeroV = [0, 0];
      const check = isEigenvector(A, zeroV);
      expect(check.isEigen).toBe(false);
      expect(check.message).toContain("zero vector is NEVER an eigenvector");
    });

    it("confirms that arbitrary scalar multiples c * v are also valid eigenvectors", () => {
      const A = [
        [2, 1],
        [1, 2],
      ];
      const vBase = [1, 1]; // eigenvector for λ = 3
      const scalars = [0.1, -4.5, 10, -0.05];

      for (const c of scalars) {
        const scaledV = [vBase[0] * c, vBase[1] * c];
        const check = isEigenvector(A, scaledV);
        expect(check.isEigen).toBe(true);
        expect(check.lambda).toBeCloseTo(3, 5);
        expect(check.isSameLine).toBe(true);
      }
    });

    it("correctly evaluates the λ = 0 collapse to origin case for singular matrices", () => {
      const A = [
        [1, 2],
        [2, 4],
      ];
      const eigensys = computeEigensystem2D(A);
      expect(eigensys.ok).toBe(true);
      if (!eigensys.ok) return;

      const pair0 = eigensys.value.eigenpairs.find((p) => Math.abs(p.eigenvalue) < ZERO_TOLERANCE);
      expect(pair0).toBeDefined();
      expect(pair0?.eigenvalue).toBe(0);

      // Verify that the basis vector in E_0 yields Av = [0, 0]
      const vNull = pair0!.eigenspaceBasis[0];
      const check = isEigenvector(A, vNull);
      expect(check.isEigen).toBe(true);
      expect(check.lambda).toBe(0);
      expect(check.isSameLine).toBe(true);
      expect(check.residual).toBeLessThan(ZERO_TOLERANCE);

      // Verify direct integer coordinates v = [-2, 1]
      const vInt = [-2, 1];
      const checkInt = isEigenvector(A, vInt);
      expect(checkInt.isEigen).toBe(true);
      expect(checkInt.lambda).toBe(0);
      expect(checkInt.isSameLine).toBe(true);
    });

    it("computes unified eigensystem across dimensions", () => {
      const A2 = [
        [1, 0],
        [0, 1],
      ];
      const res2 = computeEigensystem(A2);
      expect(res2.ok).toBe(true);
      expect(res2.ok && res2.value.dimension).toBe(2);

      const A3 = [
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ];
      const res3 = computeEigensystem(A3);
      expect(res3.ok).toBe(true);
      expect(res3.ok && res3.value.dimension).toBe(3);
    });
  });
});
