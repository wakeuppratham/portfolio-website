import { NextResponse } from "next/server";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const username = "wakeuppratham";
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error("GitHub API error");
    }

    const user = await userRes.json() as {
      public_repos: number;
      followers: number;
      avatar_url: string;
    };
    const repos = await reposRes.json() as Array<{
      stargazers_count: number;
      name: string;
      html_url: string;
      fork: boolean;
      updated_at: string;
      description: string | null;
    }>;

    const nonForkRepos = repos.filter((r) => !r.fork);
    const totalStars = nonForkRepos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const latestRepo = nonForkRepos[0];

    // Fetch latest commit message for the most recently updated repo
    let latestCommit = "";
    if (latestRepo) {
      try {
        const commitRes = await fetch(
          `https://api.github.com/repos/${username}/${latestRepo.name}/commits?per_page=1`,
          { headers }
        );
        if (commitRes.ok) {
          const commits = await commitRes.json() as Array<{ commit: { message: string } }>;
          latestCommit = commits[0]?.commit?.message?.split("\n")[0] ?? "";
        }
      } catch { /* ignore */ }
    }

    return NextResponse.json({
      repos: user.public_repos,
      stars: totalStars,
      followers: user.followers,
      latestRepo: latestRepo?.name ?? "",
      latestRepoUrl: latestRepo?.html_url ?? "",
      latestRepoDesc: latestRepo?.description ?? "",
      latestCommit,
      avatarUrl: user.avatar_url,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
