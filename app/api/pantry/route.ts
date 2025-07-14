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

  const items = await prisma.pantryItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, quantity = 1, unit, expiryDate } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const newItem = await prisma.pantryItem.create({
    data: {
      name,
      quantity,
      unit,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      userId,
    },
  });
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, quantity, unit, expiryDate } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = await prisma.pantryItem.updateMany({
    where: { id, userId },
    data: {
      name,
      quantity,
      unit,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
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

  const result = await prisma.pantryItem.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
