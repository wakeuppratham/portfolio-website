import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";

export const revalidate = 3600; // 1 hour

export async function GET() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_ENABLED !== "true") {
    return NextResponse.json({ artists: [] });
  }

  try {
    const token = await getSpotifyAccessToken();
    const res = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return NextResponse.json({ artists: [] });

    const data = await res.json() as {
      items: Array<{
        name: string;
        genres: string[];
        images: Array<{ url: string }>;
        external_urls: { spotify: string };
        followers: { total: number };
      }>;
    };

    return NextResponse.json({
      artists: data.items.map((a) => ({
        name: a.name,
        genres: a.genres.slice(0, 2).join(", ") || "—",
        image: a.images[2]?.url ?? a.images[0]?.url,
        url: a.external_urls.spotify,
        followers: a.followers.total,
      })),
    });
  } catch {
    return NextResponse.json({ artists: [] });
  }
}
