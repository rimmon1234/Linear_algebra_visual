"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useVisualizerStore } from "../store/visualizer-store";
import { CAMERA_DEFAULTS, CAMERA_BOUNDS_POLICY } from "../constants";

interface CameraControlsProps {
  dimension?: 2 | 3;
  mode?: "perspective" | "orthographic";
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

/**
 * CameraControls Component
 * Provides user-controlled orbit, pan, zoom, canonical reset, and explicit Fit Scene framing.
 * Enforces strict uniform 1:1 mathematical scale (1 unit X = 1 unit Y).
 * Decoupled from matrix edits and animations to guarantee zero camera jitter.
 */
export function CameraControls({
  dimension = 2,
  mode = dimension === 2 ? "orthographic" : "perspective",
  enableRotate = dimension === 3,
  enableZoom = true,
  enablePan = true,
}: CameraControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const cameraResetCounter = useVisualizerStore((s) => s.cameraResetCounter);
  const fitSceneCounter = useVisualizerStore((s) => s.fitSceneCounter);
  const fitSceneBounds = useVisualizerStore((s) => s.fitSceneBounds);

  // 1. Canonical Reset Camera Action: restores mathematical default view at (0, 0)
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

  // 2. Explicit Fit Scene Action: invoked only when user deliberately clicks "Fit Scene"
  useEffect(() => {
    if (fitSceneCounter === 0) return;

    const bounds = fitSceneBounds ?? {
      xMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      xMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      yMin: -CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
      yMax: CAMERA_BOUNDS_POLICY.CANONICAL_2D_SPAN / 2,
    };
    const spanX = Math.max(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN, Math.abs(bounds.xMax - bounds.xMin));
    const spanY = Math.max(CAMERA_BOUNDS_POLICY.MIN_WORLD_SPAN, Math.abs(bounds.yMax - bounds.yMin));
    const margin = CAMERA_BOUNDS_POLICY.MARGIN_FACTOR;

    if (
      dimension === 2 &&
      "isOrthographicCamera" in camera &&
      (camera as THREE.OrthographicCamera).isOrthographicCamera
    ) {
      const oCam = camera as THREE.OrthographicCamera;
      // Calculate uniform 1:1 scale zoom based on viewport dimensions
      const zoomX = size.width / (spanX * margin);
      const zoomY = size.height / (spanY * margin);
      // Min ensures uniform scale on both axes without geometric distortion
      const targetZoom = Math.min(
        CAMERA_BOUNDS_POLICY.MAX_ZOOM,
        Math.max(CAMERA_BOUNDS_POLICY.MIN_ZOOM, Math.min(zoomX, zoomY))
      );

      const midX = (bounds.xMin + bounds.xMax) / 2;
      const midY = (bounds.yMin + bounds.yMax) / 2;

      oCam.position.set(midX, midY, 10);
      oCam.zoom = targetZoom;
      oCam.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.target.set(midX, midY, 0);
        controlsRef.current.update();
      }
    }
  }, [fitSceneCounter, fitSceneBounds, camera, size, dimension]);

  // Configure mouse buttons: Left button pans in 2D, rotates in 3D
  const mouseButtons = {
    LEFT: dimension === 2 ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  // Configure touch gestures for mobile:
  // In 2D: One finger pans the 2D plane, two fingers pinch-to-zoom.
  // In 3D: One finger rotates the scene, two fingers pinch-to-zoom / pan.
  const touches = {
    ONE: dimension === 2 ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableRotate={enableRotate}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableDamping={true}
      dampingFactor={0.1}
      panSpeed={dimension === 2 ? 0.33 : 0.45} // Responsive 2D pan
      rotateSpeed={0.5}
      zoomSpeed={0.5}
      minZoom={10}                              // Generous zoom-out
      maxZoom={90}                              // Deep zoom-in
      maxDistance={45}
      minDistance={2}
      screenSpacePanning={true}
      mouseButtons={mouseButtons}
      touches={touches}
      makeDefault
    />
  );
}
