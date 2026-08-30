/**
 * Transformation Visualization Model Compiler (ADR-015)
 * Derives a complete, validated VisualizationSpec from a mathematical 2x2 matrix,
 * custom vector, and animation progress t in [0, 1].
 * Dynamically scales reference axes and grid bounds to envelope transformed vector sizes.
 * Uses concise, non-overlapping mathematical label typography.
 */

import type { Matrix, Vector } from "@/features/math/types";
import {
  evaluateTransformation2D,
} from "@/features/math/transformation/transformation-2d";
import { VISUALIZATION_THEME } from "../constants";
import type { VisualizationSpec, VisualizationObject } from "../schema";

export interface BuildTransformationSpecOptions {
  matrix: Matrix;               // 2x2 matrix A
  progress?: number;            // t in [0, 1] (default 1)
  customVector?: Vector;        // Optional custom vector v = [x, y]
  showBasisVectors?: boolean;   // default true
  showUnitSquare?: boolean;     // default true
  showTransformedGrid?: boolean;// default true
  showLinearityDemo?: boolean;  // default false
  linearityVectorU?: Vector;    // default [2, 1]
  linearityVectorV?: Vector;    // default [-1, 2]
  title?: string;
  description?: string;
}

/**
 * Builds a structured VisualizationSpec from mathematical transformation state.
 */
export function buildTransformationSpec(
  options: BuildTransformationSpecOptions
): VisualizationSpec {
  const {
    matrix,
    progress = 1,
    customVector = [2, 1],
    showBasisVectors = true,
    showUnitSquare = true,
    showLinearityDemo = false,
    linearityVectorU = [2, 1],
    linearityVectorV = [-1, 2],
    title = "Matrix Transformation",
    description = "Interactive 2D linear transformation.",
  } = options;

  const stateResult = evaluateTransformation2D(matrix, progress, customVector);
  const state = stateResult.ok
    ? stateResult.value
    : {
        matrix: [[1, 0], [0, 1]],
        progress: 1,
        interpolatedMatrix: [[1, 0], [0, 1]],
        basis1: [1, 0],
        basis2: [0, 1],
        transformedVector: customVector,
        determinant: 1,
        area: 1,
        unitSquareCorners: [[0, 0], [1, 0], [1, 1], [0, 1]],
      };

  const objects: VisualizationObject[] = [];

  // Theme tokens
  const { e1: colorE1, e2: colorE2 } = VISUALIZATION_THEME.basisVectors;
  const { custom: colorCustom, reference: colorRef } = VISUALIZATION_THEME.vectors;
  const {
    vectorU: colorU,
    vectorV: colorV,
    vectorSum: colorSum,
    parallelogramLine: colorPara,
  } = VISUALIZATION_THEME.linearity;

  // 1. Basis vectors e1(t) and e2(t)
  if (showBasisVectors && !showLinearityDemo) {
    const col1 = state.basis1;
    const labelE1 = progress === 0 ? "e₁" : "Ae₁";

    objects.push({
      type: "vector",
      id: "basis-e1",
      label: labelE1,
      color: colorE1,
      value: col1,
      origin: [0, 0],
      visible: true,
    });

    const col2 = state.basis2;
    const labelE2 = progress === 0 ? "e₂" : "Ae₂";

    objects.push({
      type: "vector",
      id: "basis-e2",
      label: labelE2,
      color: colorE2,
      value: col2,
      origin: [0, 0],
      visible: true,
    });
  } else if (showBasisVectors && showLinearityDemo) {
    // In Linearity Demo mode, show basis vectors with minimalist, compact labels
    objects.push({
      type: "vector",
      id: "basis-e1",
      label: "Ae₁",
      color: colorE1,
      value: state.basis1,
      origin: [0, 0],
      visible: true,
    });
    objects.push({
      type: "vector",
      id: "basis-e2",
      label: "Ae₂",
      color: colorE2,
      value: state.basis2,
      origin: [0, 0],
      visible: true,
    });
  }

  // 2. Custom vector v -> Av
  if (customVector && !showLinearityDemo) {
    // If progress > 0, show original vector v as a subtle reference line
    if (progress > 0.08) {
      objects.push({
        type: "line",
        id: "original-v-ref",
        start: [0, 0],
        end: customVector,
        color: colorRef,
        dashed: true,
        label: "v (orig)",
      });
    }

    const transformedV = state.transformedVector ?? customVector;
    const labelV = progress === 0 ? "v" : "Av";

    objects.push({
      type: "vector",
      id: "custom-v",
      label: labelV,
      color: colorCustom,
      value: transformedV,
      origin: [0, 0],
      draggable: progress === 0,
      visible: true,
    });
  }

  // 3. Linearity Demonstration: A(u + v) = Au + Av
  if (showLinearityDemo) {
    const stateU = evaluateTransformation2D(matrix, progress, linearityVectorU);
    const stateV = evaluateTransformation2D(matrix, progress, linearityVectorV);
    const sumVec = [
      linearityVectorU[0] + linearityVectorV[0],
      linearityVectorU[1] + linearityVectorV[1],
    ];
    const stateSum = evaluateTransformation2D(matrix, progress, sumVec);

    const transU = stateU.ok ? stateU.value.transformedVector ?? linearityVectorU : linearityVectorU;
    const transV = stateV.ok ? stateV.value.transformedVector ?? linearityVectorV : linearityVectorV;
    const transSum = stateSum.ok ? stateSum.value.transformedVector ?? sumVec : sumVec;

    // Vector u
    objects.push({
      type: "vector",
      id: "vec-u",
      label: progress === 0 ? "u" : "Au",
      color: colorU,
      value: transU,
      origin: [0, 0],
    });

    // Vector v
    objects.push({
      type: "vector",
      id: "vec-v",
      label: progress === 0 ? "v" : "Av",
      color: colorV,
      value: transV,
      origin: [0, 0],
    });

    // Sum Vector u + v
    objects.push({
      type: "vector",
      id: "vec-sum",
      label: progress === 0 ? "u + v" : "A(u + v)",
      color: colorSum,
      value: transSum,
      origin: [0, 0],
    });

    // Parallelogram completion lines
    objects.push({
      type: "line",
      id: "line-u-sum",
      start: transU,
      end: transSum,
      color: colorPara,
      dashed: true,
    });
    objects.push({
      type: "line",
      id: "line-v-sum",
      start: transV,
      end: transSum,
      color: colorPara,
      dashed: true,
    });
  }

  // 4. Transformed grid & unit-square descriptors
  const customProps: Record<string, unknown> = {
    interpolatedMatrix: state.interpolatedMatrix,
    determinant: state.determinant,
    area: state.area,
    unitSquareCorners: state.unitSquareCorners,
    showUnitSquare: showUnitSquare && !showLinearityDemo,
  };

  objects.push({
    type: "transformed-grid",
    id: "transformed-grid-object",
    properties: customProps,
  });

  // Calculate dynamic spatial envelope including:
  // - Origin [0, 0]
  // - Initial state (t=0): [1,0], [0,1], v
  // - Target state (t=1): Ae1, Ae2, Av, UnitSquare corners
  // - Linearity vectors if enabled
  const envelopeCoords: (Vector | number[] | undefined)[] = [
    [0, 0],
    [1, 0],
    [0, 1],
    customVector,
    state.basis1,
    state.basis2,
    state.transformedVector,
  ];

  if (state.unitSquareCorners) {
    envelopeCoords.push(...state.unitSquareCorners);
  }

  if (showLinearityDemo) {
    const sumVec = [
      linearityVectorU[0] + linearityVectorV[0],
      linearityVectorU[1] + linearityVectorV[1],
    ];
    envelopeCoords.push(linearityVectorU, linearityVectorV, sumVec);
  }

  let maxExtent = 6;
  for (const c of envelopeCoords) {
    if (c && c.length >= 2) {
      const x = Number.isFinite(c[0]) ? Math.abs(c[0]!) : 0;
      const y = Number.isFinite(c[1]) ? Math.abs(c[1]!) : 0;
      maxExtent = Math.max(maxExtent, x, y);
    }
  }

  // Apply 20% margin, clamp between [6, 32]
  const dynamicBounds = Math.min(32, Math.max(6, Math.ceil(maxExtent * 1.2)));

  return {
    version: 1,
    type: "matrix-transformation",
    dimension: 2,
    coordinateSystem: {
      dimension: 2,
      showAxes: true,
      showGrid: true,
      showLabels: true,
      bounds: {
        xMin: -dynamicBounds,
        xMax: dynamicBounds,
        yMin: -dynamicBounds,
        yMax: dynamicBounds,
        zMin: -dynamicBounds,
        zMax: dynamicBounds,
      },
    },
    camera: {
      mode: "orthographic",
      zoom: 36,
    },
    objects,
    controls: [
      {
        type: "matrix-input",
        id: "matrix-A",
        label: "Matrix A",
        defaultValue: matrix,
      },
      {
        type: "vector-input",
        id: "vector-v",
        label: "Vector v",
        defaultValue: customVector,
      },
      {
        type: "scrubber",
        id: "animation-progress",
        label: "Transformation Progress t",
        defaultValue: progress,
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
    animation: {
      enabled: true,
      durationMs: 2000,
      autoplay: false,
      loop: false,
      speed: 1,
    },
    metadata: {
      title,
      description,
    },
  };
}
