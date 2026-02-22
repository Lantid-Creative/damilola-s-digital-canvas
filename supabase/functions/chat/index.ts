import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AZURE_ENDPOINT =
  "https://smartedge.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";

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
