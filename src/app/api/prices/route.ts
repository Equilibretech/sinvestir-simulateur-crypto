import { NextResponse } from "next/server";
import { getPrices } from "@/lib/prices";
import { getCoin } from "@/lib/coins";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coin") ?? "";

  if (!getCoin(coinId)) {
    return NextResponse.json({ error: "Crypto inconnue." }, { status: 400 });
  }

  const { prices, source } = await getPrices(coinId);
  return NextResponse.json({ coinId, source, prices });
}
