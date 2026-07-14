"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Home,
  Loader2,
  RotateCcw,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";
import { formatTime, difficultyConfig } from "@/lib/ui";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { GradedQuestion, SubmitResult } from "@/lib/types";

export function ResultsView({ attemptId }: { attemptId?: string }) {
  const lastResult = useApp((s) => s.lastResult);
  const go = useApp((s) => s.go);

  const cached = lastResult && lastResult.attemptId === attemptId ? lastResult : null;

  const attemptApi = useApi(
    () => (attemptId && !cached ? api.attempt(attemptId) : Promise.resolve(null)),
    [attemptId, cached]
  );

  const result = cached || attemptApi.data;

  if (attemptApi.loading && attemptId && !cached) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading test results…</p>
      </div>
    );
  }

  if (attemptApi.error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">Couldn&apos;t load results</h2>
        <p className="mt-1 text-sm text-muted-foreground">{attemptApi.error}</p>
        <Button className="mt-4" onClick={() => go({ name: "tests" })}>
          Back to tests
        </Button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Trophy className="h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">No results to show</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Take a test to see your graded results here.
        </p>
        <Button className="mt-4" onClick={() => go({ name: "tests" })}>
          Browse tests
        </Button>
      </div>
    );
  }

  return <Results result={result} />;
}

function Results({ result }: { result: SubmitResult }) {
  const go = useApp((s) => s.go);
  const passed = result.passed;

  return (
    <div className="space-y-6">
      <button
        onClick={() => go({ name: "tests" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to tests
      </button>

      {/* Score hero */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60">
        <div className="absolute inset-0 bg-cyber-grid opacity-40" aria-hidden />
        <div
          className="hidden sm:block absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, " +
              (passed ? "var(--primary)" : "var(--destructive)") +
              ", transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
            {/* Score ring */}
            <div className="flex justify-center">
              <ScoreRing score={result.score} passed={passed} />
            </div>

            {/* Summary */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
                    passed
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-destructive/40 bg-destructive/15 text-destructive"
                  )}
                >
                  {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {passed ? "Passed" : "Did not pass"}
                </span>
                <Badge variant="outline" className="gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: result.category.color }}
                  />
                  {result.category.name}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{result.testTitle}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {passed
                  ? "Nice work! You met the passing threshold."
                  : `You needed ${result.passingScore}% to pass. Review the answers below and try again.`}
              </p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat icon={Check} label="Correct" value={`${result.correctAnswers}/${result.totalQuestions}`} tone="good" />
                <Stat icon={Target} label="Score" value={`${result.score}%`} tone={passed ? "good" : "bad"} />
                <Stat icon={Clock} label="Time" value={formatTime(result.timeSpentSec)} />
                <Stat icon={Trophy} label="Pass mark" value={`${result.passingScore}%`} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button className="gap-1.5" onClick={() => go({ name: "runner", testId: result.testId })}>
                  <RotateCcw className="h-4 w-4" /> Retake test
                </Button>
                <Button variant="outline" className="gap-1.5" onClick={() => go({ name: "tests" })}>
                  <CategoryIcon name={result.category.icon} className="h-4 w-4" /> More tests
                </Button>
                <Button variant="ghost" className="gap-1.5" onClick={() => go({ name: "dashboard" })}>
                  <Home className="h-4 w-4" /> Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Answer review */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Answer Review</h2>
          <span className="text-sm text-muted-foreground">{result.graded.length} questions</span>
        </div>
        <div className="space-y-4">
          {result.graded.map((g, i) => (
            <QuestionReview key={g.questionId} index={i} g={g} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = passed ? "var(--primary)" : "var(--destructive)";
  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--border)" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold tabular-nums" style={{ color }}>
          {score}%
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">score</span>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            tone === "good" && "text-primary",
            tone === "bad" && "text-destructive"
          )}
        />
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

function QuestionReview({ index, g }: { index: number; g: GradedQuestion }) {
  const diffCfg = difficultyConfig[g.difficulty];
  return (
    <Card
      className={cn(
        "p-5 sm:p-6 border-border/70 bg-card/60",
        g.isCorrect ? "border-l-4 border-l-primary" : "border-l-4 border-l-destructive"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">Q{index + 1}</Badge>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              diffCfg.className
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", diffCfg.dot)} />
            {g.difficulty}
          </span>
        </div>
        {g.isCorrect ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4" /> Correct
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-destructive">
            <XCircle className="h-4 w-4" /> Incorrect
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold leading-relaxed">{g.questionText}</h3>

      <div className="mt-4 space-y-2">
        {g.options.map((opt, i) => {
          const isCorrect = opt.isCorrect;
          const isSelected = g.selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-sm",
                isCorrect && "border-primary/50 bg-primary/10",
                !isCorrect && isSelected && "border-destructive/50 bg-destructive/10",
                !isCorrect && !isSelected && "border-border bg-background/40"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold",
                  isCorrect
                    ? "border-primary bg-primary text-primary-foreground"
                    : isSelected
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {isCorrect ? <Check className="h-3.5 w-3.5" /> : isSelected ? <X className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
              </span>
              <span className={cn("flex-1", isCorrect && "font-medium")}>{opt.text}</span>
              {isCorrect && (
                <span className="shrink-0 text-xs font-semibold text-primary">Correct answer</span>
              )}
              {!isCorrect && isSelected && (
                <span className="shrink-0 text-xs font-semibold text-destructive">Your answer</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
          <Target className="h-3.5 w-3.5" /> EXPLANATION
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{g.explanation}</p>
      </div>
    </Card>
  );
}
