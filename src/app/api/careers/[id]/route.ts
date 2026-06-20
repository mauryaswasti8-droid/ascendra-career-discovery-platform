import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { careers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [career] = await db.select().from(careers).where(eq(careers.id, parseInt(id)));
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(career);
}
