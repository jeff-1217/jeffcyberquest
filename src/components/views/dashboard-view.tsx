"use client";

import * as React from "react";
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/store";
import { formatTime, difficultyConfig } from "@/lib/ui";
import { CategoryIcon } from "@/components/category-icon";
import type { Stats } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const stats = useApi<Stats>(() => api.stats(), []);
  const go = useApp((s) => s.go);

  const passRate =
    stats.data && stats.data.totalAttempts > 0
      ? Math.round((stats.data.passedAttempts / stats.data.totalAttempts) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Track your progress and identify areas to improve.
          </p>
        </div>
        <Button className="gap-2 self-start sm:self-auto" onClick={() => go({ name: "tests" })}>
          <ListChecks className="h-4 w-4" /> Take a test
        </Button>
      </div>

      {stats.loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : stats.data && stats.data.totalAttempts > 0 ? (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi
              icon={Activity}
              label="Total attempts"
              value={String(stats.data.totalAttempts)}
              hint={`${stats.data.testsCompleted} unique tests`}
              tone="primary"
            />
            <Kpi
              icon={TrendingUp}
              label="Average score"
              value={`${stats.data.avgScore}%`}
              hint="across all attempts"
              tone={stats.data.avgScore >= 70 ? "good" : "bad"}
            />
            <Kpi
              icon={CheckCircle2}
              label="Pass rate"
              value={`${passRate}%`}
              hint={`${stats.data.passedAttempts} passed`}
              tone="good"
            />
            <Kpi
              icon={Clock}
              label="Time invested"
              value={formatTime(stats.data.totalTimeSpent)}
              hint="learning time"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-3 p-5 sm:p-6 border-border/70 bg-card/60">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Performance by Domain
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Average score per cybersecurity domain</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.data.categoryBreakdown}
                    margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                      height={56}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--accent)" }}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`${v}%`, "Avg score"]}
                    />
                    <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {stats.data.categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-5 sm:p-6 border-border/70 bg-card/60">
              <h2 className="font-semibold flex items-center gap-2 mb-5">
                <Target className="h-4 w-4 text-primary" /> Domain Mastery
              </h2>
              <div className="space-y-4 max-h-72 overflow-y-auto cyber-scroll pr-1">
                {stats.data.categoryBreakdown
                  .slice()
                  .sort((a, b) => b.avgScore - a.avgScore)
                  .map((c) => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium">{c.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {c.attempts} attempt{c.attempts !== 1 ? "s" : ""} · {c.avgScore}%
                        </span>
                      </div>
                      <Progress
                        value={c.avgScore}
                        className="h-2"
                        style={
                          {
                            "--progress-foreground": c.color,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Recent attempts */}
          <Card className="p-5 sm:p-6 border-border/70 bg-card/60">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" /> Recent Attempts
              </h2>
              <span className="text-xs text-muted-foreground">
                Last {stats.data.recentAttempts.length} attempts
              </span>
            </div>
            <div className="space-y-2">
              {stats.data.recentAttempts.map((a) => {
                const diffCfg = difficultyConfig[a.difficulty];
                return (
                  <button
                    key={a.id}
                    onClick={() => go({ name: "results", attemptId: a.id })}
                    className="flex w-full items-center text-left gap-3 rounded-lg border border-border/60 bg-background/40 p-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                      style={{
                        color: a.category.color,
                        borderColor: `${a.category.color}40`,
                        background: `${a.category.color}14`,
                      }}
                    >
                      <CategoryIcon name={a.category.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{a.testTitle}</span>
                        <span
                          className={cn(
                            "hidden sm:inline-flex items-center gap-1 rounded-full border px-1.5 py-0 text-[10px] font-semibold",
                            diffCfg.className
                          )}
                        >
                          {a.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(a.completedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {formatTime(a.timeSpentSec)}
                        {" · "}
                        {a.correctAnswers}/{a.totalQuestions} correct
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-mono text-lg font-bold tabular-nums",
                            a.passed ? "text-primary" : "text-destructive"
                          )}
                        >
                          {a.score}%
                        </div>
                      </div>
                      {a.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone?: "good" | "bad" | "primary";
}) {
  return (
    <Card className="p-5 border-border/70 bg-card/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            tone === "good" && "bg-primary/12 text-primary",
            tone === "bad" && "bg-destructive/12 text-destructive",
            (!tone || tone === "primary") && "bg-primary/12 text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div
        className={cn(
          "mt-3 text-3xl font-bold font-mono tabular-nums",
          tone === "good" && "text-primary",
          tone === "bad" && "text-destructive"
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </Card>
  );
}

function EmptyDashboard() {
  const go = useApp((s) => s.go);
  return (
    <Card className="relative overflow-hidden p-10 sm:p-16 text-center border-border/70 bg-card/60">
      <div className="absolute inset-0 bg-cyber-grid opacity-40" aria-hidden />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary border border-primary/25">
          <Trophy className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-xl font-bold">No attempts yet</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
          Complete your first cybersecurity test to start tracking your scores, progress, and domain mastery here.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button className="gap-2" onClick={() => go({ name: "tests" })}>
            <Award className="h-4 w-4" /> Browse tests
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => go({ name: "bank" })}>
            <ListChecks className="h-4 w-4" /> Question bank
          </Button>
        </div>
      </div>
    </Card>
  );
}
