import { NextRequest, NextResponse } from "next/server";
import { translateText, translateBatch, translateProductAttributes } from "@/lib/translate";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, message: "Empty request body" }, { status: 400 });
    }

    const responseData: any = { success: true };

    // 1. Single text translation
    if (typeof body.text === "string") {
      responseData.original = body.text;
      responseData.translated = await translateText(body.text);
    }

    // 2. Batch translation
    if (Array.isArray(body.texts)) {
      responseData.translatedList = await translateBatch(body.texts);
    }

    // 3. Structured attributes translation
    if (Array.isArray(body.attributes)) {
      responseData.attributes = await translateProductAttributes(body.attributes);
    }

    // 4. Full product translation helper (Title, description, attributes)
    if (body.product) {
      const p = body.product;
      const [titleEn, descriptionEn] = await Promise.all([
        translateText(p.titleCn || p.titleEn || ""),
        translateText(p.descriptionCn || p.description || "")
      ]);

      let attributes: any[] = [];
      if (Array.isArray(p.attributes) && p.attributes.length > 0) {
        attributes = await translateProductAttributes(p.attributes);
      }

      responseData.titleEn = titleEn;
      responseData.descriptionEn = descriptionEn;
      responseData.attributes = attributes;
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
