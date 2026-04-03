"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink } from "lucide-react";

const techs = [
  "Spring WebFlux",
  "Project Reactor",
  "Apache Kafka",
  "Apache Flink",
  "Redis",
  "Java",
  "PostgreSQL",
];

const bullets = [
  "Built a Promotions microservice using Spring WebFlux, enabling fully non-blocking request handling and improving system throughput under heavy load.",
  "Applied reactive programming patterns with Project Reactor to orchestrate asynchronous workflows, ensuring efficient resource utilisation and smoother backpressure handling.",
  "Implemented Redis caching for promotional configurations and optimal database indexing, reducing average API response time by 75%.",
  "Implemented Apache Kafka integration for reliable event streaming between microservices, ensuring real-time propagation and consistent downstream processing.",
  "Used Apache Flink for stateful stream processing and fast Java-based data transformations, delivering high-speed execution and strong throughput across continuous data streams.",
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            02 / Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
            Where I&apos;ve worked
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden glow-border"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Software Engineer
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href="https://salescode.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
                    >
                      Salescode.ai
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">
                      Gurugram, India
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "hsl(var(--terminal-green))" }}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  July 2024 – Present
                </span>
              </div>
            </div>

            {/* Bullet points */}
            <ul className="space-y-3 mb-6">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs mt-1 shrink-0 font-mono"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    ▸
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b}
                  </p>
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-primary/10 text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/50 bg-background/30 px-6 md:px-8 py-3">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">$</span> grep -r
              &quot;throughput&quot; impact.log | tail -1 →{" "}
              <span style={{ color: "hsl(var(--terminal-green))" }}>
                API latency reduced by 75% · Kafka streams operational · Flink
                jobs running 24/7
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
