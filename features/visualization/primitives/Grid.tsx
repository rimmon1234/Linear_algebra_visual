"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { VISUALIZATION_THEME } from "../constants";

interface GridProps {
  dimension?: 2 | 3;
  size?: number;
  divisions?: number;
}

export function Grid({
  dimension = 2,
  size = 16,
  divisions = 16,
}: GridProps) {
  const { primary, secondary } = VISUALIZATION_THEME.grid;

  // Custom 2D Grid lines for sharp, high-contrast mathematical grid in XY plane
  const grid2DObject = useMemo(() => {
    if (dimension !== 2) return null;

    const majorPoints: THREE.Vector3[] = [];
    const minorPoints: THREE.Vector3[] = [];
    const half = size / 2;
    const step = size / divisions;

    for (let i = -half; i <= half; i += step) {
      // Skip origin axes (handled by Axes primitive)
      if (Math.abs(i) < 0.001) continue;

      const isMajor = Math.round(i) % 2 === 0;
      const target = isMajor ? majorPoints : minorPoints;

      // Vertical line (parallel to Y axis)
      target.push(new THREE.Vector3(i, -half, -0.01));
      target.push(new THREE.Vector3(i, half, -0.01));

      // Horizontal line (parallel to X axis)
      target.push(new THREE.Vector3(-half, i, -0.01));
      target.push(new THREE.Vector3(half, i, -0.01));
    }

    const group = new THREE.Group();

    // Major grid lines (every 2 units)
    if (majorPoints.length > 0) {
      const majorGeo = new THREE.BufferGeometry().setFromPoints(majorPoints);
      const majorMat = new THREE.LineBasicMaterial({
        color: "#334155", // Slate-700
        transparent: true,
        opacity: 0.8,
      });
      group.add(new THREE.LineSegments(majorGeo, majorMat));
    }

    // Minor grid lines (every 1 unit)
    if (minorPoints.length > 0) {
      const minorGeo = new THREE.BufferGeometry().setFromPoints(minorPoints);
      const minorMat = new THREE.LineBasicMaterial({
        color: "#1e293b", // Slate-800
        transparent: true,
        opacity: 0.5,
      });
      group.add(new THREE.LineSegments(minorGeo, minorMat));
    }

    return group;
  }, [dimension, size, divisions]);

  if (dimension === 2 && grid2DObject) {
    return <primitive object={grid2DObject} />;
  }

  // 3D Grid helper on the ground plane (XY or XZ)
  return (
    <group name="coordinate-grid-3d">
      <gridHelper
        args={[size, divisions, primary, secondary]}
        position={[0, -0.001, 0]}
      />
    </group>
  );
}
