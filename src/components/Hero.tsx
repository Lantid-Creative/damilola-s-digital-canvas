import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/damilola.png";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-40 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pt-24 md:flex-row md:gap-16 lg:gap-24">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary"
          >
            Technology Expert · Business Strategist
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-5xl font-bold leading-tight md:text-6xl lg:text-7xl"
          >
            Damilola{" "}
            <span className="text-gradient">Yinusa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-muted-foreground"
          >
            Multidisciplinary professional driving innovation at the intersection of technology, 
            climate economics, and strategic leadership across 4 continents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center justify-center gap-4 md:justify-start"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Let's Talk
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </a>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Damilola-Yinusa" target="_blank" rel="noreferrer" className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/damilola-yinusa" target="_blank" rel="noreferrer" className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:hi@damilolayinusa.com" className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative flex-shrink-0"
        >
          <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-primary/30 md:h-80 md:w-80 lg:h-96 lg:w-96 animate-glow-pulse">
            <img
              src={profileImg}
              alt="Damilola Yinusa"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-3xl" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
