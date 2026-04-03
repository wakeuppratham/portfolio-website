import { NextRequest, NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = `${req.nextUrl.origin}/api/spotify/callback`;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json() as {
    refresh_token?: string;
    access_token?: string;
    error?: string;
  };

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  // In production: store refresh_token in env vars
  // This endpoint is only used once during setup
  return NextResponse.json({
    message: "Success! Copy your refresh_token to SPOTIFY_REFRESH_TOKEN env var.",
    refresh_token: data.refresh_token,
    access_token: data.access_token,
  });
}
