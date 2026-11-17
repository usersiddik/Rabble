"use client";

/**
 * Re-mounts on every navigation, giving each page a soft entrance.
 * The class is removed once the animation ends: a filling transform animation
 * would otherwise act as a containing block for position:fixed descendants
 * (dialogs would anchor to the page instead of the viewport).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="page-in"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.remove("page-in");
      }}
    >
      {children}
    </div>
  );
}
