"use client";

import React from "react";
import { toVec3, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

interface PointProps {
  id?: string;
  position: number[] | Vector3Tuple;
  color?: string;
  radius?: number;
  label?: string;
  showCoordinates?: boolean;
  visible?: boolean;
}

export function Point({
  id,
  position,
  color = VISUALIZATION_THEME.points.default,
  radius = 0.12,
  label,
  showCoordinates = false,
  visible = true,
}: PointProps) {
  if (!visible) return null;

  const [x, y, z] = toVec3(position);
  const pos: Vector3Tuple = [x, y, z];
  const coordText = `(${x.toFixed(1)}, ${y.toFixed(1)}${z !== 0 ? `, ${z.toFixed(1)}` : ""})`;
  const labelText = label ? `${label} ${showCoordinates ? coordText : ""}` : (showCoordinates ? coordText : "");

  return (
    <group name={`point-${id || "generic"}`} position={pos}>
      {/* Core Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Subtle Halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          wireframe={true}
        />
      </mesh>

      {labelText && (
        <Label text={labelText} position={[0, radius * 1.8, 0]} color={color} />
      )}
    </group>
  );
}
