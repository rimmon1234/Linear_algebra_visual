/**
 * Visualization Constants & Coordinate System Standards
 * Adhering to ADR-011: Standard right-handed Cartesian coordinates.
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

export const AXIS_COLORS = {
  xAxis: "#ef4444", // Red
  yAxis: "#22c55e", // Green
  zAxis: "#3b82f6", // Blue
  grid: "#334155",  // Slate-700
} as const;
