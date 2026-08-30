/**
 * Vector Operations (Mathematics Layer)
 * Pure TypeScript, zero React/Three.js dependencies.
 * Tolerances derived strictly from NUMERICAL_POLICY.md.
 */

import { Vector, Result, ok, err } from "../types";
import { ZERO_TOLERANCE } from "../constants";

/**
 * Validates that all elements in a vector are finite numbers.
 */
export function validateVector(v: Vector): Result<Vector> {
  if (!Array.isArray(v) || v.length === 0) {
    return err({
      code: "INVALID_DIMENSION",
      message: "Vector must be a non-empty array of numbers.",
    });
  }

  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== "number" || !Number.isFinite(v[i])) {
      return err({
        code: "INVALID_INPUT",
        message: `Vector element at index ${i} is not a finite number: ${v[i]}`,
      });
    }
  }

  return ok(v);
}

/**
 * Vector addition: u + v
 */
export function vectorAdd(u: Vector, v: Vector): Result<Vector> {
  const uValid = validateVector(u);
  if (!uValid.ok) return uValid;
  const vValid = validateVector(v);
  if (!vValid.ok) return vValid;

  if (u.length !== v.length) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Vector dimension mismatch: ${u.length} vs ${v.length}.`,
    });
  }

  return ok(u.map((val, i) => val + v[i]));
}

/**
 * Vector subtraction: u - v
 */
export function vectorSub(u: Vector, v: Vector): Result<Vector> {
  const uValid = validateVector(u);
  if (!uValid.ok) return uValid;
  const vValid = validateVector(v);
  if (!vValid.ok) return vValid;

  if (u.length !== v.length) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Vector dimension mismatch: ${u.length} vs ${v.length}.`,
    });
  }

  return ok(u.map((val, i) => val - v[i]));
}

/**
 * Scalar multiplication: c * v
 */
export function vectorScale(v: Vector, scalar: number): Result<Vector> {
  const vValid = validateVector(v);
  if (!vValid.ok) return vValid;

  if (typeof scalar !== "number" || !Number.isFinite(scalar)) {
    return err({
      code: "INVALID_INPUT",
      message: `Scalar must be a finite number: ${scalar}`,
    });
  }

  return ok(v.map((val) => val * scalar));
}

/**
 * Dot product: u · v
 */
export function dotProduct(u: Vector, v: Vector): Result<number> {
  const uValid = validateVector(u);
  if (!uValid.ok) return uValid;
  const vValid = validateVector(v);
  if (!vValid.ok) return vValid;

  if (u.length !== v.length) {
    return err({
      code: "INVALID_DIMENSION",
      message: `Vector dimension mismatch: ${u.length} vs ${v.length}.`,
    });
  }

  const dot = u.reduce((acc, val, i) => acc + val * v[i], 0);
  return ok(dot);
}

/**
 * Euclidean Norm (L2): ||v||
 */
export function vectorNorm(v: Vector): number {
  const valid = validateVector(v);
  if (!valid.ok) return 0;
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Vector normalization: v / ||v||
 */
export function normalizeVector(v: Vector, tolerance = ZERO_TOLERANCE): Result<Vector> {
  const vValid = validateVector(v);
  if (!vValid.ok) return vValid;

  const norm = vectorNorm(v);
  if (norm < tolerance) {
    return err({
      code: "ZERO_VECTOR",
      message: "Cannot normalize a vector with zero or near-zero norm.",
    });
  }

  return ok(v.map((val) => val / norm));
}

/**
 * Checks if a vector is within tolerance of the zero vector.
 */
export function isZeroVector(v: Vector, tolerance = ZERO_TOLERANCE): boolean {
  const valid = validateVector(v);
  if (!valid.ok) return false;
  return v.every((val) => Math.abs(val) < tolerance);
}

/**
 * Checks if two vectors are equal within numerical tolerance.
 */
export function areVectorsEqual(u: Vector, v: Vector, tolerance = ZERO_TOLERANCE): boolean {
  if (u.length !== v.length) return false;
  return u.every((val, i) => Math.abs(val - v[i]) < tolerance);
}

/**
 * Computes angle in radians between two 2D vectors.
 */
export function vectorAngle2D(u: Vector, v: Vector, tolerance = ZERO_TOLERANCE): Result<number> {
  if (u.length !== 2 || v.length !== 2) {
    return err({
      code: "INVALID_DIMENSION",
      message: "Angle calculation requires 2D vectors.",
    });
  }

  const normU = vectorNorm(u);
  const normV = vectorNorm(v);

  if (normU < tolerance || normV < tolerance) {
    return err({
      code: "ZERO_VECTOR",
      message: "Cannot calculate angle with zero vector.",
    });
  }

  const dot = u[0] * v[0] + u[1] * v[1];
  const cosTheta = Math.max(-1, Math.min(1, dot / (normU * normV)));
  return ok(Math.acos(cosTheta));
}
