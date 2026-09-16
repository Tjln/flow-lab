import type { Metadata } from "next";
import { Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { CropMarks } from "@/components/ui/PixelStack";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Parlez-nous de la tache qui vous fait perdre le plus de temps. Reponse sous 48 heures.",
};

/* Le formulaire de contact vit dans la bande sombre du pied de page, presente
   sur tout le site. Cette page prepare l'echange plutot que de le dupliquer :
   elle dit quoi ecrire, sous quel delai on repond, et ce que nous ne faisons pas. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Parlons de vos process"
        intro="Decrivez-nous la tache qui vous coute le plus de temps. Nous repondons sous 48 heures avec une premiere piste d'automatisation."
        crumbs={[{ label: "Contact" }]}
      />

      <Section>
        <div className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          {[
            {
              title: "Par email",
              value: site.email,
              href: `mailto:${site.email}`,
              detail: "Le plus direct. Reponse sous 48 heures ouvrees.",
            },
            {
              title: "Par telephone",
              value: site.phone,
              href: `tel:${site.phone.replace(/\s/g, "")}`,
              detail: "Du lundi au vendredi, de 9 h a 18 h.",
            },
            {
              title: "Par le formulaire",
              value: "En bas de cette page",
              href: undefined,
              detail: "Utile si vous voulez detailler votre contexte.",
            },
          ].map((channel) => (
            <div key={channel.title} className="bg-[var(--color-surface)] p-8">
              <Eyebrow>{channel.title}</Eyebrow>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-4 block font-display text-xl font-medium transition-colors hover:text-[var(--color-brand)]"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-4 font-display text-xl font-medium">{channel.value}</p>
              )}
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{channel.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
            <CropMarks />
            <Eyebrow>Ce qui nous aide</Eyebrow>
            <SectionTitle as="h2" className="mt-4 text-2xl sm:text-2xl">
              Trois lignes suffisent
            </SectionTitle>
            <ul className="mt-6 flex flex-col">
              {[
                "La tache qui vous fait perdre le plus de temps aujourd'hui",
                "Les outils que vous utilisez deja au quotidien",
                "Le temps que cette tache vous coute chaque semaine, meme approximatif",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-[var(--color-border)] py-3.5 text-[var(--color-text-muted)] last:border-0"
                >
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[var(--color-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
            <CropMarks />
            <Eyebrow>A savoir</Eyebrow>
            <SectionTitle as="h2" className="mt-4 text-2xl sm:text-2xl">
              Ce que nous ne faisons pas
            </SectionTitle>
            <ul className="mt-6 flex flex-col">
              {[
                "Nous ne facturons rien : flow_lab est un projet etudiant",
                "Nous n'hebergeons pas vos workflows a votre place",
                "Nous ne revendons ni ne transmettons vos donnees",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-[var(--color-border)] py-3.5 text-[var(--color-text-muted)] last:border-0"
                >
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[var(--color-border-strong)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
