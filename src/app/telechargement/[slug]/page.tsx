import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PixelStack, CropMarks } from "@/components/ui/PixelStack";
import { ButtonLink } from "@/components/ui/Button";
import { getResource, resourceSlugs, resources } from "@/content/resources";
import { socials } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Votre ressource",
  // Cette page se rejoint depuis l'email, jamais depuis une recherche :
  // indexee seule, elle donnerait la ressource sans la collecte.
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return resourceSlugs.map((slug) => ({ slug }));
}

/**
 * Page d'arrivee depuis l'email de confirmation.
 *
 * Elle ne redemande pas l'adresse : la personne vient de la donner. Envoyer
 * un lien qui renvoie vers le formulaire deja rempli est la meilleure facon
 * de perdre la confiance gagnee a l'inscription.
 */
export default async function TelechargementPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const autres = resources.filter((item) => item.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden="true" className="fl-grid absolute inset-0" />
        <PixelStack variant="descending" size={26} className="absolute left-4 top-8 hidden md:block" />

        <Container className="relative py-20 lg:py-24">
          <div className="max-w-3xl">
            <Eyebrow>{resource.format}</Eyebrow>
            <SectionTitle as="h1" className="mt-5">
              {resource.title}
            </SectionTitle>
            <p className="mt-5 text-lg text-[var(--color-text-muted)]">
              Tout est a vous. Aucun compte a creer, aucune adresse a redonner.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        {resource.files.length > 0 ? (
          <div className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)]">
            {resource.files.map((file) => (
              <div
                key={file.path}
                className="flex flex-wrap items-center justify-between gap-5 bg-[var(--color-surface)] p-7"
              >
                <div className="min-w-[16rem] flex-1">
                  <p className="font-display text-xl font-medium">{file.label}</p>
                  <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
                    {file.description}
                  </p>
                </div>

                {/* Le telechargement passe par une route du site, qui compte
                    le passage avant de rediriger vers le fichier. */}
                <ButtonLink
                  href={`/api/telechargement?r=${resource.slug}&f=${encodeURIComponent(file.path)}`}
                  withPip
                >
                  Telecharger
                </ButtonLink>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
            <CropMarks />
            <Eyebrow>En preparation</Eyebrow>
            <SectionTitle as="h2" className="mt-4 text-2xl sm:text-2xl">
              Cette ressource arrive bientot
            </SectionTitle>
            <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">
              Vous etes inscrit : nous vous enverrons le fichier par email des
              qu&apos;il sera pret. Rien d&apos;autre a faire de votre cote.
            </p>
          </div>
        )}

        {/* Meme logique que la page de remerciement : le moment ou la personne
            recoit ce qu'elle attendait est le meilleur pour demander un suivi. */}
        <div className="relative mt-16 bg-[var(--color-ink)] p-8 text-[var(--color-text-inverted)] sm:p-12">
          <CropMarks />
          <Eyebrow inverted>Pour la suite</Eyebrow>
          <SectionTitle className="mt-4 max-w-2xl">
            On publie une trouvaille n8n chaque semaine
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-[var(--color-text-inverted-muted)]">
            Le plus simple pour ne rien rater est de nous suivre la ou vous
            passez deja du temps.
          </p>
          <ul className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between gap-4 bg-[var(--color-ink)] p-5 transition-colors hover:bg-[var(--color-ink-deep)]"
                >
                  <span className="font-display text-lg font-medium">{social.label}</span>
                  <span aria-hidden="true" className="size-2.5 shrink-0 bg-[var(--color-brand)]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <Eyebrow>Les autres ressources</Eyebrow>
          <ul className="mt-6 flex flex-col">
            {autres.map((item) => (
              <li key={item.slug} className="border-b border-[var(--color-border)] last:border-0">
                <Link
                  href={`/ressources/${item.slug}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-[var(--color-brand)]"
                >
                  <span className="font-medium">{item.title}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
