import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PixelStack, CropMarks } from "@/components/ui/PixelStack";
import { ButtonLink } from "@/components/ui/Button";
import { getResource, resourceSlugs, resources } from "@/content/resources";
import { site, socials } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "C'est envoye",
  // Une page de confirmation n'a aucune valeur SEO et ne doit jamais
  // apparaitre dans les resultats de recherche sans le formulaire qui precede.
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [...resourceSlugs, "newsletter"].map((slug) => ({ slug }));
}

/**
 * La page /merci est le deuxieme etage de la fusee. Le visiteur vient de
 * donner son email : c'est le moment ou il est le plus dispose a suivre les
 * comptes. C'est ici que se joue la conversion email vers abonne, donc
 * l'etape 2 occupe plus de place que le remerciement lui-meme.
 */
export default async function ThankYouPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  const others = resources.filter((item) => item.slug !== slug);

  const shareText = encodeURIComponent(
    "Je viens de recuperer des workflows n8n gratuits chez flow_lab."
  );
  const shareUrl = encodeURIComponent(site.url);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden="true" className="fl-grid absolute inset-0" />
        <PixelStack variant="descending" size={26} className="absolute left-4 top-8 hidden md:block" />
        <PixelStack variant="ascending" size={26} className="absolute bottom-8 right-4 hidden md:block" />

        <Container className="relative py-20 text-center lg:py-24">
          <Eyebrow center>Etape 1 sur 2 — termine</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            C&apos;est dans votre boite mail
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">
            {resource
              ? `Nous venons de vous envoyer « ${resource.title} ».`
              : "Nous venons de vous envoyer votre premier email."}{" "}
            Si vous ne le voyez pas d&apos;ici deux minutes, verifiez vos spams et
            marquez-nous comme expediteur fiable.
          </p>
        </Container>
      </section>

      {/* Etape 2 : la conversion qui compte vraiment pour nous. */}
      <Section>
        <div className="relative bg-[var(--color-ink)] p-8 text-[var(--color-text-inverted)] sm:p-12">
          <CropMarks />
          <Eyebrow inverted>Etape 2 sur 2</Eyebrow>
          <SectionTitle className="mt-4 max-w-2xl">
            Debloquez le bonus reserve aux abonnes
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-[var(--color-text-inverted-muted)]">
            Suivez-nous sur deux reseaux et recevez en plus notre workflow de veille
            automatisee, celui que nous ne publions nulle part ailleurs.
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
                  <span>
                    <span className="block font-display text-lg font-medium">{social.label}</span>
                    <span className="font-mono text-[0.68rem] text-[var(--color-text-inverted-muted)]">
                      {social.handle}
                    </span>
                  </span>
                  <span aria-hidden="true" className="size-2.5 shrink-0 bg-[var(--color-brand)]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-4">
            <Eyebrow>Faites tourner</Eyebrow>
            <SectionTitle>Un collegue qui perd du temps ?</SectionTitle>
            <p className="text-[var(--color-text-muted)]">
              Nos ressources sont gratuites et le resteront. Partager le lien est la
              seule chose que nous vous demandons en retour.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink
                href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                variant="ghost"
              >
                Partager sur X
              </ButtonLink>
              <ButtonLink
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                variant="ghost"
              >
                Partager sur LinkedIn
              </ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Eyebrow>Pendant que vous y etes</Eyebrow>
            <p className="text-[var(--color-text-muted)]">
              Les autres ressources sont aussi gratuites, et vous n&apos;aurez plus a
              redonner votre email.
            </p>
            <ul className="flex flex-col">
              {others.map((item) => (
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
        </div>
      </Section>
    </>
  );
}
