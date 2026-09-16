"use client";

import { useEffect, useRef } from "react";
import { setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Curseur personnalise : un carre orange qui suit la souris avec un leger
 * retard, et grossit au survol des elements cliquables.
 *
 * Il ne remplace pas le curseur systeme sur les appareils tactiles ni au
 * clavier : on ne l'active que si un vrai pointeur precis est detecte.
 */
export function MagicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer || prefersReducedMotion()) return;

    const { gsap } = setupGsap();
    gsap.set(dot, { opacity: 1 });

    // quickTo evite de creer une tween a chaque mouvement de souris.
    const moveX = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });

    const onMove = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);

      const overInteractive = (event.target as HTMLElement)?.closest(
        "a, button, input, textarea, summary, [role='button']"
      );
      gsap.to(dot, {
        scale: overInteractive ? 2.6 : 1,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => gsap.to(dot, { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to(dot, { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] size-2.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-brand)] opacity-0 mix-blend-difference max-[1024px]:hidden"
    />
  );
}
