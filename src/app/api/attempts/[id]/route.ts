import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = req.headers.get("x-user-id") || "anonymous";

  const attempt = await db.attempt.findFirst({
    where: { id, userId },
    include: {
      test: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  let graded = [];
  try {
    graded = JSON.parse(attempt.answers);
  } catch (e) {
    console.error("Failed to parse graded answers JSON:", e);
  }

  return NextResponse.json({
    attemptId: attempt.id,
    testId: attempt.testId,
    testTitle: attempt.test.title,
    category: attempt.test.category,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    timeSpentSec: attempt.timeSpentSec,
    passed: attempt.passed,
    passingScore: attempt.test.passingScore,
    difficulty: attempt.test.difficulty,
    graded,
  });
}
