"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { site, suggestedQuestions } from "@/data/portfolio";
import { suggest } from "@/lib/commands";
import type { Action } from "@/lib/knowledge";
import { scrollToSection } from "@/lib/scroll";
import { ArrowUpRight, SendIcon } from "./Icons";
import { useChat } from "./useChat";
import { useUI } from "./UIProvider";

/** "Ask me anything" card: AI answers about me, with slash-command autocomplete. */
export function ChatBox() {
  const { registerChat, openProject } = useUI();
  const { messages, busy, aiReady, submit, stop } = useChat();
  const [input, setInput] = useState("");
  const [pick, setPick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = suggest(input);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const focus = () => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current?.focus({ preventScroll: true });
    };
    registerChat({ focus, ask: (q) => (focus(), void submit(q)) });
  }, [registerChat, submit]);

  const send = (q: string) => {
    if (!q.trim()) return;
    setInput("");
    void submit(q);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const s = suggestions[pick];
    if (s && input.trim() !== s.value.trim()) return setInput(s.value);
    send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setPick((p) => (p + (e.key === "ArrowDown" ? 1 : suggestions.length - 1)) % suggestions.length);
    } else if (e.key === "Tab") {
      e.preventDefault();
      setInput(suggestions[pick]?.value ?? input);
    }
  };

  const runAction = (a: Action) => {
    if (a.type === "open") openProject(a.slug);
    else if (a.type === "section") scrollToSection(a.id);
  };

  return (
    <div ref={rootRef} className="flex h-[470px] flex-col overflow-hidden rounded-xl border border-line-strong bg-side shadow-[0_24px_60px_-30px_var(--color-glow)]">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line bg-card/50 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/avatar.jpg" alt={site.fullName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-tight font-semibold text-fg-strong">{site.name}&apos;s AI</p>
          <p className="flex items-center gap-1.5 text-[12px] text-fg-muted">
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${aiReady === false ? "bg-[#cca700]" : "bg-ok"}`} />
            {aiReady === false ? "Instant answers" : "AI assistant · online"}
          </p>
        </div>
        <span className="rounded border border-accent-fg/40 px-2 py-0.5 font-mono text-[11px] text-accent-fg">AI</span>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        <div className="max-w-[88%] rounded-xl rounded-bl-sm bg-card px-3.5 py-2.5 text-[14px] leading-relaxed text-fg">
          Hi! I&apos;m {site.name}&apos;s AI assistant. Ask me about my projects, skills or experience.
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestedQuestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-line-strong px-3 py-1.5 text-[12.5px] text-fg-muted transition-colors hover:border-accent-fg hover:text-fg-strong"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`fade-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[88%]">
              <div
                className={`rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user" ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-card text-fg"
                }`}
              >
                {m.pending && !m.text ? (
                  <span className="typing-dots inline-flex gap-1 py-1" aria-label="Typing">
                    <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" />
                    <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" />
                    <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" />
                  </span>
                ) : (
                  m.text
                )}
              </div>
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a) =>
                    a.type === "link" ? (
                      <a
                        key={a.label}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full border border-accent-fg/40 px-2.5 py-1 text-[12px] text-accent-fg hover:bg-accent/10"
                      >
                        {a.label} <ArrowUpRight width={12} height={12} />
                      </a>
                    ) : (
                      <button key={a.label} type="button" onClick={() => runAction(a)} className="rounded-full border border-accent-fg/40 px-2.5 py-1 text-[12px] text-accent-fg hover:bg-accent/10">
                        {a.label} →
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* input */}
      <form onSubmit={onSubmit} className="relative border-t border-line p-3">
        {suggestions.length > 0 && (
          <ul className="absolute right-3 bottom-full left-3 mb-2 overflow-hidden rounded-lg border border-line-strong bg-card py-1 shadow-xl" role="listbox">
            {suggestions.map((s, i) => (
              <li key={s.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === pick}
                  onMouseEnter={() => setPick(i)}
                  onClick={() => (setInput(s.value), inputRef.current?.focus())}
                  className={`flex w-full items-baseline gap-3 px-3 py-1.5 text-left ${i === pick ? "bg-accent text-white" : "text-fg"}`}
                >
                  <span className="font-mono text-[13px]">{s.value.trim()}</span>
                  <span className={`truncate text-[12px] ${i === pick ? "text-white/75" : "text-fg-dim"}`}>{s.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-line-strong bg-input px-3 focus-within:border-accent-fg">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => (setInput(e.target.value), setPick(0))}
            onKeyDown={onKeyDown}
            placeholder="Ask a question, or type / for commands"
            aria-label="Ask a question"
            autoComplete="off"
            maxLength={500}
            className="h-10 w-full bg-transparent text-[14px] text-fg-strong outline-none placeholder:text-fg-dim"
          />
          {busy ? (
            <button type="button" onClick={stop} className="shrink-0 rounded-md border border-line-strong px-2.5 py-1 text-[12px] text-fg-muted hover:text-fg">
              Stop
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} aria-label="Send" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-white disabled:opacity-35">
              <SendIcon width={15} height={15} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
