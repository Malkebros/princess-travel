import { DESK_COOKIE, DESK_COOKIE_VALUE } from "@/lib/desk-lock";
import { NextResponse, type NextRequest } from "next/server";

function clearUnlockCookie(res: NextResponse) {
  res.cookies.set(DESK_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/** True when someone opens the site link (bookmark, texted URL, new tab) — not in-app nav. */
function isFreshSiteEntry(request: NextRequest) {
  const dest = request.headers.get("sec-fetch-dest");
  const site = request.headers.get("sec-fetch-site");
  if (dest !== "document") return false;
  return site === "none" || site === "cross-site";
}

export function proxy(request: NextRequest) {
  const passcode = process.env.DESK_PASSCODE?.trim();
  if (!passcode) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Cron / Make schedule hit this without the desk session cookie
  if (pathname.startsWith("/api/automation/follow-ups")) {
    return NextResponse.next();
  }

  // Opening the shared link always clears unlock and shows the lock screen
  if (isFreshSiteEntry(request)) {
    if (pathname.startsWith("/api/")) {
      const res = NextResponse.json(
        { error: "Desk is locked." },
        { status: 401 }
      );
      clearUnlockCookie(res);
      return res;
    }

    if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) {
      const res = NextResponse.next();
      clearUnlockCookie(res);
      return res;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/unlock";
    url.search = "";
    const res = NextResponse.redirect(url);
    clearUnlockCookie(res);
    return res;
  }

  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) {
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
