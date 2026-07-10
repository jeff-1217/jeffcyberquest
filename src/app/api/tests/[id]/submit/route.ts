import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type SubmitBody = {
  answers: Array<{ questionId: string; selectedOptionId: string | null }>;
  timeSpentSec: number;
};

// Grades a submitted test: verifies answers server-side, records an attempt,
// and returns the full result with correct answers + explanations.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json()) as SubmitBody;

  const test = await db.test.findUnique({
    where: { id },
    include: {
      category: true,
      questions: {
        orderBy: { createdAt: "asc" },
        include: {
          options: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const totalQuestions = test.questions.length;
  let correctCount = 0;

  const graded = test.questions.map((q) => {
    const submitted = body.answers.find((a) => a.questionId === q.id);
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect =
      !!submitted &&
      !!submitted.selectedOptionId &&
      !!correctOption &&
      submitted.selectedOptionId === correctOption.id;
    if (isCorrect) correctCount += 1;

    return {
      questionId: q.id,
      questionText: q.text,
      explanation: q.explanation,
      difficulty: q.difficulty,
      selectedOptionId: submitted?.selectedOptionId ?? null,
      correctOptionId: correctOption?.id ?? null,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
      })),
      isCorrect,
    };
  });

  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = score >= test.passingScore;
  const timeSpentSec = Math.max(0, Math.round(body.timeSpentSec || 0));

  const attempt = await db.attempt.create({
    data: {
      testId: test.id,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      timeSpentSec,
      passed,
      answers: JSON.stringify(graded),
    },
  });

  return NextResponse.json({
    attemptId: attempt.id,
    testId: test.id,
    testTitle: test.title,
    category: test.category,
    score,
    totalQuestions,
    correctAnswers: correctCount,
    timeSpentSec,
    passed,
    passingScore: test.passingScore,
    difficulty: test.difficulty,
    graded,
  });
}
