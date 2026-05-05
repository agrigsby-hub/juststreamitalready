import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ results: [] });

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY not configured" }, { status: 500 });
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  // Only return movies and TV shows, filter out people
  const filtered = (data.results ?? [])
    .filter((r: { media_type: string }) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, 8);

  return NextResponse.json({ results: filtered });
}
