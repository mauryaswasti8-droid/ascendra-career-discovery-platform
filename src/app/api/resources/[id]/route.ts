import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [res] = await db.select().from(resources).where(eq(resources.id, parseInt(id)));
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const [res] = await db.update(resources).set(data).where(eq(resources.id, parseInt(id))).returning();
  return NextResponse.json(res);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.delete(resources).where(eq(resources.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
