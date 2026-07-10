import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Aggregate platform + user stats for the dashboard.
export async function GET() {
  const [tests, questions, categories, attempts] = await Promise.all([
    db.test.count(),
    db.question.count(),
    db.category.count(),
    db.attempt.findMany({
      orderBy: { completedAt: "desc" },
      include: { test: { include: { category: true } } },
    }),
  ]);

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts)
      : 0;
  const totalTimeSpent = attempts.reduce((s, a) => s + a.timeSpentSec, 0);

  // Best score per test
  const bestByTest = new Map<string, number>();
  for (const a of attempts) {
    const cur = bestByTest.get(a.testId) ?? -1;
    if (a.score > cur) bestByTest.set(a.testId, a.score);
  }

  // Score distribution by category
  const categoryStats = new Map<
    string,
    { name: string; color: string; attempts: number; totalScore: number }
  >();
  for (const a of attempts) {
    const key = a.test.category.slug;
    const entry = categoryStats.get(key) ?? {
      name: a.test.category.name,
      color: a.test.category.color,
      attempts: 0,
      totalScore: 0,
    };
    entry.attempts += 1;
    entry.totalScore += a.score;
    categoryStats.set(key, entry);
  }
  const categoryBreakdown = Array.from(categoryStats.values()).map((c) => ({
    ...c,
    avgScore: c.attempts > 0 ? Math.round(c.totalScore / c.attempts) : 0,
  }));

  return NextResponse.json({
    tests,
    questions,
    categories,
    totalAttempts,
    passedAttempts,
    avgScore,
    totalTimeSpent,
    testsCompleted: bestByTest.size,
    recentAttempts: attempts.slice(0, 10).map((a) => ({
      id: a.id,
      testId: a.testId,
      testTitle: a.test.title,
      category: a.test.category,
      difficulty: a.test.difficulty,
      score: a.score,
      correctAnswers: a.correctAnswers,
      totalQuestions: a.totalQuestions,
      timeSpentSec: a.timeSpentSec,
      passed: a.passed,
      completedAt: a.completedAt,
    })),
    categoryBreakdown,
  });
}
