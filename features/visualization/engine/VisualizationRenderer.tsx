"use client";

import React, { useMemo } from "react";
import type { VisualizationSpec } from "../schema";
import { buildSceneModel } from "../model/scene-model";
import { Axes } from "../primitives/Axes";
import { Grid } from "../primitives/Grid";
import { Vector } from "../primitives/Vector";
import { Point } from "../primitives/Point";
import { Line } from "../primitives/Line";
import { Plane } from "../primitives/Plane";
import { AnimationController } from "../animation/AnimationController";

interface VisualizationRendererProps {
  spec: VisualizationSpec;
}

/**
 * Spec compiler & renderer.
 * Validates and transforms a VisualizationSpec into interactive R3F scene graph elements.
 */
export function VisualizationRenderer({ spec }: VisualizationRendererProps) {
  const model = useMemo(() => {
    return buildSceneModel(spec);
  }, [spec]);

  return (
    <group name="visualization-scene">
      {/* Coordinate Grid */}
      {model.coordinateSystem.showGrid && (
        <Grid
          dimension={model.dimension}
          size={Math.max(
            model.coordinateSystem.bounds.xMax - model.coordinateSystem.bounds.xMin,
            model.coordinateSystem.bounds.yMax - model.coordinateSystem.bounds.yMin
          )}
        />
      )}

      {/* Coordinate Axes */}
      {model.coordinateSystem.showAxes && (
        <Axes
          dimension={model.dimension}
          bounds={model.coordinateSystem.bounds}
          showLabels={model.coordinateSystem.showLabels}
        />
      )}

      {/* Planes (rendered before vectors for transparency layering) */}
      {model.planes.map((plane) => (
        <Plane
          key={plane.id}
          id={plane.id}
          origin={plane.origin}
          normal={plane.normal}
          size={plane.size}
          color={plane.color}
          opacity={plane.opacity}
          label={plane.label}
          visible={plane.visible}
        />
      ))}

      {/* Lines */}
      {model.lines.map((line) => (
        <Line
          key={line.id}
          id={line.id}
          start={line.start}
          end={line.end}
          color={line.color}
          dashed={line.dashed}
          label={line.label}
          visible={line.visible}
        />
      ))}

      {/* Vectors */}
      {model.vectors.map((vec) => (
        <Vector
          key={vec.id}
          id={vec.id}
          value={vec.value}
          origin={vec.origin}
          color={vec.color}
          label={vec.label}
          visible={vec.visible}
          draggable={vec.draggable}
        />
      ))}

      {/* Points */}
      {model.points.map((point) => (
        <Point
          key={point.id}
          id={point.id}
          position={point.position}
          color={point.color}
          radius={point.radius}
          label={point.label}
          visible={point.visible}
        />
      ))}

      {/* Animation loop */}
      {model.animation?.enabled && <AnimationController />}
    </group>
  );
}
