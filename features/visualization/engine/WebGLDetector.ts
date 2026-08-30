/**
 * Lightweight WebGL capability detection (User Adjustment 7).
 * Avoids heavy device-specific heuristics while safely detecting WebGL availability.
 */

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
