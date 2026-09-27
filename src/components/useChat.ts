"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { commandReply, parseCommand } from "@/lib/commands";
import { offlineAnswer, type Action, type Reply } from "@/lib/knowledge";
import { useUI } from "./UIProvider";

export type ChatMessage = { id: number; role: "user" | "assistant"; text: string; actions?: Action[]; pending?: boolean };

/**
 * Chat state for the "Ask me anything" box: slash commands run locally, questions stream from /api/chat,
 * and the offline answer engine takes over when no API key is configured or the AI is unreachable.
 */
export function useChat() {
  const { openProject, setTheme } = useUI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextId = useRef(1);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setAiReady(Boolean(d.configured)))
      .catch(() => setAiReady(false));
  }, []);

  const patch = (id: number, update: Partial<ChatMessage> | ((m: ChatMessage) => Partial<ChatMessage>)) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...(typeof update === "function" ? update(m) : update) } : m)));

  /** Types a canned reply out quickly so it reads like a live answer. */
  const typeOut = useCallback(async (id: number, reply: Reply, signal: AbortSignal) => {
    const words = reply.text.split(/(\s+)/);
    let shown = "";
    for (let i = 0; i < words.length; i += 3) {
      if (signal.aborted) return;
      shown += words.slice(i, i + 3).join("");
      patch(id, { text: shown, pending: false });
      await new Promise((r) => setTimeout(r, 18));
    }
    patch(id, { text: reply.text, actions: reply.actions, pending: false });
  }, []);

  const askAI = useCallback(async (id: number, question: string, signal: AbortSignal) => {
    const history = messagesRef.current
      .filter((m) => m.id !== id && m.text && !m.pending)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.text }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, history }),
      signal,
    });
    if (res.status === 429) return patch(id, { text: "Too many questions at once 😅 — try again in a few minutes.", pending: false });
    if (!res.ok || !res.body) throw new Error(`chat ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const ev of events) {
        const data = ev.startsWith("data: ") ? ev.slice(6).trim() : "";
        if (!data || data === "[DONE]") continue;
        const chunk = JSON.parse(data) as { type: string; token?: string; code?: string };
        if (chunk.type === "content" && chunk.token) {
          text += chunk.token;
          patch(id, { text, pending: false });
        } else if (chunk.type === "error" && chunk.code !== "aborted") {
          if (chunk.code === "not_configured") setAiReady(false);
          if (!text) throw new Error(chunk.code);
        }
      }
    }
    if (!text) throw new Error("empty");
  }, []);

  const submit = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q || busy) return;

      const cmd = parseCommand(q);
      if (cmd?.id === "clear") return setMessages([]);

      const userMsg: ChatMessage = { id: nextId.current++, role: "user", text: q };
      const reply: ChatMessage = { id: nextId.current++, role: "assistant", text: "", pending: true };
      setMessages((m) => [...m, userMsg, reply]);

      if (cmd) {
        if (cmd.id === "theme") {
          const mode = cmd.arg === "light" || cmd.arg === "dark" ? cmd.arg : document.documentElement.dataset.theme === "dark" ? "light" : "dark";
          setTheme(mode);
          return patch(reply.id, { text: `Switched to ${mode} theme.`, pending: false });
        }
        if (cmd.id === "open" && cmd.arg) {
          openProject(cmd.arg);
          return patch(reply.id, { text: "Opening the project details…", pending: false });
        }
        const canned = commandReply(cmd);
        if (canned) return patch(reply.id, { ...canned, pending: false });
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);
      try {
        if (aiReady === false) throw new Error("offline");
        await askAI(reply.id, q, controller.signal);
      } catch {
        if (!controller.signal.aborted) await typeOut(reply.id, offlineAnswer(q), controller.signal);
      } finally {
        patch(reply.id, (m) => ({ pending: false, text: m.text || "^C" }));
        abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, aiReady, askAI, typeOut, openProject, setTheme],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return { messages, busy, aiReady, submit, stop };
}
