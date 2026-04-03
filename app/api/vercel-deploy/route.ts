import { NextResponse } from "next/server";

export const revalidate = 60; // 1 minute

export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return NextResponse.json(
      { error: "Vercel credentials not configured" },
      { status: 503 }
    );
  }

  try {
    const url = new URL("https://api.vercel.com/v6/deployments");
    url.searchParams.set("projectId", projectId);
    url.searchParams.set("limit", "1");
    if (process.env.VERCEL_TEAM_ID) {
      url.searchParams.set("teamId", process.env.VERCEL_TEAM_ID);
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Vercel API error");

    const json = await res.json() as {
      deployments: Array<{
        readyState: string;
        createdAt: number;
        url: string;
        name: string;
      }>;
    };
    const d = json.deployments[0];

    return NextResponse.json({
      state: d.readyState,
      createdAt: d.createdAt,
      url: `https://${d.url}`,
      name: d.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch deployment" },
      { status: 500 }
    );
  }
}
