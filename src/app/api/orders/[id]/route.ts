import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = await StorageService.getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, order });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const order = await StorageService.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Merge status, tracking, and payment
    if (updates.status) order.status = updates.status;
    if (updates.payment) {
      order.payment = {
        ...order.payment,
        ...updates.payment
      };
    }
    if (updates.tracking) {
      order.tracking = {
        ...order.tracking,
        ...updates.tracking
      };
      if (updates.tracking.weightGrossKg) {
        order.pricing.actualWeightKg = updates.tracking.weightGrossKg;
        // Recalculate shipping cost with actual scale weight
        const rate = order.pricing.intlShippingRatePerKg || 750;
        const actualShippingBdt = Math.round(updates.tracking.weightGrossKg * rate);
        order.pricing.intlShippingCostBdt = actualShippingBdt;
        order.pricing.stage2TotalPayableBdt = order.pricing.stage2ProductBalanceBdt + actualShippingBdt + (order.pricing.localCourierFeeBdt || 70);
      }
    }

    await StorageService.saveOrder(order);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PATCH(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await StorageService.deleteOrder(params.id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
