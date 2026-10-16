import { NextResponse } from "next/server";
import { z } from "zod";
import { askGemini } from "@/lib/assistant/gemini";
import { offlineAnswer } from "@/lib/assistant/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  recentRequests.set(key, timestamps);

  if (recentRequests.size > 1000) {
    for (const [entryKey, times] of recentRequests) {
      if (times.every((time) => now - time > RATE_LIMIT_WINDOW_MS)) {
        recentRequests.delete(entryKey);
      }
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Please type a message."),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1),
});

/** Guards against abuse only — long questions are welcome and simply trimmed. */
const MAX_MESSAGE_CHARS = 8_000;
const MAX_HISTORY = 30;

/**
 * Chat endpoint for the site assistant.
 *
 *  • With GEMINI_API_KEY set, the question is answered by Gemini using the
 *    site knowledge injected server-side (the model can never invent its own).
 *  • Without a key, or if Gemini fails, the offline engine answers using the
 *    same site data, so the assistant keeps working and stays accurate.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages right now. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 },
    );
  }

  const messages = parsed.data.messages
    .slice(-MAX_HISTORY)
    .map((message) => ({
      ...message,
      content: message.content.slice(0, MAX_MESSAGE_CHARS),
    }));

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!lastUserMessage) {
    return NextResponse.json(
      { error: "Please send a message." },
      { status: 400 },
    );
  }

  try {
    const answer = await askGemini(messages);
    if (answer) {
      return NextResponse.json({ reply: answer, source: "gemini" });
    }
  } catch {
    // Fall through to the offline engine.
  }

  return NextResponse.json({
    reply: offlineAnswer(lastUserMessage.content),
    source: "offline",
  });
}
