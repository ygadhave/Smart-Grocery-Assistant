import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 1) block duplicates
  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // 2) create
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash },
  });

  // 3) issue JWT cookie
  const token = signToken({ userId: user.id });
  const res = NextResponse.json({ message: "User created" }, { status: 201 });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return res;
}
