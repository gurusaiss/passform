import { NextRequest } from "next/server";

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY || "admin123";

  // Check Bearer authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === adminSecret) return true;
  }

  // Check HttpOnly cookie
  const cookieSession = req.cookies.get("admin_session")?.value;
  if (cookieSession && cookieSession === adminSecret) {
    return true;
  }

  return false;
}
