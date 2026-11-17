"use client";

import { useId, useState } from "react";

interface JoinDropProps {
  source: string;
  /** garment slug for per-piece notifications */
  piece?: string;
  size?: string;
  tone?: "light" | "dark";
  /** compact: single row; stacked: label above, used in hero */
  layout?: "row" | "stacked";
  cta?: string;
  placeholder?: string;
  successTitle?: string;
  successBody?: string;
  className?: string;
}

type State = { kind: "idle" } | { kind: "busy" } | { kind: "done"; duplicate: boolean } | { kind: "error"; message: string };

/**
 * The conversion unit. One field, one button, a drawn tick when it lands.
 */
export default function JoinDrop({
  source,
  piece,
  size,
  tone = "light",
  layout = "row",
  cta = "Join the drop",
  placeholder = "you@somewhere.in",
  successTitle = "You're on the list.",
  successBody = "The link lands in your inbox an hour before anyone else's.",
  className = "",
}: JoinDropProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const dark = tone === "dark";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    setState({ kind: "busy" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, piece, size, company: honeypot }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; duplicate?: boolean };
      if (!res.ok || !data.ok) {
        setState({ kind: "error", message: data.error ?? "Something broke. Try again." });
        return;
      }
      setState({ kind: "done", duplicate: Boolean(data.duplicate) });
    } catch {
      setState({ kind: "error", message: "No connection. Try again in a moment." });
    }
  }

  if (state.kind === "done") {
    return (
      <div role="status" aria-live="polite" className={`flex items-start gap-3 ${className}`}>
        <span
          className={`pop-in flex size-9 shrink-0 items-center justify-center rounded-full ${
            dark ? "bg-alabaster text-carbon" : "bg-carbon text-alabaster"
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path className="draw-check" d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <div>
          <p className="serif-note text-xl leading-tight">{state.duplicate ? "Already on it." : successTitle}</p>
          <p className={`mt-1 text-sm ${dark ? "text-alabaster/60" : "text-carbon-2"}`}>
            {state.duplicate ? "We had you down already. Nothing more to do." : successBody}
          </p>
        </div>
      </div>
    );
  }

  const field = `w-full bg-transparent px-5 py-3 text-sm focus:outline-none ${
    dark ? "text-alabaster placeholder:text-alabaster/40" : "text-carbon placeholder:text-steel-deep"
  }`;
  const shell = `flex overflow-hidden rounded-full border transition-colors ${
    dark ? "border-alabaster/25 focus-within:border-alabaster/70" : "hairline focus-within:border-carbon"
  }`;

  return (
    <form onSubmit={submit} className={className} noValidate>
      <label htmlFor={id} className={layout === "stacked" ? "label mb-3 block" : "sr-only"}>
        Email for the drop list
      </label>
      {/* honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={shell}>
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-invalid={state.kind === "error" || undefined}
          aria-describedby={state.kind === "error" ? `${id}-error` : undefined}
          className={field}
        />
        <button
          type="submit"
          disabled={state.kind === "busy"}
          className={`label shrink-0 px-5 transition-colors disabled:opacity-50 ${
            dark ? "text-alabaster hover:text-terracotta" : "text-carbon hover:text-terracotta"
          }`}
        >
          {state.kind === "busy" ? "…" : cta}
        </button>
      </div>
      {state.kind === "error" && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-medium text-terracotta">
          {state.message}
        </p>
      )}
    </form>
  );
}
