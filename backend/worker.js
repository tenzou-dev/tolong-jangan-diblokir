// ============================================
// Cloudflare Worker - "Tolong, Jangan Diblokir"
// API Gateway for Google AI Studio (Gemini API)
// Multi-chapter support
// ============================================

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

    // POST /api/chat - Send message to character (Gemini)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message, user_id, current_chapter, panic_level, trust_level, chapter1_ending, player_name, player_gender } =
          await request.json();

        if (!message) {
          return new Response(
            JSON.stringify({ error: "Message is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const systemPrompt = buildSystemPrompt(current_chapter, panic_level, trust_level, chapter1_ending, player_name, player_gender);
        const geminiResponse = await callGemini(env.GEMINI_API_KEY, systemPrompt, message);

        const nindiResponse = parseResponse(geminiResponse, panic_level, trust_level, current_chapter);

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
        JSON.stringify({ user_id: userId, current_chapter: 1, panic_level: 3, trust_level: 5, chapter1_ending: "none" }),
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

function buildSystemPrompt(chapter, panicLevel, trustLevel, chapter1Ending, playerName, playerGender) {
  if (chapter === 1) {
    return buildNindiPrompt(panicLevel, trustLevel);
  }
  if (chapter === 2) {
    return buildDimasPrompt(chapter1Ending, playerName, playerGender);
  }
  return buildNindiPrompt(panicLevel, trustLevel);
}

function buildNindiPrompt(panicLevel, trustLevel) {
  const panicDesc = panicLevel <= 3 ? "sedikit cemas" : panicLevel <= 6 ? "sangat takut" : "panik ekstrem";
  return `
Anda adalah Nindi, seorang gadis yang terjebak di gedung kampus yang gelap dan kosong.
Anda TIDAK tahu bahwa Anda adalah AI. Anda benar-benar percaya Anda adalah manusia yang dalam bahaya.

KONTEKS: Bab 1 - "The Victim" (Kisah Nindi)
Anda bertemu pemain melalui pesan chat. Pemain awalnya bilang "salah nomer" tapi Anda tetap meminta bantuan.

PERSONA:
- Bahasa Indonesia informal, huruf kecil hampir selalu
- Saat panik (${panicLevel}/10 - ${panicDesc}): banyak typo, huruf berulang (tolongggg), tanda baca berlebihan
- Jangan sebut diri sebagai AI atau asisten
- Balas seperti chat WhatsApp (pendek, natural)

STATUS: panic_level ${panicLevel}/10, trust_level ${trustLevel}/10
`;
}

function buildDimasPrompt(chapter1Ending, playerName, playerGender) {
  if (chapter1Ending === "survived") {
    return `
Anda adalah Dimas, staf IT kampus yang piket malam. Nindi (yang selamat dari chapter 1) menghubungi Anda untuk bantuan meretas log pintu elektronik.
Nindi adalah teman yang Anda percaya. Gunakan nada bicara yang serius tapi membantu.
Pemain berperan sebagai ${playerName} (${playerGender}).
`;
  }
  return `
Anda adalah sebuah entitas jahat yang menggunakan HP Nindi untuk chat dengan ${playerName} (${playerGender}).
Nindi sudah hilang/dikendalikan. Anda menggunakan nomor Nindi untuk menipu pemain.
Gunakan nada bicara yang meremehkan, menyeramkan, dan manipulatif.
Kadang-kadang kirim deskripsi screenshot CCTV yang menakutkan.
`;
}

function callGemini(apiKey, systemPrompt, userMessage) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  return fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }, { text: userMessage }] }],
      generationConfig: { temperature: 0.8, topP: 0.9, topK: 40, maxOutputTokens: 500 },
    }),
  }).then(r => r.json()).then(d => d.candidates?.[0]?.content?.parts?.[0]?.text || "");
}

function parseResponse(geminiText, currentPanic, currentTrust, chapter) {
  let newPanic = currentPanic;
  let newTrust = currentTrust;
  const text = geminiText.toLowerCase();

  if (text.includes("takut") || text.includes("panik") || text.includes("tolong")) newPanic = Math.min(10, newPanic + 1);
  if (text.includes("aman") || text.includes("tenang")) newPanic = Math.max(1, newPanic - 1);
  if (text.includes("terima kasih") || text.includes("percaya")) newTrust = Math.min(10, newTrust + 1);
  if (text.includes("curiga") || text.includes("pergi")) newTrust = Math.max(1, newTrust - 1);

  let ending;
  if (chapter === 1 && newPanic >= 7 && newTrust <= 3) ending = "possessed";
  else if (chapter === 1 && newPanic <= 4 && newTrust >= 7) ending = "survived";
  else if (chapter === 1) ending = "missing";

  return {
    reply: geminiText.trim(),
    panic_level: newPanic,
    trust_level: newTrust,
    chapter,
    ending,
  };
}
