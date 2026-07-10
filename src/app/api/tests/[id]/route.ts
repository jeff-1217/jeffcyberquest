import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Returns a test with questions and options, but strips the `isCorrect` flag
// so the correct answer is hidden until the user submits.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  // Strip isCorrect from options for the taking endpoint
  const sanitized = {
    ...test,
    questions: test.questions.map((q) => ({
      id: q.id,
      text: q.text,
      difficulty: q.difficulty,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
    })),
  };

  return NextResponse.json(sanitized);
}
