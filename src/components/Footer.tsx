import { site } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-line bg-side">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-7 text-[13px] text-fg-dim sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.fullName}.
        </p>
        <a href="#about" className="hover:text-fg-strong">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
