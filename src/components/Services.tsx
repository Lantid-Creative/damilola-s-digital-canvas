import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Code2, Shield, BarChart3, Rocket, Cloud, Brain, Globe, Users } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "End-to-end web & mobile applications with React, Laravel, Django, Flutter, and React Native.",
    details: "PHP Laravel, React.js, Python, Django, React Native, Flutter — responsive interfaces that adapt across devices.",
  },
  {
    icon: Shield,
    title: "Cybersecurity Consulting",
    description: "Penetration testing, vulnerability assessments, security framework design, and professional training.",
    details: "IBM-certified. Specializing in API security, quantum-safe encryption, network security, and malware analysis.",
  },
  {
    icon: Brain,
    title: "AI & Data Analytics",
    description: "Machine learning integration, predictive modeling, data visualization, and AI-powered business solutions.",
    details: "Python, pandas, scikit-learn, TensorFlow — from network intrusion detection to AI-driven job matching platforms.",
  },
  {
    icon: Rocket,
    title: "Product Management",
    description: "Full product lifecycle management, go-to-market strategy, and agile project execution.",
    details: "Led products across fintech, edtech, and govtech — from concept to market with data-driven decision making.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Azure, AWS, GCP architecture. CI/CD pipelines, infrastructure management, and optimization.",
    details: "GCP Certified Facilitator. Improved deployment efficiency by 40% through CI/CD enhancements.",
  },
  {
    icon: Globe,
    title: "Climate Economics",
    description: "Macroeconomic adaptation strategies, SDG alignment, environmental impact assessment.",
    details: "IMF-certified in Climate Economics. Evaluating climate-related economic impacts for policy design.",
  },
  {
    icon: BarChart3,
    title: "Business Strategy",
    description: "Market analysis, competitive positioning, revenue optimization, and regulatory compliance.",
    details: "Cross-border fintech, go-to-market execution, and strategic partnerships across 4 continents.",
  },
  {
    icon: Users,
    title: "Training & Education",
    description: "Cybersecurity workshops, GCP facilitation, tech community building. 3,000+ professionals trained.",
    details: "Django Girls Coach, Africa Code Week Trainer, GDSC Lead, WiDS Ambassador — impacting thousands globally.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<number | null>(null);

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
          {services.map(({ icon: Icon, title, description, details }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="group glass-card cursor-pointer p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
              <motion.div
                initial={false}
                animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="mt-3 border-t border-border pt-3 font-body text-xs leading-relaxed text-muted-foreground">
                  {details}
                </p>
              </motion.div>
              <div className="mt-3 font-body text-xs text-primary opacity-60">
                {expanded === i ? "Click to collapse" : "Click to learn more →"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
