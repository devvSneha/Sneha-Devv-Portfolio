import Image from "next/image";
import type { Project } from "@/data/portfolio";

/** Shared per-card accent hue — also used to colour the project title in Projects.tsx. */
export const hues = [210, 170, 280, 30, 330, 140];

/** Project screenshot, or a generated gradient cover when no image is set. */
export function ProjectCover({ project, index, priority }: { project: Project; index: number; priority?: boolean }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} screenshot`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  const hue = hues[index % hues.length];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
      style={{
        background: `radial-gradient(90% 100% at 10% 0%, hsl(${hue} 80% 55% / 0.55), transparent 60%), radial-gradient(80% 90% at 100% 100%, hsl(${hue + 60} 75% 50% / 0.4), transparent 60%), var(--color-card)`,
      }}
    >
      {project.logo ? (
        <div className="relative h-[52%] w-[68%]">
          <Image
            src={project.logo}
            alt={`${project.title} logo`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg object-contain shadow-xl ring-1 ring-white/10"
          />
        </div>
      ) : (
        <span className="font-mono text-[22px] font-semibold text-fg-strong/90">{`<${project.title.replace(/\s+/g, "")} />`}</span>
      )}
    </div>
  );
}
