"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { setupGsap, prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "words" reproduit le skew-up des titres, "chars" l'apparition lettre a lettre. */
  mode?: "words" | "chars";
  delay?: number;
};

/**
 * L'animation signature du template de reference : le texte est decoupe en
 * mots, chaque mot remonte depuis sa ligne avec une legere inclinaison.
 *
 * Le texte est rendu normalement cote serveur et n'est masque qu'ici, dans un
 * effet : si le JavaScript ne s'execute pas, le titre reste lisible et
 * indexable. Une animation ne doit jamais pouvoir faire disparaitre du contenu.
 */
export function SplitReveal({
  children,
  as: Tag = "div",
  className = "",
  mode = "words",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const { gsap, SplitText } = setupGsap();
    const context = gsap.context(() => {}, element);
    let split: InstanceType<typeof SplitText> | null = null;
    let cancelled = false;

    const animate = () => {
      if (cancelled) return;

      context.add(() => {
        if (mode === "chars") {
          split = new SplitText(element, { type: "chars" });
          gsap.from(split.chars, {
            autoAlpha: 0,
            x: 50,
            duration: 0.5,
            delay,
            ease: "back.out(1)",
            stagger: { amount: 1 },
            scrollTrigger: { trigger: element, start: "top 85%" },
          });
          return;
        }

        // Le decoupage en lignes puis en mots permet au mot de remonter depuis
        // sa propre ligne, et non depuis le bas du bloc entier. Le debordement
        // masque sur la ligne est ce qui produit l'effet de rideau.
        split = new SplitText(element, {
          type: "lines,words",
          linesClass: "overflow-hidden",
        });
        gsap.from(split.words, {
          yPercent: 100,
          skewX: -5,
          duration: 1.2,
          delay,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: element, start: "top 85%" },
        });
      });
    };

    // Decouper le texte avant que la police finale soit appliquee produit des
    // lignes calculees sur la police de secours, donc des sauts de ligne faux.
    if (document.fonts?.status === "loaded") {
      animate();
    } else {
      document.fonts.ready.then(animate);
    }

    return () => {
      cancelled = true;
      split?.revert();
      context.revert();
    };
  }, [mode, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
