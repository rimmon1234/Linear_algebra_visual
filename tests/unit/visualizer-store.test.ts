import { describe, it, expect, beforeEach } from "vitest";
import { useVisualizerStore } from "@/features/visualization/store/visualizer-store";

describe("Visualizer Zustand Store (User Adjustment 3)", () => {
  beforeEach(() => {
    useVisualizerStore.setState({
      dimension: 2,
      cameraResetCounter: 0,
      activeTool: "select",
      selectedObjectId: null,
      hoveredObjectId: null,
      isPlaying: false,
      progress: 0,
      speed: 1,
      durationMs: 2000,
      loop: false,
      autoplay: false,
    });
  });

  it("initializes with default visualizer state", () => {
    const state = useVisualizerStore.getState();
    expect(state.dimension).toBe(2);
    expect(state.isPlaying).toBe(false);
    expect(state.progress).toBe(0);
    expect(state.speed).toBe(1);
    expect(state.cameraResetCounter).toBe(0);
  });

  it("updates dimension between 2D and 3D", () => {
    useVisualizerStore.getState().setDimension(3);
    expect(useVisualizerStore.getState().dimension).toBe(3);

    useVisualizerStore.getState().setDimension(2);
    expect(useVisualizerStore.getState().dimension).toBe(2);
  });

  it("increments camera reset counter on trigger", () => {
    useVisualizerStore.getState().triggerCameraReset();
    expect(useVisualizerStore.getState().cameraResetCounter).toBe(1);

    useVisualizerStore.getState().triggerCameraReset();
    expect(useVisualizerStore.getState().cameraResetCounter).toBe(2);
  });

  it("manages animation playback states correctly", () => {
    useVisualizerStore.getState().playAnimation();
    expect(useVisualizerStore.getState().isPlaying).toBe(true);

    useVisualizerStore.getState().pauseAnimation();
    expect(useVisualizerStore.getState().isPlaying).toBe(false);

    useVisualizerStore.getState().togglePlayback();
    expect(useVisualizerStore.getState().isPlaying).toBe(true);

    useVisualizerStore.getState().setProgress(0.75);
    expect(useVisualizerStore.getState().progress).toBe(0.75);

    // Clamps out of range progress
    useVisualizerStore.getState().setProgress(1.5);
    expect(useVisualizerStore.getState().progress).toBe(1);

    useVisualizerStore.getState().setProgress(-0.5);
    expect(useVisualizerStore.getState().progress).toBe(0);

    useVisualizerStore.getState().resetAnimation();
    expect(useVisualizerStore.getState().isPlaying).toBe(false);
    expect(useVisualizerStore.getState().progress).toBe(0);
  });
});
