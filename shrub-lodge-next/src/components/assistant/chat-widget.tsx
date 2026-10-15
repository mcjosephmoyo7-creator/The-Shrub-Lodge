"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  id: 0,
  role: "assistant",
  content: [
    `Hi, welcome to ${siteConfig.name}! 🌿`,
    "I can help you choose activities, check prices, plan transfers or answer questions about the lodge.",
    "Not sure what to do? Ask me for my top picks.",
  ].join("\n"),
};

const SUGGESTIONS = [
  "I'm not sure what to do",
  "What are the best activities?",
  "How much is a sunset cruise?",
  "Do you have rooms?",
  "How do I book?",
];

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|https?:\/\/\S+|\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*)/i,
  );

  return tokens
    .map((token, index) => {
      if (!token) return null;
      const key = `${keyPrefix}-${index}`;

      if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
        return (
          <strong key={key} className="font-semibold text-forest-950">
            {token.slice(2, -2)}
          </strong>
        );
      }

      const linkMatch = token.match(/^(https?:\/\/\S+|\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*)([.,;:!?)\]]*)$/i);
      if (linkMatch) {
        const [, href, trailing] = linkMatch;
        const isExternal = /^https?:/i.test(href);
        return (
          <span key={key}>
            {isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-medium text-gold-700 underline underline-offset-2"
              >
                {href}
              </a>
            ) : (
              <Link
                href={href}
                className="font-medium text-gold-700 underline underline-offset-2"
              >
                {href}
              </Link>
            )}
            {trailing}
          </span>
        );
      }

      return token;
    })
    .filter(Boolean);
}

function renderMessage(content: string): ReactNode {
  return content.split("\n").map((line, index) => {
    const key = `line-${index}`;
    const trimmed = line.trim();

    if (!trimmed) return <span key={key} className="block h-2" aria-hidden="true" />;

    const isBullet = /^[-•*]\s+/.test(trimmed);
    const text = isBullet ? trimmed.replace(/^[-•*]\s+/, "") : trimmed;
    const inline = renderInline(text, key);

    if (isBullet) {
      return (
        <span key={key} className="flex gap-2">
          <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
          <span className="min-w-0">{inline}</span>
        </span>
      );
    }

    return (
      <span key={key} className="block">
        {inline}
      </span>
    );
  });
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, typing, error, open]);

  useEffect(() => () => inFlight.current?.abort(), []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setError(null);
    setDraft("");

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };
    const history = [...messages, userMessage];
    setMessages(history);
    setTyping(true);

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-8).map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.reply) {
        setError(
          payload?.error ??
            "Sorry, I couldn't get an answer just now. Please try again, or contact us directly.",
        );
        return;
      }

      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "assistant", content: payload.reply as string },
      ]);
    } catch {
      if (!controller.signal.aborted) {
        setError("Sorry, I couldn't get an answer just now. Please try again in a moment.");
      }
    } finally {
      if (inFlight.current === controller) {
        inFlight.current = null;
        setTyping(false);
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close the assistant" : "Chat with the assistant"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-4 z-[60] inline-flex h-14 items-center justify-center gap-2 rounded-full bg-forest-900 px-5 text-sand-50 shadow-lg shadow-forest-950/25 transition-all duration-300 hover:bg-forest-800 hover:shadow-xl sm:right-6",
          open && "bg-forest-800",
        )}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="hidden text-sm font-semibold sm:inline">
          {open ? "Close" : "Ask Shrub Assist"}
        </span>
      </button>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Shrub Assist — virtual concierge"
        className={cn(
          "fixed bottom-24 right-4 left-4 z-[60] flex max-h-[70vh] w-auto flex-col overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-2xl shadow-forest-950/30 transition-all duration-300 sm:left-auto sm:right-6 sm:w-[24rem]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <header className="flex items-center gap-3 bg-forest-950 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-400/40 bg-forest-900 p-1">
            <Image
              src="/images/logo.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base leading-tight text-sand-50">
              Shrub Assist
            </span>
            <span className="block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-gold-300/90">
              Your Victoria Falls concierge
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close the assistant"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sand-200 transition-colors hover:bg-white/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "self-end rounded-br-md bg-forest-900 text-sand-50"
                  : "self-start rounded-bl-md border border-sand-200 bg-white text-forest-900 shadow-sm",
              )}
            >
              {renderMessage(message.content)}
            </div>
          ))}

          {typing ? (
            <div className="flex items-center gap-1.5 self-start rounded-2xl border border-sand-200 bg-white px-4 py-3.5 shadow-sm">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 animate-bounce rounded-full bg-gold-500"
                  style={{ animationDelay: `${dot * 120}ms` }}
                />
              ))}
              <span className="sr-only">Assistant is typing</span>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        {messages.length <= 1 && !error ? (
          <div className="flex flex-wrap gap-2 border-t border-sand-200 bg-white/70 px-4 pt-3 pb-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-medium text-forest-800 transition-colors hover:border-gold-400 hover:bg-sand-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-sand-200 bg-white p-3">
          <label htmlFor="assistant-input" className="sr-only">
            Ask a question
          </label>
          <input
            id="assistant-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about activities, prices, rooms..."
            autoComplete="off"
            maxLength={500}
            className="min-w-0 flex-1 rounded-full border border-sand-300 bg-sand-50 px-4 py-2.5 text-sm text-forest-900 placeholder:text-forest-800/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
          />
          <button
            type="submit"
            disabled={typing || !draft.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-900 text-sand-50 transition-colors hover:bg-forest-800 disabled:opacity-40"
          >
            {typing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
