import Link from "next/link";
import type { Metadata } from "next";
import { Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { CropMarks } from "@/components/ui/PixelStack";
import { LeadForm } from "@/components/lead/LeadForm";
import { Reveal } from "@/components/motion/Reveal";
import { resources } from "@/content/resources";

export const metadata: Metadata = {
  title: "Ressources gratuites",
  description:
    "Workflows n8n prets a l'emploi, guide d'automatisation et mini-formation par email. Tout est gratuit.",
};

export default function RessourcesPage() {
  return (
    <>
      <PageHero
        title="La bibliotheque flow_lab"
        intro="Des ressources concretes pour automatiser votre business. Choisissez celle qui correspond a votre niveau, on vous l'envoie par email."
        crumbs={[{ label: "Ressources" }]}
      />

      <Section>
        <Reveal
          stagger={0.12}
          className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3"
        >
          {resources.map((resource, index) => (
            <Link
              key={resource.slug}
              href={`/ressources/${resource.slug}`}
              className="group flex flex-col bg-[var(--color-surface)] p-8 transition-colors hover:bg-[var(--color-bg)]"
            >
              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                <span aria-hidden="true" className="size-2 bg-[var(--color-brand)]" />
                {resource.format}
              </span>

              <span
                aria-hidden="true"
                className="my-6 font-display text-6xl font-medium leading-none text-[var(--color-border-strong)] transition-colors group-hover:text-[var(--color-brand)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h2 className="font-display text-xl font-medium leading-snug">{resource.title}</h2>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{resource.hook}</p>

              <ul className="mt-5 flex flex-col gap-2 border-t border-[var(--color-border)] pt-5">
                {resource.deliverables.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-[var(--color-brand)]" />
                    {item}
                  </li>
                ))}
              </ul>

              <span className="mt-auto pt-6 text-sm font-semibold text-[var(--color-brand)]">
                {resource.cta} &rarr;
              </span>
            </Link>
          ))}
        </Reveal>
      </Section>

      {/* Dernier filet pour les indecis : la newsletter demande moins
          d'engagement que le choix d'une ressource precise. */}
      <Section tone="surface">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4 border border-[var(--color-border)] bg-[var(--color-bg)] p-10 text-center">
          <CropMarks />
          <Eyebrow center>Chaque semaine</Eyebrow>
          <SectionTitle>Un workflow utile dans votre boite mail</SectionTitle>
          <p className="text-[var(--color-text-muted)]">
            Pas encore decide ? Recevez simplement notre trouvaille n8n de la semaine,
            avec le fichier a importer.
          </p>
          <div className="mt-2 w-full max-w-md text-left">
            <LeadForm source="ressources-newsletter" tag="newsletter" submitLabel="Je m'abonne" />
          </div>
        </div>
      </Section>
    </>
  );
}
