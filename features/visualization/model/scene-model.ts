import type {
  VisualizationSpec,
  VectorObjectSpec,
  PointObjectSpec,
  LineObjectSpec,
  PlaneObjectSpec,
} from "../schema";
import {
  toVec3,
  computeVectorOrientation,
  computePlaneNormal,
  type Vector3Tuple,
  type VectorOrientation,
} from "./coordinates";
import { VISUALIZATION_THEME, COORDINATE_SYSTEM_DEFAULTS } from "../constants";

export interface NormalizedVectorModel {
  id: string;
  type: "vector";
  label?: string;
  color: string;
  visible: boolean;
  draggable: boolean;
  value: Vector3Tuple;
  origin: Vector3Tuple;
  orientation: VectorOrientation;
}

export interface NormalizedPointModel {
  id: string;
  type: "point";
  label?: string;
  color: string;
  visible: boolean;
  position: Vector3Tuple;
  radius: number;
}

export interface NormalizedLineModel {
  id: string;
  type: "line";
  label?: string;
  color: string;
  visible: boolean;
  start: Vector3Tuple;
  end: Vector3Tuple;
  dashed: boolean;
}

export interface NormalizedPlaneModel {
  id: string;
  type: "plane";
  label?: string;
  color: string;
  visible: boolean;
  origin: Vector3Tuple;
  normal: Vector3Tuple;
  isCollinearFallback: boolean;
  size: number;
  opacity: number;
}

export interface NormalizedSceneModel {
  dimension: 2 | 3;
  coordinateSystem: {
    showAxes: boolean;
    showGrid: boolean;
    showLabels: boolean;
    bounds: {
      xMin: number;
      xMax: number;
      yMin: number;
      yMax: number;
      zMin: number;
      zMax: number;
    };
  };
  camera: {
    mode: "perspective" | "orthographic";
    position?: Vector3Tuple;
    target?: Vector3Tuple;
    zoom?: number;
  };
  vectors: NormalizedVectorModel[];
  points: NormalizedPointModel[];
  lines: NormalizedLineModel[];
  planes: NormalizedPlaneModel[];
  animation?: {
    enabled: boolean;
    durationMs: number;
    autoplay: boolean;
    loop: boolean;
    speed: number;
  };
}

/**
 * Transforms a validated VisualizationSpec into a normalized, renderer-ready SceneModel.
 */
export function buildSceneModel(spec: VisualizationSpec): NormalizedSceneModel {
  const dimension = spec.dimension;
  const coordSpec = spec.coordinateSystem;

  const bounds = {
    xMin: coordSpec.bounds?.xMin ?? COORDINATE_SYSTEM_DEFAULTS.bounds.xMin,
    xMax: coordSpec.bounds?.xMax ?? COORDINATE_SYSTEM_DEFAULTS.bounds.xMax,
    yMin: coordSpec.bounds?.yMin ?? COORDINATE_SYSTEM_DEFAULTS.bounds.yMin,
    yMax: coordSpec.bounds?.yMax ?? COORDINATE_SYSTEM_DEFAULTS.bounds.yMax,
    zMin: coordSpec.bounds?.zMin ?? COORDINATE_SYSTEM_DEFAULTS.bounds.zMin,
    zMax: coordSpec.bounds?.zMax ?? COORDINATE_SYSTEM_DEFAULTS.bounds.zMax,
  };

  const cameraMode = spec.camera?.mode ?? (dimension === 2 ? "orthographic" : "perspective");
  const cameraTarget: Vector3Tuple = spec.camera?.target ? toVec3(spec.camera.target) : [0, 0, 0];
  const cameraPos: Vector3Tuple | undefined = spec.camera?.position ? toVec3(spec.camera.position) : undefined;

  const vectors: NormalizedVectorModel[] = [];
  const points: NormalizedPointModel[] = [];
  const lines: NormalizedLineModel[] = [];
  const planes: NormalizedPlaneModel[] = [];

  for (const obj of spec.objects) {
    if (obj.type === "vector") {
      const vObj = obj as VectorObjectSpec;
      const origin = toVec3(vObj.origin);
      const val3 = toVec3(vObj.value);
      const orientation = computeVectorOrientation(val3, origin);

      vectors.push({
        id: vObj.id,
        type: "vector",
        label: vObj.label,
        color: vObj.color ?? VISUALIZATION_THEME.vectors.primary,
        visible: vObj.visible ?? true,
        draggable: vObj.draggable ?? false,
        value: val3,
        origin,
        orientation,
      });
    } else if (obj.type === "point") {
      const pObj = obj as PointObjectSpec;
      points.push({
        id: pObj.id,
        type: "point",
        label: pObj.label,
        color: pObj.color ?? VISUALIZATION_THEME.points.default,
        visible: pObj.visible ?? true,
        position: toVec3(pObj.position),
        radius: pObj.radius ?? 0.1,
      });
    } else if (obj.type === "line") {
      const lObj = obj as LineObjectSpec;
      lines.push({
        id: lObj.id,
        type: "line",
        label: lObj.label,
        color: lObj.color ?? VISUALIZATION_THEME.lines.default,
        visible: lObj.visible ?? true,
        start: toVec3(lObj.start),
        end: toVec3(lObj.end),
        dashed: lObj.dashed ?? false,
      });
    } else if (obj.type === "plane") {
      const plObj = obj as PlaneObjectSpec;
      const origin = toVec3(plObj.origin);
      let normal: Vector3Tuple = [0, 0, 1];
      let isCollinear = false;

      if (plObj.normal && plObj.normal.length === 3) {
        normal = toVec3(plObj.normal);
      } else if (plObj.spanningVectors && plObj.spanningVectors.length === 2) {
        const res = computePlaneNormal(plObj.spanningVectors[0], plObj.spanningVectors[1]);
        normal = res.normal;
        isCollinear = res.isCollinear;
      }

      planes.push({
        id: plObj.id,
        type: "plane",
        label: plObj.label,
        color: plObj.color ?? VISUALIZATION_THEME.planes.default,
        visible: plObj.visible ?? true,
        origin,
        normal,
        isCollinearFallback: isCollinear,
        size: plObj.size ?? 6,
        opacity: plObj.opacity ?? 0.3,
      });
    }
  }

  return {
    dimension,
    coordinateSystem: {
      showAxes: coordSpec.showAxes ?? true,
      showGrid: coordSpec.showGrid ?? true,
      showLabels: coordSpec.showLabels ?? true,
      bounds,
    },
    camera: {
      mode: cameraMode,
      position: cameraPos,
      target: cameraTarget,
      zoom: spec.camera?.zoom,
    },
    vectors,
    points,
    lines,
    planes,
    animation: spec.animation
      ? {
          enabled: spec.animation.enabled ?? false,
          durationMs: spec.animation.durationMs ?? 2000,
          autoplay: spec.animation.autoplay ?? false,
          loop: spec.animation.loop ?? false,
          speed: spec.animation.speed ?? 1,
        }
      : undefined,
  };
}
