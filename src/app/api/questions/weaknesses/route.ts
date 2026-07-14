import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // Load all attempts to extract incorrect question IDs
  const attempts = await db.attempt.findMany({
    select: {
      answers: true,
    },
  });

  const incorrectIds = new Set<string>();

  for (const attempt of attempts) {
    try {
      const graded = JSON.parse(attempt.answers);
      if (Array.isArray(graded)) {
        for (const g of graded) {
          if (g.questionId && g.isCorrect === false) {
            incorrectIds.add(g.questionId);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse attempt answers:", e);
    }
  }

  // Fetch the full details of all the incorrect questions
  const ids = Array.from(incorrectIds);
  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const questions = await db.question.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      category: true,
      options: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(questions);
}
