import type { Metadata } from "next";
import { Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { CropMarks } from "@/components/ui/PixelStack";
import { ButtonLink } from "@/components/ui/Button";
import { differentiators, manifesto, team } from "@/content/home";
import { metrics } from "@/config/site";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "flow_lab est un projet etudiant : deux personnes, une conviction, et des ressources n8n entierement gratuites.",
};

export default function AProposPage() {
  return (
    <>
      <PageHero
        title="Deux personnes, une conviction"
        intro="flow_lab est ne d'un constat simple : les petites structures perdent chaque semaine des heures que personne ne compte."
        crumbs={[{ label: "A propos" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Eyebrow>Notre conviction</Eyebrow>
          <SectionTitle className="max-w-4xl">{manifesto}</SectionTitle>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5">
            <Eyebrow>L&apos;histoire</Eyebrow>
            <SectionTitle>Pourquoi flow_lab existe</SectionTitle>
            <p className="text-[var(--color-text-muted)]">
              En accompagnant des freelances et des petites equipes, nous avons vu
              les memes scenes se repeter : un devis recopie a la main dans trois
              outils, une relance oubliee, un tableau de bord reconstruit chaque
              lundi matin. Jamais des taches difficiles, toujours des taches
              couteuses.
            </p>
            <p className="text-[var(--color-text-muted)]">
              L&apos;automatisation existe pourtant depuis longtemps. Ce qui manque
              n&apos;est pas l&apos;outil, c&apos;est quelqu&apos;un qui prenne le temps
              d&apos;expliquer par ou commencer, et qui laisse les cles plutot que de
              garder la main.
            </p>
            <p className="text-[var(--color-text-muted)]">
              flow_lab est un projet etudiant. Nous ne vendons rien, ce qui nous
              laisse libres de publier tout ce que nous apprenons.
            </p>
          </div>

          <div className="grid gap-px self-start border border-[var(--color-border)] bg-[var(--color-border)]">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-[var(--color-bg)] p-7">
                <p className="font-display text-4xl font-medium text-[var(--color-brand)]">
                  {metric.value}
                </p>
                <p className="mt-1.5 font-medium">{metric.label}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-4">
          <Eyebrow>L&apos;equipe</Eyebrow>
          <SectionTitle>Vous parlez a ceux qui construisent</SectionTitle>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {team.map((member) => (
            <article key={member.name} className="relative border border-[var(--color-border)] p-8">
              <CropMarks />
              <span aria-hidden="true" className="mb-6 block size-12 bg-[var(--color-brand)]" />
              <h3 className="font-display text-2xl font-medium">{member.name}</h3>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-brand)]">
                {member.role}
              </p>
              <p className="mt-4 text-[var(--color-text-muted)]">{member.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="subtle">
        <div className="flex flex-col gap-4">
          <Eyebrow>Nos principes</Eyebrow>
          <SectionTitle className="max-w-2xl">Ce sur quoi nous ne transigeons pas</SectionTitle>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-3 bg-[var(--color-ink)] p-7 text-[var(--color-text-inverted)]"
            >
              <span aria-hidden="true" className="size-3 bg-[var(--color-brand)]" />
              <h3 className="font-display text-xl font-medium">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-inverted-muted)]">{item.text}</p>
            </article>
          ))}
        </div>

        <ButtonLink href="/contact" withPip className="mt-12">
          Nous ecrire
        </ButtonLink>
      </Section>
    </>
  );
}
