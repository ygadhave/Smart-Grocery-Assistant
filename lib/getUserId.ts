import { verifyToken } from "./auth";

export function getUserIdFromCookie(req: Request): string {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) {
    throw new Error("Unauthorized");
  }
  const { userId } = verifyToken(match[1]);
  return userId as string;
}
