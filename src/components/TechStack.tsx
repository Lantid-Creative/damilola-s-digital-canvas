import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "PHP", "C", "Verilog HDL"],
  },
  {
    label: "Frontend",
    items: ["React", "React Native", "Flutter", "HTML/CSS", "jQuery", "Figma"],
  },
  {
    label: "Backend",
    items: ["Django", "Laravel", "Node.js", "RESTful APIs", "GraphQL"],
  },
  {
    label: "Cloud & DevOps",
    items: ["Azure", "AWS", "GCP", "CI/CD", "Docker"],
  },
  {
    label: "Data & AI",
    items: ["pandas", "NumPy", "scikit-learn", "Tableau", "Power BI", "TensorFlow"],
  },
  {
    label: "Security",
    items: ["Pen Testing", "SIEM", "Network Security", "Encryption", "Vulnerability Assessment"],
  },
];

export default function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-secondary/30" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Arsenal</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Tech <span className="text-gradient">Stack</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ label, items }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">{label}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item, j) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2 + i * 0.08 + j * 0.04 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="cursor-default rounded-full border border-border bg-background px-3 py-1.5 font-body text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
