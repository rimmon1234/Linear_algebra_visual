"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import type { Matrix } from "@/features/math/types";
import { VISUALIZATION_THEME } from "../constants";

interface TransformedGridProps {
  matrix: Matrix; // A(t) 2x2 matrix
  range?: number; // Bounds +/- range (default 6)
  step?: number;  // Grid line spacing (default 1)
  opacity?: number;
}

/**
 * TransformedGrid Primitive (Dynamic Transformation Layer)
 * Renders the dynamic coordinate mesh deformed by a 2x2 linear transformation matrix A(t).
 * Appears distinctly over the fixed, static background Cartesian coordinate grid.
 */
export function TransformedGrid({
  matrix,
  range = 6,
  step = 1,
  opacity = 0.45,
}: TransformedGridProps) {
  const { minor: minorColor, major: majorColor, axis: axisColor } =
    VISUALIZATION_THEME.transformedGrid;

  const [a, b, c, d] = useMemo(() => {
    if (
      Array.isArray(matrix) &&
      matrix.length === 2 &&
      Array.isArray(matrix[0]) &&
      Array.isArray(matrix[1])
    ) {
      return [
        matrix[0][0] ?? 1,
        matrix[0][1] ?? 0,
        matrix[1][0] ?? 0,
        matrix[1][1] ?? 1,
      ];
    }
    return [1, 0, 0, 1];
  }, [matrix]);

  // Generate grid line segments transformed by A(t)
  const { majorPositions, minorPositions, axisPositions } = useMemo(() => {
    const major: number[] = [];
    const minor: number[] = [];
    const axis: number[] = [];

    // Helper: transform point [x, y] by [a b; c d]
    const transform = (x: number, y: number): [number, number] => {
      return [a * x + b * y, c * x + d * y];
    };

    // Vertical lines: x is constant from -range to +range, y spans [-range, range]
    for (let x = -range; x <= range; x += step) {
      const [x1, y1] = transform(x, -range);
      const [x2, y2] = transform(x, range);

      if (x === 0) {
        axis.push(x1, y1, -0.005, x2, y2, -0.005);
      } else if (Math.abs(x) % 2 === 0) {
        major.push(x1, y1, -0.015, x2, y2, -0.015);
      } else {
        minor.push(x1, y1, -0.02, x2, y2, -0.02);
      }
    }

    // Horizontal lines: y is constant from -range to +range, x spans [-range, range]
    for (let y = -range; y <= range; y += step) {
      const [x1, y1] = transform(-range, y);
      const [x2, y2] = transform(range, y);

      if (y === 0) {
        axis.push(x1, y1, -0.005, x2, y2, -0.005);
      } else if (Math.abs(y) % 2 === 0) {
        major.push(x1, y1, -0.015, x2, y2, -0.015);
      } else {
        minor.push(x1, y1, -0.02, x2, y2, -0.02);
      }
    }

    return {
      majorPositions: new Float32Array(major),
      minorPositions: new Float32Array(minor),
      axisPositions: new Float32Array(axis),
    };
  }, [a, b, c, d, range, step]);

  return (
    <group name="transformed-grid">
      {/* Minor transformed grid lines */}
      {minorPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[minorPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={minorColor}
            transparent
            opacity={opacity * 0.35}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Major transformed grid lines */}
      {majorPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[majorPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={majorColor}
            transparent
            opacity={opacity * 0.65}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Transformed Basis Lines (where x=0 and y=0 land) */}
      {axisPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[axisPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={axisColor}
            transparent
            opacity={opacity * 0.9}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}
