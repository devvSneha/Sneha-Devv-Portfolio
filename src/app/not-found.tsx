import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="text-brand font-mono text-[80px] leading-none font-bold">404</p>
      <h1 className="text-[22px] font-semibold text-fg-strong">This page doesn&apos;t exist.</h1>
      <Link href="/" className="rounded bg-accent px-5 py-2.5 text-[14px] font-medium text-white hover:opacity-90">
        Back home
      </Link>
    </main>
  );
}
