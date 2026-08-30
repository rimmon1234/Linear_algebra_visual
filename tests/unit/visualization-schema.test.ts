import { describe, it, expect } from "vitest";
import {
  VisualizationSpecSchema,
  type VisualizationSpec,
} from "@/features/visualization/schema";

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
          properties: {
            x: 2,
            y: 3,
          },
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
