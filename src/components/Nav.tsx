"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { nav, site } from "@/data/portfolio";
import { scrollToSection } from "@/lib/scroll";
import { CloseIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "./Icons";
import { useActiveSection } from "./useActiveSection";
import { useUI } from "./UIProvider";

const ids = nav.map((n) => n.id);

export function Nav() {
  const { theme, toggleTheme, setPaletteOpen } = useUI();
  const active = useActiveSection(ids);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  const iconBtn = "flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-hover hover:text-fg-strong";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-side/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#about" onClick={(e) => (e.preventDefault(), go("about"))} className="font-mono text-[15px] font-semibold text-fg-strong">
          <span className="text-kw">&lt;</span>
          {site.name.toLowerCase()}
          <span className="text-kw"> /&gt;</span>
        </a>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.id)}
              aria-current={active === n.id ? "true" : undefined}
              className={`relative rounded-md px-3 py-1.5 text-[14px] transition-colors ${active === n.id ? "text-fg-strong" : "text-fg-muted hover:text-fg-strong"}`}
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 -z-10 rounded-md bg-hover ring-1 ring-accent-fg/40"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-line-strong px-3 text-[13px] text-fg-dim transition-colors hover:border-accent-fg/60 hover:text-fg sm:flex"
            aria-label="Search (Ctrl+K)"
          >
            <SearchIcon width={15} height={15} />
            Search
            <kbd className="font-mono text-[11px]">Ctrl K</kbd>
          </button>
          <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" onClick={() => go("contact")} className="hidden h-9 items-center rounded-lg bg-accent px-4 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90 sm:flex">
            Hire me
          </button>
          <button type="button" onClick={() => setMenuOpen((o) => !o)} className={`${iconBtn} md:hidden`} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {nav.map((n) => (
                <button key={n.id} type="button" onClick={() => go(n.id)} className={`rounded-md px-3 py-2.5 text-left text-[15px] ${active === n.id ? "bg-hover text-fg-strong" : "text-fg-muted"}`}>
                  {n.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent-fg" />
    </header>
  );
}
