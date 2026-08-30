"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { toVec3, computePlaneNormal, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

export interface PlaneProps {
  id?: string;
  origin?: number[] | Vector3Tuple;
  normal?: number[] | Vector3Tuple;
  spanningVectors?: [number[], number[]];
  size?: number;
  color?: string;
  opacity?: number;
  label?: string;
  visible?: boolean;
}

export function Plane({
  id,
  origin = [0, 0, 0],
  normal,
  spanningVectors,
  size = 6,
  color = VISUALIZATION_THEME.planes.default,
  opacity = 0.3,
  label,
  visible = true,
}: PlaneProps) {
  if (!visible) return null;

  const origVec = toVec3(origin);

  // Determine plane normal vector safely (User Adjustment 1)
  const computed = useMemo(() => {
    if (normal && normal.length >= 3) {
      const [nx, ny, nz] = toVec3(normal);
      const mag = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (mag > 1e-7) {
        return { normal: [nx / mag, ny / mag, nz / mag] as Vector3Tuple, isCollinear: false };
      }
    }

    if (spanningVectors && spanningVectors.length === 2) {
      return computePlaneNormal(spanningVectors[0], spanningVectors[1]);
    }

    // Default XY plane (normal = +Z)
    return { normal: [0, 0, 1] as Vector3Tuple, isCollinear: false };
  }, [normal, spanningVectors]);

  // Compute rotation from default Three.js PlaneGeometry normal (0, 0, 1) to target normal
  const quaternion = useMemo(() => {
    const defaultNormal = new THREE.Vector3(0, 0, 1);
    const targetNormal = new THREE.Vector3(...computed.normal);
    return new THREE.Quaternion().setFromUnitVectors(defaultNormal, targetNormal);
  }, [computed.normal]);

  const borderColor = VISUALIZATION_THEME.planes.border;

  return (
    <group name={`plane-${id || "generic"}`} position={origVec} quaternion={quaternion}>
      {/* Plane surface */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={color}
          transparent={true}
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Plane wireframe edge */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
        <lineBasicMaterial color={borderColor} opacity={0.6} transparent={true} />
      </lineSegments>

      {/* Plane label */}
      {label && (
        <Label text={label} position={[size / 2 - 0.5, size / 2 - 0.5, 0.05]} color={borderColor} />
      )}
    </group>
  );
}
