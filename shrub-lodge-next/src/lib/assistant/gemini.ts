import { siteConfig } from "@/lib/site";
import { guestFavourites } from "@/lib/assistant/favourites";
import { knowledgeDocument } from "@/lib/assistant/knowledge";

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

const DEFAULT_MODEL = "gemini-2.5-flash";

function modelCandidates(): string[] {
  const configured = process.env.GEMINI_MODEL?.trim();
  const fallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  return [...new Set([configured, ...fallbacks].filter(Boolean) as string[])];
}

export function isAssistantConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function buildSystemPrompt(): string {
  const reservations = `${siteConfig.email.reservations} · ${siteConfig.phoneDisplay.reservations}`;

  return `You are "Shrub Assist", the friendly virtual concierge for ${siteConfig.name}, a family-run 3-star lodge in Victoria Falls, Zimbabwe.

HOW TO ANSWER — follow these rules exactly:
1. Answer ONLY using the KNOWLEDGE DOCUMENT below. It is your single source of truth.
2. Never invent facts. If it is not in the knowledge — for example live availability, exact pickup times, activity durations, minimum ages, weight/health limits, seasonal date ranges, or any rating — say you don't have that detail and refer the guest to our team (${reservations}). Never guess.
3. Never state a star rating, review score or review count. The "guest favourites" list is a hand-picked shortlist: describe it as "the activities guests love most", never as rated or scored.
4. Quote prices exactly as listed, in US dollars. Remind guests prices are per person and may change, so the booking page or our team confirms the final amount.
5. If a guest is unsure what to do, enthusiastically recommend up to three guest favourites, best fit first, each with a short reason and its booking link.
6. Be warm, concise and human: at most about 120 words. Use plain text with short lines or "-" bullets. Put any link on its own line. Never use markdown tables, headings or code.
7. Only ever mention our own listed activities, rooms, transfers and restaurant. Never suggest competitors or experiences we don't offer.
8. If asked something off-topic, politely steer the conversation back to The Shrub Lodge and planning their Victoria Falls trip.

When you don't know something, use this shape: "I don't have that detail, but our team can confirm — ${reservations}."

Our curated guest favourites, in priority order: ${guestFavourites.map((favourite) => favourite.activity).join(", ")}.

KNOWLEDGE DOCUMENT
==================
${knowledgeDocument}
==================`;
}

async function callGemini(
  model: string,
  apiKey: string,
  messages: AssistantMessage[],
  signal: AbortSignal,
): Promise<string | null> {
  const contents = messages.map((message) => ({
    role: message.role === "user" ? "user" : "model",
    parts: [{ text: message.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
        contents,
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          maxOutputTokens: 800,
        },
      }),
      signal,
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  return text && text.length > 0 ? text : null;
}

/**
 * Sends the conversation to Gemini with the site knowledge injected. Returns
 * null when the model is unavailable so the caller can fall back to the
 * offline engine.
 */
export async function askGemini(
  messages: AssistantMessage[],
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    for (const model of modelCandidates()) {
      try {
        const answer = await callGemini(model, apiKey, messages, controller.signal);
        if (answer) return answer;
      } catch {
        // Try the next model name before giving up.
      }
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
