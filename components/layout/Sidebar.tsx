"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Circle } from "lucide-react";
import type { Module } from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  modules: Module[];
  onTopicClick?: () => void;
}

export function Sidebar({ modules, onTopicClick }: SidebarProps) {
  const pathname = usePathname();
  // Default open all modules
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m) => {
      initial[m.id] = true;
    });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <aside className="w-full h-full overflow-y-auto border-r border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <BookOpen className="h-4 w-4 text-indigo-400" />
        <span>Curriculum Modules</span>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const isOpen = openModules[module.id] ?? true;
          const isModuleActive = pathname.includes(`/learn/${module.slug}`);

          return (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition-colors",
                  isModuleActive
                    ? "text-indigo-300 bg-indigo-950/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                <span className="truncate pr-2">
                  <span className="text-xs font-mono text-slate-500 mr-1.5">
                    M{module.order}
                  </span>
                  {module.title}
                </span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <ul className="ml-2 space-y-0.5 border-l border-slate-800/80 pl-2 text-sm">
                  {module.topics
                    .filter((t) => t.status === "published")
                    .map((topic) => {
                      const topicHref = `/learn/${module.slug}/${topic.slug}`;
                      const isTopicActive = pathname === topicHref;

                      return (
                        <li key={topic.id}>
                          <Link
                            href={topicHref}
                            onClick={onTopicClick}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                              isTopicActive
                                ? "bg-indigo-600/20 font-medium text-indigo-300 border-l-2 border-indigo-500"
                                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                            )}
                          >
                            <Circle className="h-2 w-2 shrink-0 text-slate-600" />
                            <span className="truncate">{topic.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
