import Link from "next/link";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PixelStack, CropMarks } from "@/components/ui/PixelStack";
import { ButtonLink } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Accordion } from "@/components/ui/Accordion";
import { LeadForm } from "@/components/lead/LeadForm";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Counter } from "@/components/motion/Counter";
import { Parallax } from "@/components/motion/Parallax";
import { resources } from "@/content/resources";
import { differentiators, faq, manifesto, steps, team, tools } from "@/content/home";
import { metrics, site } from "@/config/site";

export default function HomePage() {
  const featured = resources.find((r) => r.featured) ?? resources[0];

  return (
    <>
      {/* ----------------------------------------------------------------
          Hero : la promesse et le formulaire dans le meme ecran. Un visiteur
          qui doit scroller pour trouver ou laisser son email est deja perdu.
          ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden="true" className="fl-grid absolute inset-0" />
        <Parallax speed={0.25} className="absolute left-4 top-10 hidden md:block">
          <PixelStack variant="descending" size={30} />
        </Parallax>
        <Parallax speed={-0.2} className="absolute bottom-10 right-4 hidden md:block">
          <PixelStack variant="ascending" size={30} />
        </Parallax>

        <Container className="relative py-24 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col gap-6">
              <Eyebrow>Agence d&apos;automatisation n8n</Eyebrow>
              <SplitReveal
                as="h1"
                className="font-display text-[clamp(2.75rem,6.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.03em]"
              >
                {site.tagline}
              </SplitReveal>
              <p className="max-w-xl text-lg text-[var(--color-text-muted)]">
                Nous formons les freelances, les TPE et les equipes ops a n8n, et nous
                construisons les workflows qui leur rendent leurs heures.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/ressources" withPip>
                  Ressources gratuites
                </ButtonLink>
                <ButtonLink href="/formations" variant="ghost">
                  Voir les formations
                </ButtonLink>
              </div>
            </div>

            <div className="relative border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
              <CropMarks />
              <Eyebrow>{featured.format}</Eyebrow>
              <p className="mt-4 font-display text-2xl font-medium leading-tight">
                {featured.title}
              </p>
              <p className="mt-2 mb-6 text-sm text-[var(--color-text-muted)]">{featured.hook}</p>
              <LeadForm
                source="home-hero"
                tag={featured.n8nTag}
                redirectTo={`/merci/${featured.slug}`}
                submitLabel={featured.cta}
                reassurance="Gratuit. Pas de spam. Desinscription en un clic."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Manifeste : une seule phrase, en tres gros. */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Eyebrow>Notre conviction</Eyebrow>
          <SectionTitle className="max-w-4xl">{manifesto}</SectionTitle>
        </div>
      </Section>

      {/* Chiffres : objectifs affiches, pas resultats inventes. */}
      <Section>
        <Reveal
          stagger={0.12}
          className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-[var(--color-bg)] p-8">
              <p className="font-display text-5xl font-medium text-[var(--color-brand)]">
                <Counter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-2 font-medium">{metric.label}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{metric.detail}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Bandeau des outils connectes : credibilite en un coup d'oeil. */}
      <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-7">
        <Marquee durationSeconds={38}>
          {tools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-4 whitespace-nowrap px-8 font-display text-xl text-[var(--color-text-muted)]"
            >
              {tool}
              <span aria-hidden="true" className="size-1.5 bg-[var(--color-brand)]" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Methode en trois temps. */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Eyebrow>Notre methode</Eyebrow>
            <SectionTitle>Former, construire, transmettre</SectionTitle>
            <p className="text-[var(--color-text-muted)]">
              Nous ne livrons pas une boite noire. Chaque mission se termine quand
              vous savez faire tourner et modifier ce que nous avons construit.
            </p>
            <ButtonLink href="/services" withPip className="self-start">
              Decouvrir nos services
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

      {/* Differenciateurs, sur cartes sombres comme sur le wireframe. */}
      <Section tone="subtle">
        <div className="flex flex-col gap-4">
          <Eyebrow>Pourquoi flow_lab</Eyebrow>
          <SectionTitle className="max-w-2xl">
            Ce qui nous distingue d&apos;une agence classique
          </SectionTitle>
        </div>

        <Reveal stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        </Reveal>
      </Section>

      {/* Bibliotheque de ressources : le coeur de la collecte. */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>Ressources gratuites</Eyebrow>
            <SectionTitle className="max-w-2xl">
              Reparez un process avant la fin de la journee
            </SectionTitle>
          </div>
          <ButtonLink href="/ressources" variant="ghost">
            Voir la bibliotheque
          </ButtonLink>
        </div>

        <Reveal stagger={0.12} className="mt-12 grid gap-5 md:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.slug}
              href={`/ressources/${resource.slug}`}
              className="group relative flex flex-col gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-colors hover:border-[var(--color-brand)]"
            >
              <CropMarks />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {resource.format}
              </span>
              <h3 className="font-display text-xl font-medium leading-snug">{resource.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{resource.hook}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-[var(--color-brand)]">
                {resource.cta} &rarr;
              </span>
            </Link>
          ))}
        </Reveal>
      </Section>

      {/* Equipe : deux personnes, on l'assume plutot que de le masquer. */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <Eyebrow>L&apos;equipe</Eyebrow>
            <SectionTitle>Deux personnes, aucun intermediaire</SectionTitle>
            <p className="text-[var(--color-text-muted)]">
              Vous parlez directement a ceux qui construisent. C&apos;est la seule
              raison pour laquelle nous pouvons repondre en 48 heures.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {team.map((member) => (
              <article key={member.name} className="relative border border-[var(--color-border)] p-7">
                <CropMarks />
                <span aria-hidden="true" className="mb-5 block size-10 bg-[var(--color-brand)]" />
                <h3 className="font-display text-xl font-medium">{member.name}</h3>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-brand)]">
                  {member.role}
                </p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">{member.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ : traite les objections avant qu'elles bloquent la conversion. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <Eyebrow center>Questions frequentes</Eyebrow>
            <SectionTitle>Avant de vous lancer</SectionTitle>
          </div>
          <div className="mt-10">
            <Accordion items={faq} />
          </div>
        </div>
      </Section>
    </>
  );
}
