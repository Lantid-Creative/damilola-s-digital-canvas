import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Download, Instagram } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/damilola.png";
import MagneticButton from "./MagneticButton";

const titles = [
  "Technology Expert",
  "Business Strategist",
  "Climate Economist",
  "Cybersecurity Specialist",
  "Product Leader",
];

function useTypingEffect(words: string[], typingSpeed = 80, deletingSpeed = 50, pause = 1800) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text === current) setTimeout(() => setIsDeleting(true), pause);
        } else {
          setText(current.slice(0, text.length - 1));
          if (text === "") {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const typedTitle = useTypingEffect(titles);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-40 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pt-24 md:flex-row md:gap-16 lg:gap-24">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 h-6 font-body text-sm uppercase tracking-[0.3em] text-primary"
          >
            {typedTitle}
            <span className="animate-pulse text-primary">|</span>
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
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <MagneticButton
              as="a"
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Let's Talk
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#experience"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-8 py-3 font-display text-sm font-semibold text-foreground transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              View My Work
            </MagneticButton>

            <div className="flex items-center gap-3">
              {[
                { href: "https://github.com/Damilola-Yinusa", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/damilola-yinusa", icon: Linkedin, label: "LinkedIn" },
                { href: "https://x.com/thedamilyinusa", icon: XIcon, label: "X" },
                { href: "https://instagram.com/thedamilyinusa", icon: Instagram, label: "Instagram" },
                { href: "https://tiktok.com/@thedamilyinusa", icon: TiktokIcon, label: "TikTok" },
                { href: "mailto:hi@thedamiyinusa.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                </MagneticButton>
              ))}
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
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-primary/20"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-dashed border-accent/10"
          />
          <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-primary/30 md:h-80 md:w-80 lg:h-96 lg:w-96 animate-glow-pulse">
            <img src={profileImg} alt="Damilola Yinusa" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-3xl" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
          <span className="font-body text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="h-5 w-5" />
        </a>
      </motion.div>
    </section>
  );
}

function XIcon({ className, ...props }: React.SVGAttributes<SVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TiktokIcon({ className, ...props }: React.SVGAttributes<SVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
