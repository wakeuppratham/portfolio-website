"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

type Operator = "map" | "filter" | "debounce" | "take" | "merge";

interface Marble {
  id: number;
  value: number;
  color: string;
  outputValue: number | null; // null = filtered
  source: "A" | "B";
  outputDelay: number; // ms delay before output marble appears
}

const COLORS = [
  "#2dd4bf", // teal
  "#60a5fa", // blue
  "#c084fc", // purple
  "#fbbf24", // amber
  "#4ade80", // green
  "#f87171", // red
];

const TRACK_DURATION = 4500; // ms to cross the track
const EMIT_INTERVAL_A = 1100;
const EMIT_INTERVAL_B = 1600;

const operators: { id: Operator; code: string; desc: string }[] = [
  { id: "map",      code: "map(x => x * 2)",          desc: "Transforms every value" },
  { id: "filter",   code: "filter(x => x % 2 === 0)", desc: "Only even numbers pass" },
  { id: "debounce", code: "debounceTime(800ms)",       desc: "Emits only after 800ms silence" },
  { id: "take",     code: "take(5)",                   desc: "First 5 values then completes" },
  { id: "merge",    code: "merge(streamA, streamB)",   desc: "Two streams interleaved" },
];

function MarbleTrack({
  marbles,
  streamKey,
  delay = 0,
  label,
}: {
  marbles: Marble[];
  streamKey: "source" | "output";
  delay?: number;
  label: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground mb-2 tracking-wider">{label}</p>
      <div className="relative h-11 rounded-md bg-secondary/20 border border-border/30 overflow-hidden">
        {/* Timeline line */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-px h-px bg-border/50" />
        {/* Completion marker (for take) */}
        <AnimatePresence>
          {marbles.map((m) => {
            const val = streamKey === "source" ? m.value : m.outputValue;
            if (streamKey === "output" && val === null) return null;
            return (
              <motion.div
                key={`${streamKey}-${m.id}`}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: "-36px" }}
                initial={{ x: 0 }}
                animate={{ x: "calc(100vw)" }}
                transition={{
                  duration: TRACK_DURATION / 1000,
                  ease: "linear",
                  delay: delay / 1000,
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg"
                  style={{
                    background: m.color,
                    color: "#0d1117",
                    boxShadow: `0 0 8px ${m.color}66`,
                    opacity: m.source === "B" && streamKey === "source" ? 0.7 : 1,
                  }}
                >
                  {val}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ReactiveStreams() {
  const [operator, setOperator] = useState<Operator>("map");
  const [running, setRunning] = useState(false);
  const [marbles, setMarbles] = useState<Marble[]>([]);
  const [sourceLog, setSourceLog] = useState<{ id: number; value: number; color: string; source: "A" | "B" }[]>([]);
  const [outputLog, setOutputLog] = useState<{ id: number; value: number | null; color: string }[]>([]);
  const [completed, setCompleted] = useState(false);

  const counterRef = useRef(0);
  const takeCountRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDebounceIdRef = useRef<number>(-1);
  const intervalARef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalBRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const operatorRef = useRef(operator);
  operatorRef.current = operator;

  const cleanUp = useCallback(() => {
    if (intervalARef.current) clearInterval(intervalARef.current);
    if (intervalBRef.current) clearInterval(intervalBRef.current);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  }, []);

  const reset = useCallback(() => {
    cleanUp();
    setRunning(false);
    setMarbles([]);
    setSourceLog([]);
    setOutputLog([]);
    setCompleted(false);
    counterRef.current = 0;
    takeCountRef.current = 0;
    lastDebounceIdRef.current = -1;
  }, [cleanUp]);

  useEffect(() => { reset(); }, [operator, reset]);
  useEffect(() => () => cleanUp(), [cleanUp]);

  // Purge old marbles after they've crossed the track
  useEffect(() => {
    if (marbles.length === 0) return;
    const timer = setTimeout(() => {
      setMarbles((prev) => prev.filter((m) => Date.now() - (m as any).createdAt < TRACK_DURATION + 500));
    }, TRACK_DURATION + 600);
    return () => clearTimeout(timer);
  }, [marbles]);

  const emit = useCallback((source: "A" | "B" = "A") => {
    const op = operatorRef.current;
    const value = Math.floor(Math.random() * 9) + 1;
    const id = counterRef.current++;
    const color = COLORS[id % COLORS.length];

    // Compute output
    let outputValue: number | null = null;
    let outputDelay = 0;

    if (op === "map") {
      outputValue = value * 2;
    } else if (op === "filter") {
      outputValue = value % 2 === 0 ? value : null;
    } else if (op === "take") {
      if (takeCountRef.current < 5) {
        outputValue = value;
        takeCountRef.current++;
        if (takeCountRef.current >= 5) {
          setTimeout(() => setCompleted(true), 300);
        }
      } else {
        outputValue = null;
      }
    } else if (op === "merge") {
      outputValue = value;
    } else if (op === "debounce") {
      outputValue = null; // will be revealed after delay
      outputDelay = 800;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      lastDebounceIdRef.current = id;
      debounceTimerRef.current = setTimeout(() => {
        if (lastDebounceIdRef.current === id) {
          setMarbles((prev) =>
            prev.map((m) => (m.id === id ? { ...m, outputValue: value } : m))
          );
          setOutputLog((prev) => [{ id, value, color }, ...prev].slice(0, 30));
        }
      }, outputDelay);
    }

    const marble: Marble & { createdAt: number } = {
      id, value, color, outputValue, source, outputDelay,
      createdAt: Date.now(),
    };

    setMarbles((prev) => [...prev.slice(-20), marble as any]);
    setSourceLog((prev) => [{ id, value, color, source }, ...prev].slice(0, 30));

    if (op !== "debounce" && outputValue !== null) {
      setOutputLog((prev) => [{ id, value: outputValue, color }, ...prev].slice(0, 30));
    }
    if (op !== "debounce" && outputValue === null) {
      setOutputLog((prev) => [{ id, value: null, color }, ...prev].slice(0, 30));
    }
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    emit("A");
    intervalARef.current = setInterval(() => emit("A"), EMIT_INTERVAL_A);
    if (operator === "merge") {
      setTimeout(() => {
        emit("B");
        intervalBRef.current = setInterval(() => emit("B"), EMIT_INTERVAL_B);
      }, 550);
    }
  }, [emit, operator]);

  const stop = useCallback(() => {
    setRunning(false);
    cleanUp();
  }, [cleanUp]);

  const op = operators.find((o) => o.id === operator)!;
  const isMerge = operator === "merge";

  return (
    <div className="space-y-5">
      {/* Operator selector */}
      <div className="flex flex-wrap gap-2">
        {operators.map((o) => (
          <button
            key={o.id}
            onClick={() => setOperator(o.id)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              operator === o.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border/50 text-muted-foreground hover:border-primary/30"
            }`}
          >
            .{o.code.split("(")[0]}()
          </button>
        ))}
      </div>

      {/* Marble diagram */}
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        {/* Source A */}
        <div className="p-4 border-b border-border/20">
          <MarbleTrack
            marbles={marbles.filter((m) => m.source === "A")}
            streamKey="source"
            label={isMerge ? "STREAM A" : "SOURCE STREAM"}
          />
        </div>

        {/* Source B (merge only) */}
        {isMerge && (
          <div className="p-4 border-b border-border/20">
            <MarbleTrack
              marbles={marbles.filter((m) => m.source === "B")}
              streamKey="source"
              label="STREAM B"
            />
          </div>
        )}

        {/* Operator */}
        <div className="px-4 py-3 bg-primary/5 border-b border-border/20 flex items-center justify-between">
          <div>
            <code className="font-mono text-xs text-primary">.{op.code}</code>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{op.desc}</p>
          </div>
          <div
            className="w-8 h-8 rounded border border-primary/40 flex items-center justify-center text-primary font-mono text-sm"
            style={{ boxShadow: running ? "0 0 8px hsl(175 70% 50% / 0.3)" : "none" }}
          >
            λ
          </div>
        </div>

        {/* Output */}
        <div className="p-4">
          <MarbleTrack
            marbles={marbles}
            streamKey="output"
            delay={operator === "debounce" ? 800 : 0}
            label={completed ? "OUTPUT STREAM  ✓ COMPLETED" : "OUTPUT STREAM"}
          />
        </div>
      </div>

      {/* Event logs */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "SOURCE EVENTS", log: sourceLog, isSource: true },
          { title: "OUTPUT EVENTS", log: outputLog, isSource: false },
        ].map(({ title, log, isSource }) => (
          <div key={title} className="rounded-lg border border-border/50 bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border/40">
              <p className="font-mono text-[10px] text-muted-foreground">{title}</p>
            </div>
            <div className="p-3 h-36 overflow-y-auto space-y-1">
              {log.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground/30 text-center pt-6">
                  awaiting...
                </p>
              ) : (
                log.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 font-mono text-[10px]"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: e.value !== null ? e.color : "transparent", border: e.value === null ? "1px solid hsl(220 15% 30%)" : "none" }}
                    />
                    {isSource ? (
                      <span className="text-muted-foreground">
                        {(e as any).source === "B" ? (
                          <span className="text-muted-foreground/50">[B] </span>
                        ) : null}
                        next({e.value})
                      </span>
                    ) : e.value !== null ? (
                      <span className="text-muted-foreground">next({e.value})</span>
                    ) : (
                      <span className="text-muted-foreground/30 line-through text-[9px]">filtered</span>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        <button
          onClick={running ? stop : start}
          disabled={completed && operator === "take"}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono transition-all disabled:opacity-40 ${
            running
              ? "bg-secondary text-foreground hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {running ? "Pause" : "Start Stream"}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-muted-foreground text-xs font-mono hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {operator === "take" && (
          <span className="font-mono text-xs text-muted-foreground">
            {takeCountRef.current}/5 taken
          </span>
        )}
      </div>
    </div>
  );
}
