import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { Order } from "@/types";

export async function GET() {
  const orders = await StorageService.getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const orderData: Order = await req.json();
    const saved = await StorageService.saveOrder(orderData);
    return NextResponse.json({ success: true, order: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
