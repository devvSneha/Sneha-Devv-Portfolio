"use client";

import { motion } from "framer-motion";
import { experience, hero, projects, site } from "@/data/portfolio";
import { yearsOfExperience } from "@/lib/knowledge";
import { scrollToSection } from "@/lib/scroll";
import { ChatBox } from "@/components/ChatBox";
import { CountUp, Spotlight, TypingRoles } from "@/components/Effects";
import { Highlight } from "@/components/Highlight";
import { DownloadIcon } from "@/components/Icons";

const item = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.08 * i, ease: [0, 0, 0.2, 1] as const },
});

export function Hero() {
  const years = yearsOfExperience();
  const stats = [
    { value: years, suffix: "+", label: years === 1 ? "year experience" : "years experience" },
    { value: projects.length, suffix: "", label: "projects shipped" },
    { value: experience.length, suffix: "", label: experience.length === 1 ? "company" : "companies" },
  ];

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <div>
          {site.availability && (
            <motion.p {...item(0)} className="inline-flex items-center gap-2 rounded-full border border-ok/40 bg-ok/10 px-3 py-1 text-[12.5px] text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
              {site.availability}
            </motion.p>
          )}
          <motion.h1 {...item(1)} className="mt-6 text-[42px] leading-[1.08] font-bold tracking-tight text-fg-strong sm:text-[56px]">
            Hi, I&apos;m{" "}
            <span className="relative inline-block">
              <span aria-hidden="true" className="absolute -inset-4 -z-10 animate-pulse rounded-full bg-gradient-to-r from-accent-fg/25 via-ctrl/25 to-accent-fg/25 blur-2xl" />
              <span className="font-display text-brand">{site.fullName}</span>
            </span>
          </motion.h1>
          <motion.p {...item(2)} className="mt-3 font-mono text-[17px] sm:text-[19px]">
            <span className="text-fg-dim">&gt; </span>
            <TypingRoles roles={hero.roles.length ? hero.roles : [site.role]} />
          </motion.p>
          <motion.p {...item(3)} className="balance mt-6 text-[21px] leading-snug font-medium text-fg-strong sm:text-[24px]">
            <Highlight parts={hero.headline} />
          </motion.p>
          <motion.p {...item(4)} className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-fg-muted">
            {hero.intro}
          </motion.p>

          <motion.div {...item(5)} className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToSection("projects")} className="h-11 rounded-lg bg-accent px-5 text-[14.5px] font-medium text-white transition-opacity hover:opacity-90">
              View my work
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="h-11 rounded-lg border border-accent-fg px-5 text-[14.5px] font-medium text-accent-fg transition-colors hover:bg-accent-fg/10"
            >
              Contact me
            </button>
            {site.resumeUrl && (
              <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 px-3 text-[14.5px] font-medium text-fg-muted hover:text-fg-strong">
                <DownloadIcon /> Resume
              </a>
            )}
          </motion.div>

          <motion.dl {...item(6)} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <Spotlight key={s.label} className="rounded-lg border border-line bg-card/50 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-accent-fg/60">
                <dd className="text-[26px] leading-tight font-bold text-accent-fg">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="text-[12.5px] text-fg-muted">{s.label}</dt>
              </Spotlight>
            ))}
          </motion.dl>
        </div>

        <motion.div {...item(3)}>
          <ChatBox />
        </motion.div>
      </div>
    </section>
  );
}
