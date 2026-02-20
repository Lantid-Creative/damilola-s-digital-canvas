import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Globe, Shield, Code2 } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: 3000, suffix: "+", label: "Professionals Trained" },
  { value: 8, suffix: "+", label: "Business Verticals" },
  { value: 4, suffix: "", label: "Continents" },
  { value: 5, suffix: "+", label: "Years Leading" },
];

const highlights = [
  { icon: Code2, label: "Full-Stack Development" },
  { icon: Shield, label: "Cybersecurity" },
  { icon: Globe, label: "Climate Economics" },
  { icon: GraduationCap, label: "Education & Training" },
];

function AnimatedStat({ value, suffix, label, inView, delay }: { value: number; suffix: string; label: string; inView: boolean; delay: number }) {
  const count = useCountUp(value, 2000, 0, inView);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay }}
      className="glass-card flex flex-col items-center justify-center p-8 text-center"
    >
      <span className="font-display text-3xl font-bold text-gradient">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="mt-2 font-body text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">About Me</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Building the <span className="text-gradient">future</span>, one project at a time.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="font-body text-lg leading-relaxed text-muted-foreground">
              A dynamic and multidisciplinary professional with expertise spanning project management,
              climate change economics, cybersecurity, data science, and technology innovation. Based in Abuja, Nigeria
              with global operations across Africa, Turkey, the UK, and the USA.
            </p>
            <p className="mt-4 font-body text-lg leading-relaxed text-muted-foreground">
              Skilled in leading complex projects that integrate economic modelling, climate-resilience
              strategies, digital security frameworks, and data-driven decision-making. Passionate about
              translating technical findings into practical, impactful solutions.
            </p>
            <p className="mt-4 font-body text-lg leading-relaxed text-muted-foreground">
              Proficient in applying analytical tools to evaluate climate-related economic impacts,
              develop adaptation scenarios, and generate actionable insights for policy and programme design.
              Fluent in English, Yoruba, and intermediate Turkish.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex items-center gap-3 rounded-xl bg-secondary p-4 transition-colors hover:bg-secondary/80"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-body text-sm font-medium text-foreground">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} {...stat} inView={inView} delay={0.5 + i * 0.1} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
