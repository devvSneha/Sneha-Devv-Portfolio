import type { HeroPart } from "@/data/portfolio";

const tone = { accent: "text-accent-fg", accent2: "text-type" } as const;

/** Renders text parts, colouring the highlighted ones. */
export function Highlight({ parts }: { parts: HeroPart[] }) {
  return parts.map((p, i) =>
    p.tone ? (
      <span key={i} className={tone[p.tone]}>
        {p.text}
      </span>
    ) : (
      <span key={i}>{p.text}</span>
    ),
  );
}
