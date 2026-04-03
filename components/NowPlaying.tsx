"use client";

import { motion } from "framer-motion";
import { Music, Disc3, Headphones, ListMusic } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SpotifyNowPlaying } from "@/types";

const dummyTopTracks = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin" },
  { title: "Lose Yourself", artist: "Eminem" },
  { title: "Hotel California", artist: "Eagles" },
];

const dummyTopArtists = [
  { name: "The Weeknd", genres: "Pop, R&B" },
  { name: "Pink Floyd", genres: "Progressive Rock" },
  { name: "Eminem", genres: "Hip Hop, Rap" },
  { name: "Led Zeppelin", genres: "Classic Rock" },
  { name: "A.R. Rahman", genres: "Film, Indian Classical" },
];

const dummyPlaylists = [
  { name: "Late Night Coding", tracks: 87, description: "Focus music for 2am debugging sessions" },
  { name: "Chess & Chill", tracks: 42, description: "Classical meets electronic" },
  { name: "Gym Mode", tracks: 63, description: "Heavy beats for heavy lifts" },
  { name: "Cosmos Soundtrack", tracks: 31, description: "Space ambient & Hans Zimmer" },
];

type Tab = "tracks" | "artists" | "playlists";

export default function NowPlaying() {
  const [activeTab, setActiveTab] = useState<Tab>("tracks");

  const { data: nowPlaying } = useQuery<SpotifyNowPlaying>({
    queryKey: ["spotify-now-playing"],
    queryFn: () => fetch("/api/spotify/now-playing").then((r) => r.json()),
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
  });

  const tabs: { key: Tab; label: string; icon: typeof Music }[] = [
    { key: "tracks", label: "Top Tracks", icon: Music },
    { key: "artists", label: "Top Artists", icon: Headphones },
    { key: "playlists", label: "Playlists", icon: ListMusic },
  ];

  const progressPct =
    nowPlaying?.isPlaying && nowPlaying.progress && nowPlaying.duration
      ? Math.round((nowPlaying.progress / nowPlaying.duration) * 100)
      : 0;

  const formatMs = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

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
            {process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true"
              ? "Real-time data from my Spotify. Music taste is a better personality test than any interview question."
              : "Spotify integration coming soon — connect after deployment."}
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
                className={`w-4 h-4 text-primary ${nowPlaying?.isPlaying ? "animate-spin" : ""}`}
                style={{ animationDuration: "3s" }}
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
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {nowPlaying.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {nowPlaying.artist}
                    </p>
                    <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                      {nowPlaying.album}
                    </p>
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
                <Disc3 className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Nothing playing right now</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">
                  Spotify integration pending setup
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
            </div>

            <div className="p-5">
              {activeTab === "tracks" && (
                <div className="space-y-1">
                  {dummyTopTracks.map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <span className="font-mono text-xs text-muted-foreground/50 w-5 text-right">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "artists" && (
                <div className="space-y-1">
                  {dummyTopArtists.map((artist, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <span className="font-mono text-xs text-muted-foreground/50 w-5 text-right">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {artist.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {artist.genres}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "playlists" && (
                <div className="space-y-2">
                  {dummyPlaylists.map((playlist, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <ListMusic className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {playlist.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {playlist.description}
                        </p>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground shrink-0">
                        {playlist.tracks} tracks
                      </p>
                    </div>
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
