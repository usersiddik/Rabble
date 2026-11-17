"use client";

import { useEffect, useState } from "react";

interface DropCountdownProps {
  /** ISO date */
  target: string;
  tone?: "light" | "dark";
  className?: string;
}

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Days / hours / minutes / seconds to a drop. Renders dashes until hydrated so
 * server and client never disagree about the time.
 */
export default function DropCountdown({ target, tone = "light", className = "" }: DropCountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // deliberate: the clock only exists on the client
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now === null ? null : parts(new Date(target).getTime() - now);
  const open = remaining !== null && remaining.days + remaining.hours + remaining.minutes + remaining.seconds === 0;
  const cells = [
    ["days", remaining?.days],
    ["hours", remaining?.hours],
    ["min", remaining?.minutes],
    ["sec", remaining?.seconds],
  ] as const;

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={open ? "The drop is open" : remaining ? `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes to the drop` : "Counting down to the drop"}
      className={`grid grid-cols-4 gap-px overflow-hidden rounded-md ${tone === "dark" ? "bg-alabaster/15" : "bg-carbon/10"} ${className}`}
    >
      {cells.map(([label, value]) => (
        <div key={label} className={`px-3 py-4 text-center sm:py-6 ${tone === "dark" ? "bg-carbon" : "bg-alabaster"}`}>
          <p className="display tabular text-3xl sm:text-5xl md:text-6xl">
            {value === undefined ? "––" : String(value).padStart(2, "0")}
          </p>
          <p className={`micro mt-2 ${tone === "dark" ? "text-alabaster/50" : "text-steel-deep"}`}>{label}</p>
        </div>
      ))}
    </div>
  );
}
