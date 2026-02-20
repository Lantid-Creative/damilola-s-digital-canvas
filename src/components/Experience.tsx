import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, MapPin } from "lucide-react";

const experiences = [
  {
    role: "Lead Developer",
    company: "Lantid Creative",
    location: "England, UK",
    period: "Jun 2022 – Jan 2025",
    highlights: [
      "Led development for 8+ diverse business verticals including AI, EdTech, Healthcare SaaS, and Social Media tools",
      "Obafemi Awolowo University deployed Lantid Academy & SmartEdge for entrepreneurship programs",
      "Built comprehensive tech ecosystem spanning healthcare, hospitality, education, and AI-powered solutions",
    ],
  },
  {
    role: "Fintech Product Manager",
    company: "Autoclear Inc",
    location: "USA",
    period: "Jan 2024 – Jan 2025",
    highlights: [
      "Led development of Clea platform for seamless international payments",
      "Eliminated FX losses for African importers, reducing banking delays by 75%",
      "Managed end-to-end product lifecycle in highly regulated fintech environment",
    ],
  },
  {
    role: "Chief Marketing Officer",
    company: "Africode INC",
    location: "USA",
    period: "Sep 2023 – Jan 2025",
    highlights: [
      "Empowered African tech talent through data-driven campaigns and AfricodeX Meet-ups",
      "Expanded reach through strategic partnerships and mentorship programs",
    ],
  },
  {
    role: "CTO",
    company: "Harrena.com",
    location: "Remote",
    period: "2023 – Jan 2025",
    highlights: [
      "Created comprehensive digital platform with focus on scalability and UX",
      "Architected full-stack solutions with advanced performance optimization",
    ],
  },
  {
    role: "Senior Developer",
    company: "Pushbio",
    location: "Delaware, USA",
    period: "Jun 2021 – Jan 2025",
    highlights: [
      "Developed software solutions for Pushbio.io, enhancing its competitive advantage",
      "Implemented SEO best practices boosting visibility and search rankings",
      "Integrated third-party APIs to expand functionality and user experience",
    ],
  },
  {
    role: "Cybersecurity Educator & Trainer",
    company: "Global",
    location: "Multi-continent",
    period: "2018 – 2025",
    highlights: [
      "Trained 3,000+ professionals across multiple continents in cybersecurity",
      "IBM Cybersecurity Analyst training & Google Cloud Platform security workshops",
      "Established sustainable cybersecurity learning communities worldwide",
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Career</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Professional <span className="text-gradient">Experience</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2" />

          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.6 }}
                className={`relative mb-12 flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.15 * i + 0.2, type: "spring" }}
                  className="absolute left-6 top-2 z-10 -ml-[7px] h-4 w-4 rounded-full border-2 border-primary bg-background md:left-1/2"
                />

                {/* Card */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <div className="glass-card group p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                      {exp.period}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-foreground">{exp.role}</h3>
                    <div className={`mt-1 flex items-center gap-2 font-body text-sm text-muted-foreground ${isLeft ? "md:justify-end" : ""}`}>
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{exp.company}</span>
                      <span className="text-border">•</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{exp.location}</span>
                    </div>
                    <ul className={`mt-4 space-y-2 ${isLeft ? "md:text-right" : ""}`}>
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="font-body text-sm leading-relaxed text-muted-foreground">
                          {h}
                        </li>
                      ))}
                    </ul>
                    {/* Hover glow bar */}
                    <div className={`mt-4 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full ${isLeft ? "md:ml-auto" : ""}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
