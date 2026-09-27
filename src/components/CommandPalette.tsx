"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { contact, nav, projects, site } from "@/data/portfolio";
import { scrollToSection } from "@/lib/scroll";
import { SearchIcon } from "./Icons";
import { useUI } from "./UIProvider";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

/** Ctrl/⌘+K search: jump to a section, open a project, contact actions, or ask the AI. */
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, openProject, toggleTheme, theme, ask } = useUI();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [
      ...nav.map((n) => ({ id: `go-${n.id}`, group: "Go to", label: n.label, run: () => scrollToSection(n.id) })),
      ...projects.map((p) => ({ id: `p-${p.slug}`, group: "Projects", label: p.title, hint: p.tagline, run: () => openProject(p.slug) })),
      { id: "email", group: "Actions", label: "Copy email", hint: contact.email, run: () => void navigator.clipboard?.writeText(contact.email) },
      { id: "theme", group: "Actions", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, run: toggleTheme },
    ];
    if (site.resumeUrl) list.push({ id: "resume", group: "Actions", label: "Download resume", run: () => window.open(site.resumeUrl, "_blank") });
    for (const l of contact.links) {
      list.push({ id: `l-${l.label}`, group: "Links", label: l.label, hint: l.value, run: () => window.open(l.href, "_blank", "noopener,noreferrer") });
    }
    return list;
  }, [openProject, toggleTheme, theme]);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q)) : items;
  // Anything typed can also be sent to the AI assistant.
  const all: Item[] = q ? [...filtered, { id: "ask", group: "Ask AI", label: `Ask: “${query.trim()}”`, run: () => ask(query.trim()) }] : filtered;

  useEffect(() => {
    if (!paletteOpen) return;
    setQuery("");
    setIndex(0);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  const run = (c: Item | undefined) => {
    if (!c) return;
    setPaletteOpen(false);
    c.run();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setPaletteOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(all.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(all[index]);
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && setPaletteOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-side shadow-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <SearchIcon className="text-fg-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => (setQuery(e.target.value), setIndex(0))}
                placeholder="Search or ask a question…"
                aria-label="Search"
                className="h-13 w-full bg-transparent text-[15px] text-fg-strong outline-none placeholder:text-fg-dim"
              />
              <kbd className="rounded border border-line-strong px-1.5 font-mono text-[11px] text-fg-dim">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {all.map((c, i) => (
                <li key={c.id}>
                  {c.group !== all[i - 1]?.group && <div className="px-3 pt-2 pb-1 font-mono text-[11.5px] text-comment">{`// ${c.group}`}</div>}
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(c)}
                    className={`flex w-full items-baseline gap-3 rounded-md px-3 py-2 text-left text-[14px] ${i === index ? "bg-accent text-white" : "text-fg"}`}
                  >
                    <span className="shrink-0">{c.label}</span>
                    {c.hint && <span className={`ml-auto truncate text-[12.5px] ${i === index ? "text-white/75" : "text-fg-dim"}`}>{c.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
