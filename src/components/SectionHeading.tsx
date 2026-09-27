import { Reveal } from "./Effects";

/** `// label` comment line + clear title, used at the top of every section. */
export function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-10">
      <span className="flex items-center gap-2.5 text-accent-fg">
        <span className="h-px w-8 bg-accent-fg" />
        <span className="text-[14px] font-semibold tracking-[0.2em] uppercase">{label}</span>
      </span>
      <h2 className="mt-3 text-[30px] leading-tight font-semibold tracking-tight text-fg-strong sm:text-[34px]">{title}</h2>
      {subtitle && <p className="mt-2 max-w-[60ch] text-[15.5px] text-fg-muted">{subtitle}</p>}
    </Reveal>
  );
}
