import { module1 } from "@/content/modules/module-1";
import { module2 } from "@/content/modules/module-2";
import { module3 } from "@/content/modules/module-3";
import { module4 } from "@/content/modules/module-4";
import { CurriculumRegistrySchema, type CurriculumRegistry } from "./schema";

const rawRegistry = {
  version: 1 as const,
  modules: [module1, module2, module3, module4],
};

// Validate the complete curriculum registry against the canonical Zod schema at runtime
export const curriculumRegistry: CurriculumRegistry =
  CurriculumRegistrySchema.parse(rawRegistry);
