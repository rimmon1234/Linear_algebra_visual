"use client";

import React, { useRef } from "react";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { toVec3, type Vector3Tuple } from "../model/coordinates";
import { VISUALIZATION_THEME } from "../constants";

export interface LabelProps {
  text: string;
  position: number[] | Vector3Tuple;
  color?: string;
  offset?: [number, number, number];
  fontSize?: number;
  className?: string;
  minimal?: boolean;
  /**
   * Dynamic LOD (Level of Detail) zoom threshold:
   * - "tick": Fades out earliest on slight zoom-out (e.g. numeric ticks -4, -2, 2, 4)
   * - "secondary": Fades out on early zoom-out (e.g. detailed vector coordinates, area, references)
   * - "primary": Fades out on moderate zoom-out (e.g. main axis +x, +y, primary vector names)
   * - "always": Never hidden by zoom-out
   */
  lod?: "tick" | "secondary" | "primary" | "always";
}

/**
 * Unified, dynamic Label primitive abstraction with responsive LOD zoom filtering.
 * Automatically and smoothly fades out labels upon early/close zoom-out to prevent clutter
 * dynamically calibrated across device viewports and screen densities.
 */
export function Label({
  text,
  position,
  color = VISUALIZATION_THEME.labels.text,
  offset = [0.12, 0.12, 0],
  className,
  minimal = false,
  lod = "secondary",
}: LabelProps) {
  const [x, y, z] = toVec3(position);
  const finalPos: Vector3Tuple = [x + offset[0], y + offset[1], z + offset[2]];

  const containerRef = useRef<HTMLDivElement>(null);
  const worldPos = useRef(new THREE.Vector3(...finalPos));
  worldPos.current.set(...finalPos);

  const { camera, size } = useThree();

  // Dynamic Level of Detail (LOD) check per frame
  useFrame(() => {
    if (!containerRef.current) return;

    if (lod === "always") {
      if (containerRef.current.style.opacity !== "1") {
        containerRef.current.style.opacity = "1";
      }
      return;
    }

    // Compute effective screen pixels per world unit
    let pixelsPerUnit = 36;
    if (
      "isOrthographicCamera" in camera &&
      (camera as THREE.OrthographicCamera).isOrthographicCamera
    ) {
      pixelsPerUnit = (camera as THREE.OrthographicCamera).zoom;
    } else if (
      "isPerspectiveCamera" in camera &&
      (camera as THREE.PerspectiveCamera).isPerspectiveCamera
    ) {
      const pCam = camera as THREE.PerspectiveCamera;
      const dist = pCam.position.distanceTo(worldPos.current);
      if (dist > 0.001) {
        const vFovRad = THREE.MathUtils.degToRad(pCam.fov);
        const visibleHeightAtDist = 2 * dist * Math.tan(vFovRad / 2);
        pixelsPerUnit = size.height / visibleHeightAtDist;
      }
    }

    // Responsive thresholds calibrated for early zoom-out disappearance:
    // - "tick": hides as soon as user zooms out slightly (< 34 px/unit vs 36 default)
    // - "secondary": hides early on small zoom-out (< 31 px/unit)
    // - "primary": hides on moderate zoom-out (< 26 px/unit)
    let minPixels = 31;
    if (lod === "tick") minPixels = 34;
    if (lod === "primary") minPixels = 26;

    const visible = pixelsPerUnit >= minPixels;
    const targetOpacity = visible ? "1" : "0";

    if (containerRef.current.style.opacity !== targetOpacity) {
      containerRef.current.style.opacity = targetOpacity;
    }
  });

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
        ref={containerRef}
        className={className}
        style={{
          color,
          backgroundColor: minimal ? "transparent" : "rgba(2, 6, 23, 0.8)",
          borderColor: minimal ? "transparent" : "rgba(51, 65, 85, 0.5)",
          borderWidth: minimal ? "0px" : "1px",
          borderStyle: "solid",
          borderRadius: "3px",
          padding: minimal ? "0px" : "1px 4px",
          fontSize: "10px",
          fontFamily: "monospace",
          fontWeight: 600,
          whiteSpace: "nowrap",
          backdropFilter: minimal ? "none" : "blur(4px)",
          letterSpacing: "-0.02em",
          transition: "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: 1,
        }}
      >
        {text}
      </div>
    </Html>
  );
}
