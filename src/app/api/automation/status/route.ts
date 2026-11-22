import { isAutomationConfigured } from "@/lib/automation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    automationEnabled: isAutomationConfigured(),
    event: "new_caller",
    description:
      "When a new caller is saved in the desk, a webhook fires to Make/Zapier/n8n (no button click).",
  });
}
