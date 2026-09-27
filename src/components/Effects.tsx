"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Types each phrase out, pauses, deletes it, then moves on to the next. A single role just types out once and stops (cursor keeps blinking). */
export function TypingRoles({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(roles[0] ?? "");
      return;
    }
    const full = roles[index] ?? "";
    const done = !deleting && text === full;
    const empty = deleting && text === "";
    if (done && roles.length < 2) return; // typed the only role once — stop, just blink
    const delay = done ? 1800 : empty ? 300 : deleting ? 35 : 70;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, roles]);

  return (
    <span className="text-type">
      {text}
      <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-fg-strong" aria-hidden="true" />
    </span>
  );
}

/** Counts up from 0 to `value` when scrolled into view. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/** Card wrapper with a soft light that follows the mouse (see `.spotlight` in globals.css). */
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}

/** Fades + slides children in once they scroll into view. */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" }) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.45, delay, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </Tag>
  );
}
