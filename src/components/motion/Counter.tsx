"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Compteur qui s'incremente lorsqu'il entre dans l'ecran, comme l'odometre
 * du site de reference.
 *
 * La valeur finale est ecrite dans le HTML rendu cote serveur et n'est
 * remplacee qu'au moment ou l'animation demarre : sans JavaScript, ou avant
 * le declenchement, le visiteur lit toujours le bon chiffre.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1500;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Decelaration : rapide au debut, puis le chiffre se pose.
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = `${prefix}${Math.round(eased * value)}${suffix}`;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
