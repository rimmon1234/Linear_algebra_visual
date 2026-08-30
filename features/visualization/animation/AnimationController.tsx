"use client";

import { useFrame } from "@react-three/fiber";
import { useVisualizerStore } from "../store/visualizer-store";

interface AnimationControllerProps {
  onProgressUpdate?: (progress: number) => void;
}

/**
 * High-performance useFrame animation runner.
 * Advances progress according to speed and durationMs without unnecessary top-level state churning.
 */
export function AnimationController({ onProgressUpdate }: AnimationControllerProps) {
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const durationMs = useVisualizerStore((s) => s.durationMs);
  const speed = useVisualizerStore((s) => s.speed);
  const loop = useVisualizerStore((s) => s.loop);
  const setProgress = useVisualizerStore((s) => s.setProgress);
  const pauseAnimation = useVisualizerStore((s) => s.pauseAnimation);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const currentProgress = useVisualizerStore.getState().progress;
    const deltaMs = delta * 1000 * speed;
    const step = deltaMs / Math.max(100, durationMs);
    let nextProgress = currentProgress + step;

    if (nextProgress >= 1) {
      if (loop) {
        nextProgress = nextProgress % 1;
      } else {
        nextProgress = 1;
        pauseAnimation();
      }
    }

    setProgress(nextProgress);
    if (onProgressUpdate) {
      onProgressUpdate(nextProgress);
    }
  });

  return null;
}
