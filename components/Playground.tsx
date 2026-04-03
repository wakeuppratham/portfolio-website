"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, Code2, Shield, CheckCircle2, XCircle } from "lucide-react";

/* ─── Prisoner's Dilemma ─── */
type Strategy = "always_cooperate" | "always_defect" | "tit_for_tat" | "random" | "grudger";
type Move = "cooperate" | "defect";

const strategies: { id: Strategy; label: string; desc: string }[] = [
  { id: "tit_for_tat", label: "Tit for Tat", desc: "Copy opponent's last move" },
  { id: "always_cooperate", label: "Always Cooperate", desc: "Trust unconditionally" },
  { id: "always_defect", label: "Always Defect", desc: "Pure self-interest" },
  { id: "random", label: "Random", desc: "50/50 chaos" },
  { id: "grudger", label: "Grudger", desc: "Cooperate until betrayed, then defect forever" },
];

function getMove(strategy: Strategy, _history: Move[], opponentHistory: Move[]): Move {
  switch (strategy) {
    case "always_cooperate": return "cooperate";
    case "always_defect": return "defect";
    case "random": return Math.random() > 0.5 ? "cooperate" : "defect";
    case "tit_for_tat":
      return opponentHistory.length === 0 ? "cooperate" : opponentHistory[opponentHistory.length - 1];
    case "grudger":
      return opponentHistory.includes("defect") ? "defect" : "cooperate";
  }
}

function score(a: Move, b: Move): [number, number] {
  if (a === "cooperate" && b === "cooperate") return [3, 3];
  if (a === "cooperate" && b === "defect") return [0, 5];
  if (a === "defect" && b === "cooperate") return [5, 0];
  return [1, 1];
}

type SimResult = {
  userScore: number;
  opponentScore: number;
  rounds: { user: Move; opp: Move; userPts: number; oppPts: number }[];
  latencyMs: number;
  oppStrategy: Strategy;
};

/* ─── Rate Limiter Visualizer (Token Bucket) ─── */
type RLAlgo = "token_bucket" | "sliding_window";

interface RequestEvent {
  id: number;
  ts: number;
  allowed: boolean;
}

function RateLimiterVisualizer() {
  const [algo, setAlgo] = useState<RLAlgo>("token_bucket");
  const [running, setRunning] = useState(false);
  const [tokens, setTokens] = useState(10);
  const [capacity] = useState(10);
  const [rps, setRps] = useState(3); // requests per second to fire
  const [refillRate] = useState(2); // tokens added per second
  const [log, setLog] = useState<RequestEvent[]>([]);
  const [totalAllowed, setTotalAllowed] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reqTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tokensRef = useRef(10);
  const windowRef = useRef<number[]>([]); // timestamps for sliding window
  const idRef = useRef(0);

  const stop = () => {
    setRunning(false);
    if (tickRef.current) clearInterval(tickRef.current);
    if (reqTickRef.current) clearInterval(reqTickRef.current);
  };

  const reset = () => {
    stop();
    setTokens(10);
    tokensRef.current = 10;
    windowRef.current = [];
    setLog([]);
    setTotalAllowed(0);
    setTotalRejected(0);
    idRef.current = 0;
  };

  const start = () => {
    if (running) return;
    setRunning(true);

    if (algo === "token_bucket") {
      // Refill tokens every second
      tickRef.current = setInterval(() => {
        tokensRef.current = Math.min(capacity, tokensRef.current + refillRate);
        setTokens(tokensRef.current);
      }, 1000);
    }

    // Fire requests at rps interval
    reqTickRef.current = setInterval(() => {
      const now = Date.now();
      let allowed = false;

      if (algo === "token_bucket") {
        if (tokensRef.current >= 1) {
          tokensRef.current -= 1;
          setTokens(tokensRef.current);
          allowed = true;
        }
      } else {
        // Sliding window: allow max 8 req per 3 seconds
        const window = 3000;
        const maxReqs = 8;
        windowRef.current = windowRef.current.filter((t) => now - t < window);
        if (windowRef.current.length < maxReqs) {
          windowRef.current.push(now);
          allowed = true;
        }
      }

      const ev: RequestEvent = { id: idRef.current++, ts: now, allowed };
      setLog((prev) => [ev, ...prev].slice(0, 20));
      if (allowed) setTotalAllowed((n) => n + 1);
      else setTotalRejected((n) => n + 1);
    }, Math.floor(1000 / rps));
  };

  useEffect(() => () => { stop(); }, []);

  const algos: { id: RLAlgo; label: string; desc: string }[] = [
    { id: "token_bucket", label: "Token Bucket", desc: "Tokens refill at 2/s, capacity 10" },
    { id: "sliding_window", label: "Sliding Window", desc: "Max 8 req per 3s window" },
  ];

  return (
    <div className="space-y-5">
      {/* Algo picker */}
      <div className="flex flex-wrap gap-2">
        {algos.map((a) => (
          <button
            key={a.id}
            onClick={() => { reset(); setAlgo(a.id); }}
            disabled={running}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all disabled:opacity-50 ${
              algo === a.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border/50 text-muted-foreground hover:border-primary/20"
            }`}
          >
            {a.label}
            <span className="text-muted-foreground ml-1 hidden md:inline">— {a.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Left: Controls + token bucket visual */}
        <div className="space-y-4">
          {/* RPS slider */}
          <div>
            <p className="font-mono text-xs text-primary mb-2">
              REQUEST RATE — {rps} req/s
            </p>
            <input
              type="range" min={1} max={10} value={rps}
              onChange={(e) => { reset(); setRps(Number(e.target.value)); }}
              disabled={running}
              className="w-full accent-primary disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>1 req/s</span><span>10 req/s</span>
            </div>
          </div>

          {/* Token bucket visualization */}
          {algo === "token_bucket" && (
            <div>
              <p className="font-mono text-xs text-primary mb-2">
                BUCKET — {tokens}/{capacity} tokens
              </p>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: capacity }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border transition-all duration-300"
                    style={{
                      background: i < tokens ? "hsl(175 70% 50% / 0.3)" : "transparent",
                      borderColor: i < tokens ? "hsl(175 70% 50%)" : "hsl(220 15% 25%)",
                    }}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">
                Refills +{refillRate} token/s · 1 token consumed per request
              </p>
            </div>
          )}

          {/* Sliding window bar */}
          {algo === "sliding_window" && (
            <div>
              <p className="font-mono text-xs text-primary mb-2">SLIDING WINDOW (3s)</p>
              <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.min(100, (windowRef.current.length / 8) * 100)}%`,
                    background:
                      windowRef.current.length >= 8
                        ? "hsl(0 72% 55%)"
                        : "hsl(175 70% 50%)",
                  }}
                />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">
                {windowRef.current.length}/8 requests in last 3s
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-card border border-border/50 text-center">
              <p className="text-xs font-mono text-muted-foreground mb-1">ALLOWED</p>
              <p className="text-xl font-bold" style={{ color: "hsl(142 70% 55%)" }}>
                {totalAllowed}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border/50 text-center">
              <p className="text-xs font-mono text-muted-foreground mb-1">REJECTED</p>
              <p className="text-xl font-bold" style={{ color: "hsl(0 72% 55%)" }}>
                {totalRejected}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={running ? stop : start}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono transition-opacity ${
                running
                  ? "bg-secondary text-foreground hover:opacity-90"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {running ? "Stop" : "Start Sending"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-muted-foreground text-xs font-mono hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Right: Request log */}
        <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: running ? "hsl(175 70% 50%)" : "hsl(220 15% 30%)" }} />
            <span className="font-mono text-xs text-muted-foreground">
              REQUEST LOG {running ? "— LIVE" : "— IDLE"}
            </span>
          </div>
          <div className="p-3 space-y-1 h-56 overflow-y-auto">
            {log.length === 0 && (
              <p className="font-mono text-xs text-muted-foreground/50 text-center pt-8">
                awaiting_requests...
              </p>
            )}
            {log.map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 py-0.5">
                {ev.allowed
                  ? <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "hsl(142 70% 55%)" }} />
                  : <XCircle className="w-3 h-3 shrink-0" style={{ color: "hsl(0 72% 55%)" }} />
                }
                <span className="font-mono text-[10px] text-muted-foreground">
                  req_#{String(ev.id).padStart(4, "0")}
                </span>
                <span
                  className="font-mono text-[10px] ml-auto"
                  style={{ color: ev.allowed ? "hsl(142 70% 55%)" : "hsl(0 72% 55%)" }}
                >
                  {ev.allowed ? "200 OK" : "429 Too Many"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Playground ─── */
type Tab = "dilemma" | "ratelimiter";

export default function Playground() {
  const [activeTab, setActiveTab] = useState<Tab>("dilemma");
  const [userStrategy, setUserStrategy] = useState<Strategy>("tit_for_tat");
  const [result, setResult] = useState<SimResult | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    setRunning(true);
    setShowJson(false);
    setTimeout(() => {
      const oppPool: Strategy[] = ["always_cooperate", "always_defect", "tit_for_tat", "random", "grudger"];
      const oppStrategy: Strategy = oppPool[Math.floor(Math.random() * oppPool.length)];
      const start = performance.now();
      const userHistory: Move[] = [];
      const oppHistory: Move[] = [];
      const rounds: SimResult["rounds"] = [];
      let userTotal = 0;
      let oppTotal = 0;

      for (let i = 0; i < 100; i++) {
        const uMove = getMove(userStrategy, userHistory, oppHistory);
        const oMove = getMove(oppStrategy, oppHistory, userHistory);
        const [uPts, oPts] = score(uMove, oMove);
        userHistory.push(uMove);
        oppHistory.push(oMove);
        userTotal += uPts;
        oppTotal += oPts;
        rounds.push({ user: uMove, opp: oMove, userPts: uPts, oppPts: oPts });
      }

      setResult({
        userScore: userTotal,
        opponentScore: oppTotal,
        rounds,
        latencyMs: Math.round(performance.now() - start),
        oppStrategy,
      });
      setRunning(false);
    }, 800);
  }, [userStrategy]);

  const cooperatePercentage = result
    ? Math.round((result.rounds.filter((r) => r.user === "cooperate").length / 100) * 100)
    : 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "dilemma", label: "Prisoner's Dilemma" },
    { id: "ratelimiter", label: "Rate Limiter" },
  ];

  return (
    <section id="playground" className="section-padding bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            05 / Playground
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Interactive demos
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Because understanding CS fundamentals is better with visuals and
            simulations you can actually run.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-8 p-1 rounded-lg bg-secondary/30 border border-border/50 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                activeTab === t.id
                  ? "bg-card text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Prisoner's Dilemma */}
        {activeTab === "dilemma" && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-mono text-xs text-primary mb-1">PAYOFF MATRIX</p>
              <p className="text-xs text-muted-foreground mb-4">
                Mutual cooperation = 3pts each · Mutual defection = 1pt each · Betray = 5pts vs 0pts
              </p>
              <p className="font-mono text-xs text-primary mb-3">SELECT YOUR STRATEGY</p>
              <div className="space-y-2 mb-6">
                {strategies.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setUserStrategy(s.id); setResult(null); }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                      userStrategy === s.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-card text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">— {s.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={runSimulation}
                  disabled={running}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {running ? "Running..." : "Run 100 Rounds"}
                </button>
                {result && (
                  <button
                    onClick={() => { setResult(null); setShowJson(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-card border border-border/50 text-center">
                      <p className="text-xs text-muted-foreground font-mono mb-1">YOUR SCORE</p>
                      <p className="text-3xl font-bold text-gradient">{result.userScore}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border/50 text-center">
                      <p className="text-xs text-muted-foreground font-mono mb-1">OPPONENT</p>
                      <p className="text-3xl font-bold text-foreground">{result.opponentScore}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border/50">
                    <p className="text-xs text-muted-foreground font-mono mb-3">ROUND HISTORY (100 rounds)</p>
                    <div className="flex flex-wrap gap-[3px]">
                      {result.rounds.map((r, i) => (
                        <div
                          key={i}
                          className="w-[7px] h-[7px] rounded-[1px]"
                          title={`R${i + 1}: You ${r.user}, Opp ${r.opp}`}
                          style={{
                            background:
                              r.user === "cooperate" && r.opp === "cooperate"
                                ? "hsl(var(--terminal-green))"
                                : r.user === "defect" && r.opp === "defect"
                                ? "hsl(var(--terminal-red))"
                                : r.user === "cooperate"
                                ? "hsl(var(--terminal-amber))"
                                : "hsl(var(--primary))",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground font-mono flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ background: "hsl(var(--terminal-green))" }} /> Both cooperate
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ background: "hsl(var(--terminal-red))" }} /> Both defect
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ background: "hsl(var(--terminal-amber))" }} /> You betrayed
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ background: "hsl(var(--primary))" }} /> You won round
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-mono">
                    vs <span className="text-primary">{strategies.find(s => s.id === result.oppStrategy)?.label}</span> ·{" "}
                    coop {cooperatePercentage}% · {result.latencyMs}ms ·{" "}
                    <span style={{ color: result.userScore > result.opponentScore ? "hsl(142 70% 55%)" : result.userScore === result.opponentScore ? "inherit" : "hsl(0 72% 65%)" }}>
                      {result.userScore > result.opponentScore ? "Victory" : result.userScore === result.opponentScore ? "Draw" : "Defeat"}
                    </span>
                  </p>

                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    {showJson ? "Hide" : "Inspect"} API Response
                  </button>

                  {showJson && (
                    <div className="rounded-lg border border-border bg-background p-4 overflow-auto max-h-48">
                      <pre className="font-mono text-xs text-muted-foreground">
                        {JSON.stringify(
                          {
                            simulation_id: `sim_${Math.random().toString(36).slice(2, 7)}`,
                            user_strategy: userStrategy,
                            opponent: result.oppStrategy,
                            rounds: 100,
                            final_score: { user: result.userScore, opponent: result.opponentScore },
                            cooperation_rate: `${cooperatePercentage}%`,
                            latency_ms: result.latencyMs,
                            verdict:
                              result.userScore > result.opponentScore
                                ? "victory"
                                : result.userScore === result.opponentScore
                                ? "draw"
                                : "defeat",
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 rounded-lg border border-dashed border-border/50 bg-card/50">
                  <div className="text-center">
                    <p className="font-mono text-sm text-muted-foreground mb-2">
                      awaiting_input...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select a strategy and run the simulation
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Rate Limiter Visualizer */}
        {activeTab === "ratelimiter" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RateLimiterVisualizer />
          </motion.div>
        )}
      </div>
    </section>
  );
}
