import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PixelStack } from "@/components/ui/PixelStack";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Parallax } from "@/components/motion/Parallax";

type Crumb = { label: string; href?: string };

/**
 * En-tete commun a toutes les pages internes : grand titre centre, fil
 * d'Ariane et decorations pixel dans les angles, comme sur la maquette.
 */
export function PageHero({
  title,
  intro,
  crumbs = [],
}: {
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div aria-hidden="true" className="fl-grid absolute inset-0" />
      <Parallax speed={0.3} className="absolute left-4 top-6 hidden md:block">
        <PixelStack variant="descending" size={26} />
      </Parallax>
      <Parallax speed={-0.25} className="absolute bottom-6 right-4 hidden md:block">
        <PixelStack variant="ascending" size={26} />
      </Parallax>

      <Container className="relative py-20 text-center lg:py-24">
        <SplitReveal
          as="h1"
          className="font-display text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1] tracking-[-0.03em]"
        >
          {title}
        </SplitReveal>

        {intro && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">{intro}</p>
        )}

        <nav aria-label="Fil d'Ariane" className="mt-6">
          <ol className="flex flex-wrap items-center justify-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            <li>
              <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">
                Accueil
              </Link>
            </li>
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {crumb.href && index < crumbs.length - 1 ? (
                  <Link href={crumb.href} className="transition-colors hover:text-[var(--color-brand)]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-[var(--color-text)]">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
