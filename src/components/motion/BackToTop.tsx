"use client";

import { useEffect, useState } from "react";

/**
 * Bouton de retour en haut, avec anneau de progression de lecture.
 * L'anneau est un cercle SVG dont on fait varier le trait : pas d'image,
 * pas de dependance, et il reste net a toutes les tailles.
 */
export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(ratio, 1));
      setVisible(window.scrollY > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className={`fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-text-inverted)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="sr-only">Revenir en haut de la page</span>

      <svg aria-hidden="true" className="absolute inset-0 size-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>

      <span aria-hidden="true" className="relative text-sm">
        &uarr;
      </span>
    </button>
  );
}
