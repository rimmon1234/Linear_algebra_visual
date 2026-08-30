import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllModules } from "@/features/curriculum/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const modules = getAllModules();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-20 max-w-5xl mx-auto w-full space-y-16">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-3xl">
        <Badge variant="accent" className="px-3 py-1 text-xs">
          Interactive Linear Algebra Laboratory
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100 sm:leading-tight">
          See the geometry. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Understand the mathematics.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform abstract matrices, vector spaces, and eigenvalues into interactive 2D and 3D geometric explorations that build deep mathematical intuition.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            Explore Curriculum
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/learn/matrices-eigenvalues-decompositions/characteristic-equations"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Start Module I
          </Link>
        </div>
      </div>

      {/* Curriculum modules overview */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Curriculum Syllabus</h2>
            <p className="text-xs text-slate-400">4 Core Modules covering university Linear Algebra</p>
          </div>
          <Link href="/learn" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
            View all topics <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Card key={mod.id} className="hover:border-indigo-900/60 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="font-mono text-[10px] text-indigo-400">
                    Module {mod.order}
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">
                    {mod.topics.length} topics • ~{mod.estimatedHours}h
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-100">
                  <Link href={`/learn/${mod.slug}`} className="hover:text-indigo-300 transition-colors">
                    {mod.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {mod.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mod.topics.slice(0, 3).map((t) => (
                    <Link
                      key={t.id}
                      href={`/learn/${mod.slug}/${t.slug}`}
                      className="rounded bg-slate-950 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-indigo-300 transition-colors"
                    >
                      {t.title}
                    </Link>
                  ))}
                  {mod.topics.length > 3 && (
                    <span className="text-[11px] text-slate-500 py-1 px-1">
                      +{mod.topics.length - 3} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
