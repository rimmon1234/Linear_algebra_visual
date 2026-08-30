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
  showAxes: z.boolean().default(true),
  showGrid: z.boolean().default(true),
  showLabels: z.boolean().default(true),
  bounds: z
    .object({
      xMin: z.number().default(-5),
      xMax: z.number().default(5),
      yMin: z.number().default(-5),
      yMax: z.number().default(5),
      zMin: z.number().optional().default(-5),
      zMax: z.number().optional().default(5),
    })
    .optional(),
});

export const VisualizationObjectSchema = z.object({
  type: z.string(),
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  visible: z.boolean().optional().default(true),
  properties: z.record(z.unknown()).optional(),
});

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
  enabled: z.boolean().default(false),
  durationMs: z.number().default(2000),
  autoplay: z.boolean().optional().default(false),
  loop: z.boolean().optional().default(false),
});

export const VisualizationSpecSchema = z.object({
  version: z.literal(1),
  type: VisualizationTypeSchema,
  dimension: z.union([z.literal(2), z.literal(3)]),
  coordinateSystem: CoordinateSystemSpecSchema,
  objects: z.array(VisualizationObjectSchema).default([]),
  controls: z.array(VisualizationControlSchema).default([]),
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
export type VisualizationObject = z.infer<typeof VisualizationObjectSchema>;
export type VisualizationControl = z.infer<typeof VisualizationControlSchema>;
export type AnimationSpec = z.infer<typeof AnimationSpecSchema>;
export type VisualizationSpec = z.infer<typeof VisualizationSpecSchema>;
