import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Mail, Phone, RotateCcw, Loader2, Calendar, CheckCircle } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const WELCOME_MSG: Message = {
  role: "assistant",
  content:
    "Hey there! 👋 I'm Damilola. Great to have you here — whether you need help with software development, cybersecurity, AI, or something entirely different, I'd love to hear what you're working on. What brings you here today?",
};

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

// ---------- Booking Form ----------
function BookingForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", project_description: "", preferred_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.project_description.trim() || !form.preferred_date) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          project_description: form.project_description.trim(),
          preferred_date: form.preferred_date,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      onSubmitted();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-primary mb-2" />
        <p className="font-display text-sm font-semibold text-foreground">Booking Confirmed!</p>
        <p className="font-body text-xs text-muted-foreground mt-1">
          I'll reach out to you by {form.preferred_date}. Looking forward to our conversation!
        </p>
      </motion.div>
    );
  }

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary";

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2"
    >
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="h-4 w-4 text-primary" />
        <p className="font-display text-xs font-semibold text-foreground">Book a Call with Me</p>
      </div>

      <input placeholder="Your name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} maxLength={100} />
      <input placeholder="Email address *" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} maxLength={255} />
      <input placeholder="Phone number (optional)" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} maxLength={30} />
      <textarea
        placeholder="Tell me briefly what you'd like to work on *"
        value={form.project_description}
        onChange={(e) => setForm((f) => ({ ...f, project_description: e.target.value }))}
        className={`${inputClass} min-h-[60px] resize-none`}
        maxLength={2000}
      />
      <div>
        <label className="font-body text-[10px] text-muted-foreground">Preferred contact date *</label>
        <input
          type="date"
          min={getMinDate()}
          value={form.preferred_date}
          onChange={(e) => setForm((f) => ({ ...f, preferred_date: e.target.value }))}
          className={inputClass}
        />
      </div>

      {error && <p className="font-body text-xs text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-3 py-2 font-body text-xs font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Schedule Call"}
      </button>
    </motion.form>
  );
}

// ---------- Main Chat ----------
export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showBooking]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isStreaming) return;

      const userMsg: Message = { role: "user", content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInputVal("");
      setIsStreaming(true);

      const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.content }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!resp.ok || !resp.body) throw new Error(`API error: ${resp.status}`);

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let assistantSoFar = "";
        let textBuffer = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantSoFar += content;
                const snapshot = assistantSoFar;
                setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snapshot } : m)));
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Show booking form if assistant mentions booking
        if (assistantSoFar.toLowerCase().includes("booking form") || assistantSoFar.toLowerCase().includes("schedule") || assistantSoFar.toLowerCase().includes("book a call")) {
          setShowBooking(true);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            const errMsg: Message = {
              role: "assistant",
              content: "I'm having a bit of trouble right now. You can reach me directly at hi@damilolayinusa.com or WhatsApp +2347074430088 🙏",
            };
            if (last?.role === "assistant" && last.content === "") {
              return [...prev.slice(0, -1), errMsg];
            }
            return [...prev, errMsg];
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([WELCOME_MSG]);
    setIsStreaming(false);
    setShowBooking(false);
  };

  return (
    <>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">D</div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Damilola Yinusa</p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={reset} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title="New conversation">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.content}
                    {msg.role === "assistant" && msg.content === "" && (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Typing...
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick suggestions */}
              {messages.length === 1 && !isStreaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-1.5 pt-1">
                  {["I need a developer", "Cybersecurity help", "AI / Data solutions", "Let's discuss a project"].map((opt) => (
                    <button key={opt} onClick={() => sendMessage(opt)} className="rounded-full border border-primary/30 px-3 py-1.5 font-body text-xs text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Booking form */}
              {showBooking && (
                <BookingForm
                  onSubmitted={() => {
                    setMessages((prev) => [
                      ...prev,
                      { role: "assistant", content: "Awesome, I've got your details! I'll be reaching out soon. Talk to you then! 🎉" },
                    ]);
                  }}
                />
              )}

              {/* Book a call button (show after 3+ messages if not already showing) */}
              {!showBooking && messages.length >= 3 && !isStreaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5 font-body text-xs text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <Calendar className="h-3 w-3" /> Book a call with me
                  </button>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Contact bar */}
            <div className="flex items-center justify-center gap-4 border-t border-border bg-secondary/50 px-4 py-2">
              <a href="mailto:hi@damilolayinusa.com" className="flex items-center gap-1 font-body text-[11px] text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-3 w-3" /> Email
              </a>
              <a href="https://wa.me/2347074430088" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-body text-[11px] text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={isStreaming ? "Typing..." : "Type a message..."}
                  disabled={isStreaming}
                  className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
                />
                <button type="submit" disabled={isStreaming || !inputVal.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50">
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
