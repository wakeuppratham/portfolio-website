"use client";

import { motion } from "framer-motion";
import { Music, Disc3, Headphones, ListMusic } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SpotifyNowPlaying } from "@/types";

type Tab = "tracks" | "artists";

interface TopTrack {
  title: string;
  artist: string;
  albumArt?: string;
  url: string;
  duration: number;
}

interface TopArtist {
  name: string;
  genres: string;
  image?: string;
  url: string;
  followers: number;
}

const fallbackTracks: TopTrack[] = [
  { title: "Blinding Lights", artist: "The Weeknd", url: "#", duration: 200000 },
  { title: "Lose Yourself", artist: "Eminem", url: "#", duration: 200000 },
  { title: "Bohemian Rhapsody", artist: "Queen", url: "#", duration: 200000 },
  { title: "Hotel California", artist: "Eagles", url: "#", duration: 200000 },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", url: "#", duration: 200000 },
];

const fallbackArtists: TopArtist[] = [
  { name: "The Weeknd", genres: "Pop, R&B", url: "#", followers: 0 },
  { name: "Pink Floyd", genres: "Progressive Rock", url: "#", followers: 0 },
  { name: "Eminem", genres: "Hip Hop, Rap", url: "#", followers: 0 },
  { name: "A.R. Rahman", genres: "Film, Indian Classical", url: "#", followers: 0 },
  { name: "Led Zeppelin", genres: "Classic Rock", url: "#", followers: 0 },
];

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function NowPlaying() {
  const [activeTab, setActiveTab] = useState<Tab>("tracks");

  const { data: nowPlaying } = useQuery<SpotifyNowPlaying>({
    queryKey: ["spotify-now-playing"],
    queryFn: () => fetch("/api/spotify/now-playing").then((r) => r.json()),
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
  });

  const { data: topTracksData } = useQuery<{ tracks: TopTrack[] }>({
    queryKey: ["spotify-top-tracks"],
    queryFn: () => fetch("/api/spotify/top-tracks").then((r) => r.json()),
    staleTime: 60 * 60 * 1000,
  });

  const { data: topArtistsData } = useQuery<{ artists: TopArtist[] }>({
    queryKey: ["spotify-top-artists"],
    queryFn: () => fetch("/api/spotify/top-artists").then((r) => r.json()),
    staleTime: 60 * 60 * 1000,
  });

  const tracks = topTracksData?.tracks?.length ? topTracksData.tracks : fallbackTracks;
  const artists = topArtistsData?.artists?.length ? topArtistsData.artists : fallbackArtists;
  const isRealData = !!topTracksData?.tracks?.length;

  const progressPct =
    nowPlaying?.isPlaying && nowPlaying.progress && nowPlaying.duration
      ? Math.round((nowPlaying.progress / nowPlaying.duration) * 100)
      : 0;

  const tabs: { key: Tab; label: string; icon: typeof Music }[] = [
    { key: "tracks", label: "Top Tracks", icon: Music },
    { key: "artists", label: "Top Artists", icon: Headphones },
  ];

  return (
    <section id="music" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            07 / Music
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What I&apos;m listening to
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Music taste is a better personality test than any interview question.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Now Playing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 rounded-lg border border-border/50 bg-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              <Disc3
                className="w-4 h-4 text-primary"
                style={{
                  animation: nowPlaying?.isPlaying ? "spin 3s linear infinite" : "none",
                }}
              />
              <span className="font-mono text-xs text-primary">
                {nowPlaying?.isPlaying ? "NOW PLAYING" : "NOT PLAYING"}
              </span>
            </div>

            {nowPlaying?.isPlaying ? (
              <>
                <div className="flex items-start gap-4 mb-5">
                  {nowPlaying.albumArt && (
                    <img
                      src={nowPlaying.albumArt}
                      alt={nowPlaying.album}
                      className="w-20 h-20 rounded-md object-cover border border-border/50"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <a
                      href={nowPlaying.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-foreground truncate block hover:text-primary transition-colors"
                    >
                      {nowPlaying.title}
                    </a>
                    <p className="text-sm text-muted-foreground truncate">{nowPlaying.artist}</p>
                    <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{nowPlaying.album}</p>
                  </div>
                </div>
                <div className="mt-auto">
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
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <Disc3 className="w-12 h-12 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">Nothing playing right now</p>
                <p className="font-mono text-xs text-muted-foreground/50 mt-1">
                  play something on spotify
                </p>
              </div>
            )}
          </motion.div>

          {/* Tabs section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:col-span-3 rounded-lg border border-border/50 bg-card overflow-hidden"
          >
            <div className="flex border-b border-border/50">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono transition-colors ${
                    activeTab === tab.key
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
              {!isRealData && (
                <span className="px-3 py-3 font-mono text-[10px] text-muted-foreground/40 flex items-center">
                  sample
                </span>
              )}
            </div>

            <div className="p-5">
              {activeTab === "tracks" && (
                <div className="space-y-1">
                  {tracks.map((track, i) => (
                    <a
                      key={i}
                      href={track.url !== "#" ? track.url : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-secondary/50 transition-colors group"
                    >
                      <span className="font-mono text-xs text-muted-foreground/50 w-5 text-right shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {track.albumArt ? (
                        <img src={track.albumArt} alt="" className="w-8 h-8 rounded shrink-0 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-primary/10 shrink-0 flex items-center justify-center">
                          <Music className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {track.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                        {formatMs(track.duration)}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {activeTab === "artists" && (
                <div className="space-y-1">
                  {artists.map((artist, i) => (
                    <a
                      key={i}
                      href={artist.url !== "#" ? artist.url : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-secondary/50 transition-colors group"
                    >
                      <span className="font-mono text-xs text-muted-foreground/50 w-5 text-right shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {artist.image ? (
                        <img src={artist.image} alt="" className="w-8 h-8 rounded-full shrink-0 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                          <Headphones className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {artist.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{artist.genres}</p>
                      </div>
                      {artist.followers > 0 && (
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                          {formatFollowers(artist.followers)}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
