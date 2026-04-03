export interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  latestRepo: string;
  latestRepoUrl: string;
  avatarUrl: string;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

export interface VercelDeployment {
  state: "READY" | "ERROR" | "BUILDING" | "CANCELED" | "QUEUED";
  createdAt: number;
  url: string;
  name: string;
}

export interface SpotifyNowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  progress?: number;
  duration?: number;
  songUrl?: string;
}
