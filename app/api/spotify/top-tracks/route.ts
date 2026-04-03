import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";

export const revalidate = 3600; // 1 hour

export async function GET() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_ENABLED !== "true") {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const token = await getSpotifyAccessToken();
    const res = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return NextResponse.json({ tracks: [] });

    const data = await res.json() as {
      items: Array<{
        name: string;
        artists: Array<{ name: string }>;
        album: { images: Array<{ url: string }> };
        external_urls: { spotify: string };
        duration_ms: number;
      }>;
    };

    return NextResponse.json({
      tracks: data.items.map((t) => ({
        title: t.name,
        artist: t.artists.map((a) => a.name).join(", "),
        albumArt: t.album.images[2]?.url ?? t.album.images[0]?.url,
        url: t.external_urls.spotify,
        duration: t.duration_ms,
      })),
    });
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
