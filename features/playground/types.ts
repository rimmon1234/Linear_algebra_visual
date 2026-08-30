import { z } from "zod";
import { VisualizationSpecSchema } from "@/features/visualization/schema";

export const PlaygroundResponseSchema = z.object({
  topicId: z.string().optional(),
  problemType: z.string(),
  answer: z.string(),
  steps: z.array(z.string()).default([]),
  conceptualExplanation: z.string().optional(),
  verification: z.record(z.unknown()).optional(),
  visualization: VisualizationSpecSchema.optional(),
  caveats: z.array(z.string()).optional(),
});

export type PlaygroundResponse = z.infer<typeof PlaygroundResponseSchema>;
