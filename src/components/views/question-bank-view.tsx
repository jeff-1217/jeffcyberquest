"use client";

import * as React from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  Filter,
  Lightbulb,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { difficultyConfig } from "@/lib/ui";
import { CategoryIcon } from "@/components/category-icon";
import type { BankQuestion, Category, Difficulty } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const difficulties: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export function QuestionBankView({ drillMode = false }: { drillMode?: boolean }) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState<Difficulty | "All">("All");

  const categories = useApi<Category[]>(() => api.categories(), []);
  const debounced = useDebounced(search, 300);
  const questions = useApi<BankQuestion[]>(
    () =>
      drillMode
        ? api.weaknessQuestions()
        : api.questions({
            search: debounced || undefined,
            category: category !== "all" ? category : undefined,
            difficulty: difficulty !== "All" ? difficulty : undefined,
          }),
    [debounced, category, difficulty, drillMode]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {drillMode ? "Weakness Drill" : "Question Bank"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {drillMode
            ? "Practice only the questions you have previously answered incorrectly to close your knowledge gaps."
            : "Study mode. Pick an answer to check yourself instantly — every question includes a full explanation."}
        </p>
      </div>

      {/* Filters */}
      {!drillMode && (
        <div className="space-y-4 rounded-xl border border-border/70 bg-card/50 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions and explanations…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto cyber-scroll pb-1 sm:pb-0">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    difficulty === d
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Domain
            </span>
            <button
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === "all"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {categories.data?.map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                  style={active ? { borderColor: `${c.color}80`, color: c.color, background: `${c.color}1a` } : undefined}
                >
                  <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Questions */}
      {questions.loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : questions.data && questions.data.length > 0 ? (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>
              Showing <span className="font-semibold text-foreground">{questions.data.length}</span> questions
            </span>
          </div>
          <div className="space-y-4">
            {questions.data.map((q, i) => (
              <PracticeCard key={q.id} index={i} question={q} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold">No questions found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

function PracticeCard({ index, question }: { index: number; question: BankQuestion }) {
  const diffCfg = difficultyConfig[question.difficulty];

  const [selected, setSelected] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const isCorrect = revealed && selected === question.options.find((o) => o.isCorrect)?.id;

  function pick(id: string) {
    if (revealed) return;
    setSelected(id);
    setRevealed(true);
  }

  function reset() {
    setSelected(null);
    setRevealed(false);
  }

  return (
    <Card className="p-5 sm:p-6 border-border/70 bg-card/60">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">Q{index + 1}</Badge>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
            style={{ color: question.category.color, borderColor: `${question.category.color}40`, background: `${question.category.color}14` }}
          >
            <CategoryIcon name={question.category.icon} className="h-3 w-3" />
            {question.category.name}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              diffCfg.className
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", diffCfg.dot)} />
            {question.difficulty}
          </span>
        </div>
        {revealed && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold",
              isCorrect ? "text-primary" : "text-destructive"
            )}
          >
            {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold leading-relaxed">{question.text}</h3>

      <div className="mt-4 space-y-2">
        {question.options.map((opt, i) => {
          const isCorrectOpt = opt.isCorrect;
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => pick(opt.id)}
              disabled={revealed}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                !revealed && "hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
                revealed && isCorrectOpt && "border-primary/50 bg-primary/10",
                revealed && !isCorrectOpt && isSelected && "border-destructive/50 bg-destructive/10",
                revealed && !isCorrectOpt && !isSelected && "border-border bg-background/40 opacity-70",
                !revealed && isSelected && "border-primary bg-primary/10"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold",
                  revealed && isCorrectOpt
                    ? "border-primary bg-primary text-primary-foreground"
                    : revealed && isSelected
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className={cn("flex-1", revealed && isCorrectOpt && "font-medium")}>{opt.text}</span>
              {revealed && isCorrectOpt && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
              {revealed && !isCorrectOpt && isSelected && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 gap-1.5 text-muted-foreground"
          onClick={() => setRevealed(true)}
        >
          <Eye className="h-4 w-4" /> Reveal answer
        </Button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <Lightbulb className="h-3.5 w-3.5" /> EXPLANATION
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{question.explanation}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" /> Try again
          </Button>
        </div>
      )}
    </Card>
  );
}

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
