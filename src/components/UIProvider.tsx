"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_THEME, THEME_BG, isTheme, type ThemeId } from "@/lib/config";

type UIContext = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  toggleTheme: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  /** Slug of the project shown in the details popup, or null. */
  openSlug: string | null;
  openProject: (slug: string | null) => void;
  /** Sends a question to the chat box and brings it into view. */
  ask: (question: string) => void;
  focusChat: () => void;
  registerChat: (handlers: { ask: (q: string) => void; focus: () => void }) => void;
};

const Ctx = createContext<UIContext | null>(null);

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openSlug, openProject] = useState<string | null>(null);
  const chat = useRef({ ask: (_q: string) => {}, focus: () => {} });

  // The inline script in <head> already applied the saved theme; sync state with it.
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (isTheme(current)) setThemeState(current);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_BG[t]);
    try {
      localStorage.setItem("theme", t);
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }
  }, []);

  // Ctrl/⌘+K opens search anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const registerChat = useCallback((h: { ask: (q: string) => void; focus: () => void }) => {
    chat.current = h;
  }, []);

  const value = useMemo<UIContext>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      paletteOpen,
      setPaletteOpen,
      openSlug,
      openProject,
      ask: (q) => chat.current.ask(q),
      focusChat: () => chat.current.focus(),
      registerChat,
    }),
    [theme, setTheme, paletteOpen, openSlug, registerChat],
  );

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}
