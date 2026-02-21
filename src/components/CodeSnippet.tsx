import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const codeLines = [
  { indent: 0, color: "text-primary/60", text: "// damilola.config.ts" },
  { indent: 0, color: "text-primary", text: "export const" },
  { indent: 0, color: "text-foreground", text: " profile = {" },
  { indent: 1, color: "text-accent", text: 'name: "Damilola Yinusa",' },
  { indent: 1, color: "text-accent", text: 'role: "Multidisciplinary Engineer",' },
  { indent: 1, color: "text-muted-foreground", text: "skills: [" },
  { indent: 2, color: "text-primary", text: '"Full-Stack Dev", "Cybersecurity",' },
  { indent: 2, color: "text-primary", text: '"AI/ML", "Cloud Architecture",' },
  { indent: 2, color: "text-primary", text: '"Climate Economics", "IoT",' },
  { indent: 1, color: "text-muted-foreground", text: "]," },
  { indent: 1, color: "text-accent", text: "continents: 4," },
  { indent: 1, color: "text-accent", text: "professionalsTrainied: 3000," },
  { indent: 1, color: "text-muted-foreground", text: "available:" },
  { indent: 2, color: "text-green-400", text: "true," },
  { indent: 0, color: "text-foreground", text: "};" },
];

export default function CodeSnippet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass-card overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-destructive/80" />
        <div className="h-3 w-3 rounded-full bg-accent/80" />
        <div className="h-3 w-3 rounded-full bg-primary/80" />
        <span className="ml-3 font-body text-xs text-muted-foreground">damilola.config.ts</span>
      </div>
      {/* Code */}
      <div className="p-4 font-mono text-xs leading-6 md:text-sm md:leading-7">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            style={{ paddingLeft: `${line.indent * 1.5}rem` }}
            className={line.color}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
