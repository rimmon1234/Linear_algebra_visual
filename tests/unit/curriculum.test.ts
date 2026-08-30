import { describe, it, expect } from "vitest";
import { curriculumRegistry } from "@/features/curriculum/registry";
import {
  getAllModules,
  getModuleBySlug,
  getTopicBySlug,
  getTopicById,
  getAllPublishedTopics,
  getAdjacentTopics,
} from "@/features/curriculum/queries";
import { CurriculumRegistrySchema } from "@/features/curriculum/schema";

describe("Curriculum Registry & Integrity", () => {
  it("validates the entire registry against the canonical Zod schema", () => {
    const parseResult = CurriculumRegistrySchema.safeParse(curriculumRegistry);
    expect(parseResult.success).toBe(true);
  });

  it("contains exactly the 4 syllabus modules from CURRICULUM_SPEC.md", () => {
    const modules = getAllModules();
    expect(modules).toHaveLength(4);

    const moduleSlugs = modules.map((m) => m.slug);
    expect(moduleSlugs).toEqual([
      "matrices-eigenvalues-decompositions",
      "vector-spaces",
      "inner-product-spaces",
      "linear-transformations",
    ]);
  });

  it("enforces unique module IDs and consecutive module ordering", () => {
    const modules = getAllModules();
    const moduleIds = modules.map((m) => m.id);
    const uniqueIds = new Set(moduleIds);
    expect(uniqueIds.size).toBe(moduleIds.length);

    modules.forEach((mod, index) => {
      expect(mod.order).toBe(index + 1);
    });
  });

  it("enforces globally unique topic IDs across all modules", () => {
    const modules = getAllModules();
    const allTopicIds: string[] = [];

    modules.forEach((mod) => {
      mod.topics.forEach((t) => {
        allTopicIds.push(t.id);
      });
    });

    const uniqueTopicIds = new Set(allTopicIds);
    expect(uniqueTopicIds.size).toBe(allTopicIds.length);
    expect(allTopicIds.length).toBe(33); // 9 + 9 + 9 + 6 = 33 topics
  });

  it("enforces unique topic slugs and consecutive ordering within each module", () => {
    const modules = getAllModules();

    modules.forEach((mod) => {
      const topicSlugs = mod.topics.map((t) => t.slug);
      const uniqueSlugs = new Set(topicSlugs);
      expect(uniqueSlugs.size).toBe(topicSlugs.length);

      mod.topics.forEach((topic, index) => {
        expect(topic.order).toBe(index + 1);
        expect(topic.moduleId).toBe(mod.id);
      });
    });
  });

  it("verifies all prerequisite references point to valid, existing topic IDs", () => {
    const allTopicIds = new Set<string>();
    getAllModules().forEach((mod) => {
      mod.topics.forEach((t) => allTopicIds.add(t.id));
    });

    getAllModules().forEach((mod) => {
      mod.topics.forEach((topic) => {
        topic.prerequisites.forEach((prereqId) => {
          expect(allTopicIds.has(prereqId)).toBe(true);
          // Prerequisite cannot be the topic itself
          expect(prereqId).not.toBe(topic.id);
        });
      });
    });
  });

  it("queries modules and topics correctly by slug and id", () => {
    const mod1 = getModuleBySlug("matrices-eigenvalues-decompositions");
    expect(mod1).toBeDefined();
    expect(mod1?.id).toBe("module-1");

    const topicResult = getTopicBySlug(
      "matrices-eigenvalues-decompositions",
      "characteristic-equations"
    );
    expect(topicResult).toBeDefined();
    expect(topicResult?.topic.title).toBe("Characteristic Equations");

    const topicById = getTopicById("mod1-characteristic-equations");
    expect(topicById).toBeDefined();
    expect(topicById?.topic.slug).toBe("characteristic-equations");
  });

  it("calculates adjacent topics accurately across module boundaries", () => {
    // First topic in Module 1: prev should be undefined
    const firstAdj = getAdjacentTopics(
      "matrices-eigenvalues-decompositions",
      "characteristic-equations"
    );
    expect(firstAdj.prev).toBeUndefined();
    expect(firstAdj.next?.topic.slug).toBe("eigenvalues-eigenvectors");

    // Last topic in Module 1 (generalized-inverses): next should be first topic in Module 2 (definition-of-field)
    const bridgeAdj = getAdjacentTopics(
      "matrices-eigenvalues-decompositions",
      "generalized-inverses"
    );
    expect(bridgeAdj.next?.module.slug).toBe("vector-spaces");
    expect(bridgeAdj.next?.topic.slug).toBe("definition-of-field");
  });

  it("ensures archived or draft topics do not appear in active query lookups", () => {
    const allPublished = getAllPublishedTopics();
    allPublished.forEach(({ topic }) => {
      expect(topic.status).toBe("published");
    });
  });
});
