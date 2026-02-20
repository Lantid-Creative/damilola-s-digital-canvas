import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Shield, BarChart3, Rocket, Cloud, Brain, Globe, Users } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "End-to-end web & mobile applications with React, Laravel, Django, Flutter, and React Native.",
  },
  {
    icon: Shield,
    title: "Cybersecurity Consulting",
    description: "Penetration testing, vulnerability assessments, security framework design, and professional training.",
  },
  {
    icon: Brain,
    title: "AI & Data Analytics",
    description: "Machine learning integration, predictive modeling, data visualization, and AI-powered business solutions.",
  },
  {
    icon: Rocket,
    title: "Product Management",
    description: "Full product lifecycle management, go-to-market strategy, and agile project execution.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Azure, AWS, GCP architecture. CI/CD pipelines, infrastructure management, and optimization.",
  },
  {
    icon: Globe,
    title: "Climate Economics",
    description: "Macroeconomic adaptation strategies, SDG alignment, environmental impact assessment.",
  },
  {
    icon: BarChart3,
    title: "Business Strategy",
    description: "Market analysis, competitive positioning, revenue optimization, and regulatory compliance.",
  },
  {
    icon: Users,
    title: "Training & Education",
    description: "Cybersecurity workshops, GCP facilitation, tech community building. 3,000+ professionals trained.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding bg-secondary/30" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">What I Do</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            My <span className="text-gradient">Services</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="group glass-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
