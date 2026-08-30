"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { computeVectorOrientation, toVec3, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

export interface VectorProps {
  id?: string;
  value: number[] | Vector3Tuple;
  origin?: number[] | Vector3Tuple;
  color?: string;
  label?: string;
  showCoordinates?: boolean;
  visible?: boolean;
  draggable?: boolean;
  onDrag?: (newVal: Vector3Tuple) => void;
}

export function Vector({
  id,
  value,
  origin = [0, 0, 0],
  color = VISUALIZATION_THEME.vectors.primary,
  label,
  showCoordinates = false,
  visible = true,
}: VectorProps) {
  if (!visible) return null;

  const orientation = useMemo(() => {
    return computeVectorOrientation(value, origin);
  }, [value, origin]);

  const {
    isZero,
    head,
    quaternion,
    shaftLength,
    shaftRadius,
    coneLength,
    coneRadius,
  } = orientation;

  const [ox, oy, oz] = orientation.origin;
  const [hx, hy, hz] = head;
  const coordText = `[${(hx - ox).toFixed(1)}, ${(hy - oy).toFixed(1)}${orientation.direction[2] !== 0 ? `, ${(hz - oz).toFixed(1)}` : ""}]`;
  const labelText = label
    ? `${label} ${showCoordinates ? coordText : ""}`
    : showCoordinates
    ? coordText
    : "";

  // If vector is mathematically zero, render only a small origin dot without broken geometries
  if (isZero) {
    return (
      <group name={`vector-zero-${id || "generic"}`} position={[ox, oy, oz]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {labelText && <Label text={`${labelText} (0)`} position={[0, 0.2, 0]} color={color} />}
      </group>
    );
  }

  const rotationQuaternion = new THREE.Quaternion(...quaternion);

  return (
    <group name={`vector-${id || "generic"}`}>
      {/* Rotated & Translated Vector Body */}
      <group position={[ox, oy, oz]} quaternion={rotationQuaternion}>
        {/* Shaft Cylinder */}
        {shaftLength > 0 && (
          <mesh position={[0, shaftLength / 2, 0]}>
            <cylinderGeometry
              args={[shaftRadius, shaftRadius, shaftLength, 16]}
            />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.25}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Head Cone */}
        {coneLength > 0 && (
          <mesh position={[0, shaftLength + coneLength / 2, 0]}>
            <coneGeometry args={[coneRadius, coneLength, 20]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.2}
            />
          </mesh>
        )}
      </group>

      {/* Label at arrowhead tip */}
      {labelText && (
        <Label
          text={labelText}
          position={[hx, hy, hz]}
          offset={[0.1, 0.15, 0]}
          color={color}
        />
      )}
    </group>
  );
}
