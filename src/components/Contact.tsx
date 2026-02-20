import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, Loader2, CheckCircle, Linkedin, Github, ArrowRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">Get In Touch</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              Let's work <span className="text-gradient">together</span>
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Have a project in mind, need consulting, or want to collaborate? Whether it's technology, cybersecurity, climate economics, or business strategy — let's make it happen.
            </p>

            <div className="mt-10 space-y-6">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground">Email</p>
                  <a href="mailto:hi@damilolayinusa.com" className="font-display font-medium text-foreground transition-colors hover:text-primary">
                    hi@damilolayinusa.com
                  </a>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground">Location</p>
                  <p className="font-display font-medium text-foreground">Abuja, Nigeria · Global Operations</p>
                </div>
              </motion.div>
            </div>

            {/* Social CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton
                as="a"
                href="https://linkedin.com/in/damilola-yinusa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </MagneticButton>
              <MagneticButton
                as="a"
                href="https://github.com/Damilola-Yinusa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <Github className="h-4 w-4" /> GitHub
              </MagneticButton>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card space-y-6 p-8"
          >
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-foreground">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Tell me about your project..."
              />
            </div>
            <motion.button
              type="submit"
              disabled={status !== "idle"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70"
            >
              {status === "idle" && (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
              {status === "sending" && (
                <>
                  Sending... <Loader2 className="h-4 w-4 animate-spin" />
                </>
              )}
              {status === "sent" && (
                <>
                  Message Sent! <CheckCircle className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
