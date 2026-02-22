import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Mail, Phone, RotateCcw, Loader2 } from "lucide-react";

type Message = {
  role: "system" | "assistant" | "user";
  content: string;
};

const AZURE_ENDPOINT =
  "https://smartedge.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";
const AZURE_KEY =
  "F3yqy6cug8lvAauc582zzJGpVB1JVDs0jck2JzzzR6LWAfYYxLuqJQQJ99BKACYeBjFXJ3w3AAABACOGx5T4";

const SYSTEM_PROMPT = `You are "Damilola", the virtual assistant on Damilola Yinusa's portfolio website. You speak in a warm, professional, and confident tone.

About Damilola Yinusa:
- Full-stack developer (React, Laravel, Django, Flutter, React Native)
- IBM-certified cybersecurity professional (API security, quantum-safe encryption, network defense)
- AI & Data specialist (Python, TensorFlow, scikit-learn, LangChain)
- Hardware & IoT engineer (Arduino, Raspberry Pi, embedded systems)
- GCP Facilitator, trained 3,000+ professionals globally
- Experience at Clea (fintech), Xenith IQ (govtech), and across 4 continents
- Awards: Google Cloud Innovator, IBM Cybersecurity Certificate, HNG Finalist
- Services: Software Development, Cybersecurity, AI/ML, Research & Innovation, Hardware/IoT, Technical Writing, Cloud Architecture, Strategy/Consulting, Training/Workshops

Your job:
1. Help visitors understand Damilola's expertise and how he can help with their project.
2. Ask clarifying questions to understand what the visitor needs.
3. Help them articulate their project ideas and requirements.
4. Provide high-level guidance and planning suggestions, but always emphasize that Damilola himself should be contacted for detailed planning and execution.
5. Be helpful but always direct people to reach out for real engagement.

Contact details (share when appropriate):
- Email: hi@damilolayinusa.com
- WhatsApp: +2347074430088

Keep responses concise (2-4 sentences typically). Use emojis sparingly. Be professional but approachable.`;

const WELCOME_MSG: Message = {
  role: "assistant",
  content:
    "Hey there! 👋 I'm Damilola's AI assistant. I can help you explore how Damilola can contribute to your project — whether it's software development, cybersecurity, AI solutions, or something else entirely. What brings you here today?",
};

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isStreaming) return;

      const userMsg: Message = { role: "user", content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInputVal("");
      setIsStreaming(true);

      // Build API messages with system prompt
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
      ];

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const resp = await fetch(AZURE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AZURE_KEY,
          },
          body: JSON.stringify({
            messages: apiMessages,
            stream: true,
            max_tokens: 500,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        if (!resp.ok || !resp.body) {
          throw new Error(`Azure API error: ${resp.status}`);
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let assistantSoFar = "";
        let textBuffer = "";

        // Add empty assistant message
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
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: snapshot } : m
                  )
                );
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            ...(prev[prev.length - 1]?.role === "assistant" && prev[prev.length - 1]?.content === ""
              ? []
              : []),
            {
              role: "assistant" as const,
              content:
                "I'm having trouble connecting right now. Please reach out to Damilola directly at hi@damilolayinusa.com or via WhatsApp at +2347074430088 🙏",
            },
          ]);
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
                  <p className="font-display text-sm font-semibold text-foreground">
                    Damilola AI
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    Powered by GPT-4o
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="New conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages
                .filter((m) => m.role !== "system")
                .map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                      {msg.role === "assistant" && msg.content === "" && (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

              {/* Quick suggestions on first message */}
              {messages.length === 1 && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {[
                    "I need a developer",
                    "Cybersecurity help",
                    "AI / Data solutions",
                    "Let's discuss a project",
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => sendMessage(opt)}
                      className="rounded-full border border-primary/30 px-3 py-1.5 font-body text-xs text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Contact bar */}
            <div className="flex items-center justify-center gap-4 border-t border-border bg-secondary/50 px-4 py-2">
              <a
                href="mailto:hi@damilolayinusa.com"
                className="flex items-center gap-1 font-body text-[11px] text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-3 w-3" /> Email
              </a>
              <a
                href="https://wa.me/2347074430088"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-body text-[11px] text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={isStreaming ? "Waiting for response..." : "Ask me anything..."}
                  disabled={isStreaming}
                  className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !inputVal.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
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
