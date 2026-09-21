import { notFound } from "next/navigation";
import { getTopicBySlug, getAdjacentTopics } from "@/features/curriculum/queries";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TopicHeader } from "@/components/learning/TopicHeader";
import { LearningObjectives } from "@/components/learning/LearningObjectives";
import { TopicSectionCard } from "@/components/learning/TopicSectionCard";
import { TopicNavigation } from "@/components/learning/TopicNavigation";
import { PracticeSection } from "@/components/learning/PracticeSection";
import { VisualizationContainer } from "@/components/visualizer/VisualizationContainer";

interface TopicPageProps {
  params: Promise<{
    moduleSlug: string;
    topicSlug: string;
  }>;
}

export default async function GenericTopicPage({ params }: TopicPageProps) {
  const { moduleSlug, topicSlug } = await params;
  const result = getTopicBySlug(moduleSlug, topicSlug);

  if (!result) {
    notFound();
  }

  const { module, topic } = result;
  const { prev, next } = getAdjacentTopics(module.slug, topic.slug);
  const primaryPreset = topic.visualizationPresets[0];

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: module.title, href: `/learn/${module.slug}` },
          { label: topic.title },
        ]}
      />

      {/* Header section */}
      <TopicHeader topic={topic} module={module} />

      {/* Learning Objectives */}
      <LearningObjectives objectives={topic.learningObjectives} />

      {/* Primary Interactive Visualizer Container */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Geometric Visualization
        </h2>
        <VisualizationContainer
          title={primaryPreset?.title || "Interactive Scene"}
          presetId={primaryPreset?.presetId}
          type={primaryPreset?.type || topic.visualizationTypes[0] || "matrix-transformation"}
          dimension={primaryPreset?.dimension || 2}
        />
      </div>

      {/* Structured Topic Sections */}
      {topic.sections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Lesson Content & Mathematics
          </h2>
          <div className="space-y-4">
            {topic.sections.map((section) => (
              <TopicSectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Practice Questions */}
      {topic.exercises.length > 0 && (
        <PracticeSection exercises={topic.exercises} />
      )}

      {/* Previous / Next Topic Navigation */}
      <TopicNavigation prev={prev} next={next} />
    </div>
  );
}
