import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/getUserId";

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromCookie(req);
    const receipts = await prisma.receipt.findMany({
      where: { userId },
      include: { items: true },
    });
    return NextResponse.json(receipts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromCookie(req);
    const { storeName, purchaseDate, totalAmount, items } = await req.json();
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        storeName,
        purchaseDate: new Date(purchaseDate),
        totalAmount,
        items: { create: items }, 
      },
    });
    return NextResponse.json(receipt, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
