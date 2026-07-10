"use client";

import * as React from "react";
import { Filter, Search, X } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/store";
import { CategoryIcon } from "@/components/category-icon";
import type { Category, Difficulty, TestSummary } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TestCard } from "./shared";
import { cn } from "@/lib/utils";

const difficulties: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export function TestsView() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [difficulty, setDifficulty] = React.useState<Difficulty | "All">("All");

  const categories = useApi<Category[]>(() => api.categories(), []);

  const debounced = useDebounced(search, 300);
  const tests = useApi<TestSummary[]>(
    () => api.tests({ search: debounced || undefined, category: category !== "all" ? category : undefined, difficulty: difficulty !== "All" ? difficulty : undefined }),
    [debounced, category, difficulty]
  );

  const activeCount =
    (search ? 1 : 0) + (category !== "all" ? 1 : 0) + (difficulty !== "All" ? 1 : 0);

  function clearAll() {
    setSearch("");
    setCategory("all");
    setDifficulty("All");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Tests</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a cybersecurity assessment. Each test is timed and graded instantly with full explanations.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-xl border border-border/70 bg-card/50 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests by title, description, or tag…"
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

        {/* Category chips */}
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

        {activeCount > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {tests.loading ? "Loading…" : `${tests.data?.length ?? 0} test(s) found`}
            </span>
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={clearAll}>
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Grid */}
      {tests.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : tests.data && tests.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.data.map((t) => (
            <TestCard key={t.id} test={t} />
          ))}
        </div>
      ) : (
        <EmptyState onClear={clearAll} />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold">No tests found</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        Try adjusting your search or filters to find a cybersecurity test.
      </p>
      <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={onClear}>
        <X className="h-4 w-4" /> Clear filters
      </Button>
    </div>
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
