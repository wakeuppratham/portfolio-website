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
  "  navigation:",
  "    cd <section>    scroll to section",
  "    sections: about, experience, projects,",
  "              skills, playground, machineroom, contact",
  "",
  "  files:",
  "    ls              list files",
  "    cat about.md    about me",
  "    cat skills.json tech stack",
  "    cat contact.txt contact info",
  "    cat resume.pdf  open resume (PDF)",
  "",
  "  links:",
  "    open github     github.com/wakeuppratham",
  "    open linkedin   linkedin.com/in/pratham-goyal",
  "    open echohub    EchoHub project repo",
  "",
  "  other:",
  "    git log         portfolio history",
  "    uname           system info",
  "    whoami / pwd / clear",
];

type LogLine = { text: string; isCommand?: boolean; isError?: boolean };

function TerminalNavigator() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<LogLine[]>([
    { text: 'type "help" to explore this portfolio' },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [visible, setVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    const cmdl = cmd.toLowerCase();
    const newLog: LogLine[] = [...log, { text: `% ${raw}`, isCommand: true }];

    const finish = (lines: LogLine[]) => {
      setLog([...newLog, ...lines]);
      setHistory((prev) => [raw, ...prev].slice(0, 20));
      setHistIdx(-1);
      setInput("");
    };

    if (!cmd) { setLog(newLog); setInput(""); return; }

    // ── Blocked / risky ─────────────────────────────────────────────────────
    if (
      cmdl.startsWith("sudo") ||
      cmdl.startsWith("su ") || cmdl === "su" ||
      cmdl.match(/rm\s+-rf\s+[\/~\*]/) ||
      cmdl.match(/chmod\s+-r\s+777/) ||
      cmdl.match(/mkfs|fdisk|dd if=\/dev\/zero/) ||
      cmdl.match(/:\(\)\s*\{/) ||
      cmdl.match(/nc\s+.*-e/) ||
      cmdl.match(/(wget|curl).*\|.*sh/)
    ) {
      return finish([{ text: `  bash: ${cmd}: Permission denied`, isError: true }]);
    }

    // ── Navigation ───────────────────────────────────────────────────────────
    if (cmdl === "help") {
      return finish(helpText.map((t) => ({ text: t })));
    }
    if (cmdl === "clear") { setLog([]); setHistory((p) => [raw,...p].slice(0,20)); setHistIdx(-1); setInput(""); return; }
    if (cmdl.startsWith("cd ")) {
      const section = cmdl.slice(3).trim();
      if (navMap[section]) {
        setTimeout(() => document.getElementById(navMap[section])?.scrollIntoView({ behavior: "smooth" }), 200);
        return finish([{ text: `  → navigating to #${section}...` }]);
      }
      return finish([
        { text: `  bash: cd: ${section}: No such file or directory`, isError: true },
      ]);
    }
    if (cmdl === "cd" || cmdl === "cd ~" || cmdl === "cd /home/pratham") {
      return finish([{ text: "  /home/pratham/portfolio" }]);
    }

    // ── Files ────────────────────────────────────────────────────────────────
    if (cmdl === "ls" || cmdl === "ls -l" || cmdl === "ls -la" || cmdl === "ls -lah" || cmdl === "ls -a") {
      return finish([
        { text: "  drwxr-xr-x  pratham  staff   about.md" },
        { text: "  drwxr-xr-x  pratham  staff   projects/" },
        { text: "  -rw-r--r--  pratham  staff   resume.pdf" },
        { text: "  -rw-r--r--  pratham  staff   skills.json" },
        { text: "  -rw-r--r--  pratham  staff   contact.txt" },
        { text: "  -rw-r--r--  pratham  staff   .chessrating" },
      ]);
    }
    if (cmdl === "ls /" || cmdl === "ls -la /") {
      return finish([
        { text: "  bin  boot  dev  etc  home  lib  proc  tmp  usr  var" },
      ]);
    }
    if (cmdl === "ls /usr/bin") {
      return finish([
        { text: "  node  npm  java  git  curl  wget  python3  vim  grep  awk" },
      ]);
    }
    if (cmdl === "cat resume.pdf" || cmdl === "open resume" || cmdl === "open resume.pdf") {
      setTimeout(() => window.open("/resume.pdf", "_blank"), 200);
      return finish([{ text: "  opening resume.pdf..." }]);
    }
    if (cmdl === "cat skills.json") {
      return finish([
        { text: '  {' },
        { text: '    "languages":  ["Java", "TypeScript", "SQL"],' },
        { text: '    "frameworks": ["Spring WebFlux", "Kafka", "Redis"],' },
        { text: '    "databases":  ["MongoDB", "PostgreSQL", "MySQL"],' },
        { text: '    "tools":      ["Docker", "Flink", "Git"]' },
        { text: '  }' },
      ]);
    }
    if (cmdl === "cat about.md") {
      return finish([
        { text: "  # Pratham Goyal" },
        { text: "  Backend engineer · Punjab, India" },
        { text: "  Currently: Software Engineer @ Salescode.ai" },
        { text: "  Stack: Java · Spring WebFlux · Kafka · Redis" },
        { text: "  Interests: distributed systems, game theory, chess" },
        { text: "  CGPA: 9.22 · LeetCode: 400+ · Runner-up Rann-Neeti IIT Mandi" },
      ]);
    }
    if (cmdl === "cat contact.txt") {
      return finish([
        { text: "  email:    prathamg2003@gmail.com" },
        { text: "  github:   github.com/wakeuppratham" },
        { text: "  linkedin: linkedin.com/in/pratham-goyal" },
      ]);
    }
    if (cmdl === "cat .chessrating") {
      return finish([{ text: "  [classified]" }]);
    }
    if (cmdl === "cat /dev/null") {
      return finish([]);
    }
    if (cmdl === "cat /etc/os-release" || cmdl === "cat /etc/hostname") {
      return finish([
        { text: "  NAME=Vercel Edge Runtime" },
        { text: "  VERSION=2024" },
        { text: "  ID=vercel" },
        { text: "  HOME_URL=https://vercel.com" },
      ]);
    }
    if (cmdl === "cat /proc/cpuinfo") {
      return finish([
        { text: "  model name : V8 JavaScript Engine (browser)" },
        { text: "  cores      : as many as your tab allows" },
        { text: "  cache size : L1 (warm)" },
      ]);
    }
    if (cmdl === "cat /proc/version") {
      return finish([
        { text: "  Linux version 5.15.0-vercel (Next.js 14 App Router)" },
      ]);
    }
    if (cmdl.startsWith("head ") || cmdl.startsWith("tail ")) {
      const file = cmd.split(" ").pop() ?? "";
      return finish([{ text: `  ${file}: showing lines (fake — no real fs)` }]);
    }
    if (cmdl.startsWith("wc ")) {
      return finish([{ text: "  42  137  1024  (lines  words  bytes)" }]);
    }
    if (cmdl.startsWith("file ")) {
      const f = cmd.split(" ").pop() ?? "";
      return finish([{ text: `  ${f}: ASCII text, UTF-8` }]);
    }
    if (cmdl.startsWith("touch ")) {
      const f = cmd.slice(6).trim();
      return finish([{ text: `  created: ${f}` }]);
    }
    if (cmdl.startsWith("mkdir ")) {
      const d = cmd.slice(6).trim();
      return finish([{ text: `  mkdir: created directory '${d}'` }]);
    }
    if (cmdl.startsWith("rm ")) {
      const parts = cmdl.split(" ");
      if (parts.includes("/") || parts.includes("~")) {
        return finish([{ text: "  rm: cannot remove '/': Permission denied", isError: true }]);
      }
      const f = parts[parts.length - 1];
      return finish([{ text: `  removed '${f}'` }]);
    }
    if (cmdl.startsWith("cp ") || cmdl.startsWith("mv ")) {
      const [, src, dest] = cmd.split(" ");
      return finish([{ text: `  ${src} → ${dest}` }]);
    }
    if (cmdl.startsWith("tar ")) {
      return finish([{ text: "  tar: archive operation complete" }]);
    }
    if (cmdl.startsWith("zip ") || cmdl.startsWith("unzip ")) {
      return finish([{ text: "  inflating: done" }]);
    }
    if (cmdl.startsWith("grep ")) {
      const parts = cmd.split(" ");
      const pattern = parts[1] ?? "";
      return finish([
        { text: `  searching for '${pattern}'...` },
        { text: "  about.md:  Pratham Goyal" },
        { text: "  skills.json: Java, TypeScript" },
      ]);
    }
    if (cmdl.startsWith("find ")) {
      return finish([
        { text: "  ./about.md" },
        { text: "  ./projects/echohub" },
        { text: "  ./resume.pdf" },
        { text: "  ./skills.json" },
        { text: "  ./contact.txt" },
      ]);
    }
    if (cmdl.startsWith("sort ") || cmdl.startsWith("uniq ") || cmdl.startsWith("cut ") || cmdl.startsWith("tr ")) {
      return finish([{ text: "  (processed)" }]);
    }
    if (cmdl.startsWith("diff ")) {
      return finish([{ text: "  Files are identical." }]);
    }
    if (cmdl.startsWith("base64 ")) {
      const input64 = cmd.slice(7);
      return finish([{ text: `  ${btoa(input64)}` }]);
    }
    if (cmdl.startsWith("md5 ") || cmdl.startsWith("md5sum ") || cmdl.startsWith("sha256sum ")) {
      return finish([{ text: "  d41d8cd98f00b204e9800998ecf8427e  (fake hash)" }]);
    }

    // ── Open links ───────────────────────────────────────────────────────────
    if (cmdl === "open github") {
      setTimeout(() => window.open("https://github.com/wakeuppratham", "_blank"), 200);
      return finish([{ text: "  opening github.com/wakeuppratham..." }]);
    }
    if (cmdl === "open linkedin") {
      setTimeout(() => window.open("https://linkedin.com/in/pratham-goyal", "_blank"), 200);
      return finish([{ text: "  opening linkedin.com/in/pratham-goyal..." }]);
    }
    if (cmdl === "open echohub") {
      setTimeout(() => window.open("https://github.com/wakeuppratham/EchoHub", "_blank"), 200);
      return finish([{ text: "  opening EchoHub repo..." }]);
    }

    // ── System info ──────────────────────────────────────────────────────────
    if (cmdl === "whoami") return finish([{ text: "  pratham" }]);
    if (cmdl === "id") return finish([{ text: "  uid=1000(pratham) gid=1000(pratham) groups=1000(pratham),4(adm),27(sudo)" }]);
    if (cmdl === "groups") return finish([{ text: "  pratham adm sudo docker" }]);
    if (cmdl === "pwd") return finish([{ text: "  /home/pratham/portfolio" }]);
    if (cmdl === "date") return finish([{ text: `  ${new Date().toString()}` }]);
    if (cmdl === "hostname") return finish([{ text: "  prathamgoyal.vercel.app" }]);
    if (cmdl === "uname" || cmdl === "uname -a") {
      return finish([
        { text: "  pratham-portfolio Next.js 14 App Router TypeScript strict" },
        { text: "  Tailwind v4 · Framer Motion · TanStack Query · Vercel" },
      ]);
    }
    if (cmdl === "uptime") {
      return finish([{ text: "  up indefinitely — deployed on Vercel, never sleeps" }]);
    }
    if (cmdl === "env" || cmdl === "printenv") {
      return finish([
        { text: "  NODE_ENV=production" },
        { text: "  NEXT_RUNTIME=nodejs" },
        { text: "  VERCEL=1" },
        { text: "  REGION=bom1" },
        { text: "  SHELL=/bin/zsh" },
        { text: "  USER=pratham" },
        { text: "  HOME=/home/pratham" },
      ]);
    }
    if (cmdl.startsWith("export ")) {
      const pair = cmd.slice(7);
      return finish([{ text: `  exported: ${pair}` }]);
    }
    if (cmdl === "ps" || cmdl === "ps aux" || cmdl === "ps -ef") {
      return finish([
        { text: "  PID   USER      COMMAND" },
        { text: "  1     pratham   next-server --port 3000" },
        { text: "  42    pratham   react-reconciler" },
        { text: "  99    pratham   framer-motion (animating)" },
        { text: "  137   pratham   tanstack-query (polling)" },
        { text: "  404   pratham   sleep (not found)" },
      ]);
    }
    if (cmdl === "top" || cmdl === "htop") {
      return finish([
        { text: "  Tasks: 4 total, 1 running, 3 sleeping" },
        { text: "  %CPU: 0.0   %MEM: low   LOAD: 0.00 0.00 0.00" },
        { text: "  PID   COMMAND          %CPU   %MEM" },
        { text: "  1     next-server       0.1    12.4" },
        { text: "  42    react-renderer    0.0     8.1" },
        { text: "  99    framer-motion     0.0     2.3" },
      ]);
    }
    if (cmdl === "free" || cmdl === "free -h") {
      return finish([
        { text: "               total    used    free    shared" },
        { text: "  Mem:          16Gi    2.1Gi   13Gi    128Mi" },
        { text: "  Swap:          0Bi      0Bi    0Bi" },
      ]);
    }
    if (cmdl === "df" || cmdl === "df -h") {
      return finish([
        { text: "  Filesystem      Size  Used  Avail  Use%  Mounted on" },
        { text: "  vercel-fs        ∞     low    ∞      0%   /" },
        { text: "  tmpfs           16G    0G    16G     0%   /dev/shm" },
      ]);
    }
    if (cmdl === "du" || cmdl === "du -h" || cmdl === "du -sh") {
      return finish([
        { text: "  4.0K   ./about.md" },
        { text: "  8.0K   ./skills.json" },
        { text: "  124K   ./resume.pdf" },
        { text: "  136K   ." },
      ]);
    }
    if (cmdl === "w" || cmdl === "who") {
      return finish([
        { text: "  USER     TTY   FROM              LOGIN@   IDLE" },
        { text: "  pratham  pts/0 portfolio-visitor just now   0s" },
        { text: "  you      pts/1 browser           now       0s" },
      ]);
    }
    if (cmdl === "last") {
      return finish([
        { text: "  pratham  pts/0   Thu Apr  3 10:00  still logged in" },
        { text: "  pratham  pts/0   Wed Apr  2 22:14 - 23:50  (01:36)" },
        { text: "  reboot   system  Wed Apr  2 00:00" },
      ]);
    }
    if (cmdl === "ifconfig" || cmdl === "ip addr" || cmdl === "ip a") {
      return finish([
        { text: "  lo:   inet 127.0.0.1/8" },
        { text: "  eth0: inet [redacted]/24  scope global" },
      ]);
    }
    if (cmdl === "netstat" || cmdl === "netstat -an" || cmdl === "ss -an") {
      return finish([
        { text: "  Proto  Local Address          Foreign Address        State" },
        { text: "  tcp    0.0.0.0:3000           0.0.0.0:*              LISTEN" },
        { text: "  tcp    127.0.0.1:5432         0.0.0.0:*              LISTEN" },
      ]);
    }
    if (cmdl === "lsof") {
      return finish([
        { text: "  COMMAND   PID     USER   FD   TYPE  NAME" },
        { text: "  node       1    pratham   5u   IPv4  *:3000" },
        { text: "  chrome    99      you    42u  IPv4  portfolio:443" },
      ]);
    }

    // ── History ──────────────────────────────────────────────────────────────
    if (cmdl === "history") {
      const lines = history.length
        ? history.slice().reverse().map((h, i) => ({ text: `  ${String(i + 1).padStart(3)}  ${h}` }))
        : [{ text: "  (no history yet)" }];
      return finish(lines);
    }
    if (cmdl === "!!" && history.length) {
      return runCommand(history[0]);
    }

    // ── Echo / shell builtins ────────────────────────────────────────────────
    if (cmdl.startsWith("echo ")) return finish([{ text: `  ${raw.slice(5)}` }]);
    if (cmdl === "echo") return finish([{ text: "" }]);
    if (cmdl.startsWith("alias")) return finish([{ text: "  ll='ls -la'  gs='git status'  glog='git log --oneline'" }]);
    if (cmdl === "jobs") return finish([{ text: "  (no jobs)" }]);
    if (cmdl.startsWith("sleep ")) return finish([{ text: "  (done)" }]);
    if (cmdl === "true") return finish([]);
    if (cmdl === "false") return finish([{ text: "  1", isError: true }]);

    // ── Editors ──────────────────────────────────────────────────────────────
    if (cmdl === "vim" || cmdl.startsWith("vim ")) {
      return finish([{ text: "  you're in. type :q! to escape (good luck)" }]);
    }
    if (cmdl === "nano" || cmdl.startsWith("nano ")) {
      return finish([{ text: "  GNU nano — ^X to exit" }]);
    }
    if (cmdl === "emacs" || cmdl.startsWith("emacs ")) {
      return finish([{ text: "  GNU Emacs. C-x C-c to quit. Or just close the tab." }]);
    }
    if (cmdl === "code" || cmdl.startsWith("code ")) {
      return finish([{ text: "  opening VS Code... (hypothetically)" }]);
    }

    // ── Git ──────────────────────────────────────────────────────────────────
    if (cmdl === "git log" || cmdl === "git log --oneline") {
      return finish([
        { text: "  a3f9c12  add Spotify now-playing integration" },
        { text: "  8d1e047  add MachineRoom live data panels" },
        { text: "  5c82b91  add Prisoner's Dilemma + Auction Theory" },
        { text: "  2f4a388  add sorting visualizer playground" },
        { text: "  d7b3c10  add contact form with Resend" },
        { text: "  1e9a024  port from Lovable to Next.js 14 + Tailwind" },
        { text: "  0000001  initial commit — pratham.dev" },
      ]);
    }
    if (cmdl === "git status") {
      return finish([
        { text: "  On branch main" },
        { text: "  Your branch is up to date with 'origin/main'." },
        { text: "  nothing to commit, working tree clean" },
      ]);
    }
    if (cmdl === "git branch" || cmdl === "git branch -a") {
      return finish([{ text: "  * main" }, { text: "    remotes/origin/main" }]);
    }
    if (cmdl === "git remote -v") {
      return finish([
        { text: "  origin  https://github.com/wakeuppratham/portfolio-website (fetch)" },
        { text: "  origin  https://github.com/wakeuppratham/portfolio-website (push)" },
      ]);
    }
    if (cmdl.startsWith("git diff")) {
      return finish([{ text: "  (no changes)" }]);
    }
    if (cmdl.startsWith("git ")) {
      const sub = cmdl.slice(4).split(" ")[0];
      return finish([{ text: `  git: '${sub}' — ok (this is a fake shell)` }]);
    }

    // ── Package managers ─────────────────────────────────────────────────────
    if (cmdl.startsWith("npm install") || cmdl.startsWith("npm i ")) {
      return finish([
        { text: "  added 847 packages in 3s" },
        { text: "  found 0 vulnerabilities" },
      ]);
    }
    if (cmdl.startsWith("npm ")) {
      return finish([{ text: "  npm: ok" }]);
    }
    if (cmdl.startsWith("brew install ")) {
      const pkg = cmd.slice(13);
      return finish([
        { text: `  ==> Downloading ${pkg}...` },
        { text: `  ==> Installing ${pkg}` },
        { text: `  🍺  /usr/local/Cellar/${pkg}: done` },
      ]);
    }
    if (cmdl.startsWith("brew ")) {
      return finish([{ text: "  brew: ok" }]);
    }
    if (cmdl.startsWith("apt install") || cmdl.startsWith("apt-get install")) {
      const pkg = cmd.split(" ").pop() ?? "";
      return finish([
        { text: `  Reading package lists... Done` },
        { text: `  Installing ${pkg}...` },
        { text: `  done.` },
      ]);
    }
    if (cmdl.startsWith("pip install") || cmdl.startsWith("pip3 install")) {
      const pkg = cmd.split(" ").pop() ?? "";
      return finish([{ text: `  Successfully installed ${pkg}` }]);
    }

    // ── Runtimes ─────────────────────────────────────────────────────────────
    if (cmdl === "node -v" || cmdl === "node --version") return finish([{ text: "  v20.11.0" }]);
    if (cmdl === "npm -v" || cmdl === "npm --version") return finish([{ text: "  10.3.0" }]);
    if (cmdl === "java --version" || cmdl === "java -version") {
      return finish([
        { text: "  openjdk 21.0.2 2024-01-16" },
        { text: "  OpenJDK Runtime Environment (build 21.0.2+13)" },
      ]);
    }
    if (cmdl === "python3 --version" || cmdl === "python --version") return finish([{ text: "  Python 3.12.2" }]);
    if (cmdl === "python3" || cmdl === "python") {
      return finish([
        { text: "  Python 3.12.2 (main)" },
        { text: "  Type 'exit()' to quit." },
        { text: "  >>> (not a real REPL — nice try)" },
      ]);
    }
    if (cmdl.startsWith("node ")) return finish([{ text: "  (script executed)" }]);

    // ── Docker / k8s ─────────────────────────────────────────────────────────
    if (cmdl === "docker ps" || cmdl === "docker ps -a") {
      return finish([
        { text: "  CONTAINER ID   IMAGE          STATUS         PORTS" },
        { text: "  a1b2c3d4e5f6   portfolio      Up 42 days     0.0.0.0:3000->3000/tcp" },
        { text: "  f6e5d4c3b2a1   postgres:15    Up 42 days     5432/tcp" },
      ]);
    }
    if (cmdl === "docker images") {
      return finish([
        { text: "  REPOSITORY    TAG       SIZE" },
        { text: "  portfolio     latest    142MB" },
        { text: "  postgres      15        379MB" },
        { text: "  redis         7         34MB" },
      ]);
    }
    if (cmdl.startsWith("docker run ")) {
      return finish([{ text: "  container started" }]);
    }
    if (cmdl.startsWith("docker ")) {
      return finish([{ text: "  docker: ok" }]);
    }
    if (cmdl === "kubectl get pods" || cmdl === "kubectl get pods -A") {
      return finish([
        { text: "  NAME                       READY   STATUS    RESTARTS" },
        { text: "  portfolio-7d9f8b-xk2p9     1/1     Running   0" },
        { text: "  kafka-broker-0             1/1     Running   0" },
        { text: "  redis-master-0             1/1     Running   0" },
      ]);
    }
    if (cmdl.startsWith("kubectl ")) {
      return finish([{ text: "  kubectl: ok" }]);
    }

    // ── Network ──────────────────────────────────────────────────────────────
    if (cmdl.startsWith("ping ")) {
      const host = cmd.slice(5).trim();
      return finish([
        { text: `  PING ${host}: 56 bytes of data` },
        { text: `  64 bytes from ${host}: time=11ms` },
        { text: `  64 bytes from ${host}: time=12ms` },
        { text: `  64 bytes from ${host}: time=10ms` },
        { text: `  --- ${host} ping statistics ---` },
        { text: "  3 packets transmitted, 3 received, 0% packet loss" },
      ]);
    }
    if (cmdl.startsWith("curl ")) {
      const url = cmd.slice(5).trim();
      if (url.includes("prathamgoyal") || url.includes("localhost")) {
        return finish([
          { text: "  HTTP/2 200" },
          { text: "  content-type: text/html" },
          { text: "  x-powered-by: Next.js" },
          { text: "  <!DOCTYPE html> ... (you're already here)" },
        ]);
      }
      return finish([
        { text: `  HTTP/2 200` },
        { text: `  (response from ${url})` },
      ]);
    }
    if (cmdl.startsWith("wget ")) {
      const url = cmd.slice(5).split(" ").pop() ?? "";
      return finish([
        { text: `  --2024-04-03-- ${url}` },
        { text: "  Connecting... connected." },
        { text: "  200 OK — saved." },
      ]);
    }
    if (cmdl.startsWith("ssh ")) {
      const host = cmd.slice(4).trim();
      return finish([
        { text: `  ssh: connect to host ${host} port 22:` },
        { text: "  Connection refused.", isError: true },
      ]);
    }
    if (cmdl.startsWith("telnet ")) {
      return finish([{ text: "  telnet: Unable to connect to remote host: Connection refused", isError: true }]);
    }
    if (cmdl.startsWith("nmap ")) {
      return finish([{ text: "  (port scan not available in browser)", isError: true }]);
    }

    // ── Which / versions ─────────────────────────────────────────────────────
    if (cmdl.startsWith("which ")) {
      const bin = cmd.slice(6).trim();
      const known = ["node","npm","java","git","curl","wget","python3","vim","grep","awk","sed","docker","kubectl"];
      if (known.includes(bin)) return finish([{ text: `  /usr/local/bin/${bin}` }]);
      return finish([{ text: `  ${bin} not found`, isError: true }]);
    }
    if (cmdl.startsWith("type ")) {
      const bin = cmd.slice(5).trim();
      return finish([{ text: `  ${bin} is /usr/local/bin/${bin}` }]);
    }

    // ── Man pages ────────────────────────────────────────────────────────────
    if (cmdl === "man pratham" || cmdl === "man goyal") {
      return finish([
        { text: "  PRATHAM(1)              User Commands             PRATHAM(1)" },
        { text: "" },
        { text: "  NAME" },
        { text: "    pratham — backend engineer, systems thinker, chess player" },
        { text: "" },
        { text: "  SYNOPSIS" },
        { text: "    pratham [--build | --chess | --learn | --ship]" },
        { text: "" },
        { text: "  DESCRIPTION" },
        { text: "    Orchestrates order out of chaos using Java, Kafka, Redis." },
        { text: "    Currently employed at Salescode.ai. CGPA 9.22." },
        { text: "" },
        { text: "  SEE ALSO" },
        { text: "    github(1), linkedin(1), leetcode(1)" },
      ]);
    }
    if (cmdl.startsWith("man ")) {
      const page = cmd.slice(4).trim();
      return finish([{ text: `  No manual entry for ${page}` }]);
    }
    if (cmdl.startsWith("tldr ")) {
      const page = cmd.slice(5).trim();
      return finish([{ text: `  tldr: ${page}: just Google it` }]);
    }
    if (cmdl.startsWith("info ")) {
      return finish([{ text: "  (info pages not available)" }]);
    }

    // ── Misc shell ───────────────────────────────────────────────────────────
    if (cmdl === "cal" || cmdl === "calendar") {
      const now = new Date();
      return finish([{ text: `  ${now.toLocaleString("default",{month:"long"})} ${now.getFullYear()}` },
        { text: "  Mo Tu We Th Fr Sa Su" },
        { text: "   1  2  3  4  5  6  7" },
        { text: "   8  9 10 11 12 13 14" },
      ]);
    }
    if (cmdl.startsWith("bc") || cmdl.startsWith("expr ")) {
      const expr = cmdl.startsWith("bc") ? "" : cmd.slice(5);
      try {
        // safe eval for simple math only
        if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) {
          // eslint-disable-next-line no-eval
          return finish([{ text: `  ${eval(expr)}` }]);
        }
      } catch { /* fall through */ }
      return finish([{ text: "  (calculator — type math expressions)" }]);
    }
    if (cmdl === "yes") {
      return finish([{ text: "  y y y y y y y y y ... (^C to stop)" }]);
    }
    if (cmdl === "bash" || cmdl === "sh" || cmdl === "zsh") {
      return finish([{ text: `  you're already in ${cmd}` }]);
    }
    if (cmdl === "source" || cmdl === ".") {
      return finish([{ text: "  (nothing to source)" }]);
    }
    if (cmdl.startsWith("kill ") || cmdl.startsWith("killall ")) {
      return finish([{ text: "  permission denied — you can't kill the vibe", isError: true }]);
    }
    if (cmdl === "reboot" || cmdl === "shutdown now" || cmdl === "poweroff") {
      return finish([{ text: "  reboot: Permission denied", isError: true }]);
    }
    if (cmdl.startsWith("chmod ") || cmdl.startsWith("chown ")) {
      return finish([{ text: "  Permission denied", isError: true }]);
    }
    if (cmdl === "passwd") {
      return finish([{ text: "  passwd: Authentication token manipulation error", isError: true }]);
    }
    if (cmdl.startsWith("crontab")) {
      return finish([{ text: "  no crontab for pratham" }]);
    }

    // ── exit / logout ────────────────────────────────────────────────────────
    if (cmdl === "exit" || cmdl === "logout") {
      setLog([...newLog,
        { text: "" },
        { text: "Saving session..." },
        { text: "...copying shared history..." },
        { text: "...saving history...truncating history files..." },
        { text: "...completed." },
        { text: "" },
        { text: "[Process completed]" },
      ]);
      setHistory((prev) => [raw, ...prev].slice(0, 20));
      setHistIdx(-1);
      setInput("");
      setTimeout(() => setVisible(false), 2200);
      return;
    }

    // ── Fallback ─────────────────────────────────────────────────────────────
    return finish([
      { text: `  bash: ${cmd}: command not found`, isError: true },
    ]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
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

  if (!visible) return null;

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
      <div ref={outputRef} className="p-4 font-mono text-xs leading-relaxed h-44 overflow-y-auto space-y-0.5">
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
            Backend engineer orchestrating order out of chaos — building reactive,
            event-driven systems at scale. Passionate about distributed systems,
            game theory, and the art of making things that actually work.
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
