import { create } from "zustand";

export interface VisualizerState {
  // Dimension & Camera
  dimension: 2 | 3;
  cameraResetCounter: number;
  fitSceneCounter: number;
  fitSceneBounds: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  activeTool: "select" | "pan" | "orbit";

  // Selection & Interactivity
  selectedObjectId: string | null;
  hoveredObjectId: string | null;

  // Animation State
  isPlaying: boolean;
  progress: number; // 0.0 to 1.0
  speed: number;    // e.g. 0.5, 1.0, 2.0
  durationMs: number;
  loop: boolean;
  autoplay: boolean;

  // Actions
  triggerCameraReset: () => void;
  triggerFitScene: (bounds?: { xMin: number; xMax: number; yMin: number; yMax: number }) => void;
  setDimension: (dimension: 2 | 3) => void;
  setSelectedObjectId: (id: string | null) => void;
  setHoveredObjectId: (id: string | null) => void;
  setActiveTool: (tool: "select" | "pan" | "orbit") => void;

  // Animation Actions
  playAnimation: () => void;
  pauseAnimation: () => void;
  togglePlayback: () => void;
  resetAnimation: () => void;
  setProgress: (progress: number) => void;
  setSpeed: (speed: number) => void;
  updateAnimationSpec: (durationMs: number, loop?: boolean, autoplay?: boolean) => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  dimension: 2,
  cameraResetCounter: 0,
  fitSceneCounter: 0,
  fitSceneBounds: null,
  activeTool: "select",
  selectedObjectId: null,
  hoveredObjectId: null,

  isPlaying: false,
  progress: 0,
  speed: 1,
  durationMs: 2000,
  loop: false,
  autoplay: false,

  triggerCameraReset: () =>
    set((state) => ({ cameraResetCounter: state.cameraResetCounter + 1 })),

  triggerFitScene: (bounds) =>
    set((state) => ({
      fitSceneCounter: state.fitSceneCounter + 1,
      fitSceneBounds: bounds ?? null,
    })),

  setDimension: (dimension) => set({ dimension }),

  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  setHoveredObjectId: (id) => set({ hoveredObjectId: id }),

  setActiveTool: (activeTool) => set({ activeTool }),

  playAnimation: () => set({ isPlaying: true }),

  pauseAnimation: () => set({ isPlaying: false }),

  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

  resetAnimation: () => set({ isPlaying: false, progress: 0 }),

  setProgress: (progress) =>
    set({ progress: Math.max(0, Math.min(1, progress)) }),

  setSpeed: (speed) => set({ speed }),

  updateAnimationSpec: (durationMs, loop = false, autoplay = false) =>
    set({ durationMs, loop, autoplay, isPlaying: autoplay, progress: 0 }),
}));
