"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { useState } from "react";

const projects = [
  {
    title: "EchoHub — Real-time Chat App",
    status: "Personal Project",
    description:
      "A real-time messaging platform built on the MERN stack with Socket.IO for bidirectional communication. Supports user authentication, session management, contact management, and structured chat flows.",
    challenge:
      "Ensuring reliable message delivery without duplication during network instability. Implemented acknowledgment-based delivery with client-side deduplication using message IDs.",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.IO"],
    architecture: [
      "Client → React Frontend (SPA)",
      "Frontend → Express REST API (Auth, Contacts)",
      "Frontend → Socket.IO (Real-time messaging)",
      "Socket.IO → Node.js Event Loop",
      "Node.js → MongoDB (Message persistence)",
      "Session → JWT (Stateless auth)",
    ],
    github: "https://github.com/wakeuppratham",
  },
  {
    title: "Multithreaded Socket Server",
    status: "Personal Project",
    description:
      "A concurrent server application written in Java that handles multiple client connections simultaneously using a dedicated-thread-per-client architecture. Demonstrates core socket programming and multithreading concepts.",
    challenge:
      "Managing thread lifecycle and preventing resource leaks under concurrent load. Used ExecutorService with a fixed thread pool and graceful shutdown hooks.",
    tech: ["Java", "Sockets", "Multithreading", "ExecutorService"],
    architecture: [
      "ServerSocket → Accept loop",
      "Accept loop → ThreadPool (ExecutorService)",
      "ThreadPool → ClientHandler thread",
      "ClientHandler → InputStream / OutputStream",
      "InputStream → Message parser",
      "Message parser → Broadcast / Echo",
    ],
    github: "https://github.com/wakeuppratham",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [showArch, setShowArch] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p
              className="font-mono text-xs mt-1"
              style={{ color: "hsl(var(--terminal-amber))" }}
            >
              ● {project.status}
            </p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors self-start"
            aria-label="Source code"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="mb-4 p-3 rounded-md bg-secondary/50 border border-border/30">
          <p className="text-xs font-mono text-primary mb-1">
            // hardest challenge
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {project.challenge}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-2.5 py-1 rounded bg-primary/10 text-primary"
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowArch(!showArch)}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          {showArch ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {showArch ? "Hide" : "View"} System Architecture
        </button>
      </div>

      {showArch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="border-t border-border/50 bg-background/50 p-6"
        >
          <p className="font-mono text-xs text-primary mb-3">
            $ cat architecture.flow
          </p>
          <div className="space-y-1">
            {project.architecture.map((line, i) => (
              <p key={i} className="font-mono text-xs text-muted-foreground">
                <span className="text-primary mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            03 / Projects
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Things I&apos;ve built
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Each project is documented like API docs — because backend
            engineering is about reliability, not aesthetics.
          </p>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
