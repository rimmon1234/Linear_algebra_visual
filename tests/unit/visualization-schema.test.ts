import { describe, it, expect } from "vitest";
import {
  VisualizationSpecSchema,
  type VisualizationSpec,
} from "@/features/visualization/schema";
import {
  CANONICAL_2D_DEMO_SPEC,
  CANONICAL_3D_DEMO_SPEC,
} from "@/features/visualization/presets/canonical-presets";
import { buildSceneModel } from "@/features/visualization/model/scene-model";

describe("Visualization Layer Schema & Spec Validation", () => {
  it("successfully parses a valid 2D matrix-transformation specification", () => {
    const validSpec = {
      version: 1,
      type: "matrix-transformation",
      dimension: 2,
      coordinateSystem: {
        dimension: 2,
        showAxes: true,
        showGrid: true,
        showLabels: true,
      },
      objects: [
        {
          type: "vector",
          id: "v1",
          label: "v",
          value: [2, 3],
        },
      ],
      controls: [
        {
          type: "matrix-input",
          id: "matrix-A",
          label: "Transformation Matrix A",
        },
      ],
      animation: {
        enabled: true,
        durationMs: 1500,
      },
    };

    const parsed = VisualizationSpecSchema.safeParse(validSpec);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.type).toBe("matrix-transformation");
      expect(parsed.data.dimension).toBe(2);
      expect(parsed.data.objects).toHaveLength(1);
    }
  });

  it("validates and builds scene model for CANONICAL_2D_DEMO_SPEC (User Adjustment 8)", () => {
    const parsed = VisualizationSpecSchema.safeParse(CANONICAL_2D_DEMO_SPEC);
    expect(parsed.success).toBe(true);

    const model = buildSceneModel(CANONICAL_2D_DEMO_SPEC);
    expect(model.dimension).toBe(2);
    expect(model.vectors).toHaveLength(3);
    expect(model.points).toHaveLength(0);
    expect(model.lines).toHaveLength(2);
    expect(model.coordinateSystem.showAxes).toBe(true);
    expect(model.coordinateSystem.showGrid).toBe(true);
  });

  it("validates and builds scene model for CANONICAL_3D_DEMO_SPEC (User Adjustment 8)", () => {
    const parsed = VisualizationSpecSchema.safeParse(CANONICAL_3D_DEMO_SPEC);
    expect(parsed.success).toBe(true);

    const model = buildSceneModel(CANONICAL_3D_DEMO_SPEC);
    expect(model.dimension).toBe(3);
    expect(model.vectors).toHaveLength(3);
    expect(model.planes).toHaveLength(1);
    expect(model.points).toHaveLength(0);
    expect(model.camera.mode).toBe("perspective");
  });

  it("rejects an invalid specification with wrong version or missing fields", () => {
    const invalidSpec = {
      version: 2, // invalid version
      type: "unsupported-nonexistent-type",
      dimension: 4, // dimension > 3 invalid
    };

    const parsed = VisualizationSpecSchema.safeParse(invalidSpec);
    expect(parsed.success).toBe(false);
  });
});
