"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flag,
  ListChecks,
  Loader2,
  Send,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/store";
import { difficultyConfig, formatClock } from "@/lib/ui";
import { CategoryIcon } from "@/components/category-icon";
import type { TestForTaking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TestRunnerView({ testId }: { testId: string }) {
  const test = useApi<TestForTaking>(() => api.test(testId), [testId]);
  const go = useApp((s) => s.go);
  const setLastResult = useApp((s) => s.setLastResult);

  if (test.loading) return <RunnerSkeleton />;
  if (test.error || !test.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">Couldn&apos;t load this test</h2>
        <p className="mt-1 text-sm text-muted-foreground">{test.error}</p>
        <Button className="mt-4" onClick={() => go({ name: "tests" })}>
          Back to tests
        </Button>
      </div>
    );
  }

  return (
    <Runner
      test={test.data}
      onSubmit={async (answers, timeSpentSec) => {
        const result = await api.submitTest(testId, { answers, timeSpentSec });
        setLastResult(result);
        go({ name: "results", attemptId: result.attemptId });
      }}
    />
  );
}

function Runner({
  test,
  onSubmit,
}: {
  test: TestForTaking;
  onSubmit: (
    answers: { questionId: string; selectedOptionId: string | null }[],
    timeSpentSec: number
  ) => Promise<void>;
}) {
  const go = useApp((s) => s.go);
  const totalQs = test.questions.length;

  const [answers, setAnswers] = React.useState<Record<string, string | null>>({});
  const [current, setCurrent] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(test.durationMin * 60);
  const startRef = React.useRef(Date.now());

  // Countdown timer
  React.useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const submittedRef = React.useRef(false);

  const answeredCount = Object.values(answers).filter((v) => !!v).length;
  const progress = (answeredCount / totalQs) * 100;

  const q = test.questions[current];

  function selectOption(optionId: string) {
    setAnswers((a) => ({ ...a, [q.id]: a[q.id] === optionId ? null : optionId }));
  }

  async function doSubmit(auto = false) {
    void auto;
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const timeSpentSec = Math.round((Date.now() - startRef.current) / 1000);
      const payload = test.questions.map((qq) => ({
        questionId: qq.id,
        selectedOptionId: answers[qq.id] ?? null,
      }));
      await onSubmit(payload, timeSpentSec);
    } catch (e) {
      setSubmitting(false);
      submittedRef.current = false;
      toast.error(e instanceof Error ? e.message : "Failed to submit test");
    }
  }

  // Auto-submit on timeout
  React.useEffect(() => {
    if (timeLeft === 0 && !submittedRef.current) {
      toast.warning("Time's up! Submitting your test.");
      doSubmit(true);
    }
  }, [timeLeft]);

  const timeWarn = timeLeft <= 60;
  const diffCfg = difficultyConfig[test.difficulty];

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => go({ name: "tests" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Exit test
        </button>

        <Card className="p-4 sm:p-5 border-border/70 bg-card/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
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
              <div className="min-w-0">
                <h1 className="text-lg font-semibold leading-tight truncate">{test.title}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-semibold",
                      diffCfg.className
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", diffCfg.dot)} />
                    {test.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ListChecks className="h-3.5 w-3.5" /> {totalQs} questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Flag className="h-3.5 w-3.5" /> Pass: {test.passingScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-lg font-bold tabular-nums",
                  timeWarn
                    ? "border-destructive/40 bg-destructive/10 text-destructive animate-pulse"
                    : "border-border bg-background"
                )}
              >
                <Clock className="h-4 w-4" />
                {formatClock(timeLeft)}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <ListChecks className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                  <SheetHeader>
                    <SheetTitle>Question Palette</SheetTitle>
                  </SheetHeader>
                  <Palette
                    test={test}
                    answers={answers}
                    current={current}
                    onSelect={setCurrent}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                Answered <span className="font-semibold text-foreground">{answeredCount}</span> of {totalQs}
              </span>
              <span className="font-mono">Question {current + 1}/{totalQs}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </Card>
      </div>

      {/* Question + palette */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
        {/* Question card */}
        <Card className="p-5 sm:p-7 border-border/70 bg-card/60">
          <div className="flex items-center justify-between gap-3 mb-4">
            <Badge variant="secondary" className="font-mono">
              Q{current + 1}
            </Badge>
            <span className="text-xs text-muted-foreground">{q.difficulty}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">{q.text}</h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]"
                      : "border-border bg-background/50 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={cn("text-sm sm:text-base", selected && "font-medium")}>
                    {opt.text}
                  </span>
                  {selected && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div className="mt-7 flex items-center justify-between gap-3 pt-5 border-t border-border/60">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              {current < totalQs - 1 ? (
                <Button onClick={() => setCurrent((c) => Math.min(totalQs - 1, c + 1))} className="gap-1.5">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="gap-1.5" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Submit Test
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit your test?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {answeredCount === totalQs
                          ? `You've answered all ${totalQs} questions. Your answers will be graded instantly.`
                          : `You've answered ${answeredCount} of ${totalQs} questions. ${totalQs - answeredCount} will be marked incorrect. This cannot be undone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={submitting}>Keep going</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={submitting}
                        onClick={() => doSubmit(false)}
                      >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                        Submit now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </Card>

        {/* Palette (desktop) */}
        <Card className="hidden lg:block p-4 border-border/70 bg-card/60 sticky top-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Question Palette</h3>
            <span className="text-xs text-muted-foreground font-mono">{answeredCount}/{totalQs}</span>
          </div>
          <Palette test={test} answers={answers} current={current} onSelect={setCurrent} />
        </Card>
      </div>
    </div>
  );
}

function Palette({
  test,
  answers,
  current,
  onSelect,
}: {
  test: TestForTaking;
  answers: Record<string, string | null>;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {test.questions.map((q, i) => {
        const answered = !!answers[q.id];
        const isCurrent = i === current;
        return (
          <button
            key={q.id}
            onClick={() => onSelect(i)}
            className={cn(
              "aspect-square rounded-lg border text-sm font-mono font-semibold transition-all",
              isCurrent
                ? "border-primary bg-primary text-primary-foreground"
                : answered
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function RunnerSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-32 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        <Skeleton className="h-[480px] rounded-xl" />
        <Skeleton className="hidden lg:block h-64 rounded-xl" />
      </div>
    </div>
  );
}
