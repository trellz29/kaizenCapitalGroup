import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | Kaizen Capital Group",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#E6EEF2] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0F1A28]">
          <span className="text-2xl font-black text-white">KCG</span>
        </div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#5A7188]">404 — Not Found</p>
        <h1 className="text-4xl font-bold text-[#0F1A28] md:text-5xl">This page doesn't exist.</h1>
        <p className="mt-4 text-lg text-[#2E4358]">The page you're looking for has moved, been removed, or never existed.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-full bg-[#0F1A28] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-[#1A2A3D]">Back to Homepage</Link>
          <Link href="/contact" className="rounded-full border border-[#2E4358]/40 bg-white/50 px-8 py-4 font-semibold text-[#0F1A28] transition hover:scale-105 hover:bg-white/75">Contact KCG →</Link>
        </div>
      </div>
    </main>
  );
}
