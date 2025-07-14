import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/getUserId";

export async function GET(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lists = await prisma.shoppingList.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(lists);
}

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const newList = await prisma.shoppingList.create({
    data: { name, userId },
  });
  return NextResponse.json(newList, { status: 201 });
}

export async function PUT(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name } = await req.json();
  if (!id || !name) {
    return NextResponse.json({ error: "Missing id or name" }, { status: 400 });
  }

  const updated = await prisma.shoppingList.updateMany({
    where: { id, userId },
    data: { name },
  });
  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = await prisma.shoppingList.deleteMany({
    where: { id, userId },
  });
  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
