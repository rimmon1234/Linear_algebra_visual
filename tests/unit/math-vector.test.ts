import { describe, it, expect } from "vitest";
import {
  vectorAdd,
  vectorSub,
  vectorScale,
  dotProduct,
  vectorNorm,
  normalizeVector,
  isZeroVector,
  areVectorsEqual,
  vectorAngle2D,
  validateVector,
} from "@/features/math/vector/operations";

describe("Math Layer: Vector Operations", () => {
  it("adds vectors correctly", () => {
    const res = vectorAdd([1, 2], [3, 4]);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toEqual([4, 6]);
    }
  });

  it("handles dimension mismatch gracefully in addition and subtraction", () => {
    const addRes = vectorAdd([1, 2], [3, 4, 5]);
    expect(addRes.ok).toBe(false);
    if (!addRes.ok) {
      expect(addRes.error.code).toBe("INVALID_DIMENSION");
    }

    const subRes = vectorSub([1, 2, 3], [4, 5]);
    expect(subRes.ok).toBe(false);
    if (!subRes.ok) {
      expect(subRes.error.code).toBe("INVALID_DIMENSION");
    }
  });

  it("scales vector by scalar", () => {
    const res = vectorScale([2, -3], 2.5);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toEqual([5, -7.5]);
    }
  });

  it("computes dot product and detects orthogonality", () => {
    const orthogonal = dotProduct([1, 0], [0, 1]);
    expect(orthogonal.ok).toBe(true);
    if (orthogonal.ok) {
      expect(orthogonal.value).toBe(0);
    }

    const general = dotProduct([2, 3], [4, 5]);
    expect(general.ok).toBe(true);
    if (general.ok) {
      expect(general.value).toBe(23);
    }
  });

  it("computes vector norm and normalizes non-zero vectors", () => {
    expect(vectorNorm([3, 4])).toBe(5);
    expect(vectorNorm([0, 0])).toBe(0);

    const normalized = normalizeVector([3, 4]);
    expect(normalized.ok).toBe(true);
    if (normalized.ok) {
      expect(normalized.value[0]).toBeCloseTo(0.6, 6);
      expect(normalized.value[1]).toBeCloseTo(0.8, 6);
      expect(vectorNorm(normalized.value)).toBeCloseTo(1, 6);
    }
  });

  it("rejects normalization of zero vector safely", () => {
    const res = normalizeVector([0, 0]);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("ZERO_VECTOR");
    }
  });

  it("identifies zero vectors and near-zero vectors", () => {
    expect(isZeroVector([0, 0])).toBe(true);
    expect(isZeroVector([1e-9, -1e-8])).toBe(true);
    expect(isZeroVector([0.1, 0])).toBe(false);
  });

  it("computes 2D vector angles correctly", () => {
    const angle90 = vectorAngle2D([1, 0], [0, 1]);
    expect(angle90.ok).toBe(true);
    if (angle90.ok) {
      expect(angle90.value).toBeCloseTo(Math.PI / 2, 5);
    }

    const angleParallel = vectorAngle2D([2, 0], [5, 0]);
    expect(angleParallel.ok).toBe(true);
    if (angleParallel.ok) {
      expect(angleParallel.value).toBeCloseTo(0, 5);
    }
  });

  it("rejects non-finite inputs", () => {
    const res = validateVector([1, NaN, 3]);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("INVALID_INPUT");
    }
  });
});
