/**
 * Math Engine Types & Result Model
 * Pure TypeScript representation adhering to ADR-013.
 * Zero UI/React/Three.js dependencies.
 */

export type Vector = number[];
export type Matrix = number[][];

export type MathErrorCode =
  | "INVALID_DIMENSION"
  | "NON_SQUARE_MATRIX"
  | "SINGULAR_MATRIX"
  | "ZERO_VECTOR"
  | "NUMERICALLY_UNSTABLE"
  | "UNSUPPORTED_OPERATION"
  | "INVALID_INPUT"
  | "NOT_DIAGONALIZABLE";

export interface MathError {
  code: MathErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type Result<T, E = MathError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(error: MathError): Result<T> {
  return { ok: false, error };
}
