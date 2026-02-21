import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, ArrowRight, Github, Cpu, Shield, Brain, Globe } from "lucide-react";

const categories = ["All", "Software", "Cybersecurity", "AI / Data", "Hardware"] as const;

const projects = [
  {
    title: "Xenith IQ",
    tag: "GovTech",
    category: "Software",
    description: "Africa's most comprehensive city intelligence ecosystem measuring development across 114 indicators.",
    url: "https://xenithiq.com",
    repo: null,
    stack: ["React", "AI", "Azure"],
    icon: Globe,
  },
  {
    title: "GetAsyst",
    tag: "AI SaaS",
    category: "Software",
    description: "AI-powered executive assistant with intelligent habit learning and task automation for entrepreneurs.",
    url: "https://getasyst.com",
    repo: null,
    stack: ["AI/ML", "Laravel", "Azure"],
    icon: Brain,
  },
  {
    title: "Clea Platform",
    tag: "Fintech",
    category: "Software",
    description: "Cross-border payment solution eliminating FX losses and reducing banking delays by 75% for African importers.",
    url: "https://tryclea.com",
    repo: null,
    stack: ["Fintech", "API", "Compliance"],
    icon: Globe,
  },
  {
    title: "Lantid SmartEdge",
    tag: "EdTech / AI",
    category: "Software",
    description: "AI analytics and business solutions deployed by Obafemi Awolowo University for entrepreneurship education.",
    url: "https://smartedge.lantid.com",
    repo: null,
    stack: ["Laravel", "AI", "Azure"],
    icon: Brain,
  },
  {
    title: "Pushbio",
    tag: "SaaS",
    category: "Software",
    description: "Comprehensive link-in-bio platform with multi-tenancy, AI analytics, and custom landing pages.",
    url: "https://app.pushbio.io",
    repo: null,
    stack: ["Laravel", "Azure", "SEO"],
    icon: Globe,
  },
  {
    title: "Lantid Academy",
    tag: "EdTech",
    category: "Software",
    description: "AI-powered LMS with personalized analytics, deployed by OAU's IFEDS Department.",
    url: "https://hub.lantid.com",
    repo: null,
    stack: ["Laravel", "AI", "Azure"],
    icon: Brain,
  },
  {
    title: "WIDS Job Platform",
    tag: "AI / Jobs",
    category: "AI / Data",
    description: "AI job-matching platform connecting African women in data science with opportunities.",
    url: "#",
    repo: null,
    stack: ["Laravel", "AI", "Azure"],
    icon: Brain,
  },
  {
    title: "API Security Tester",
    tag: "Cybersecurity",
    category: "Cybersecurity",
    description: "Framework to test APIs for SQL Injection, XSS, IDOR, and Rate Limiting vulnerabilities.",
    url: "https://github.com/Damilola-Yinusa/API-Security-Tester",
    repo: "https://github.com/Damilola-Yinusa/API-Security-Tester",
    stack: ["Python", "Flask", "Security"],
    icon: Shield,
  },
  {
    title: "Quantum-Safe Encryption",
    tag: "Cybersecurity",
    category: "Cybersecurity",
    description: "Post-quantum cryptography implementation using AES and lattice-based algorithms against quantum threats.",
    url: "https://github.com/Damilola-Yinusa/Quantum-Safe-Encryption",
    repo: "https://github.com/Damilola-Yinusa/Quantum-Safe-Encryption",
    stack: ["Python", "Cryptography", "PQC"],
    icon: Shield,
  },
  {
    title: "Network Packet Sniffer",
    tag: "Cybersecurity",
    category: "Cybersecurity",
    description: "Network traffic monitoring and analysis tool for understanding and securing network communications.",
    url: "https://github.com/Damilola-Yinusa/Network-Packet-Sniffer",
    repo: "https://github.com/Damilola-Yinusa/Network-Packet-Sniffer",
    stack: ["Python", "Networking", "Security"],
    icon: Shield,
  },
  {
    title: "Log Analysis & Anomaly Detection",
    tag: "AI / Security",
    category: "AI / Data",
    description: "Real-time log analysis system detecting security threats using machine learning. ⭐ 6 stars.",
    url: "https://github.com/Damilola-Yinusa/Log-Analysis-and-Anomaly-Detection",
    repo: "https://github.com/Damilola-Yinusa/Log-Analysis-and-Anomaly-Detection",
    stack: ["Python", "ML", "Security"],
    icon: Brain,
  },
  {
    title: "Network Intrusion Detection",
    tag: "AI / Security",
    category: "AI / Data",
    description: "ML-based network intrusion detection using UNSW-NB15 dataset with scikit-learn. ⭐ 3 stars.",
    url: "https://github.com/Damilola-Yinusa/Anomaly-Detection-in-Network-Security",
    repo: "https://github.com/Damilola-Yinusa/Anomaly-Detection-in-Network-Security",
    stack: ["Python", "ML", "Jupyter"],
    icon: Brain,
  },
  {
    title: "Custom Knowledge ChatGPT",
    tag: "AI",
    category: "AI / Data",
    description: "LangChain-based chatbot with PDF processing, embeddings, and similarity search. ⭐ 2 stars.",
    url: "https://github.com/Damilola-Yinusa/Custom-Knowledge-ChatGPT",
    repo: "https://github.com/Damilola-Yinusa/Custom-Knowledge-ChatGPT",
    stack: ["Python", "LangChain", "AI"],
    icon: Brain,
  },
  {
    title: "Data Masking & Tokenization",
    tag: "Security",
    category: "Cybersecurity",
    description: "Sensitive data masking and tokenization solution using pandas and cryptography libraries.",
    url: "https://github.com/Damilola-Yinusa/data-masking-tokenization",
    repo: "https://github.com/Damilola-Yinusa/data-masking-tokenization",
    stack: ["Python", "Crypto", "Pandas"],
    icon: Shield,
  },
  {
    title: "Solar Panel Angle Optimizer",
    tag: "Hardware",
    category: "Hardware",
    description: "Digital circuit design using sensors to detect and optimize solar panel positioning for maximum efficiency.",
    url: "https://github.com/Damilola-Yinusa/Solar-Panel-Angle-Optimization-Digital-Circuit-Design",
    repo: "https://github.com/Damilola-Yinusa/Solar-Panel-Angle-Optimization-Digital-Circuit-Design",
    stack: ["Coq", "Digital Logic", "IoT"],
    icon: Cpu,
  },
  {
    title: "Synchronous Logic (Verilog)",
    tag: "Hardware",
    category: "Hardware",
    description: "D-Latch, D Flip-Flop, 4-Bit Shift Register, and synchronous parallel load shift register designs.",
    url: "https://github.com/Damilola-Yinusa/Synchronous-Logic-Implementation-using-Verilog-HDL",
    repo: "https://github.com/Damilola-Yinusa/Synchronous-Logic-Implementation-using-Verilog-HDL",
    stack: ["Verilog", "HDL", "FPGA"],
    icon: Cpu,
  },
  {
    title: "Controller FSM",
    tag: "Hardware",
    category: "Hardware",
    description: "Finite State Machine controller with START, ZERO_FLAG, CLK, RST inputs and DONE output signal.",
    url: "https://github.com/Damilola-Yinusa/Controller-FSM",
    repo: "https://github.com/Damilola-Yinusa/Controller-FSM",
    stack: ["Verilog", "FSM", "Digital"],
    icon: Cpu,
  },
  {
    title: "Hierarchical Schematic Entry",
    tag: "Hardware",
    category: "Hardware",
    description: "Multi-module schematic capture with symbol creation and multibit signal routing.",
    url: "https://github.com/Damilola-Yinusa/Hierarchical-Schematic-Entry-with-Multibit-Signals",
    repo: "https://github.com/Damilola-Yinusa/Hierarchical-Schematic-Entry-with-Multibit-Signals",
    stack: ["Schematic", "EDA", "Digital"],
    icon: Cpu,
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = activeCategory === "All" ? projects : projects.filter(p => p.category === activeCategory);
  const displayed = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
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

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAll(false); }}
              className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayed.map(({ title, tag, description, url, repo, stack, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group glass-card relative overflow-hidden p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="flex items-start justify-between">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                  {tag}
                </span>
                <div className="flex gap-1.5">
                  {repo && (
                    <a href={repo} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary" onClick={e => e.stopPropagation()}>
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {url !== "#" && (
                    <a href={url} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary" onClick={e => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary/60" />
                <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
              </div>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span key={s} className="rounded bg-muted px-2 py-0.5 font-body text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        {filtered.length > 8 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-8 py-3 font-display text-sm font-semibold text-foreground transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              Show All Projects <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
