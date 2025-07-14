// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Build a response that clears the "token" cookie
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set({
    name: "token",      // must match whatever name you used when setting it
    value: "",
    httpOnly: true,
    path: "/",          // same path as when you set it
    maxAge: 0,          // expire immediately
  });
  return res;
}
