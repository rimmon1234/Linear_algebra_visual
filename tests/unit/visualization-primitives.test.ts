import { describe, it, expect } from "vitest";
import {
  computeVectorOrientation,
  computePlaneNormal,
  toVec3,
  computeMagnitude,
} from "@/features/visualization/model/coordinates";

describe("Visualization Model & Primitive Computations", () => {
  it("converts 2D coordinates to 3D XY-plane tuples (ADR-011)", () => {
    expect(toVec3([3, 4])).toEqual([3, 4, 0]);
    expect(toVec3([1, 2, 3])).toEqual([1, 2, 3]);
    expect(toVec3([])).toEqual([0, 0, 0]);
  });

  it("computes accurate Euclidean magnitudes", () => {
    expect(computeMagnitude([3, 4])).toBeCloseTo(5);
    expect(computeMagnitude([1, 2, 2])).toBeCloseTo(3);
    expect(computeMagnitude([0, 0, 0])).toBe(0);
  });

  it("computes orientation for standard 2D and 3D vectors", () => {
    const res2D = computeVectorOrientation([3, 4], [1, 1]);
    expect(res2D.isZero).toBe(false);
    expect(res2D.magnitude).toBeCloseTo(5);
    expect(res2D.origin).toEqual([1, 1, 0]);
    expect(res2D.head).toEqual([4, 5, 0]);
    expect(res2D.direction[0]).toBeCloseTo(3 / 5);
    expect(res2D.direction[1]).toBeCloseTo(4 / 5);
    expect(res2D.direction[2]).toBe(0);

    // Assert quaternion is a valid unit quaternion (x^2 + y^2 + z^2 + w^2 = 1)
    const [qx, qy, qz, qw] = res2D.quaternion;
    const qNorm = qx * qx + qy * qy + qz * qz + qw * qw;
    expect(qNorm).toBeCloseTo(1);
  });

  it("safely handles ZERO vector without producing NaN or Infinity (User Adjustment 10)", () => {
    const zeroRes = computeVectorOrientation([0, 0, 0]);
    expect(zeroRes.isZero).toBe(true);
    expect(zeroRes.magnitude).toBe(0);
    expect(zeroRes.shaftLength).toBe(0);
    expect(zeroRes.coneLength).toBe(0);
    expect(Number.isNaN(zeroRes.quaternion[0])).toBe(false);
    expect(Number.isNaN(zeroRes.quaternion[3])).toBe(false);
    expect(zeroRes.quaternion).toEqual([0, 0, 0, 1]);
  });

  it("safely handles near-zero vectors below tolerance threshold", () => {
    const tinyRes = computeVectorOrientation([1e-9, 1e-9, 0]);
    expect(tinyRes.isZero).toBe(true);
    expect(Number.isFinite(tinyRes.magnitude)).toBe(true);
    expect(Number.isNaN(tinyRes.quaternion[0])).toBe(false);
  });

  it("safely handles parallel and anti-parallel orientation vectors", () => {
    // Parallel to +Y (default up)
    const parallelRes = computeVectorOrientation([0, 5, 0]);
    expect(parallelRes.isZero).toBe(false);
    expect(parallelRes.quaternion).toEqual([0, 0, 0, 1]);

    // Anti-parallel to +Y (-Y direction)
    const antiParallelRes = computeVectorOrientation([0, -5, 0]);
    expect(antiParallelRes.isZero).toBe(false);
    const [ax, ay, az, aw] = antiParallelRes.quaternion;
    const antiNorm = ax * ax + ay * ay + az * az + aw * aw;
    expect(antiNorm).toBeCloseTo(1);
    expect(Number.isNaN(ax)).toBe(false);
  });

  it("computes plane normal from two independent spanning vectors (User Adjustment 1)", () => {
    const v1 = [1, 0, 0];
    const v2 = [0, 1, 0];
    const planeRes = computePlaneNormal(v1, v2);

    expect(planeRes.isCollinear).toBe(false);
    expect(planeRes.normal).toEqual([0, 0, 1]); // +Z normal
  });

  it("detects collinear/degenerate span vectors and safely falls back (User Adjustment 1)", () => {
    const v1 = [1, 2, 3];
    const v2 = [2, 4, 6]; // Collinear: v2 = 2 * v1
    const degenerateRes = computePlaneNormal(v1, v2);

    expect(degenerateRes.isCollinear).toBe(true);
    expect(degenerateRes.normal).toEqual([0, 0, 1]); // Safe fallback
  });
});
