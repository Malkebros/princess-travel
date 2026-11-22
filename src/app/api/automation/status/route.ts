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
    events: ["stage_changed", "follow_up_digest"],
    description: {
      stage_changed:
        "When Amira changes a caller’s status, the customer gets an automatic SMS/WhatsApp/email via Make (message depends on the new stage).",
      follow_up_digest: `Daily cron: callers still open or waiting_pay for ${days}+ days → digest to Amira.`,
    },
    followUpAfterDays: days,
    schedule: "Follow-ups daily ~8:00 AM America/Chicago (14:00 UTC)",
  });
}
