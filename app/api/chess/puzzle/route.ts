import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://lichess.org/api/puzzle/daily", {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Lichess error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch puzzle" }, { status: 500 });
  }
}
