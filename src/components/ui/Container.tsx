import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

type SectionProps = {
  children: ReactNode;
  /** Fond alternatif, pour rythmer la succession des sections. */
  tone?: "default" | "surface" | "subtle" | "ink";
  className?: string;
  id?: string;
};

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-[var(--color-bg)]",
  surface: "bg-[var(--color-surface)]",
  subtle: "bg-[var(--color-bg-subtle)]",
  ink: "bg-[var(--color-ink)] text-[var(--color-text-inverted)]",
};

export function Section({ children, tone = "default", className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-[var(--space-section)] ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Intitule de section : petit carre orange + texte capitale espace.
 * Present au-dessus de chaque titre dans la maquette.
 */
export function Eyebrow({
  children,
  inverted = false,
  center = false,
}: {
  children: ReactNode;
  inverted?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] ${
        center ? "justify-center" : ""
      } ${inverted ? "text-[var(--color-text-inverted-muted)]" : "text-[var(--color-text-muted)]"}`}
    >
      <span aria-hidden="true" className="size-2 bg-[var(--color-brand)]" />
      {children}
    </p>
  );
}

/**
 * Titre de section, dans la typo display de la charte.
 * L'animation mot a mot est portee ici : tous les titres du site en heritent
 * sans avoir a y penser page par page.
 */
export function SectionTitle({
  children,
  className = "",
  as = "h2",
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  animate?: boolean;
}) {
  const classes = `font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] ${className}`;

  if (!animate) {
    const Tag = as;
    return <Tag className={classes}>{children}</Tag>;
  }

  return (
    <SplitReveal as={as} className={classes}>
      {children}
    </SplitReveal>
  );
}
