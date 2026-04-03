"use client";

import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useState } from "react";

const socials = [
  { icon: GithubIcon, label: "GitHub", href: "https://github.com/wakeuppratham", handle: "@wakeuppratham" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com/in/pratham-goyal", handle: "pratham-goyal" },
  { icon: Mail, label: "Email", href: "mailto:prathamg2003@gmail.com", handle: "prathamg2003@gmail.com" },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">09 / Contact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Let&apos;s connect</h2>
          <p className="text-muted-foreground max-w-md">
            Open to discussing new opportunities, interesting systems problems, or a game of chess.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-start gap-3 p-6 rounded-lg border border-border/50 bg-card h-full justify-center">
                <CheckCircle2 className="w-8 h-8" style={{ color: "hsl(var(--terminal-green))" }} />
                <h3 className="text-lg font-semibold text-foreground">Message sent</h3>
                <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="font-mono text-xs text-primary hover:underline mt-2"
                >
                  send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block font-mono text-xs text-primary mb-1.5">{label.toUpperCase()}</label>
                    <input
                      id={id}
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[id as "name" | "email"]}
                      onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-md bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block font-mono text-xs text-primary mb-1.5">MESSAGE</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell me what you're working on..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-md bg-secondary/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "hsl(var(--terminal-red))" }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    Something went wrong — try emailing directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: socials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-3 justify-center"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.label !== "Email" ? "_blank" : undefined}
                rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-5 py-4 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                <social.icon className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-mono text-muted-foreground/70">{social.label}</p>
                  <p className="text-sm font-medium">{social.handle}</p>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Sisyphus — full width, centered below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-border/50 pt-10 flex flex-col items-center gap-4"
        >
          <div className="relative w-72 h-24 sisyphus-anim">
            <svg viewBox="0 0 288 96" className="absolute inset-0 w-full h-full">
              <line x1="8" y1="90" x2="280" y2="14"
                stroke="hsl(220 15% 30%)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <motion.div
              className="absolute flex items-end gap-0.5"
              style={{ left: 8, bottom: 6 }}
              animate={{ x: [0, 240, 240, 0], y: [0, -67, -67, 0] }}
              transition={{ duration: 6, times: [0, 0.72, 0.75, 1], ease: ["linear", "linear", "easeIn"], repeat: Infinity, repeatDelay: 0.8 }}
            >
              <motion.span
                className="text-xl leading-none select-none"
                animate={{ scaleX: [1, 1, -1, -1] }}
                transition={{ duration: 6, times: [0, 0.72, 0.75, 0.99], repeat: Infinity, repeatDelay: 0.8 }}
                style={{ display: "inline-block", transformOrigin: "center" }}
              >🧑‍💻</motion.span>
              <span className="text-xl leading-none select-none">🪨</span>
            </motion.div>
          </div>
          <p className="text-xs font-mono italic text-muted-foreground text-center">
            &ldquo;One must imagine the backend engineer happy.&rdquo; — Camus (paraphrased)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
