import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Xenith IQ",
    tag: "GovTech",
    description: "Africa's most comprehensive city intelligence ecosystem measuring development across 114 indicators. Nigeria's first subnational development analytics system.",
    url: "https://xenithiq.com",
    stack: ["React", "AI", "Azure"],
  },
  {
    title: "GetAsyst",
    tag: "AI SaaS",
    description: "AI-powered executive assistant with intelligent habit learning and task automation for entrepreneurs and executives.",
    url: "https://getasyst.com",
    stack: ["AI/ML", "Laravel", "Azure"],
  },
  {
    title: "Lantid SmartEdge",
    tag: "EdTech / AI",
    description: "AI analytics and business solutions deployed by Obafemi Awolowo University for entrepreneurship education programs.",
    url: "https://smartedge.lantid.com",
    stack: ["Laravel", "AI", "Azure"],
  },
  {
    title: "Clea Platform",
    tag: "Fintech",
    description: "Cross-border payment solution eliminating FX losses and reducing banking delays by 75% for African importers.",
    url: "#",
    stack: ["Fintech", "API", "Compliance"],
  },
  {
    title: "Pushbio",
    tag: "SaaS",
    description: "Comprehensive link-in-bio platform with multi-tenancy, AI analytics, and custom landing pages.",
    url: "https://app.pushbio.io",
    stack: ["Laravel", "Azure", "SEO"],
  },
  {
    title: "Lantid Academy",
    tag: "EdTech",
    description: "AI-powered LMS with personalized analytics, currently deployed by Obafemi Awolowo University's IFEDS Department.",
    url: "https://hub.lantid.com",
    stack: ["Laravel", "AI", "Azure"],
  },
  {
    title: "WIDS Job Platform",
    tag: "AI / Jobs",
    description: "Revolutionary job-matching platform leveraging AI algorithms to connect African women in data science with opportunities.",
    url: "#",
    stack: ["Laravel", "AI", "Azure"],
  },
  {
    title: "API Security Framework",
    tag: "Cybersecurity",
    description: "Comprehensive Python/Flask vulnerability scanner testing for SQL injection, XSS, IDOR, and rate limiting attacks.",
    url: "https://github.com/Damilola-Yinusa",
    stack: ["Python", "Flask", "Security"],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Portfolio</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <a
            href="https://github.com/Damilola-Yinusa"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary md:flex"
          >
            View all on GitHub <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.map(({ title, tag, description, url, stack }, i) => (
            <motion.a
              key={title}
              href={url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group glass-card relative overflow-hidden p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                {tag}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span key={s} className="rounded bg-muted px-2 py-0.5 font-body text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
