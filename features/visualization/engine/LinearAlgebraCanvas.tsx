"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { CAMERA_DEFAULTS } from "../constants";
import { CameraControls } from "../camera/CameraControls";
import { isWebGLAvailable } from "./WebGLDetector";
import { VisualizationFallback } from "@/components/visualizer/VisualizationFallback";

interface LinearAlgebraCanvasProps {
  dimension?: 2 | 3;
  cameraMode?: "perspective" | "orthographic";
  children?: React.ReactNode;
  fallbackTitle?: string;
}

export function LinearAlgebraCanvas({
  dimension = 2,
  cameraMode = dimension === 2 ? "orthographic" : "perspective",
  children,
  fallbackTitle = "Interactive Scene",
}: LinearAlgebraCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    // Filter Three.js Clock deprecation warning triggered by internal dependencies
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("THREE.Clock: This module has been deprecated")
      ) {
        return;
      }
      origWarn.apply(console, args);
    };

    return () => {
      console.warn = origWarn;
    };
  }, []);

  if (!hasWebGL) {
    return (
      <VisualizationFallback
        title={fallbackTitle}
        type="vector"
        dimension={dimension}
      />
    );
  }

  const is2D = dimension === 2;
  const isOrtho = is2D || cameraMode === "orthographic";

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-lg overflow-hidden bg-slate-950/80">
      <Canvas
        dpr={[1, 2]} // Crisp rendering on Retina without mobile GPU penalty
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Dynamic Default Camera Switcher without unmounting WebGL context */}
        {is2D ? (
          <OrthographicCamera
            makeDefault
            position={CAMERA_DEFAULTS.orthographic2D.position}
            zoom={CAMERA_DEFAULTS.orthographic2D.zoom}
            near={0.1}
            far={1000}
          />
        ) : isOrtho ? (
          <OrthographicCamera
            makeDefault
            position={CAMERA_DEFAULTS.orthographic3D.position}
            zoom={CAMERA_DEFAULTS.orthographic3D.zoom}
            near={0.1}
            far={1000}
          />
        ) : (
          <PerspectiveCamera
            makeDefault
            position={CAMERA_DEFAULTS.perspective3D.position}
            fov={CAMERA_DEFAULTS.perspective3D.fov}
            near={0.1}
            far={1000}
          />
        )}

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />

        {/* Camera Controls */}
        <CameraControls dimension={dimension} mode={cameraMode} />

        {/* Scene Objects */}
        {children}
      </Canvas>
    </div>
  );
}
