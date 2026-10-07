import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const offerId = req.nextUrl.searchParams.get("offerId") || "1019859245819";
  const fetchUrl = `https://m.1688.com/offer/${offerId}.html`;
  
  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        Referer: "https://m.1688.com/",
      },
    });

    const html = await res.text();
    return NextResponse.json({
      status: res.status,
      length: html.length,
      hasRgv587: html.includes("rgv587"),
      hasX5sec: html.includes("x5secdata"),
      preview: html.slice(0, 300)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
