import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // slug
  const difficulty = searchParams.get("difficulty");
  const search = searchParams.get("search");

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
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const tests = await db.test.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return NextResponse.json(tests);
}
