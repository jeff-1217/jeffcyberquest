import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Question bank for study/practice mode. Includes the correct answer flag so
// users can learn. Supports category filter and search.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // slug
  const search = searchParams.get("search");
  const difficulty = searchParams.get("difficulty");

  const where: {
    categoryId?: string;
    difficulty?: string;
    OR?: Array<Record<string, { contains: string }>>;
  } = {};

  if (category) {
    const cat = await db.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [{ text: { contains: search } }, { explanation: { contains: search } }];
  }

  const questions = await db.question.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
      options: { orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json(questions);
}
