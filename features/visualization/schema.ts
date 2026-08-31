import { z } from "zod";

export const VisualizationTypeSchema = z.enum([
  "vector",
  "vectors",
  "line",
  "plane",
  "subspace",
  "basis",
  "matrix-transformation",
  "linear-transformation",
  "characteristic-equation",
  "characteristic-polynomial",
  "projection",
  "orthogonal-complement",
  "eigenvectors",
  "eigenvalue-transformation",
  "diagonalization",
  "surface",
  "trajectory",
  "least-squares",
  "qr-decomposition",
  "svd",
  "unit-sphere",
  "ellipsoid",
  "placeholder",
]);

export const CoordinateSystemSpecSchema = z.object({
  dimension: z.union([z.literal(2), z.literal(3)]),
  showAxes: z.boolean().optional().default(true),
  showGrid: z.boolean().optional().default(true),
  showLabels: z.boolean().optional().default(true),
  bounds: z
    .object({
      xMin: z.number().optional().default(-5),
      xMax: z.number().optional().default(5),
      yMin: z.number().optional().default(-5),
      yMax: z.number().optional().default(5),
      zMin: z.number().optional().default(-5),
      zMax: z.number().optional().default(5),
    })
    .optional(),
});

export const CameraSpecSchema = z.object({
  mode: z.enum(["perspective", "orthographic"]).optional().default("perspective"),
  position: z.array(z.number()).optional(),
  target: z.array(z.number()).optional(),
  zoom: z.number().optional(),
});

// Specific primitive object schemas
export const VectorObjectSpecSchema = z.object({
  type: z.literal("vector"),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  origin: z.array(z.number()).optional(),
  value: z.array(z.number()),
  draggable: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const PointObjectSpecSchema = z.object({
  type: z.literal("point"),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  position: z.array(z.number()),
  radius: z.number().optional(),
  visible: z.boolean().optional(),
});

export const LineObjectSpecSchema = z.object({
  type: z.literal("line"),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  start: z.array(z.number()),
  end: z.array(z.number()),
  dashed: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const PlaneObjectSpecSchema = z.object({
  type: z.literal("plane"),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  origin: z.array(z.number()).optional(),
  normal: z.array(z.number()).optional(),
  spanningVectors: z.array(z.array(z.number())).optional(),
  size: z.number().optional(),
  opacity: z.number().optional(),
  visible: z.boolean().optional(),
});

export const GenericObjectSpecSchema = z.object({
  type: z.string(),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  visible: z.boolean().optional(),
  properties: z.record(z.unknown()).optional(),
});

export const VisualizationObjectSchema = z.union([
  VectorObjectSpecSchema,
  PointObjectSpecSchema,
  LineObjectSpecSchema,
  PlaneObjectSpecSchema,
  GenericObjectSpecSchema,
]);

export const VisualizationControlSchema = z.object({
  type: z.enum([
    "slider",
    "number-input",
    "vector-input",
    "matrix-input",
    "toggle",
    "select",
    "button",
    "scrubber",
  ]),
  id: z.string(),
  label: z.string(),
  defaultValue: z.unknown().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

export const AnimationSpecSchema = z.object({
  enabled: z.boolean().optional().default(false),
  durationMs: z.number().optional().default(2000),
  autoplay: z.boolean().optional().default(false),
  loop: z.boolean().optional().default(false),
  speed: z.number().optional().default(1),
});

export const VisualizationSpecSchema = z.object({
  version: z.literal(1),
  type: VisualizationTypeSchema,
  dimension: z.union([z.literal(2), z.literal(3)]),
  coordinateSystem: CoordinateSystemSpecSchema,
  camera: CameraSpecSchema.optional(),
  objects: z.array(VisualizationObjectSchema).optional().default([]),
  controls: z.array(VisualizationControlSchema).optional().default([]),
  animation: AnimationSpecSchema.optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export type VisualizationType = z.infer<typeof VisualizationTypeSchema>;
export type CoordinateSystemSpec = z.infer<typeof CoordinateSystemSpecSchema>;
export type CameraSpec = z.infer<typeof CameraSpecSchema>;
export type VectorObjectSpec = z.infer<typeof VectorObjectSpecSchema>;
export type PointObjectSpec = z.infer<typeof PointObjectSpecSchema>;
export type LineObjectSpec = z.infer<typeof LineObjectSpecSchema>;
export type PlaneObjectSpec = z.infer<typeof PlaneObjectSpecSchema>;
export type VisualizationObject = z.infer<typeof VisualizationObjectSchema>;
export type VisualizationControl = z.infer<typeof VisualizationControlSchema>;
export type AnimationSpec = z.infer<typeof AnimationSpecSchema>;
export type VisualizationSpec = z.infer<typeof VisualizationSpecSchema>;
