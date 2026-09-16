"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Enregistre les plugins une seule fois, cote navigateur.
 * Les composants d'animation appellent ceci avant toute timeline.
 */
export function setupGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

/**
 * Respecte le reglage systeme « reduire les animations ».
 * Toutes nos animations sont decoratives : quand ce reglage est actif, on
 * n'anime pas du tout plutot que d'animer plus lentement.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
