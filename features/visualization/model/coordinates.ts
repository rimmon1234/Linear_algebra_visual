import * as THREE from "three";

export type Vector3Tuple = [number, number, number];
export type Vector2Tuple = [number, number];

export const ZERO_VECTOR_TOLERANCE = 1e-7;

/**
 * Converts any 2D or 3D coordinate array to a canonical 3D tuple [x, y, z].
 * Adheres to ADR-011: 2D maps directly to XY plane (z = 0).
 */
export function toVec3(coord?: number[]): Vector3Tuple {
  if (!coord || coord.length === 0) return [0, 0, 0];
  if (coord.length === 1) return [coord[0] ?? 0, 0, 0];
  if (coord.length === 2) return [coord[0] ?? 0, coord[1] ?? 0, 0];
  return [coord[0] ?? 0, coord[1] ?? 0, coord[2] ?? 0];
}

/**
 * Calculates Euclidean magnitude (L2 norm) of a 2D or 3D coordinate.
 */
export function computeMagnitude(coord: number[]): number {
  const [x, y, z] = toVec3(coord);
  return Math.sqrt(x * x + y * y + z * z);
}

export interface VectorOrientation {
  isZero: boolean;
  magnitude: number;
  origin: Vector3Tuple;
  head: Vector3Tuple;
  direction: Vector3Tuple;
  quaternion: [number, number, number, number];
  shaftLength: number;
  shaftRadius: number;
  coneLength: number;
  coneRadius: number;
}

/**
 * Computes safe vector geometric orientation and quaternion.
 * GUARANTEE: Never produces NaN, Infinity, or invalid rotation quaternions.
 * Handles zero vectors, near-zero vectors, parallel, and anti-parallel vectors safely.
 */
export function computeVectorOrientation(
  val: number[],
  originCoord?: number[],
  options?: {
    headLengthRatio?: number;
    maxConeLength?: number;
    shaftRadius?: number;
    coneRadiusRatio?: number;
  }
): VectorOrientation {
  const origin = toVec3(originCoord);
  const [vx, vy, vz] = toVec3(val);
  const head: Vector3Tuple = [origin[0] + vx, origin[1] + vy, origin[2] + vz];

  const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);
  const isZero = magnitude < ZERO_VECTOR_TOLERANCE;

  if (isZero) {
    return {
      isZero: true,
      magnitude: 0,
      origin,
      head,
      direction: [0, 1, 0],
      quaternion: [0, 0, 0, 1], // Identity
      shaftLength: 0,
      shaftRadius: 0,
      coneLength: 0,
      coneRadius: 0,
    };
  }

  const dirX = vx / magnitude;
  const dirY = vy / magnitude;
  const dirZ = vz / magnitude;
  const direction: Vector3Tuple = [dirX, dirY, dirZ];

  // Compute arrowhead and shaft proportions
  const headLengthRatio = options?.headLengthRatio ?? 0.25;
  const maxConeLength = options?.maxConeLength ?? 0.4;
  const coneLength = Math.min(magnitude * headLengthRatio, maxConeLength);
  const shaftLength = Math.max(0, magnitude - coneLength);
  const shaftRadius = options?.shaftRadius ?? 0.035;
  const coneRadius = coneLength * (options?.coneRadiusRatio ?? 0.4);

  // Compute rotation quaternion from default Three.js cylinder/cone axis (0, 1, 0)
  const defaultUp = new THREE.Vector3(0, 1, 0);
  const targetDir = new THREE.Vector3(dirX, dirY, dirZ);
  const q = new THREE.Quaternion().setFromUnitVectors(defaultUp, targetDir);

  return {
    isZero: false,
    magnitude,
    origin,
    head,
    direction,
    quaternion: [q.x, q.y, q.z, q.w],
    shaftLength,
    shaftRadius,
    coneLength,
    coneRadius,
  };
}

/**
 * Computes normal vector from two spanning vectors [v1, v2].
 * Returns null if vectors are collinear or degenerate (magnitude < tolerance).
 */
export function computePlaneNormal(
  v1Coord: number[],
  v2Coord: number[]
): { normal: Vector3Tuple; isCollinear: boolean } {
  const [x1, y1, z1] = toVec3(v1Coord);
  const [x2, y2, z2] = toVec3(v2Coord);

  // Cross product v1 x v2
  const cx = y1 * z2 - z1 * y2;
  const cy = z1 * x2 - x1 * z2;
  const cz = x1 * y2 - y1 * x2;
  const crossMag = Math.sqrt(cx * cx + cy * cy + cz * cz);

  if (crossMag < ZERO_VECTOR_TOLERANCE) {
    // Collinear or zero vectors cannot span a 2D plane
    return {
      normal: [0, 0, 1], // Safe default XY plane fallback
      isCollinear: true,
    };
  }

  return {
    normal: [cx / crossMag, cy / crossMag, cz / crossMag],
    isCollinear: false,
  };
}
