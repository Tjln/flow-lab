import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "ink" | "brand" | "ghost" | "inverted";

const VARIANTS: Record<Variant, string> = {
  ink: "bg-[var(--color-ink)] text-[var(--color-text-inverted)] hover:bg-[var(--color-ink-deep)]",
  brand: "bg-[var(--color-brand)] text-[#ffffff] hover:bg-[var(--color-brand-hover)]",
  ghost:
    "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] shadow-[0_2px_10px_rgba(25,25,25,0.06)] hover:border-[var(--color-brand)]",
  inverted:
    "bg-[var(--color-bg)] text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60";

/**
 * Certains boutons de la maquette portent un carre orange en tete, repris
 * du motif pixel. On le genere ici plutot que de l'ajouter a chaque appel.
 */
function Pip() {
  return <span aria-hidden="true" className="size-2 shrink-0 bg-[var(--color-brand)]" />;
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  withPip?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "ink", withPip = false, className = "" }: Props) {
  const external = href.startsWith("http");
  const content = (
    <>
      {withPip && <Pip />}
      {children}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${BASE} ${VARIANTS[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {content}
    </Link>
  );
}

export const buttonClass = (variant: Variant = "ink") => `${BASE} ${VARIANTS[variant]}`;
