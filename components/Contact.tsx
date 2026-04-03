"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const socials = [
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/wakeuppratham",
    handle: "@wakeuppratham",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://linkedin.com/in/pratham-goyal",
    handle: "pratham-goyal",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:prathamg2003@gmail.com",
    handle: "prathamg2003@gmail.com",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            09 / Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let&apos;s connect
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Open to discussing new opportunities, interesting systems problems,
            or a game of chess.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.label !== "Email" ? "_blank" : undefined}
              rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
              aria-label={social.label}
              className="flex items-center gap-3 px-5 py-3 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 w-full sm:w-auto"
            >
              <social.icon className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs font-mono text-muted-foreground/70">{social.label}</p>
                <p className="text-sm font-medium">{social.handle}</p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Sisyphus footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-border/50"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Sisyphus — rolling boulder up a hill `/`, falls back, repeat */}
            <div className="relative w-72 h-24">
              {/* Hill SVG: line from bottom-left to top-right */}
              <svg
                viewBox="0 0 288 96"
                className="absolute inset-0 w-full h-full"
              >
                <line
                  x1="8"  y1="90"
                  x2="280" y2="14"
                  stroke="hsl(220 15% 30%)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Character travels up the slope then snaps back to base */}
              {/* Hill slope: Δy/Δx = (14-90)/(280-8) = -76/272 ≈ -0.2794 */}
              <motion.div
                className="absolute flex items-end gap-0.5"
                style={{ left: 8, bottom: 6 }}
                animate={{
                  x: [0, 240, 240, 0],
                  y: [0, -67, -67, 0],
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.72, 0.75, 1],
                  ease: ["linear", "linear", "easeIn"],
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }}
              >
                <motion.span
                  className="text-xl leading-none select-none"
                  animate={{ scaleX: [1, 1, -1, -1] }}
                  transition={{
                    duration: 6,
                    times: [0, 0.72, 0.75, 0.99],
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                  style={{ display: "inline-block", transformOrigin: "center" }}
                >
                  🧑‍💻
                </motion.span>
                <span className="text-xl leading-none select-none">🪨</span>
              </motion.div>
            </div>

            <p className="text-xs font-mono italic" style={{ color: "hsl(215 15% 55%)" }}>
              &ldquo;One must imagine the backend engineer happy.&rdquo; — Camus (paraphrased)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
