import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { v4 as uuid } from "uuid";

export async function GET() {
  // each guest gets a fresh user
  const user = await prisma.user.create({
    data: {
      id: uuid(),
      email: `guest-${Date.now()}@guest.local`,
      isGuest: true,
    },
  });

  const token = signToken({ userId: user.id });
  const res = NextResponse.json({ message: "Guest mode" });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
