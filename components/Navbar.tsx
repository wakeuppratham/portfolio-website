"use client";

import { motion } from "framer-motion";
import { Terminal, Monitor } from "lucide-react";
import { useTerminalMode } from "@/hooks/useTerminalMode";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Playground", href: "#playground" },
  { label: "Stats", href: "#metrics" },
];

export default function Navbar() {
  const { isTerminal, toggle } = useTerminalMode();

  return (
    <>
      <div className="terminal-banner">
        You are viewing the unstyled version of this page. The content is the
        same — the CSS is not.
      </div>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-24 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <a href="#" className="text-lg font-semibold tracking-tight">
          <span className="text-gradient font-mono">~/pratham</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
            title={isTerminal ? "Switch to styled view" : "View without CSS"}
          >
            {isTerminal ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Terminal className="w-4 h-4" />
            )}
          </button>
          <a
            href="#contact"
            className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </motion.nav>
    </>
  );
}
