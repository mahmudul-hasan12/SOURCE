import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { GlobalSettings } from "@/types";

export async function GET() {
  const settings = await StorageService.getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  try {
    const newSettings: GlobalSettings = await req.json();
    const saved = await StorageService.saveSettings(newSettings);
    return NextResponse.json({ success: true, settings: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
