import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/auth";
import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const existingToken = cookieStore.get("token")?.value;

  if (existingToken) {
    try {
      verifyToken(existingToken);
      return NextResponse.json({ message: "Already in guest mode" });
    } catch {}
  }

  const user = await prisma.user.create({
    data: {
      id: uuid(),
      email: `guest-${Date.now()}@guest.local`,
      isGuest: true,
    },
  });

  const token = signToken({ userId: user.id });

  const res = NextResponse.json({ message: "Guest mode" });
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}