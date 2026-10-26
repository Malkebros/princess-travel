import {
  DESK_COOKIE,
  DESK_COOKIE_VALUE,
  expectedDeskPasscode,
} from "@/lib/desk-lock";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expected = expectedDeskPasscode();
  if (!expected) {
    return NextResponse.json({ ok: true, unlocked: true });
  }

  let passcode = "";
  try {
    const body = (await request.json()) as { passcode?: string };
    passcode = String(body.passcode || "");
  } catch {
    return NextResponse.json({ error: "Missing passcode." }, { status: 400 });
  }

  if (passcode !== expected) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Session cookie only — clears when the browser/app session ends.
  res.cookies.set(DESK_COOKIE, DESK_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DESK_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
