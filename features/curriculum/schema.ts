import { z } from "zod";

export const TopicStatusSchema = z.enum(["draft", "published", "archived"]);

export const DifficultySchema = z.enum(["introductory", "intermediate", "advanced"]);

export const TopicSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum([
    "why-it-matters",
    "definition",
    "intuition",
    "formal-math",
    "geometric-interpretation",
    "worked-example",
    "experiment",
    "common-mistakes",
    "summary",
  ]),
  content: z.string(),
  formula: z.string().optional(),
  callout: z
    .object({
      type: z.enum(["note", "tip", "warning", "misconception"]),
      text: z.string(),
    })
    .optional(),
});

export const ExampleSchema = z.object({
  id: z.string(),
  title: z.string(),
  statement: z.string(),
  steps: z.array(z.string()),
  solution: z.string(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  difficulty: DifficultySchema,
  question: z.string(),
  expectedAnswer: z.string().optional(),
  hints: z.array(z.string()).default([]),
  solution: z.string(),
  visualizationPresetId: z.string().optional(),
});

export const VisualizationPresetRefSchema = z.object({
  presetId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dimension: z.union([z.literal(2), z.literal(3)]).default(2),
  type: z.string(),
});

export const TopicSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  status: TopicStatusSchema.default("published"),
  difficulty: DifficultySchema.default("introductory"),
  estimatedMinutes: z.number().int().positive().default(15),
  description: z.string(),
  learningObjectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
  visualizationTypes: z.array(z.string()).default([]),
  sections: z.array(TopicSectionSchema).default([]),
  examples: z.array(ExampleSchema).default([]),
  exercises: z.array(ExerciseSchema).default([]),
  visualizationPresets: z.array(VisualizationPresetRefSchema).default([]),
  relatedTopics: z.array(z.string()).default([]),
});

export const ModuleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  estimatedHours: z.number().positive().default(10),
  description: z.string(),
  learningObjectives: z.array(z.string()).default([]),
  topics: z.array(TopicSchema),
});

export const CurriculumRegistrySchema = z.object({
  version: z.literal(1),
  modules: z.array(ModuleSchema),
});

export type TopicStatus = z.infer<typeof TopicStatusSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type TopicSection = z.infer<typeof TopicSectionSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type VisualizationPresetRef = z.infer<typeof VisualizationPresetRefSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type CurriculumRegistry = z.infer<typeof CurriculumRegistrySchema>;
