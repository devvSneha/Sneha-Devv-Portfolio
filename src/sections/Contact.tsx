"use client";

import { useState } from "react";
import { contact, site } from "@/data/portfolio";
import { Reveal } from "@/components/Effects";
import { ArrowUpRight, DownloadIcon, MailIcon, PhoneIcon } from "@/components/Icons";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — the email button still works
    }
  };

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-card/50 px-6 py-14 text-center sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 0%, var(--color-glow), transparent 70%)" }} />
          <div className="relative">
            <span className="flex items-center justify-center gap-2.5 text-accent-fg">
              <span className="h-px w-8 bg-accent-fg" />
              <span className="text-[14px] font-semibold tracking-[0.2em] uppercase">contact</span>
              <span className="h-px w-8 bg-accent-fg" />
            </span>
            <h2 className="balance mt-3 text-[32px] leading-tight font-bold tracking-tight text-fg-strong sm:text-[42px]">
              Let&apos;s build something <span className="text-accent-fg">together</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[16px] text-fg-muted">{contact.note}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={`mailto:${contact.email}`} className="flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-[15px] font-medium text-white hover:opacity-90">
                <MailIcon /> {contact.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className={`h-12 rounded-lg border px-4 text-[14px] font-medium ${copied ? "border-ok/50 text-ok" : "border-line-strong text-fg-strong hover:border-accent-fg hover:text-accent-fg"}`}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center gap-2 rounded-lg border border-line-strong px-5 text-[14px] font-medium text-fg-strong hover:border-accent-fg hover:text-accent-fg"
                >
                  <DownloadIcon /> Resume
                </a>
              )}
            </div>

            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                className="mt-4 flex items-center justify-center gap-1.5 text-[14.5px] text-fg-muted hover:text-fg-strong"
              >
                <PhoneIcon /> {contact.phone}
              </a>
            )}

            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {contact.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[14px] text-fg-muted transition-colors hover:border-accent-fg hover:text-fg-strong"
                  >
                    {l.label} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
