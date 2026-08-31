"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Topic, Module } from "@/features/curriculum/types";
import { MathText } from "@/components/math/MathText";

interface TopicHeaderProps {
  topic: Topic;
  module: Module;
}

export function TopicHeader({ topic, module }: TopicHeaderProps) {
  const difficultyVariant = {
    introductory: "default" as const,
    intermediate: "secondary" as const,
    advanced: "destructive" as const,
  };

  return (
    <div className="space-y-3 pb-6 border-b border-slate-800">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs text-indigo-400 border-indigo-900/60">
          Module {module.order}: {module.title}
        </Badge>
        <Badge variant={difficultyVariant[topic.difficulty]} className="capitalize text-xs">
          {topic.difficulty}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
          <Clock className="h-3.5 w-3.5" />
          {topic.estimatedMinutes} mins
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
        {topic.title}
      </h1>

      <div className="text-sm sm:text-base text-slate-300 leading-relaxed">
        <MathText text={topic.description} />
      </div>
    </div>
  );
}
