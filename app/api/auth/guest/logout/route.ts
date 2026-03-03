import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const payload = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user?.isGuest) {
        await prisma.pantryItem.deleteMany({
          where: { userId: user.id },
        });

        await prisma.shoppingListItem.deleteMany({
          where: {
            list: {
              userId: user.id,
            },
          },
        });

        await prisma.shoppingList.deleteMany({
          where: { userId: user.id },
        });

        await prisma.receiptItem.deleteMany({
          where: {
            receipt: {
              userId: user.id,
            },
          },
        });

        await prisma.receipt.deleteMany({
          where: { userId: user.id },
        });

        await prisma.user.delete({
          where: { id: user.id },
        });
      }
    } catch (err) {
      console.error("Guest logout cleanup error:", err);
    }
  }

  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}