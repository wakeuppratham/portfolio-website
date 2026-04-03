"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

const roles = [
  "Software Engineer",
  "Backend Developer",
  "Systems Thinker",
  "Chess Player",
];

const navMap: Record<string, string> = {
  about: "about",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  playground: "playground",
  machineroom: "machineroom",
  stats: "stats",
  contact: "contact",
};

const helpText = [
  "  available sections:",
  "    about        — who I am",
  "    experience   — where I've worked",
  "    projects     — things I've built",
  "    skills       — my tech stack",
  "    playground   — interactive demos",
  "    machineroom  — live data feeds",
  "    contact      — get in touch",
  "",
  "  usage: cd <section>",
];

type LogLine = { text: string; isCommand?: boolean; isError?: boolean };

function TerminalNavigator() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<LogLine[]>([
    { text: 'type "help" to see available sections' },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const newLog: LogLine[] = [...log, { text: `% ${raw}`, isCommand: true }];

    if (!cmd) {
      setLog(newLog);
      return;
    }

    if (cmd === "help" || cmd === "ls") {
      setLog([...newLog, ...helpText.map((t) => ({ text: t }))]);
    } else if (cmd === "clear") {
      setLog([]);
    } else if (cmd.startsWith("cd ")) {
      const section = cmd.slice(3).trim();
      if (navMap[section]) {
        setLog([...newLog, { text: `  → navigating to #${section}...` }]);
        setTimeout(() => {
          document.getElementById(navMap[section])?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        setLog([
          ...newLog,
          { text: `  bash: cd: ${section}: No such section`, isError: true },
          { text: '  run "help" to list sections' },
        ]);
      }
    } else if (cmd === "whoami") {
      setLog([...newLog, { text: "  pratham" }]);
    } else if (cmd === "pwd") {
      setLog([...newLog, { text: "  /home/pratham" }]);
    } else if (cmd === "date") {
      setLog([...newLog, { text: `  ${new Date().toDateString()}` }]);
    } else {
      setLog([
        ...newLog,
        { text: `  bash: ${cmd}: command not found`, isError: true },
      ]);
    }

    setHistory((prev) => [raw, ...prev].slice(0, 20));
    setHistIdx(-1);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next] ?? "");
    }
  };

  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden glow-border max-w-lg"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--terminal-red))" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--terminal-amber))" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--terminal-green))" }} />
        <span className="ml-2 text-xs text-muted-foreground font-mono">pratham — bash</span>
      </div>

      {/* Output */}
      <div className="p-4 font-mono text-xs leading-relaxed h-44 overflow-y-auto space-y-0.5">
        {log.map((line, i) => (
          <p
            key={i}
            className={
              line.isCommand
                ? "text-foreground"
                : line.isError
                ? ""
                : "text-muted-foreground"
            }
            style={line.isError ? { color: "hsl(0 72% 65%)" } : undefined}
          >
            {line.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <span className="font-mono text-xs" style={{ color: "hsl(var(--terminal-green))" }}>
          pratham@mac
        </span>
        <span className="font-mono text-xs text-muted-foreground">~</span>
        <span className="font-mono text-xs text-foreground">%</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none caret-primary"
          autoFocus
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const typedRole = useTypingEffect(roles, 80, 40, 1800);

  return (
    <section className="relative min-h-screen flex items-center section-padding pt-32 scanline overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/6 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-2">
            <span className="text-foreground">Pratham</span>
            <br />
            <span className="text-gradient">Goyal.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="font-mono text-base md:text-lg text-muted-foreground flex items-center gap-1">
            <span className="text-primary">&gt;</span>
            <span>{typedRole}</span>
            <span className="terminal-cursor text-primary">▊</span>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mt-4 leading-relaxed">
            Backend engineer building reactive, event-driven systems at scale.
            Passionate about distributed systems, game theory, and the art of
            making things that actually work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            View Projects
          </a>
          <a
            href="#playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            Run Simulation
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center gap-3 mb-12"
        >
          <a
            href="https://github.com/wakeuppratham"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/pratham-goyal"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="mailto:prathamg2003@gmail.com"
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Interactive terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <TerminalNavigator />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
