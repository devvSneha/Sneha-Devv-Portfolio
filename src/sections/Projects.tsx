"use client";

import { projects } from "@/data/portfolio";
import { Reveal, Spotlight } from "@/components/Effects";
import { ArrowUpRight, PlayIcon } from "@/components/Icons";
import { hues, ProjectCover } from "@/components/ProjectCover";
import { SectionHeading } from "@/components/SectionHeading";
import { useUI } from "@/components/UIProvider";

export function Projects() {
  const { openProject } = useUI();

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading label="projects" title="Selected work" subtitle="A few things I've built. Click a card for details." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const hue = hues[i % hues.length];
            return (
            <Reveal key={p.slug} delay={0.06 * (i % 3)} className="flex">
              <Spotlight className="group flex w-full flex-col overflow-hidden rounded-xl border border-line bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-accent-fg/60">
                <button type="button" onClick={() => openProject(p.slug)} aria-label={`View details for ${p.title}`} className="relative aspect-[16/10] w-full overflow-hidden">
                  <ProjectCover project={p} index={i} priority={i < 2} />
                  {p.videoUrl && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11.5px] text-white">
                      <PlayIcon /> Demo
                    </span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[18px] font-semibold">
                    <button
                      type="button"
                      onClick={() => openProject(p.slug)}
                      className="text-left transition-[filter] duration-300 hover:brightness-125"
                      style={{ color: `hsl(${hue} 85% 68%)`, textShadow: `0 0 18px hsl(${hue} 80% 50% / 0.35)` }}
                    >
                      {p.title}
                    </button>
                  </h3>
                  <p className="mt-1.5 text-[14.5px] text-fg-muted">{p.tagline}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded bg-hover px-2 py-0.5 font-mono text-[11.5px] text-type">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center gap-4 pt-5 text-[13.5px]">
                    <button type="button" onClick={() => openProject(p.slug)} className="font-medium text-accent-fg hover:underline">
                      Details →
                    </button>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-fg-muted hover:text-fg-strong">
                        Website <ArrowUpRight />
                      </a>
                    )}
                  </div>
                </div>
              </Spotlight>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
