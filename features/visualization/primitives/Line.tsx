"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { toVec3, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

interface LineProps {
  id?: string;
  start: number[] | Vector3Tuple;
  end: number[] | Vector3Tuple;
  color?: string;
  dashed?: boolean;
  label?: string;
  visible?: boolean;
  lod?: "tick" | "secondary" | "primary" | "always";
}

export function Line({
  id,
  start,
  end,
  color = VISUALIZATION_THEME.lines.default,
  dashed = false,
  label,
  visible = true,
  lod = "secondary",
}: LineProps) {
  if (!visible) return null;

  const [x1, y1, z1] = toVec3(start);
  const [x2, y2, z2] = toVec3(end);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: 0.2, gapSize: 0.1 })
      : new THREE.LineBasicMaterial({ color, linewidth: 1.5 });
    const line = new THREE.Line(geo, mat);
    if (dashed) {
      line.computeLineDistances();
    }
    return line;
  }, [x1, y1, z1, x2, y2, z2, color, dashed]);

  const midpoint: Vector3Tuple = [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];

  return (
    <group name={`line-${id || "generic"}`}>
      <primitive object={lineObj} />
      {label && (
        <Label text={label} position={midpoint} color={color} lod={lod} />
      )}
    </group>
  );
}
