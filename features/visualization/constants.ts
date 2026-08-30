/**
 * Visualization Constants & Centralized Theme Tokens
 * Adhering to ADR-011: Standard right-handed Cartesian coordinates (+X right, +Y up in 2D; +X right, +Y forward/up, +Z depth/up in 3D).
 */

export const COORDINATE_SYSTEM_DEFAULTS = {
  dimension: 2 as const,
  bounds: {
    xMin: -6,
    xMax: 6,
    yMin: -6,
    yMax: 6,
    zMin: -6,
    zMax: 6,
  },
  showGrid: true,
  showAxes: true,
  showLabels: true,
  tickStep: 1,
} as const;

export const VISUALIZATION_THEME = {
  // Reference Coordinate Axes (Fixed World Frame)
  axes: {
    xAxis: "#ef4444", // Red (+X)
    yAxis: "#22c55e", // Green (+Y)
    zAxis: "#3b82f6", // Blue (+Z)
    origin: "#f8fafc", // White origin marker
    tick: "#475569",  // Slate-600
    tickLabel: "#94a3b8", // Slate-400
  },
  // Reference Cartesian Background Grid (Fixed World Frame)
  grid: {
    primary: "#334155",   // Slate-700 major grid lines
    secondary: "#1e293b", // Slate-800 minor grid lines
    subspace: "rgba(99, 102, 241, 0.15)", // Indigo translucent
  },
  // Transformed Coordinate Mesh (Dynamic Transformation Layer)
  transformedGrid: {
    minor: "#0284c7", // Sky-600
    major: "#38bdf8", // Sky-400
    axis: "#818cf8",  // Indigo-400
  },
  // Transformed Unit Square Parallelogram
  unitSquare: {
    standard: "#10b981", // Emerald-500 (det > 0, orientation preserved)
    reflected: "#f43f5e", // Rose-500 (det < 0, orientation reversed)
    singular: "#64748b",  // Slate-500 (det = 0, collapsed)
  },
  // Standard and Transformed Basis Vectors
  basisVectors: {
    e1: "#06b6d4", // Cyan-500
    e2: "#ec4899", // Pink-500
  },
  // Default and Custom Vectors
  vectors: {
    primary: "#6366f1",   // Indigo-500
    secondary: "#06b6d4", // Cyan-500
    tertiary: "#f59e0b",  // Amber-500
    transformed: "#ec4899", // Pink-500
    highlight: "#a855f7", // Purple-500
    custom: "#f59e0b",    // Amber-500
    reference: "#475569", // Slate-600
  },
  // Linearity Demonstration Vectors
  linearity: {
    vectorU: "#38bdf8",   // Sky-400
    vectorV: "#34d399",   // Emerald-400
    vectorSum: "#fbbf24", // Amber-400
    parallelogramLine: "#64748b", // Slate-500
  },
  // Geometric primitives
  points: {
    default: "#38bdf8", // Sky-400
    origin: "#f8fafc",
  },
  planes: {
    default: "rgba(99, 102, 241, 0.25)",
    border: "#6366f1",
  },
  lines: {
    default: "#94a3b8",
  },
  labels: {
    text: "#f8fafc",
    background: "rgba(2, 6, 23, 0.8)",
    border: "rgba(51, 65, 85, 0.5)",
  },
} as const;

export const CAMERA_DEFAULTS = {
  // 2D Orthographic Camera: 36px/unit provides stable 1:1 scale
  orthographic2D: {
    position: [0, 0, 10] as [number, number, number],
    zoom: 36,
    near: 0.1,
    far: 1000,
  },
  // 3D Perspective Camera
  perspective3D: {
    position: [7.5, 5.5, 8.5] as [number, number, number],
    fov: 42,
    near: 0.1,
    far: 1000,
  },
  // 3D Orthographic Camera
  orthographic3D: {
    position: [7.5, 5.5, 8.5] as [number, number, number],
    zoom: 30,
    near: 0.1,
    far: 1000,
  },
} as const;
