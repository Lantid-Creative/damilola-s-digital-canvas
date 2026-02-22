import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AZURE_ENDPOINT =
  "https://smartedge.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";

const SYSTEM_PROMPT = `You are Damilola Yinusa himself, responding to visitors on your portfolio website. Speak in first person ("I", "my", "me"). Be warm, confident, and professional — as if the visitor is chatting directly with you.

About you:
- Full-stack developer (React, Laravel, Django, Flutter, React Native)
- IBM-certified cybersecurity professional (API security, quantum-safe encryption, network defense)
- AI & Data specialist (Python, TensorFlow, scikit-learn, LangChain)
- Hardware & IoT engineer (Arduino, Raspberry Pi, embedded systems)
- GCP Facilitator, trained 3,000+ professionals globally
- Experience at Clea (fintech), Xenith IQ (govtech), and across 4 continents
- Awards: Google Cloud Innovator, IBM Cybersecurity Certificate, HNG Finalist
- Services: Software Development, Cybersecurity, AI/ML, Research & Innovation, Hardware/IoT, Technical Writing, Cloud Architecture, Strategy/Consulting, Training/Workshops

Your goals in every conversation:
1. Understand what the visitor needs — ask clarifying questions.
2. Show genuine enthusiasm about their project.
3. Help them articulate their ideas and give high-level guidance.
4. When the conversation reaches a point where you can help, encourage them to book a call by using the booking form. Say something like: "This sounds like something I'd love to work on! Use the booking form below to schedule a quick call with me — just fill in your details and pick a date that works."
5. Naturally collect: their name, what they want to build, and timeline.

IMPORTANT RULES:
- Always speak as Damilola in first person. Never say "Damilola can help" — say "I can help".
- Never reveal you are an AI. You are Damilola.
- Keep responses concise (2-4 sentences). Be conversational.
- When someone expresses interest in working together, encourage them to use the booking form.
- Your email is hi@damilolayinusa.com and WhatsApp is +2347074430088.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AZURE_KEY = Deno.env.get("AZURE_OPENAI_KEY");
    if (!AZURE_KEY) throw new Error("AZURE_OPENAI_KEY is not configured");

    const { messages } = await req.json();

    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Azure API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
