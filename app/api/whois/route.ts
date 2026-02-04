import { NextResponse } from "next/server";

const DOMAIN_PATTERN =
  /^(?=.{1,253}$)(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = (searchParams.get("domain") ?? "").trim().toLowerCase();
  const vercelToken = process.env.NEXT_VERCEL_TOKEN ?? "";

  if (!DOMAIN_PATTERN.test(domain)) {
    return NextResponse.json(
      { available: false, status: "invalid" },
      { status: 400 },
    );
  }

  try {
    if (!vercelToken) {
      return NextResponse.json(
        { available: false, status: "error" },
        { status: 500 },
      );
    }

    let price: number | null = null;
    try {
      const priceResponse = await fetch(
        `https://api.vercel.com/v1/registrar/domains/${encodeURIComponent(
          domain,
        )}/price`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        },
      );
      if (priceResponse.ok) {
        const priceResult = (await priceResponse.json()) as {
          purchasePrice: number | null;
          renewalPrice: number | null;
          transferPrice: number | null;
        };
        price =
          priceResult.purchasePrice ??
          priceResult.renewalPrice ??
          priceResult.transferPrice ??
          null;
      }
    } catch {
      // Ignore price lookup errors; availability check still runs.
    }

    const response = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`,
      { method: "GET", redirect: "follow" },
    );

    if (response.status === 404) {
      return NextResponse.json({ available: true, status: "available", price });
    }

    if (response.ok) {
      return NextResponse.json({ available: false, status: "taken", price });
    }

    return NextResponse.json(
      { available: false, status: "error" },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { available: false, status: "error" },
      { status: 502 },
    );
  }
}
