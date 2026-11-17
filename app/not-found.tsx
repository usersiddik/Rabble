import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-studio min-h-[60svh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">404</p>
      <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
        This piece is off the rack.
      </h1>
      <p className="mt-3 text-[13px] text-neutral-600">
        One-run prints sell through. The page you&apos;re after isn&apos;t here.
      </p>
      <Link
        href="/"
        className="mt-8 border border-neutral-400 rounded-full px-7 py-2.5 text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors"
      >
        Back to the Rack
      </Link>
    </section>
  );
}
