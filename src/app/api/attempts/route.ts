import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const attempts = await db.attempt.findMany({
    orderBy: { completedAt: "desc" },
    include: {
      test: {
        include: { category: true },
      },
    },
  });

  const withParsed = attempts.map((a) => ({
    id: a.id,
    testId: a.testId,
    testTitle: a.test.title,
    category: a.test.category,
    difficulty: a.test.difficulty,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctAnswers: a.correctAnswers,
    timeSpentSec: a.timeSpentSec,
    passed: a.passed,
    completedAt: a.completedAt,
  }));

  return NextResponse.json(withParsed);
}
