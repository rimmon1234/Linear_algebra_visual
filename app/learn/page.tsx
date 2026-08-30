import Link from "next/link";
import { getAllModules } from "@/features/curriculum/queries";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function LearnIndexPage() {
  const modules = getAllModules();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Linear Algebra Curriculum
        </h1>
        <p className="text-sm text-slate-400">
          Select a module or topic below to begin interactive study.
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <Card key={module.id} className="border-slate-800 bg-slate-900/40">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs text-indigo-400">
                  Module {module.order}
                </Badge>
                <span className="text-xs text-slate-400">
                  ~{module.estimatedHours} hours total
                </span>
              </div>
              <CardTitle className="text-xl font-semibold mt-1">
                <Link
                  href={`/learn/${module.slug}`}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {module.title}
                </Link>
              </CardTitle>
              <p className="text-xs text-slate-400 leading-relaxed">{module.description}</p>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Topics ({module.topics.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {module.topics
                    .filter((t) => t.status === "published")
                    .map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/learn/${module.slug}/${topic.slug}`}
                        className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-200 hover:border-indigo-900/60 hover:bg-slate-900 transition-colors group"
                      >
                        <span className="truncate pr-2 group-hover:text-indigo-300">
                          <span className="font-mono text-slate-500 mr-1.5">{topic.order}.</span>
                          {topic.title}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-indigo-400" />
                      </Link>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
