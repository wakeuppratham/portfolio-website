"use client";

import { motion } from "framer-motion";
import { Trophy, Code2, GraduationCap, Users, BookOpen } from "lucide-react";

const stats = [
  {
    icon: Code2,
    value: "400+",
    label: "LeetCode Problems",
    sub: "DSA grind never stops",
    color: "hsl(var(--primary))",
  },
  {
    icon: Trophy,
    value: "Runner-up",
    label: "Chess at IIT Mandi",
    sub: "Rann-Neeti competition",
    color: "hsl(var(--terminal-amber))",
  },
  {
    icon: GraduationCap,
    value: "9.22",
    label: "CGPA",
    sub: "Chitkara University",
    color: "hsl(var(--terminal-green))",
  },
  {
    icon: Users,
    value: "Member",
    label: "University Coding Academy",
    sub: "Peer teaching & mentorship",
    color: "hsl(var(--chart-blue))",
  },
];

const timeline = [
  { year: "2021", event: "Started BE CS at Chitkara University" },
  { year: "2022", event: "Began competitive programming on LeetCode" },
  { year: "2023", event: "Runner-up in chess at IIT Mandi Rann-Neeti" },
  { year: "2024", event: "Joined Salescode.ai as Software Engineer" },
  { year: "2025", event: "Graduating — seeking next challenge" },
];

export default function PersonalStats() {
  return (
    <section id="stats" className="section-padding bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            08 / Profile
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            By the numbers
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            A few things worth knowing outside the resume.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="p-5 rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors"
            >
              <s.icon className="w-5 h-5 mb-3" style={{ color: s.color }} />
              <p className="text-2xl font-bold text-foreground mb-1">{s.value}</p>
              <p className="text-sm font-medium text-foreground mb-0.5">{s.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-lg border border-border/50 bg-card"
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Timeline
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-[42px] top-0 bottom-0 w-px bg-border/50" />
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="font-mono text-xs text-primary w-10 shrink-0 pt-0.5">
                    {item.year}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full border-2 border-primary bg-background shrink-0 mt-1 relative z-10"
                  />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
