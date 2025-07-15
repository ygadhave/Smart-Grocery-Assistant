import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/getUserId";

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = getUserIdFromCookie(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { listId, name, quantity = 1, unit = null, isChecked = false } =
    await req.json();
  if (!listId || !name) {
    return NextResponse.json({ error: "Missing listId or name" }, { status: 400 });
  }
  const parent = await prisma.shoppingList.findUnique({ where: { id: listId } });
  if (!parent || parent.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const newItem = await prisma.shoppingListItem.create({
    data: { listId, name, quantity, unit, isChecked },
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
  const { id, isChecked } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const existing = await prisma.shoppingListItem.findUnique({
    where: { id },
    include: { list: true },
  });
  if (!existing || existing.list.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const updated = await prisma.shoppingListItem.update({
    where: { id },
    data: { isChecked },
  });
  return NextResponse.json(updated);
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
  const existing = await prisma.shoppingListItem.findUnique({
    where: { id },
    include: { list: true },
  });
  if (!existing || existing.list.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const deleted = await prisma.shoppingListItem.delete({ where: { id } });
  return NextResponse.json(deleted);
}
