import {
  followUpAfterDays,
  isAutomationConfigured,
} from "@/lib/automation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const days = followUpAfterDays();
  return NextResponse.json({
    automationEnabled: isAutomationConfigured(),
    event: "follow_up_digest",
    schedule: "Daily ~8:00 AM America/Chicago (14:00 UTC) via Vercel Cron",
    description: `Without anyone clicking: callers still open or waiting_pay for ${days}+ days are emailed/texted to Amira through Make/Zapier.`,
    followUpAfterDays: days,
  });
}
