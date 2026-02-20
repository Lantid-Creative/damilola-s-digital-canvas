import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, GraduationCap, Award, Cloud, Users, Star } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    title: "Africa's Under 40 CEOs Awards",
    year: "2024",
    description: "Nominated for excellence in leadership, business growth, and community impact. Kampala, Uganda.",
  },
  {
    icon: GraduationCap,
    title: "Honorary Doctorate (Business Admin)",
    year: "2024",
    description: "Prowess University, Delaware, USA — recognition of exceptional professional achievement.",
  },
  {
    icon: Star,
    title: "First Class Honours",
    year: "Computer Engineering",
    description: "3.66/4.0 GPA from Middle East Technical University with merit scholarship.",
  },
  {
    icon: Cloud,
    title: "GCP Certified Facilitator",
    year: "Google",
    description: "Recognized for training 1,500+ developers across Africa and Turkey.",
  },
  {
    icon: Users,
    title: "WiDS Stanford Ambassador",
    year: "2020–2025",
    description: "Organized Women in Data Science conferences across 5 major Nigerian cities.",
  },
  {
    icon: Award,
    title: "IBM Cybersecurity Analyst",
    year: "Certified",
    description: "8-course comprehensive professional cybersecurity specialization.",
  },
];

export default function Awards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="awards" className="section-padding bg-secondary/30" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Recognition</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Awards & <span className="text-gradient">Honors</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {awards.map(({ icon: Icon, title, year, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="glass-card p-6 transition-all hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                  {year}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
