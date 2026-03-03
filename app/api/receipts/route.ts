import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/getUserId";

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromCookie(req);

    const receipts = await prisma.receipt.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(receipts);
  } catch (err: any) {
    console.error("Receipts GET error:", err);
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromCookie(req);

    const { storeName, purchaseDate, totalAmount, items } =
      await req.json();

    const cleanItems = (items || [])
      .map((item: any) => ({
        name: item.name?.trim(),
        quantity: 1,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      }))
      .filter(
        (item: any) =>
          item.name &&
          item.totalPrice > 0 &&
          item.totalPrice < 10000
      );

    if (cleanItems.length === 0) {
      return NextResponse.json(
        { error: "No valid receipt items found" },
        { status: 400 }
      );
    }

    const safeTotal = cleanItems.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0
    );

    const receipt = await prisma.receipt.create({
      data: {
        userId,
        storeName,
        purchaseDate: new Date(purchaseDate),
        totalAmount: safeTotal,
        items: {
          create: cleanItems,
        },
      },
      include: { items: true },
    });

    const receipts = await prisma.receipt.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(receipts, { status: 201 });

  } catch (err: any) {
    console.error("Receipt POST error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = getUserIdFromCookie(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing receipt id" },
        { status: 400 }
      );
    }

    await prisma.receipt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Receipt DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}