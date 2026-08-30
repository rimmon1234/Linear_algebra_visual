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
import { UnitSquare } from "../primitives/UnitSquare";
import { AnimationController } from "../animation/AnimationController";
import type { Matrix, Vector as MathVector } from "@/features/math/types";

interface VisualizationRendererProps {
  spec: VisualizationSpec;
}

/**
 * Spec compiler & renderer.
 * Enforces strict architectural separation:
 * 1. Reference Layer (Fixed world coordinate frame: static orthogonal reference grid + horizontal/vertical axes)
 * 2. Transformation Layer (Dynamic mathematical objects: basis vectors Ae1/Ae2, custom vector Av, unit square parallelogram)
 */
export function VisualizationRenderer({ spec }: VisualizationRendererProps) {
  const model = useMemo(() => {
    return buildSceneModel(spec);
  }, [spec]);

  // Extract dynamic transformed unit-square and determinant data from spec
  const transformationData = useMemo(() => {
    const gridObj = spec.objects?.find((o) => o.type === "transformed-grid");
    if (!gridObj || !("properties" in gridObj) || !gridObj.properties) {
      return null;
    }
    const props = gridObj.properties as {
      interpolatedMatrix?: Matrix;
      determinant?: number;
      area?: number;
      unitSquareCorners?: MathVector[];
      showUnitSquare?: boolean;
    };
    return props;
  }, [spec.objects]);

  const maxAxisBound = Math.max(
    model.coordinateSystem.bounds.xMax,
    model.coordinateSystem.bounds.yMax,
    Math.abs(model.coordinateSystem.bounds.xMin),
    Math.abs(model.coordinateSystem.bounds.yMin)
  );

  return (
    <group name="visualization-scene">
      {/* ===================================================================
          1. REFERENCE LAYER (Fixed World Coordinate Frame)
             Fixed at origin (0, 0), strictly horizontal X (y=0), vertical Y (x=0).
             Permanent, orthogonal Cartesian background grid.
         =================================================================== */}
      <group name="reference-layer">
        {model.coordinateSystem.showGrid && (
          <Grid
            dimension={model.dimension}
            size={maxAxisBound * 2}
            divisions={maxAxisBound * 2}
          />
        )}
        {model.coordinateSystem.showAxes && (
          <Axes
            dimension={model.dimension}
            bounds={model.coordinateSystem.bounds}
            showLabels={model.coordinateSystem.showLabels}
          />
        )}
      </group>

      {/* ===================================================================
          2. TRANSFORMATION LAYER (Dynamic Mathematical Objects)
             Responds to matrix A(t) strictly via mathematical vector operations.
         =================================================================== */}
      <group name="transformation-layer">
        {/* Transformed Unit Square Parallelogram */}
        {transformationData?.showUnitSquare !== false &&
          transformationData?.unitSquareCorners &&
          transformationData.determinant !== undefined && (
            <UnitSquare
              corners={transformationData.unitSquareCorners}
              determinant={transformationData.determinant}
            />
          )}

        {/* Dynamic Planes */}
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

        {/* Dynamic Lines (e.g. Parallelogram completion lines) */}
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

        {/* Dynamic Vectors (Basis Ae1, Ae2, custom Av, Linearity vectors) */}
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

        {/* Dynamic Points */}
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
      </group>

      {/* Animation loop */}
      {model.animation?.enabled && <AnimationController />}
    </group>
  );
}
