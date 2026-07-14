import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "anonymous";

  const attempts = await db.attempt.findMany({
    where: { userId },
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
