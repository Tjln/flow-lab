"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { setupGsap, prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Sens d'arrivee. "up" est le comportement par defaut du template. */
  from?: "up" | "left" | "right" | "scale";
  delay?: number;
  /** Decalage applique aux enfants directs, pour une arrivee en cascade. */
  stagger?: number;
};

const OFFSETS = {
  up: { y: 40 },
  left: { x: -40 },
  right: { x: 40 },
  scale: { scale: 0.94 },
} as const;

/**
 * Apparition au defilement, equivalent de WOW.js sur le site de reference
 * mais sans jQuery : un simple ScrollTrigger sur l'element ou ses enfants.
 *
 * Comme pour SplitReveal, le contenu est visible par defaut et n'est masque
 * que par l'effet, jamais par le rendu serveur.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  from = "up",
  delay = 0,
  stagger,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const { gsap } = setupGsap();

    const context = gsap.context(() => {
      const targets = stagger ? Array.from(element.children) : element;
      gsap.from(targets, {
        autoAlpha: 0,
        duration: 0.9,
        delay,
        ease: "power2.out",
        stagger: stagger ?? 0,
        ...OFFSETS[from],
        scrollTrigger: { trigger: element, start: "top 88%" },
      });
    }, element);

    return () => context.revert();
  }, [from, delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
