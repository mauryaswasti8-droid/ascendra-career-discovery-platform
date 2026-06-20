import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  let query = db.select().from(resources).orderBy(desc(resources.createdAt)).$dynamic();

  if (search) {
    query = query.where(or(ilike(resources.title, `%${search}%`), ilike(resources.description, `%${search}%`)));
  }
  if (category && category !== "All") {
    query = query.where(eq(resources.category, category));
  }

  const results = await query;
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const [res] = await db.insert(resources).values(data).returning();
  return NextResponse.json(res);
}
