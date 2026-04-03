"use client";

import { motion } from "framer-motion";
import { Disc3, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SpotifyNowPlaying } from "@/types";

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function NowPlaying() {
  const { data: nowPlaying } = useQuery<SpotifyNowPlaying>({
    queryKey: ["spotify-now-playing"],
    queryFn: () => fetch("/api/spotify/now-playing").then((r) => r.json()),
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
  });

  const progressPct =
    nowPlaying?.isPlaying && nowPlaying.progress && nowPlaying.duration
      ? Math.round((nowPlaying.progress / nowPlaying.duration) * 100)
      : 0;

  return (
    <section id="music" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            07 / Music
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What I&apos;m listening to
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Live from Spotify — updates every 30 seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-lg"
        >
          <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
              <Disc3
                className="w-4 h-4 text-primary"
                style={{
                  animation: nowPlaying?.isPlaying
                    ? "spin 3s linear infinite"
                    : "none",
                }}
              />
              <span className="font-mono text-xs text-primary tracking-wider">
                {nowPlaying?.isPlaying ? "NOW PLAYING" : "NOT PLAYING"}
              </span>
            </div>

            {/* Content */}
            {nowPlaying?.isPlaying ? (
              <div className="p-5">
                <div className="flex items-start gap-4 mb-5">
                  {nowPlaying.albumArt && (
                    <img
                      src={nowPlaying.albumArt}
                      alt={nowPlaying.album}
                      className="w-20 h-20 rounded-md object-cover border border-border/30 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {nowPlaying.title}
                      </h3>
                      {nowPlaying.songUrl && (
                        <a
                          href={nowPlaying.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-0.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {nowPlaying.artist}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {nowPlaying.album}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {nowPlaying.progress ? formatMs(nowPlaying.progress) : "0:00"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {nowPlaying.duration ? formatMs(nowPlaying.duration) : "0:00"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-6">
                <div className="w-12 h-12 rounded-md bg-secondary/50 flex items-center justify-center shrink-0">
                  <Disc3 className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nothing playing right now
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/50 mt-0.5">
                    open spotify and it&apos;ll show up here
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
