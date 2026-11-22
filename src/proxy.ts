import { DESK_COOKIE, DESK_COOKIE_VALUE } from "@/lib/desk-lock";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const passcode = process.env.DESK_PASSCODE?.trim();
  if (!passcode) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) {
    return NextResponse.next();
  }

  // Cron / Make schedule hit this without the desk session cookie
  if (pathname.startsWith("/api/automation/follow-ups")) {
    return NextResponse.next();
  }

  const unlocked = request.cookies.get(DESK_COOKIE)?.value === DESK_COOKIE_VALUE;
  if (unlocked) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Desk is locked." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
