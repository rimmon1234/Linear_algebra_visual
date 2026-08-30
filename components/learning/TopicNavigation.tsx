import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Module, Topic } from "@/features/curriculum/types";

interface TopicNavigationProps {
  prev?: { module: Module; topic: Topic };
  next?: { module: Module; topic: Topic };
}

export function TopicNavigation({ prev, next }: TopicNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
      {prev ? (
        <Link
          href={`/learn/${prev.module.slug}/${prev.topic.slug}`}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left transition-colors hover:bg-slate-900 w-full sm:w-1/2"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-400" />
          <div className="overflow-hidden">
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Previous Topic
            </span>
            <span className="block truncate text-sm font-medium text-slate-200">
              {prev.topic.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="w-full sm:w-1/2" />
      )}

      {next ? (
        <Link
          href={`/learn/${next.module.slug}/${next.topic.slug}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-right transition-colors hover:bg-slate-900 w-full sm:w-1/2 sm:ml-auto"
        >
          <div className="overflow-hidden">
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Next Topic
            </span>
            <span className="block truncate text-sm font-medium text-slate-200">
              {next.topic.title}
            </span>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-indigo-400" />
        </Link>
      ) : (
        <div className="w-full sm:w-1/2" />
      )}
    </div>
  );
}
