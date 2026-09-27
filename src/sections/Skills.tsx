import { skills } from "@/data/portfolio";
import { Reveal, Spotlight } from "@/components/Effects";
import { SectionHeading } from "@/components/SectionHeading";

/** Accent colour per group/item, taken from the syntax palette. */
const accents = ["text-kw", "text-type", "text-fn", "text-str", "text-ctrl", "text-var", "text-num", "text-comment"];

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading label="skills" title="What I work with" />
        <div className={`grid gap-4 ${skills.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4" : ""}`}>
          {skills.map((g, i) => (
            <Reveal key={g.label} delay={0.05 * i} className={skills.length === 1 ? "sm:col-span-2 lg:col-span-4" : ""}>
              <Spotlight className="h-full rounded-xl border border-accent-fg/50 bg-card/50 p-5 transition-colors hover:border-accent-fg">
                <h3 className={`font-mono text-[14px] font-medium ${accents[i % accents.length]}`}>{g.label}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((s, si) => (
                    <li key={s} className={`rounded-md bg-hover px-2.5 py-1 text-[13px] font-medium ${accents[si % accents.length]}`}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
