"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Languages",
    skills: ["Java", "JavaScript", "TypeScript", "SQL"],
  },
  {
    title: "Frameworks",
    skills: ["Spring Boot", "Spring WebFlux", "Express.js", "React.js"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    title: "Streaming & Messaging",
    skills: ["Apache Kafka", "Apache Flink", "Event-Driven"],
  },
  {
    title: "Tools & Infra",
    skills: ["Docker", "Git", "GitHub", "IntelliJ IDEA", "Postman"],
  },
  {
    title: "CS Fundamentals",
    skills: ["DSA", "System Design", "Microservices", "REST APIs", "gRPC"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">
            04 / Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Tech I work with
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="p-5 rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors duration-300"
            >
              <h3 className="font-mono text-xs text-primary mb-3 uppercase tracking-wider">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
