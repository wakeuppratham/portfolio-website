import { NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function GET() {
  const enabled = process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true";
  if (!enabled) {
    return NextResponse.json({ isPlaying: false });
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (res.status === 204 || res.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await res.json() as {
      is_playing: boolean;
      item: {
        name: string;
        artists: Array<{ name: string }>;
        album: { name: string; images: Array<{ url: string }> };
        duration_ms: number;
        external_urls: { spotify: string };
      };
      progress_ms: number;
    };

    if (!song.is_playing || !song.item) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json({
      isPlaying: true,
      title: song.item.name,
      artist: song.item.artists.map((a) => a.name).join(", "),
      album: song.item.album.name,
      albumArt: song.item.album.images[0]?.url,
      progress: song.progress_ms,
      duration: song.item.duration_ms,
      songUrl: song.item.external_urls.spotify,
    });
  } catch {
    return NextResponse.json({ isPlaying: false });
  }
}
