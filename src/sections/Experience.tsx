import { achievements, education, experience } from "@/data/portfolio";
import { Reveal, Spotlight } from "@/components/Effects";
import { ArrowUpRight } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading label="experience" title="Where I've worked" />

        <ol className="relative ml-1.5 space-y-6 border-l-2 border-line pl-8">
          {experience.map((r) => (
            <Reveal as="li" key={`${r.company}-${r.period}`} className="relative">
              <span className={`absolute top-6 -left-[41px] h-4 w-4 rounded-full border-4 border-editor ${r.current ? "bg-ok" : "bg-accent-fg"}`} />
              <Spotlight className="rounded-xl border border-line bg-card/50 p-5 transition-colors hover:border-accent-fg/50 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-[17px] font-semibold text-fg-strong">
                    {r.title} <span className="font-normal text-fg-muted">@ {r.company}</span>
                  </h3>
                  {r.current && <span className="rounded-full bg-ok/15 px-2 py-0.5 text-[11.5px] font-medium text-ok">Current</span>}
                </div>
                <p className="mt-1 font-mono text-[12.5px] text-fn">
                  {r.period} <span className="text-fg-dim">· {r.location}</span>
                </p>
                <ul className="mt-4 space-y-1.5">
                  {r.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[14.5px] text-fg">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-fg" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <li key={t} className="rounded bg-hover px-2 py-0.5 font-mono text-[11.5px] text-type">
                      {t}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </ol>

        <div className={`mt-12 grid gap-5 ${achievements.length ? "md:grid-cols-2" : ""}`}>
          <Reveal className="rounded-xl border border-line bg-card/50 p-6">
            <h3 className="font-mono text-[14px] text-fn">Education</h3>
            <ul className="mt-4 space-y-3">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="text-[15px] font-medium text-fg-strong">{e.degree}</p>
                  <p className="text-[13.5px] text-fg-muted">
                    {e.school} · <span className="font-mono text-[12.5px]">{e.period}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          {achievements.length > 0 && (
            <Reveal delay={0.05} className="rounded-xl border border-line bg-card/50 p-6">
              <h3 className="font-mono text-[14px] text-fn">Achievements</h3>
              <ul className="mt-4 space-y-2.5">
                {achievements.map((a) => (
                  <li key={a.text} className="flex gap-2.5 text-[14.5px] text-fg">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-type" />
                    {a.href ? (
                      <a href={a.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent-fg">
                        {a.text} <ArrowUpRight width={12} height={12} />
                      </a>
                    ) : (
                      a.text
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
