"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { toVec3, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";

interface LabelProps {
  text: string;
  position: number[] | Vector3Tuple;
  color?: string;
  offset?: [number, number, number];
  fontSize?: number;
  className?: string;
}

/**
 * Unified, reusable Label primitive abstraction (User Adjustment 6).
 * Renders crisp, billboarded math labels at 3D coordinates.
 */
export function Label({
  text,
  position,
  color = VISUALIZATION_THEME.labels.text,
  offset = [0.15, 0.15, 0],
  className,
}: LabelProps) {
  const [x, y, z] = toVec3(position);
  const finalPos: Vector3Tuple = [x + offset[0], y + offset[1], z + offset[2]];

  return (
    <Html
      position={finalPos}
      center
      style={{
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        className={className}
        style={{
          color,
          backgroundColor: VISUALIZATION_THEME.labels.background,
          borderColor: VISUALIZATION_THEME.labels.border,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "11px",
          fontFamily: "monospace",
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </Html>
  );
}
