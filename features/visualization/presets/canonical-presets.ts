import type { VisualizationSpec } from "../schema";

/**
 * Canonical 2D Demo Scene (User Adjustment 8)
 * Demonstrates 2D vectors, parallelogram sum lines, points, and coordinate grid.
 */
export const CANONICAL_2D_DEMO_SPEC: VisualizationSpec = {
  version: 1,
  type: "vector",
  dimension: 2,
  coordinateSystem: {
    dimension: 2,
    showAxes: true,
    showGrid: true,
    showLabels: true,
    bounds: {
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      zMin: -6,
      zMax: 6,
    },
  },
  objects: [
    {
      type: "vector",
      id: "v1",
      label: "v₁ = [3, 1.5]",
      color: "#6366f1", // Indigo
      value: [3, 1.5],
      origin: [0, 0],
    },
    {
      type: "vector",
      id: "v2",
      label: "v₂ = [-1.5, 2.5]",
      color: "#06b6d4", // Cyan
      value: [-1.5, 2.5],
      origin: [0, 0],
    },
    {
      type: "vector",
      id: "v_sum",
      label: "v₁ + v₂ = [1.5, 4]",
      color: "#f59e0b", // Amber
      value: [1.5, 4],
      origin: [0, 0],
    },
    {
      type: "point",
      id: "pt-sum",
      label: "(1.5, 4)",
      position: [1.5, 4],
      color: "#f59e0b",
      radius: 0.1,
    },
    {
      type: "line",
      id: "line-1",
      start: [3, 1.5],
      end: [1.5, 4],
      color: "#64748b",
      dashed: true,
    },
    {
      type: "line",
      id: "line-2",
      start: [-1.5, 2.5],
      end: [1.5, 4],
      color: "#64748b",
      dashed: true,
    },
  ],
  controls: [],
  animation: {
    enabled: false,
    durationMs: 2000,
    autoplay: false,
    loop: false,
    speed: 1,
  },
  metadata: {
    title: "Canonical 2D Vector Space Demo",
    description: "Interactive 2D vectors and linear combination parallelogram.",
  },
};

/**
 * Canonical 3D Demo Scene (User Adjustment 8)
 * Demonstrates 3D vectors, 3D plane subspace, points, and 3D coordinate frame.
 */
export const CANONICAL_3D_DEMO_SPEC: VisualizationSpec = {
  version: 1,
  type: "vector",
  dimension: 3,
  coordinateSystem: {
    dimension: 3,
    showAxes: true,
    showGrid: true,
    showLabels: true,
    bounds: {
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      zMin: -6,
      zMax: 6,
    },
  },
  camera: {
    mode: "perspective",
    position: [8, 6, 9],
    target: [0, 0, 0],
  },
  objects: [
    {
      type: "vector",
      id: "u3",
      label: "u = [2, 3, 2]",
      color: "#6366f1", // Indigo
      value: [2, 3, 2],
      origin: [0, 0, 0],
    },
    {
      type: "vector",
      id: "v3",
      label: "v = [-2, 2, 1]",
      color: "#06b6d4", // Cyan
      value: [-2, 2, 1],
      origin: [0, 0, 0],
    },
    {
      type: "vector",
      id: "w3",
      label: "w = [0, 1, 3]",
      color: "#ec4899", // Pink
      value: [0, 1, 3],
      origin: [0, 0, 0],
    },
    {
      type: "plane",
      id: "xy-subspace",
      label: "Span(u, v)",
      color: "#6366f1",
      origin: [0, 0, 0],
      spanningVectors: [
        [2, 3, 2],
        [-2, 2, 1],
      ],
      size: 8,
      opacity: 0.25,
    },
    {
      type: "point",
      id: "pt-u",
      label: "U",
      position: [2, 3, 2],
      color: "#6366f1",
      radius: 0.12,
    },
  ],
  controls: [],
  animation: {
    enabled: false,
    durationMs: 2000,
    autoplay: false,
    loop: false,
    speed: 1,
  },
  metadata: {
    title: "Canonical 3D Subspace & Vectors Demo",
    description: "Interactive 3D vectors with span subspace plane.",
  },
};
