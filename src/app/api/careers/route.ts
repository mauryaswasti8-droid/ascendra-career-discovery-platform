import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { careers } from "@/db/schema";
import { ilike, or, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const tags = searchParams.get("tags");

  let query = db.select().from(careers).orderBy(desc(careers.createdAt)).$dynamic();

  if (search) {
    query = query.where(or(ilike(careers.title, `%${search}%`), ilike(careers.overview, `%${search}%`), ilike(careers.category, `%${search}%`)));
  }

  const results = await query;

  if (tags) {
    const tagList = tags.split(",").map(t => t.trim().toLowerCase());
    const filtered = results.filter(c => c.tags.some(t => tagList.includes(t.toLowerCase())));
    return NextResponse.json(filtered.length > 0 ? filtered : results.slice(0, 10));
  }

  return NextResponse.json(results);
}
