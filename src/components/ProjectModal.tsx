"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { projects } from "@/data/portfolio";
import { ArrowUpRight, CloseIcon } from "./Icons";
import { ProjectCover } from "./ProjectCover";
import { useUI } from "./UIProvider";

/** Converts a YouTube watch/short link into an embeddable URL. */
function embedUrl(url: string) {
  const id = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/** Project details popup (Esc closes, ←/→ switch projects). */
export function ProjectModal() {
  const { openSlug, openProject } = useUI();
  const index = projects.findIndex((p) => p.slug === openSlug);
  const project = index >= 0 ? projects[index] : null;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") openProject(null);
      if (e.key === "ArrowRight") openProject(projects[(index + 1) % projects.length].slug);
      if (e.key === "ArrowLeft") openProject(projects[(index - 1 + projects.length) % projects.length].slug);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [project, index, openProject]);

  const video = project?.videoUrl ? embedUrl(project.videoUrl) : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && openProject(null)}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl border border-line-strong bg-side outline-none sm:rounded-xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={() => openProject(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
            >
              <CloseIcon />
            </button>
            <div className="overflow-y-auto">
              <div className="relative aspect-video w-full overflow-hidden">
                {video ? (
                  <iframe
                    src={video}
                    title={`${project.title} demo`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <ProjectCover project={project} index={index} />
                )}
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <h3 className="text-[24px] font-semibold text-fg-strong">{project.title}</h3>
                  <p className="mt-1 text-[15px] text-accent-fg">{project.tagline}</p>
                </div>
                <p className="text-[15px] leading-relaxed text-fg">{project.description}</p>
                {project.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-[14.5px] text-fg">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-type" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <li key={t} className="rounded bg-hover px-2 py-0.5 font-mono text-[12px] text-type">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-1">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-1.5 rounded-lg bg-accent px-4 text-[14px] font-medium text-white hover:opacity-90">
                      Visit website <ArrowUpRight />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {projects.length > 1 && (
              <div className="flex items-center justify-between border-t border-line px-6 py-3 text-[13px] text-fg-muted">
                <button type="button" onClick={() => openProject(projects[(index - 1 + projects.length) % projects.length].slug)} className="hover:text-fg-strong">
                  ← Previous
                </button>
                <span className="font-mono text-[12px]">
                  {index + 1} / {projects.length}
                </span>
                <button type="button" onClick={() => openProject(projects[(index + 1) % projects.length].slug)} className="hover:text-fg-strong">
                  Next →
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
