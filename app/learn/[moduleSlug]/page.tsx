import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/features/curriculum/queries";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, CheckCircle } from "lucide-react";

interface ModulePageProps {
  params: Promise<{ moduleSlug: string }>;
}

export default async function ModuleDetailPage({ params }: ModulePageProps) {
  const { moduleSlug } = await params;
  const currentModule = getModuleBySlug(moduleSlug);

  if (!currentModule) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: currentModule.title },
        ]}
      />

      <div className="space-y-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="font-mono text-xs">
            Module {currentModule.order}
          </Badge>
          <span className="text-xs text-slate-400">
            {currentModule.topics.length} topics • ~{currentModule.estimatedHours} hours
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          {currentModule.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
          {currentModule.description}
        </p>

        {currentModule.learningObjectives.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Module Goals
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentModule.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Topics in this Module</h2>
        <div className="space-y-3">
          {currentModule.topics
            .filter((t) => t.status === "published")
            .map((topic) => (
              <Link
                key={topic.id}
                href={`/learn/${currentModule.slug}/${topic.slug}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-900/60 hover:bg-slate-900 transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-semibold">
                      {topic.order}.
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300">
                      {topic.title}
                    </h3>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {topic.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {topic.estimatedMinutes}m
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400" />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
