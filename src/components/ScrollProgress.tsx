import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(270 80% 65%), hsl(275 90% 70%), hsl(300 70% 60%))",
      }}
    />
  );
}
