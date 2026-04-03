"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  GitBranch,
  Star,
  Code2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Rocket,
  Trophy,
} from "lucide-react";
import type { GitHubStats, LeetCodeStats, VercelDeployment } from "@/types";

/* ─── Mini sparkline ─── */
function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const height = 50;
  const w = data.length * 8;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className="w-full h-12"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(175 70% 50%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(175 70% 50%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${height} ${data.map((v, i) => `L${i * 8},${height - (v / max) * height}`).join(" ")} L${(data.length - 1) * 8},${height} Z`}
        fill="url(#chartGrad)"
      />
      <path
        d={data.map((v, i) => `${i === 0 ? "M" : "L"}${i * 8},${height - (v / max) * height}`).join(" ")}
        fill="none"
        stroke="hsl(175 70% 50%)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function generateLatency() {
  return Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 5);
}

/* ─── GitHub Panel ─── */
function GitHubPanel() {
  const { data, isLoading, isError } = useQuery<GitHubStats>({
    queryKey: ["github"],
    queryFn: () => fetch("/api/github").then((r) => r.json()),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  return (
    <div className="p-5 rounded-lg border border-border/50 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-primary" />
        <span className="font-mono text-xs text-muted-foreground uppercase">
          GitHub
        </span>
        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-auto" />}
      </div>

      {isError && (
        <p className="text-xs text-muted-foreground font-mono">Failed to load</p>
      )}

      {isLoading && !data && (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-secondary rounded w-16" />
          <div className="h-3 bg-secondary rounded w-24" />
          <div className="h-3 bg-secondary rounded w-32" />
        </div>
      )}

      {data && (
        <>
          <div className="flex items-baseline gap-3 mb-3">
            <p className="text-2xl font-bold text-foreground">{data.repos}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-3 h-3" />
              <span className="text-xs font-mono">{data.stars} stars</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">public repos</p>
          {data.latestRepo && (
            <a
              href={data.latestRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-primary hover:underline truncate block"
            >
              ↳ {data.latestRepo}
            </a>
          )}
        </>
      )}
    </div>
  );
}

/* ─── LeetCode Panel ─── */
function LeetCodePanel() {
  const { data, isLoading, isError } = useQuery<LeetCodeStats>({
    queryKey: ["leetcode"],
    queryFn: () => fetch("/api/leetcode").then((r) => r.json()),
    refetchInterval: 60 * 60 * 1000,
    staleTime: 55 * 60 * 1000,
  });

  return (
    <div className="p-5 rounded-lg border border-border/50 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-4 h-4" style={{ color: "hsl(var(--terminal-amber))" }} />
        <span className="font-mono text-xs text-muted-foreground uppercase">
          LeetCode
        </span>
        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-auto" />}
      </div>

      {isError && (
        <p className="text-xs text-muted-foreground font-mono">Failed to load</p>
      )}

      {isLoading && !data && (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-secondary rounded w-16" />
          <div className="h-3 bg-secondary rounded w-24" />
        </div>
      )}

      {data && (
        <>
          <p className="text-2xl font-bold text-foreground mb-1">
            {data.totalSolved}
          </p>
          <p className="text-xs text-muted-foreground mb-3">problems solved</p>
          <div className="flex gap-2 flex-wrap">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--terminal-green)/0.15)", color: "hsl(var(--terminal-green))" }}>
              Easy {data.easySolved}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--terminal-amber)/0.15)", color: "hsl(var(--terminal-amber))" }}>
              Med {data.mediumSolved}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--terminal-red)/0.15)", color: "hsl(var(--terminal-red))" }}>
              Hard {data.hardSolved}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Vercel Panel ─── */
function VercelPanel() {
  const { data, isLoading, isError } = useQuery<VercelDeployment>({
    queryKey: ["vercel"],
    queryFn: () => fetch("/api/vercel-deploy").then((r) => r.json()),
    refetchInterval: 60 * 1000,
    staleTime: 50 * 1000,
  });

  const stateColor =
    data?.state === "READY"
      ? "hsl(var(--terminal-green))"
      : data?.state === "ERROR"
      ? "hsl(var(--terminal-red))"
      : "hsl(var(--terminal-amber))";

  const StateIcon =
    data?.state === "READY"
      ? CheckCircle2
      : data?.state === "ERROR"
      ? AlertCircle
      : Rocket;

  return (
    <div className="p-5 rounded-lg border border-border/50 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-4 h-4" style={{ color: "hsl(var(--chart-blue))" }} />
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Vercel Deploy
        </span>
        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-auto" />}
      </div>

      {isError && (
        <p className="text-xs text-muted-foreground font-mono">
          Not configured — add VERCEL_TOKEN + VERCEL_PROJECT_ID
        </p>
      )}

      {isLoading && !data && (
        <div className="space-y-2 animate-pulse">
          <div className="h-5 bg-secondary rounded w-20" />
          <div className="h-3 bg-secondary rounded w-32" />
        </div>
      )}

      {data && !("error" in data) && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <StateIcon className="w-4 h-4" style={{ color: stateColor }} />
            <span className="font-mono text-sm font-bold" style={{ color: stateColor }}>
              {data.state}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1 font-mono">{data.name}</p>
          {data.createdAt && (
            <p className="text-[10px] text-muted-foreground font-mono">
              {new Date(data.createdAt).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Achievements Panel ─── */
function AchievementsPanel() {
  const achievements = [
    { icon: Trophy, label: "Chess Runner-up", sub: "Rann-Neeti, IIT Mandi", color: "hsl(var(--terminal-amber))" },
    { icon: Code2, label: "400+ LeetCode", sub: "Problems solved", color: "hsl(var(--primary))" },
    { icon: Star, label: "CGPA 9.22 / 10", sub: "Chitkara University", color: "hsl(var(--terminal-green))" },
  ];

  return (
    <div className="p-5 rounded-lg border border-border/50 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4" style={{ color: "hsl(var(--terminal-amber))" }} />
        <span className="font-mono text-xs text-muted-foreground uppercase">Achievements</span>
      </div>
      <div className="space-y-3">
        {achievements.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <a.icon className="w-4 h-4 shrink-0" style={{ color: a.color }} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{a.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MachineRoom() {
  const [latencyData, setLatencyData] = useState(generateLatency);
  const avgLatency = Math.round(latencyData.reduce((a, b) => a + b, 0) / latencyData.length);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLatencyData((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 15) + 5,
      ]);
    }, 2000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section id="metrics" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            06 / Machine Room
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live telemetry
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Real-time data pulled from GitHub, LeetCode, and Vercel APIs.
            Because if you can&apos;t measure it, you can&apos;t improve it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[GitHubPanel, LeetCodePanel, VercelPanel, AchievementsPanel].map(
            (Panel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Panel />
              </motion.div>
            )
          )}
        </div>

        {/* Latency chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-6 rounded-lg border border-border/50 bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">
                SIMULATED API LATENCY — AVG {avgLatency}ms
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">live</span>
            </div>
          </div>
          <MiniChart data={latencyData} />
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
            <span>-60s</span>
            <span>now</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
