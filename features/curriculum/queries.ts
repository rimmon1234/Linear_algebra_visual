import { curriculumRegistry } from "./registry";
import type { Module, Topic } from "./types";

/**
 * Pure, environment-agnostic query helpers for curriculum data.
 * Adheres to rule: Free of server-only/client-only constraints.
 */

export function getAllModules(): Module[] {
  return [...curriculumRegistry.modules].sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(moduleSlug: string): Module | undefined {
  return curriculumRegistry.modules.find(
    (m) => m.slug === moduleSlug || m.id === moduleSlug
  );
}

export function getModuleById(moduleId: string): Module | undefined {
  return curriculumRegistry.modules.find((m) => m.id === moduleId);
}

export function getTopicBySlug(
  moduleSlug: string,
  topicSlug: string
): { module: Module; topic: Topic } | undefined {
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) return undefined;

  const topic = mod.topics.find(
    (t) => (t.slug === topicSlug || t.id === topicSlug) && t.status === "published"
  );
  if (!topic) return undefined;

  return { module: mod, topic };
}

export function getTopicById(
  topicId: string
): { module: Module; topic: Topic } | undefined {
  for (const mod of curriculumRegistry.modules) {
    const topic = mod.topics.find((t) => t.id === topicId);
    if (topic) return { module: mod, topic };
  }
  return undefined;
}

export function getAllPublishedTopics(): Array<{ module: Module; topic: Topic }> {
  const result: Array<{ module: Module; topic: Topic }> = [];
  const modules = getAllModules();

  for (const mod of modules) {
    const topics = [...mod.topics]
      .filter((t) => t.status === "published")
      .sort((a, b) => a.order - b.order);

    for (const topic of topics) {
      result.push({ module: mod, topic });
    }
  }

  return result;
}

export function getAdjacentTopics(
  moduleSlug: string,
  topicSlug: string
): {
  prev?: { module: Module; topic: Topic };
  next?: { module: Module; topic: Topic };
} {
  const all = getAllPublishedTopics();
  const index = all.findIndex(
    (item) =>
      (item.module.slug === moduleSlug || item.module.id === moduleSlug) &&
      (item.topic.slug === topicSlug || item.topic.id === topicSlug)
  );

  if (index === -1) return {};

  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}
