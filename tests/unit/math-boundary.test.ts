import { describe, it, expect } from "vitest";
import { ok, err, type Result, type MathError } from "@/features/math/types";
import {
  NUMERICAL_TOLERANCES,
  ZERO_TOLERANCE,
  ORTHOGONALITY_TOLERANCE,
  RANK_TOLERANCE,
  SINGULAR_VALUE_TOLERANCE,
} from "@/features/math/constants";

describe("Math Layer Boundary & Numerical Policy Integrity", () => {
  it("verifies the Result discriminated union contract (ADR-013)", () => {
    const successResult: Result<number> = ok(42);
    expect(successResult.ok).toBe(true);
    if (successResult.ok) {
      expect(successResult.value).toBe(42);
    }

    const failureError: MathError = {
      code: "SINGULAR_MATRIX",
      message: "Matrix determinant is below numerical zero tolerance.",
    };
    const failureResult: Result<number> = err(failureError);
    expect(failureResult.ok).toBe(false);
    if (!failureResult.ok) {
      expect(failureResult.error.code).toBe("SINGULAR_MATRIX");
      expect(failureResult.error.message).toContain("zero tolerance");
    }
  });

  it("verifies numerical tolerances adhere strictly to NUMERICAL_POLICY.md (ADR-009)", () => {
    // Assert against the canonical expectations defined in NUMERICAL_POLICY.md
    expect(NUMERICAL_TOLERANCES.ZERO_TOLERANCE).toBe(1e-7);
    expect(NUMERICAL_TOLERANCES.ORTHOGONALITY_TOLERANCE).toBe(1e-6);
    expect(NUMERICAL_TOLERANCES.RANK_TOLERANCE).toBe(1e-6);
    expect(NUMERICAL_TOLERANCES.SINGULAR_VALUE_TOLERANCE).toBe(1e-6);

    // Direct exports match the centralized object
    expect(ZERO_TOLERANCE).toBe(NUMERICAL_TOLERANCES.ZERO_TOLERANCE);
    expect(ORTHOGONALITY_TOLERANCE).toBe(NUMERICAL_TOLERANCES.ORTHOGONALITY_TOLERANCE);
    expect(RANK_TOLERANCE).toBe(NUMERICAL_TOLERANCES.RANK_TOLERANCE);
    expect(SINGULAR_VALUE_TOLERANCE).toBe(NUMERICAL_TOLERANCES.SINGULAR_VALUE_TOLERANCE);
  });
});
