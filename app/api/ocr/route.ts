export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";
import { Buffer } from "buffer";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as Blob;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const { data: { text } } = await Tesseract.recognize(buffer, "eng");
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const items = lines.map((line) => {
    const parts = line.split(/\s+/);
    const last = parts.pop()!;
    const price = parseFloat(last.replace(/[^0-9.]/g, "")) || 0;
    return { name: parts.join(" "), quantity: 1, unitPrice: price, totalPrice: price };
  });
  return NextResponse.json({ items });
}
