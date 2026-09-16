"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Deplacement lent au defilement. Sur le site de reference c'est ce qui donne
 * l'impression de profondeur : les decors bougent moins vite que le contenu.
 *
 * `speed` est la fraction de la hauteur parcourue pendant la traversee de
 * l'ecran. Au-dela de 0.3, l'effet devient voyant et fatigant.
 */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const { gsap } = setupGsap();

    const context = gsap.context(() => {
      gsap.to(element, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, element);

    return () => context.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
