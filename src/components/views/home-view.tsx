"use client";

import * as React from "react";
import {
  ArrowRight,
  Brain,
  ChevronRight,
  ListChecks,
  Library,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TestCard, DifficultyBadge } from "./shared";
import type { Category, Stats, TestSummary } from "@/lib/types";

export function HomeView() {
  const go = useApp((s) => s.go);
  const tests = useApi<TestSummary[]>(() => api.tests(), []);
  const stats = useApi<Stats>(() => api.stats(), []);
  const categories = useApi<Category[]>(() => api.categories(), []);

  const featured = (tests.data ?? []).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/40">
        <div className="absolute inset-0 bg-cyber-grid opacity-60" aria-hidden />
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-5 gap-2 border-primary/40 bg-primary/10 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              8 domains · 100+ questions · instant grading
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Master <span className="text-primary glow-primary">cybersecurity</span>
              <br className="hidden sm:block" /> one question at a time.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
              Interactive MCQ tests and a searchable question bank covering network
              security, cryptography, web exploits, malware, IAM, SOC, cloud, and
              ethical hacking. Practice, get graded instantly, and learn from every answer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="gap-2" onClick={() => go({ name: "tests" })}>
                <ListChecks className="h-4 w-4" />
                Browse Tests
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => go({ name: "bank" })}
              >
                <Library className="h-4 w-4" />
                Question Bank
              </Button>
            </div>

            {/* Terminal-style strip */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-4 py-2 font-mono text-sm">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">./cyberquest --start</span>
              <span className="animate-blink text-primary">_</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ListChecks}
          label="Tests"
          value={stats.loading ? "—" : String(stats.data?.tests ?? 0)}
          hint="across 8 domains"
        />
        <StatCard
          icon={Brain}
          label="Questions"
          value={stats.loading ? "—" : String(stats.data?.questions ?? 0)}
          hint="with explanations"
        />
        <StatCard
          icon={Target}
          label="Categories"
          value={stats.loading ? "—" : String(stats.data?.categories ?? 0)}
          hint="cyber domains"
        />
        <StatCard
          icon={Trophy}
          label="Attempts"
          value={stats.loading ? "—" : String(stats.data?.totalAttempts ?? 0)}
          hint={`${stats.data?.passedAttempts ?? 0} passed`}
        />
      </section>

      {/* CATEGORIES */}
      <section>
        <SectionHeader
          title="Explore by Domain"
          subtitle="Pick a cybersecurity discipline and dive into curated tests and questions."
        />
        {categories.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.data?.map((c) => (
              <CategoryTile key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURED TESTS */}
      <section>
        <SectionHeader
          title="Featured Tests"
          subtitle="Start with these popular assessments to gauge your skills."
          action={
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => go({ name: "tests" })}>
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          }
        />
        {tests.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((t) => (
              <TestCard key={t.id} test={t} />
            ))}
          </div>
        )}
      </section>

      {/* WHY / HOW IT WORKS */}
      <section>
        <SectionHeader
          title="How It Works"
          subtitle="A focused loop to build and verify your cybersecurity knowledge."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={Zap}
            title="Take a timed test"
            desc="Answer multiple-choice questions with a live timer and progress tracker. Navigate freely before submitting."
            step="01"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Get instant grading"
            desc="Server-side grading returns your score, pass/fail status, and a per-question breakdown instantly."
            step="02"
          />
          <FeatureCard
            icon={Brain}
            title="Learn from explanations"
            desc="Every question ships with a clear explanation. Review answers and drill weak areas in the question bank."
            step="03"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-5 border-border/70 bg-card/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/12 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold font-mono tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </Card>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function CategoryTile({ category }: { category: Category }) {
  const go = useApp((s) => s.go);
  return (
    <button
      onClick={() => go({ name: "tests" })}
      className="text-left"
    >
      <Card className="card-glow h-full p-5 border-border/70 bg-card/60">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
          style={{
            color: category.color,
            borderColor: `${category.color}40`,
            background: `${category.color}14`,
          }}
        >
          <CategoryIcon name={category.icon} className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-semibold leading-tight">{category.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {category.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-mono">{category._count?.tests ?? 0} tests</span>
          <span className="text-border">·</span>
          <span className="font-mono">{category._count?.questions ?? 0} Qs</span>
        </div>
      </Card>
    </button>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  step,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  step: string;
}) {
  return (
    <Card className="relative p-6 border-border/70 bg-card/60 overflow-hidden">
      <span className="absolute top-4 right-5 font-mono text-4xl font-bold text-primary/15">
        {step}
      </span>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/12 text-primary border border-primary/25">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}
