"use client";

import { useEffect } from "react";
import { setupGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Recalcule les points de declenchement une fois les polices et les images
 * chargees.
 *
 * Sans cela, les positions sont mesurees avec la police de secours : la page
 * change de hauteur ensuite, et certaines sections peuvent se retrouver deja
 * depassees sans que leur animation se soit jouee, donc invisibles.
 */
export function MotionProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { ScrollTrigger } = setupGsap();
    const refresh = () => ScrollTrigger.refresh();

    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}
