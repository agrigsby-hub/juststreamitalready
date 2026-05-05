import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const type = req.nextUrl.searchParams.get("type"); // "movie" or "tv"
  const region = req.nextUrl.searchParams.get("region") ?? "US";

  if (!id || !type) {
    return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY not configured" }, { status: 500 });
  }

  const url = `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  const regionData = data.results?.[region] ?? null;

  return NextResponse.json({
    region,
    link: regionData?.link ?? null,
    flatrate: regionData?.flatrate ?? [],
    rent: regionData?.rent ?? [],
    buy: regionData?.buy ?? [],
    free: regionData?.free ?? [],
    ads: regionData?.ads ?? [],
  });
}
