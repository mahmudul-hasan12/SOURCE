import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { RfqRequest } from "@/types";

export async function GET() {
  try {
    const rfqs = await StorageService.getRfqs();
    return NextResponse.json({ success: true, rfqs });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.phone || !body.productTitle) {
      return NextResponse.json(
        { success: false, message: "দয়া করে নাম, মোবাইল নম্বর এবং পণ্যের নাম প্রদান করুন।" },
        { status: 400 }
      );
    }

    const newRfq: RfqRequest = {
      id: `rfq-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      district: body.district?.trim() || "ঢাকা",
      productTitle: body.productTitle.trim(),
      description: body.description?.trim() || "",
      targetQuantity: Number(body.targetQuantity) || 10,
      targetPriceBdt: body.targetPriceBdt ? Number(body.targetPriceBdt) : undefined,
      imageUrl: body.imageUrl || undefined,
      referenceLink: body.referenceLink?.trim() || undefined,
      preferredShipping: body.preferredShipping === "SEA" ? "SEA" : "AIR",
      status: "PENDING",
      adminNotes: "",
      quotedPriceBdt: undefined,
    };

    const saved = await StorageService.saveRfq(newRfq);
    return NextResponse.json({ success: true, rfq: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...update } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "RFQ ID is required" }, { status: 400 });
    }

    const ok = await StorageService.updateRfqStatus(id, update);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
