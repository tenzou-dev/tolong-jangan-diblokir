// ============================================
// Cloudflare Worker - "Tolong, Jangan Diblokir"
// API Gateway for Google AI Studio (Gemini API)
// ============================================

// Environment bindings (set in wrangler.toml / Cloudflare dashboard)
// GEMINI_API_KEY: your Google AI Studio API key
// DB: D1 database binding or KV namespace

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // POST /api/chat - Send message to Nindi (Gemini)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message, user_id, current_chapter, panic_level, trust_level } =
          await request.json();

        if (!message) {
          return new Response(
            JSON.stringify({ error: "Message is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const systemPrompt = buildSystemPrompt(current_chapter, panic_level, trust_level);
        const geminiResponse = await callGemini(env.GEMINI_API_KEY, systemPrompt, message);
        const nindiResponse = parseNindiResponse(geminiResponse, panic_level, trust_level);

        return new Response(
          JSON.stringify(nindiResponse),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Worker error:", err);
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // GET /api/state/:user_id - Get game state
    if (url.pathname.match(/^\/api\/state\/([^\/]+)$/) && request.method === "GET") {
      const userId = url.pathname.split("/").pop();
      return new Response(
        JSON.stringify({ user_id: userId, current_chapter: 1, panic_level: 3, trust_level: 5 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /api/state - Save game state
    if (url.pathname === "/api/state" && request.method === "POST") {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
};
