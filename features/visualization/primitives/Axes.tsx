"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { VISUALIZATION_THEME } from "../constants";
import { Label } from "./Label";

interface AxesProps {
  dimension?: 2 | 3;
  bounds?: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    zMin?: number;
    zMax?: number;
  };
  showLabels?: boolean;
  showTicks?: boolean;
}

export function Axes({
  dimension = 2,
  bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6, zMin: -6, zMax: 6 },
  showLabels = true,
  showTicks = true,
}: AxesProps) {
  const { xAxis, yAxis, zAxis, origin, tick, tickLabel } = VISUALIZATION_THEME.axes;

  // Geometry and Line objects for X axis
  const xLineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(bounds.xMin, 0, 0),
      new THREE.Vector3(bounds.xMax, 0, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: xAxis, linewidth: 2 });
    return new THREE.Line(geo, mat);
  }, [bounds.xMin, bounds.xMax, xAxis]);

  // Geometry and Line objects for Y axis
  const yLineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, bounds.yMin, 0),
      new THREE.Vector3(0, bounds.yMax, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: yAxis, linewidth: 2 });
    return new THREE.Line(geo, mat);
  }, [bounds.yMin, bounds.yMax, yAxis]);

  // Geometry and Line objects for Z axis (if 3D)
  const zLineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, bounds.zMin ?? -6),
      new THREE.Vector3(0, 0, bounds.zMax ?? 6),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: zAxis, linewidth: 2 });
    return new THREE.Line(geo, mat);
  }, [bounds.zMin, bounds.zMax, zAxis]);

  // Dynamic numeric tick marks along X axis spanning full bounds
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const min = Math.ceil(bounds.xMin + 1);
    const max = Math.floor(bounds.xMax - 1);
    const step = max > 10 ? 4 : 2;
    for (let x = Math.ceil(min / step) * step; x <= max; x += step) {
      if (x !== 0) ticks.push(x);
    }
    return ticks;
  }, [bounds.xMin, bounds.xMax]);

  // Dynamic numeric tick marks along Y axis spanning full bounds
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const min = Math.ceil(bounds.yMin + 1);
    const max = Math.floor(bounds.yMax - 1);
    const step = max > 10 ? 4 : 2;
    for (let y = Math.ceil(min / step) * step; y <= max; y += step) {
      if (y !== 0) ticks.push(y);
    }
    return ticks;
  }, [bounds.yMin, bounds.yMax]);

  // Dynamic Ticks geometry
  const tickGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // X ticks
    for (const x of xTicks) {
      points.push(new THREE.Vector3(x, -0.08, 0));
      points.push(new THREE.Vector3(x, 0.08, 0));
    }
    // Y ticks
    for (const y of yTicks) {
      points.push(new THREE.Vector3(-0.08, y, 0));
      points.push(new THREE.Vector3(0.08, y, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: tick });
    return new THREE.LineSegments(geo, mat);
  }, [xTicks, yTicks, tick]);

  return (
    <group name="coordinate-axes">
      {/* Origin Point Marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={origin} />
      </mesh>

      {/* X Axis Line */}
      <primitive object={xLineObj} />
      {/* +X Arrow Cone */}
      <mesh position={[bounds.xMax, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <meshBasicMaterial color={xAxis} />
      </mesh>
      {showLabels && (
        <Label text="+x" position={[bounds.xMax + 0.3, 0, 0]} color={xAxis} minimal lod="primary" />
      )}

      {/* Y Axis Line */}
      <primitive object={yLineObj} />
      {/* +Y Arrow Cone */}
      <mesh position={[0, bounds.yMax, 0]}>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <meshBasicMaterial color={yAxis} />
      </mesh>
      {showLabels && (
        <Label text="+y" position={[0, bounds.yMax + 0.3, 0]} color={yAxis} minimal lod="primary" />
      )}

      {/* Z Axis Line (3D Mode) */}
      {dimension === 3 && (
        <>
          <primitive object={zLineObj} />
          {/* +Z Arrow Cone */}
          <mesh position={[0, 0, bounds.zMax ?? 6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.08, 0.25, 16]} />
            <meshBasicMaterial color={zAxis} />
          </mesh>
          {showLabels && (
            <Label text="+z" position={[0, 0, (bounds.zMax ?? 6) + 0.3]} color={zAxis} minimal lod="primary" />
          )}
        </>
      )}

      {/* Subtle, unboxed Numeric Tick Labels (disappear smoothly on zoom-out) */}
      {showTicks && (
        <>
          <primitive object={tickGeometry} />
          {xTicks.map((x) => (
            <Label
              key={`x-tick-${x}`}
              text={`${x}`}
              position={[x, -0.25, 0]}
              color={tickLabel}
              offset={[0, 0, 0]}
              minimal
              lod="tick"
              className="text-[9px] text-slate-500 font-mono select-none"
            />
          ))}
          {yTicks.map((y) => (
            <Label
              key={`y-tick-${y}`}
              text={`${y}`}
              position={[-0.3, y, 0]}
              color={tickLabel}
              offset={[0, 0, 0]}
              minimal
              lod="tick"
              className="text-[9px] text-slate-500 font-mono select-none"
            />
          ))}
        </>
      )}
    </group>
  );
}
