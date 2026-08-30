"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import type { Vector } from "@/features/math/types";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

interface UnitSquareProps {
  corners: Vector[]; // [[0,0], e1, e1+e2, e2]
  determinant: number;
  showLabel?: boolean;
}

/**
 * Transformed Unit Square (Parallelogram) Primitive (Dynamic Transformation Layer)
 * Visualizes the geometric effect of det(A): area scaling factor and orientation.
 * Area is computed strictly from the mathematical model: area = |det(A)|.
 */
export function UnitSquare({
  corners,
  determinant,
  showLabel = true,
}: UnitSquareProps) {
  const { standard, reflected, singular } = VISUALIZATION_THEME.unitSquare;

  const isSingular = Math.abs(determinant) < 1e-6;
  const isNegative = determinant < -1e-6;

  // Determine fill & border color based on orientation
  const fillColor = isSingular
    ? singular // Slate when collapsed
    : isNegative
    ? reflected // Rose when orientation flipped (det < 0)
    : standard; // Emerald when orientation preserved (det > 0)

  const { shapeGeometry, borderPositions, centerPosition } = useMemo(() => {
    if (!corners || corners.length < 4) {
      return {
        shapeGeometry: null,
        borderPositions: null,
        centerPosition: [0.5, 0.5, 0] as [number, number, number],
      };
    }

    const [p0, p1, p2, p3] = corners;

    // Create 2D shape for polygon fill
    const shape = new THREE.Shape();
    shape.moveTo(p0[0] ?? 0, p0[1] ?? 0);
    shape.lineTo(p1[0] ?? 1, p1[1] ?? 0);
    shape.lineTo(p2[0] ?? 1, p2[1] ?? 1);
    shape.lineTo(p3[0] ?? 0, p3[1] ?? 1);
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);

    // Border line loop
    const border = new Float32Array([
      p0[0] ?? 0, p0[1] ?? 0, 0.01,
      p1[0] ?? 1, p1[1] ?? 0, 0.01,
      p2[0] ?? 1, p2[1] ?? 1, 0.01,
      p3[0] ?? 0, p3[1] ?? 1, 0.01,
      p0[0] ?? 0, p0[1] ?? 0, 0.01,
    ]);

    // Center point of the parallelogram for area badge
    const cx = ((p0[0] ?? 0) + (p1[0] ?? 1) + (p2[0] ?? 1) + (p3[0] ?? 0)) / 4;
    const cy = ((p0[0] ?? 0) + (p1[1] ?? 0) + (p2[1] ?? 1) + (p3[1] ?? 1)) / 4;

    return {
      shapeGeometry: geometry,
      borderPositions: border,
      centerPosition: [cx, cy, 0.02] as [number, number, number],
    };
  }, [corners]);

  const area = Math.abs(determinant);

  return (
    <group name="unit-square-parallelogram">
      {/* Filled Parallelogram Surface */}
      {shapeGeometry && (
        <mesh geometry={shapeGeometry} position={[0, 0, -0.005]}>
          <meshBasicMaterial
            color={fillColor}
            transparent
            opacity={isSingular ? 0.08 : 0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Border Outline */}
      {borderPositions && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[borderPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={fillColor}
            transparent
            opacity={0.8}
            linewidth={2}
          />
        </line>
      )}

      {/* Area Badge Label */}
      {showLabel && area > 0.15 && (
        <Label
          text={`Area = ${area.toFixed(2)}`}
          position={centerPosition}
          color={fillColor}
          lod="secondary"
        />
      )}
    </group>
  );
}
