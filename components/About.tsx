"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Music,
  Gamepad2,
  Telescope,
} from "lucide-react";

const details = [
  { icon: MapPin, label: "Based in", value: "India" },
  { icon: Briefcase, label: "Currently", value: "Salescode.ai" },
  { icon: GraduationCap, label: "Degree", value: "BE CS — 9.22 CGPA" },
  { icon: Music, label: "Music", value: "Listening to Music" },
  { icon: Gamepad2, label: "Playing", value: "Chess & Badminton" },
  { icon: Telescope, label: "Exploring", value: "Cosmos & Relativity" },
];

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            01 / About
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
            The narrative
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3 space-y-5"
          >
            <p className="text-muted-foreground leading-relaxed text-base">
              I&apos;ve spent the last few years in the engine room of software
              engineering. Backend appeals to me because it&apos;s honest —
              either the data saves correctly, or it doesn&apos;t. There are no
              CSS tricks to mask a broken query.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              At Salescode.ai, I build reactive microservices using Spring
              WebFlux and Project Reactor, orchestrate event streams with Apache
              Kafka, and squeeze performance using Redis caching and database
              indexing. The 75% latency reduction we achieved was not magic — it
              was measurement, iteration, and patience.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Outside of code, I study game theory to understand human
              incentives, play chess because every match is a finite state
              machine, and find Einstein&apos;s relativity deeply poetic — the
              idea that mass bends spacetime is the most beautiful engineering
              spec ever written.
            </p>
            <div className="pt-2">
              <p className="text-foreground font-medium text-base italic border-l-2 border-primary pl-4">
                &ldquo;Looking for my next challenge where I can build systems
                that are robust, scalable, and brutally efficient.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-3"
          >
            {details.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
