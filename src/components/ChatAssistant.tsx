import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ArrowRight, Mail, Phone } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
  options?: string[];
};

const INTRO: Message = {
  role: "assistant",
  content: "Hey there! 👋 I'm Damilola's virtual assistant. I can help you explore how Damilola can contribute to your project. What brings you here today?",
  options: [
    "I need a developer",
    "I need cybersecurity help",
    "I need AI / Data solutions",
    "Business strategy / Consulting",
    "Training / Workshop",
    "Something else",
  ],
};

const FLOWS: Record<string, Message[]> = {
  "I need a developer": [
    { role: "assistant", content: "Great! Damilola builds full-stack apps with React, Laravel, Django, Flutter & React Native. What type of project?", options: ["Web Application", "Mobile App", "API / Backend", "E-commerce", "SaaS Platform"] },
    { role: "assistant", content: "Sounds exciting! What stage is your project at?", options: ["Just an idea", "Need an MVP", "Existing product — need features", "Need a tech co-founder/advisor"] },
    { role: "assistant", content: "Perfect. Damilola has delivered 15+ production apps across fintech, govtech, edtech and SaaS. He'd love to discuss your project in detail! 🚀" },
  ],
  "I need cybersecurity help": [
    { role: "assistant", content: "Damilola is IBM-certified in cybersecurity with expertise in API security, quantum-safe encryption, and network defense. What do you need?", options: ["Penetration Testing", "Security Audit", "Compliance / Framework", "Security Training", "Incident Response"] },
    { role: "assistant", content: "Got it. He's built tools like API Security Tester and Quantum-Safe Encryption frameworks. Let's get you connected! 🔒" },
  ],
  "I need AI / Data solutions": [
    { role: "assistant", content: "Damilola works with Python, TensorFlow, scikit-learn, and LangChain. What's your AI challenge?", options: ["Predictive Analytics", "NLP / Chatbots", "Computer Vision", "Data Pipeline", "AI Integration in existing app"] },
    { role: "assistant", content: "He's built anomaly detection systems, AI job-matching platforms, and custom knowledge chatbots. Let's explore your use case! 🧠" },
  ],
  "Business strategy / Consulting": [
    { role: "assistant", content: "Damilola has led products across fintech, govtech, and edtech on 4 continents. What area?", options: ["Go-to-market strategy", "Product roadmap", "Fractional CTO", "Market expansion", "Climate/ESG strategy"] },
    { role: "assistant", content: "With experience at companies like Clea (fintech) and Xenith IQ (govtech), he brings cross-sector strategic insight. Let's talk! 📊" },
  ],
  "Training / Workshop": [
    { role: "assistant", content: "Damilola has trained 3,000+ professionals globally. What topic interests you?", options: ["Cybersecurity Workshop", "Cloud / GCP Training", "AI / ML Bootcamp", "Full-Stack Development", "Custom Corporate Training"] },
    { role: "assistant", content: "As a GCP Facilitator, Django Girls Coach, and GDSC Lead, he tailors sessions for any audience. Let's plan your training! 🎓" },
  ],
  "Something else": [
    { role: "assistant", content: "No problem! Tell me a bit about what you're looking for and I'll point you in the right direction.", options: ["Research collaboration", "Speaking engagement", "Partnership opportunity", "Hardware / IoT project"] },
    { role: "assistant", content: "Interesting! Damilola is always open to unique collaborations. Reach out directly for the best conversation! 💡" },
  ],
};

const CONTACT_MSG: Message = {
  role: "assistant",
  content: "Ready to connect? Here's how to reach Damilola directly:\n\n📧 hi@thedamiyinusa.com\n📱 WhatsApp: +2347074430088\n\nHe typically responds within 24 hours. Looking forward to hearing from you!",
};

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [flowKey, setFlowKey] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [showContact, setShowContact] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOption = (option: string) => {
    const userMsg: Message = { role: "user", content: option };
    
    if (!flowKey) {
      // First selection - enter a flow
      const flow = FLOWS[option];
      if (flow) {
        setFlowKey(option);
        setFlowStep(0);
        setMessages((prev) => [...prev, userMsg, flow[0]]);
      }
    } else {
      // Continue in flow
      const flow = FLOWS[flowKey];
      const nextStep = flowStep + 1;
      if (flow && nextStep < flow.length) {
        setFlowStep(nextStep);
        setMessages((prev) => [...prev, userMsg, flow[nextStep]]);
        if (nextStep === flow.length - 1) {
          // Last step — show contact after delay
          setTimeout(() => {
            setMessages((prev) => [...prev, CONTACT_MSG]);
            setShowContact(true);
          }, 1500);
        }
      }
    }
  };

  const handleFreeText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const userMsg: Message = { role: "user", content: inputVal };
    setInputVal("");
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: "assistant",
        content: `Thanks for sharing that! This sounds like something Damilola would be interested in discussing. For the best experience, I'd recommend reaching out directly — he loves diving deep into unique projects! 🚀`,
      },
      CONTACT_MSG,
    ]);
    setShowContact(true);
  };

  const reset = () => {
    setMessages([INTRO]);
    setFlowKey(null);
    setFlowStep(0);
    setShowContact(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-shadow hover:shadow-primary/50"
            id="chat"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  D
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Damilola's Assistant</p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    Online — ready to help
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground transition-colors hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === messages.length - 1 ? 0.2 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Options */}
              {messages.length > 0 && (() => {
                const last = messages[messages.length - 1];
                if (last.role === "assistant" && last.options && !showContact) {
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-1.5 pt-1"
                    >
                      {last.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOption(opt)}
                          className="rounded-full border border-primary/30 px-3 py-1.5 font-body text-xs text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  );
                }
                return null;
              })()}

              {/* Contact buttons */}
              {showContact && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 pt-2"
                >
                  <a
                    href="mailto:hi@thedamiyinusa.com"
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
                  >
                    <Mail className="h-4 w-4" /> Email Damilola
                  </a>
                  <a
                    href="https://wa.me/2347074430088"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-primary/30 px-4 py-2.5 font-body text-sm font-medium text-foreground transition-all hover:border-primary"
                  >
                    <Phone className="h-4 w-4 text-primary" /> WhatsApp
                  </a>
                  <button
                    onClick={reset}
                    className="mt-1 font-body text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    ← Start over
                  </button>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleFreeText} className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
