import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LearningObjectivesProps {
  objectives: string[];
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card className="border-indigo-950/60 bg-indigo-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
          Learning Objectives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
