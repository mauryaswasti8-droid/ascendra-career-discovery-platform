import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.select().from(savedItems).where(eq(savedItems.userId, session.id));
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { itemType, itemId } = await req.json();

  const existing = await db.select().from(savedItems).where(
    and(eq(savedItems.userId, session.id), eq(savedItems.itemType, itemType), eq(savedItems.itemId, itemId))
  );

  if (existing.length > 0) {
    await db.delete(savedItems).where(eq(savedItems.id, existing[0].id));
    return NextResponse.json({ saved: false });
  }

  await db.insert(savedItems).values({ userId: session.id, itemType, itemId });
  return NextResponse.json({ saved: true });
}
