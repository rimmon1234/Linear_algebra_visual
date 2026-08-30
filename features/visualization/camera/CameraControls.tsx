"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useVisualizerStore } from "../store/visualizer-store";
import { CAMERA_DEFAULTS } from "../constants";

interface CameraControlsProps {
  dimension?: 2 | 3;
  mode?: "perspective" | "orthographic";
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export function CameraControls({
  dimension = 2,
  mode = dimension === 2 ? "orthographic" : "perspective",
  enableRotate = dimension === 3,
  enableZoom = true,
  enablePan = true,
}: CameraControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const cameraResetCounter = useVisualizerStore((s) => s.cameraResetCounter);

  // Position and reset camera on initial mount, dimension toggle, or reset trigger
  useEffect(() => {
    if (dimension === 2) {
      const { position, zoom } = CAMERA_DEFAULTS.orthographic2D;
      camera.position.set(...position);
      camera.lookAt(0, 0, 0);
      if ("zoom" in camera) {
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
      }
    } else {
      const defaults =
        mode === "orthographic"
          ? CAMERA_DEFAULTS.orthographic3D
          : CAMERA_DEFAULTS.perspective3D;

      camera.position.set(...defaults.position);
      camera.lookAt(0, 0, 0);
      if (mode === "orthographic" && "zoom" in camera) {
        camera.zoom = CAMERA_DEFAULTS.orthographic3D.zoom;
      }
      camera.updateProjectionMatrix();
    }

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [cameraResetCounter, camera, dimension, mode]);

  // Configure mouse buttons: Left button pans in 2D, rotates in 3D
  const mouseButtons = {
    LEFT: dimension === 2 ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableRotate={enableRotate}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableDamping={true}
      dampingFactor={0.1}
      panSpeed={dimension === 2 ? 0.22 : 0.45} // Precise 1:1 drag feel in 2D
      rotateSpeed={0.5}                         // Smooth 3D rotation
      zoomSpeed={0.5}                           // Smooth, measured zoom
      minZoom={16}                              // Clamped minimum zoom-out
      maxZoom={80}                              // Clamped maximum zoom-in
      maxDistance={35}
      minDistance={2}
      screenSpacePanning={true}
      mouseButtons={mouseButtons}
      makeDefault
    />
  );
}
