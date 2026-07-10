"use client";

import { Clock, ListChecks, Target } from "lucide-react";
import type { TestSummary } from "@/lib/types";
import { difficultyConfig } from "@/lib/ui";
import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const cfg = difficultyConfig[difficulty as keyof typeof difficultyConfig] ?? difficultyConfig.Beginner;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        cfg.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export function TestCard({ test }: { test: TestSummary }) {
  const go = useApp((s) => s.go);
  const tags = test.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);

  return (
    <Card className="card-glow group flex flex-col p-5 h-full border-border/70 bg-card/60">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border"
          style={{
            color: test.category.color,
            borderColor: `${test.category.color}40`,
            background: `${test.category.color}14`,
          }}
        >
          <CategoryIcon name={test.category.icon} className="h-5 w-5" />
        </div>
        <DifficultyBadge difficulty={test.difficulty} />
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
        {test.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
        {test.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Badge key={t} variant="secondary" className="text-[10px] font-mono">
            #{t}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5" />
          {test._count.questions} Qs
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {test.durationMin} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" />
          {test.passingScore}%
        </span>
      </div>

      <div className="mt-5 pt-4 border-t border-border/60">
        <Button
          className="w-full gap-2"
          onClick={() => go({ name: "runner", testId: test.id })}
        >
          Start Test
        </Button>
      </div>
    </Card>
  );
}
