import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Practice" }]} />

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950/80 text-indigo-400 mx-auto">
          <Dumbbell className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Practice Exercises</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Interactive practice problems, hints, and visual verification connect in Phase 9. You can currently study definitions, intuition, and formulas through curriculum topics.
        </p>
        <div className="pt-2">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Explore Curriculum Topics
          </Link>
        </div>
      </div>
    </div>
  );
}
