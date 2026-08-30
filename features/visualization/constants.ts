/**
 * Visualization Constants & Theme Tokens
 * Adhering to ADR-011: Standard right-handed Cartesian coordinates (+X right, +Y up in 2D; +X right, +Y forward/up, +Z depth/up in 3D).
 */

export const COORDINATE_SYSTEM_DEFAULTS = {
  dimension: 2 as const,
  bounds: {
    xMin: -5,
    xMax: 5,
    yMin: -5,
    yMax: 5,
    zMin: -5,
    zMax: 5,
  },
  showGrid: true,
  showAxes: true,
  showLabels: true,
  tickStep: 1,
} as const;

export const VISUALIZATION_THEME = {
  // Axis colors (ADR-011 convention)
  axes: {
    xAxis: "#ef4444", // Red (+X)
    yAxis: "#22c55e", // Green (+Y)
    zAxis: "#3b82f6", // Blue (+Z)
    origin: "#f8fafc",
    tick: "#475569",  // Slate-600
    tickLabel: "#94a3b8", // Slate-400
  },
  // Grid colors
  grid: {
    primary: "#334155",   // Slate-700
    secondary: "#1e293b", // Slate-800
    subspace: "rgba(99, 102, 241, 0.15)", // Indigo translucent
  },
  // Default vector colors
  vectors: {
    primary: "#6366f1",   // Indigo-500
    secondary: "#06b6d4", // Cyan-500
    tertiary: "#f59e0b",  // Amber-500
    transformed: "#ec4899", // Pink-500
    highlight: "#a855f7", // Purple-500
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
    background: "rgba(15, 23, 42, 0.85)",
    border: "#334155",
  },
} as const;

export const CAMERA_DEFAULTS = {
  // 2D Orthographic Camera: 36px/unit fits [-5, 5] vertically in 460px with ideal margin
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
