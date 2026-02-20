import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Xenith IQ",
    tag: "GovTech",
    description: "Africa's most comprehensive city intelligence ecosystem measuring development across 114 indicators.",
    url: "https://xenithiq.com",
  },
  {
    title: "GetAsyst",
    tag: "AI SaaS",
    description: "AI-powered executive assistant with intelligent habit learning and task automation.",
    url: "https://getasyst.com",
  },
  {
    title: "Lantid SmartEdge",
    tag: "EdTech / AI",
    description: "AI analytics and business solutions deployed by Obafemi Awolowo University.",
    url: "https://smartedge.lantid.com",
  },
  {
    title: "Clea Platform",
    tag: "Fintech",
    description: "Cross-border payment solution eliminating FX losses and reducing banking delays by 75%.",
    url: "#",
  },
  {
    title: "Pushbio",
    tag: "SaaS",
    description: "Comprehensive link-in-bio platform with multi-tenancy, AI analytics, and custom landing pages.",
    url: "https://app.pushbio.io",
  },
  {
    title: "Lantid Academy",
    tag: "EdTech",
    description: "AI-powered learning management system serving educators and businesses at scale.",
    url: "https://hub.lantid.com",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Portfolio</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ title, tag, description, url }, i) => (
            <motion.a
              key={title}
              href={url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="group glass-card relative overflow-hidden p-8 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                {tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
