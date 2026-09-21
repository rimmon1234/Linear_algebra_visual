"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TopicSection } from "@/features/curriculum/types";
import { Lightbulb, Info, AlertTriangle, HelpCircle } from "lucide-react";
import { MathFormula } from "@/components/math/MathFormula";
import { MathText } from "@/components/math/MathText";

interface TopicSectionCardProps {
  section: TopicSection;
}

export function TopicSectionCard({ section }: TopicSectionCardProps) {
  const typeLabels: Record<string, string> = {
    "why-it-matters": "Why This Matters",
    definition: "Definition",
    intuition: "Geometric Intuition",
    "formal-math": "Formal Mathematics",
    "geometric-interpretation": "Geometric Interpretation",
    "worked-example": "Worked Example",
    experiment: "Guided Experiment",
    "common-mistakes": "Common Misconceptions",
    summary: "Summary",
  };

  const calloutIcons = {
    note: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
    misconception: HelpCircle,
  };

  return (
    <Card className="space-y-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-slate-100">
          {section.title}
        </CardTitle>
        <Badge variant="outline" className="text-[10px] text-slate-400 capitalize">
          {typeLabels[section.type] || section.type}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <MathText text={section.content} />

        {section.formula && (
          <div className="rounded-lg bg-slate-950/90 border border-slate-800/80 p-3.5 my-2 shadow-inner">
            <MathFormula math={section.formula} inline={false} />
          </div>
        )}

        {section.callout && (
          <div className="flex items-start gap-2.5 rounded-md border border-indigo-900/40 bg-indigo-950/30 p-3 text-xs text-slate-300">
            {(() => {
              const Icon = calloutIcons[section.callout.type] || Info;
              return <Icon className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />;
            })()}
            <MathText text={section.callout.text} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
