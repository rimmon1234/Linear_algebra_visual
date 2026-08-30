import { describe, it, expect } from "vitest";
import { buildTransformationSpec } from "@/features/visualization/model/transformation-model";
import { useVisualizerStore } from "@/features/visualization/store/visualizer-store";

describe("Visualization Layer: Transformation Model Compiler & Visualizer Architecture", () => {
  it("builds a valid VisualizationSpec for Identity Matrix", () => {
    const spec = buildTransformationSpec({
      matrix: [
        [1, 0],
        [0, 1],
      ],
      progress: 0,
      customVector: [2, 1],
    });

    expect(spec.version).toBe(1);
    expect(spec.type).toBe("matrix-transformation");
    expect(spec.dimension).toBe(2);

    const basisE1 = spec.objects.find((o) => o.id === "basis-e1");
    const basisE2 = spec.objects.find((o) => o.id === "basis-e2");
    const customV = spec.objects.find((o) => o.id === "custom-v");

    expect(basisE1).toBeDefined();
    expect(basisE2).toBeDefined();
    expect(customV).toBeDefined();

    if (basisE1 && "value" in basisE1) expect(basisE1.value).toEqual([1, 0]);
    if (basisE2 && "value" in basisE2) expect(basisE2.value).toEqual([0, 1]);
    if (customV && "value" in customV) expect(customV.value).toEqual([2, 1]);
  });

  it("enforces the Column Invariant: Ae1 = col1(A), Ae2 = col2(A) at full transformation (progress = 1)", () => {
    const A = [
      [3, -1.5],
      [2, 4],
    ];

    const spec = buildTransformationSpec({
      matrix: A,
      progress: 1,
      customVector: [1, 2],
    });

    const basisE1 = spec.objects.find((o) => o.id === "basis-e1");
    const basisE2 = spec.objects.find((o) => o.id === "basis-e2");
    const customV = spec.objects.find((o) => o.id === "custom-v");

    if (basisE1 && "value" in basisE1) expect(basisE1.value).toEqual([3, 2]); // Column 1
    if (basisE2 && "value" in basisE2) expect(basisE2.value).toEqual([-1.5, 4]); // Column 2
    if (customV && "value" in customV) expect(customV.value).toEqual([0, 10]); // [3*1 + -1.5*2, 2*1 + 4*2] = [0, 10]
  });

  it("handles very large scaling matrices and large vectors by expanding bounds safely", () => {
    const spec = buildTransformationSpec({
      matrix: [
        [10, 0],
        [0, 8],
      ],
      progress: 1,
      customVector: [20, 15],
    });

    const bounds = spec.coordinateSystem?.bounds;
    expect(bounds).toBeDefined();
    expect(bounds?.xMax).toBeGreaterThanOrEqual(24);
    expect(Number.isFinite(bounds?.xMax)).toBe(true);
    expect(Number.isFinite(bounds?.yMax)).toBe(true);
  });

  it("handles very small transformations without collapsing bounds below minimum threshold", () => {
    const spec = buildTransformationSpec({
      matrix: [
        [0.1, 0],
        [0, 0.2],
      ],
      progress: 1,
      customVector: [0.2, 0.1],
    });

    const bounds = spec.coordinateSystem?.bounds;
    expect(bounds?.xMax).toBeGreaterThanOrEqual(6);
    expect(bounds?.yMax).toBeGreaterThanOrEqual(6);
  });

  it("handles singular matrices (det = 0) without producing NaN or Infinity", () => {
    const spec = buildTransformationSpec({
      matrix: [
        [1, 0],
        [0, 0],
      ],
      progress: 1,
      customVector: [0, 5],
    });

    const customV = spec.objects.find((o) => o.id === "custom-v");
    if (customV && "value" in customV) {
      expect(customV.value).toEqual([0, 0]); // Projection onto x-axis maps [0, 5] to [0, 0]
      expect(Number.isFinite(customV.value[0])).toBe(true);
      expect(Number.isFinite(customV.value[1])).toBe(true);
    }
  });

  it("handles rotations, reflections, and shears accurately", () => {
    // 90 deg rotation
    const rotSpec = buildTransformationSpec({
      matrix: [
        [0, -1],
        [1, 0],
      ],
      progress: 1,
    });
    const basisE1 = rotSpec.objects.find((o) => o.id === "basis-e1");
    if (basisE1 && "value" in basisE1) expect(basisE1.value).toEqual([0, 1]);

    // Reflection across y-axis
    const refSpec = buildTransformationSpec({
      matrix: [
        [-1, 0],
        [0, 1],
      ],
      progress: 1,
    });
    const refE1 = refSpec.objects.find((o) => o.id === "basis-e1");
    if (refE1 && "value" in refE1) expect(refE1.value).toEqual([-1, 0]);

    // Horizontal shear
    const shearSpec = buildTransformationSpec({
      matrix: [
        [1, 1.5],
        [0, 1],
      ],
      progress: 1,
    });
    const shearE2 = shearSpec.objects.find((o) => o.id === "basis-e2");
    if (shearE2 && "value" in shearE2) expect(shearE2.value).toEqual([1.5, 1]);
  });

  it("handles zero vector safely", () => {
    const spec = buildTransformationSpec({
      matrix: [
        [2, 0],
        [0, 2],
      ],
      progress: 1,
      customVector: [0, 0],
    });

    const customV = spec.objects.find((o) => o.id === "custom-v");
    expect(customV).toBeDefined();
    if (customV && "value" in customV) {
      expect(customV.value).toEqual([0, 0]);
    }
  });

  it("REGRESSION TEST 1: Reference coordinate system remains horizontal and vertical regardless of matrix", () => {
    const rotSpec = buildTransformationSpec({
      matrix: [
        [0, -1],
        [1, 0],
      ],
      progress: 1,
    });

    // Reference axes in spec coordinateSystem are strictly symmetric Cartesian bounds
    const bounds = rotSpec.coordinateSystem?.bounds;
    expect(bounds?.xMin).toBeLessThan(0);
    expect(bounds?.xMax).toBeGreaterThan(0);
    expect(bounds?.yMin).toBeLessThan(0);
    expect(bounds?.yMax).toBeGreaterThan(0);
    expect(bounds?.xMax).toEqual(bounds?.yMax);
  });

  it("REGRESSION TEST 2: Visualizer store Camera Reset and Fit Scene act independently of matrix state", () => {
    const store = useVisualizerStore.getState();
    const initialResetCount = store.cameraResetCounter;
    const initialFitCount = store.fitSceneCounter;

    // Trigger Camera Reset
    store.triggerCameraReset();
    expect(useVisualizerStore.getState().cameraResetCounter).toBe(initialResetCount + 1);

    // Trigger Fit Scene
    store.triggerFitScene({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    expect(useVisualizerStore.getState().fitSceneCounter).toBe(initialFitCount + 1);
    expect(useVisualizerStore.getState().fitSceneBounds).toEqual({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
    });
  });
});
