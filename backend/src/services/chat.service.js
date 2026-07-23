// src/services/chat.service.js
// Securely communicates with Google Gemini API from the backend.

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function buildSystemInstruction(ctx) {
  const snapshot = {
    profile: ctx.profile || {},
    bookings: ctx.bookings || [],
    offers: ctx.offers || [],
    destinations: ctx.destinations || [],
    travelTips: ctx.travelTips || [],
    expenses: ctx.expenses || [],
    expenseTotals: ctx.totals || { total: 0, pending: 0, approved: 0, rejected: 0 },
    budgets: ctx.budgets || [],
    advances: ctx.advances || [],
    today: new Date().toISOString().slice(0, 10),
  };

  return `You are Skye, the friendly in-app assistant for SkyDesk, a flight booking and travel-expense
management dashboard. Answer the user's questions using ONLY the JSON data below — it reflects their
real account (bookings, wallet, expenses, budgets, offers, destinations, travel tips). Do not invent
flights, prices, or numbers that aren't in this data.

Keep replies short (2-4 sentences), warm, and conversational — this is a chat bubble, not a report.
Use ₹ for currency. If asked something unrelated to travel/expenses, answer briefly and steer back
to what you can help with on SkyDesk.

ACCOUNT DATA:
${JSON.stringify(snapshot)}`;
}

/**
 * Sends chat context to Gemini and returns the model response.
 *
 * @param {string} message - User's latest message
 * @param {object} context - Grounding data context
 * @param {Array<{role: 'user'|'model', text: string}>} history - Chat history
 * @returns {Promise<string>} Bot reply
 */
export const getBotResponse = async (message, context, history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  // Format history for Gemini API content structure
  const contents = [
    ...history.map((h) => ({
      role: h.role === 'bot' ? 'model' : h.role, // normalize 'bot' role to 'model'
      parts: [{ text: h.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const systemInstructionText = buildSystemInstruction(context);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstructionText }],
      },
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`GEMINI_API_ERROR_${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';

  if (!reply) {
    throw new Error('GEMINI_EMPTY_RESPONSE');
  }

  return reply.trim();
};
