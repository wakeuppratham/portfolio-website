import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour

const LEETCODE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

export async function GET() {
  try {
    const username = process.env.LEETCODE_USERNAME ?? "prathamg2003";

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    if (!res.ok) throw new Error("LeetCode API error");

    const json = await res.json() as {
      data: {
        matchedUser: {
          submitStats: {
            acSubmissionNum: Array<{ difficulty: string; count: number }>;
          };
          profile: { ranking: number };
        };
        allQuestionsCount: Array<{ difficulty: string; count: number }>;
      };
    };

    const stats = json.data.matchedUser.submitStats.acSubmissionNum;
    const totalSolved = stats.find((s) => s.difficulty === "All")?.count ?? 0;
    const easySolved = stats.find((s) => s.difficulty === "Easy")?.count ?? 0;
    const mediumSolved =
      stats.find((s) => s.difficulty === "Medium")?.count ?? 0;
    const hardSolved = stats.find((s) => s.difficulty === "Hard")?.count ?? 0;

    const allQ = json.data.allQuestionsCount;
    const totalQ = allQ.find((q) => q.difficulty === "All")?.count ?? 1;
    const acceptanceRate = Math.round((totalSolved / totalQ) * 100);

    return NextResponse.json({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate,
      ranking: json.data.matchedUser.profile.ranking,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch LeetCode stats" },
      { status: 500 }
    );
  }
}
