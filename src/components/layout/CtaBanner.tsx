import { Container } from "@/components/ui/Container";
import { PixelStack } from "@/components/ui/PixelStack";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Silhouette en escalier du bandeau final : une vallee symetrique.
 * Chaque valeur est la hauteur relative d'une colonne, alignee en bas.
 */
const SKYLINE = [1, 1, 0.72, 0.72, 0.45, 0.45, 0.45, 0.45, 0.72, 0.72, 1, 1];

/**
 * Bandeau d'appel a l'action, repris en bas de chaque page.
 * C'est le dernier filet : un visiteur arrive en bas de page sans avoir
 * converti doit encore trouver un chemin vers la collecte.
 */
export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg)] pt-20">
      <div aria-hidden="true" className="fl-grid absolute inset-0" />

      <Container className="relative">
        <SplitReveal
          as="h2"
          className="text-center font-display text-[clamp(2.5rem,8vw,6rem)] font-medium uppercase leading-[0.95] tracking-[-0.03em]"
        >
          Automatisons
          <br />
          votre business
        </SplitReveal>
        <p className="mx-auto mt-6 max-w-xl text-center text-[var(--color-text-muted)]">
          Recuperez nos workflows, suivez la formation, ou parlez-nous de vos process.
          Tout est gratuit.
        </p>
      </Container>

      {/* Silhouette en escalier : la signature graphique de la charte. */}
      <div aria-hidden="true" className="relative mt-16 h-[180px] sm:h-[240px]">
        <Reveal from="up" stagger={0.06} className="flex h-full items-end">
          {SKYLINE.map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-[var(--color-brand)]"
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </Reveal>

        <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-4">
          <span className="bg-[var(--color-ink)] px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-text-inverted)]">
            <span className="mr-2 inline-block size-1.5 bg-[var(--color-brand)] align-middle" />
            Automatisation n8n
          </span>
          <span className="bg-[var(--color-ink)] px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-text-inverted)]">
            <span className="mr-2 inline-block size-1.5 bg-[var(--color-brand)] align-middle" />
            Formation et conseil
          </span>
        </div>
      </div>

      <PixelStack
        variant="descending"
        size={22}
        className="absolute left-6 top-6 hidden md:block"
      />
    </section>
  );
}
