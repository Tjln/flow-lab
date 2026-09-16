import type { Metadata } from "next";
import { Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { CropMarks } from "@/components/ui/PixelStack";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/content/services";
import { steps } from "@/content/home";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audit de process, workflows n8n sur mesure, integrations, formation et supervision. Les huit domaines d'intervention de flow_lab.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Ce que nous construisons"
        intro="Huit domaines d'intervention, un seul objectif : que vos taches repetitives tournent sans vous."
        crumbs={[{ label: "Services" }]}
      />

      <Section>
        <div className="flex flex-col items-center gap-4 text-center">
          <Eyebrow center>Nos services</Eyebrow>
          <SectionTitle>De l&apos;audit a la supervision</SectionTitle>
        </div>

        {/* Grille numerotee : le grand chiffre en filigrane sert de reperage
            visuel, le contenu utile reste la liste de prestations. */}
        <Reveal
          stagger={0.07}
          className="mt-12 grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative flex flex-col bg-[var(--color-surface)] p-7 transition-colors hover:bg-[var(--color-bg)]"
            >
              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                <span aria-hidden="true" className="size-2 bg-[var(--color-brand)]" />
                {service.tag}
              </span>

              <span
                aria-hidden="true"
                className="my-5 font-display text-6xl font-medium leading-none text-[var(--color-border-strong)] transition-colors group-hover:text-[var(--color-brand)]"
              >
                {service.number}
              </span>

              <h2 className="font-display text-lg font-medium leading-snug">{service.title}</h2>

              <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-[var(--color-brand)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Eyebrow>Comment ca se passe</Eyebrow>
            <SectionTitle>Trois etapes, jamais plus</SectionTitle>
            <p className="text-[var(--color-text-muted)]">
              Nous ne vendons pas de forfait a rallonge. Un chantier commence par un
              chiffre, se termine par le meme chiffre mesure, et vous repartez avec
              les cles.
            </p>
            <ButtonLink href="/contact" withPip className="self-start">
              Parler de vos process
            </ButtonLink>
          </div>

          <ol className="flex flex-col">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex gap-6 border-b border-[var(--color-border)] py-7 first:border-t"
              >
                <span className="font-display text-3xl font-medium text-[var(--color-border-strong)]">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-[var(--color-text-muted)]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Rappel projet d'ecole : pas de prix, pas de vente. On l'assume dans
          le contenu plutot que de simuler une grille tarifaire. */}
      <Section>
        <div className="relative mx-auto max-w-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <CropMarks />
          <Eyebrow center>Tarifs</Eyebrow>
          <SectionTitle className="mt-4">Tout est gratuit</SectionTitle>
          <p className="mt-4 text-[var(--color-text-muted)]">
            flow_lab est un projet etudiant : nous ne facturons rien et ne vendons
            rien. Les ressources, les formations et les echanges sont offerts. En
            retour, nous vous demandons simplement votre email.
          </p>
          <ButtonLink href="/ressources" withPip className="mt-8">
            Voir les ressources
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
