import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Section } from "@/components/ui/Container";
import { PixelStack, CropMarks } from "@/components/ui/PixelStack";
import { LeadForm } from "@/components/lead/LeadForm";
import { getResource, resourceSlugs, resources } from "@/content/resources";

type Props = { params: Promise<{ slug: string }> };

/* Pages generees au build : chaque lead magnet a sa landing page statique,
   servie instantanement depuis le CDN Vercel. */
export function generateStaticParams() {
  return resourceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.hook,
    openGraph: { title: resource.title, description: resource.hook },
  };
}

export default async function ResourceLandingPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const others = resources.filter((item) => item.slug !== slug);

  return (
    <>
      {/* Landing page : pas de navigation parasite, une seule action possible. */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden="true" className="fl-grid absolute inset-0" />
        <PixelStack variant="descending" size={26} className="absolute left-4 top-8 hidden md:block" />

        <Container className="relative py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-6">
              <Eyebrow>{resource.format}</Eyebrow>
              <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                {resource.title}
              </h1>
              <p className="max-w-2xl text-lg text-[var(--color-text-muted)]">
                {resource.description}
              </p>

              <div className="mt-2">
                <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Ce que vous recevez
                </h2>
                <ul className="mt-4 flex flex-col">
                  {resource.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-b border-[var(--color-border)] py-3.5 last:border-0"
                    >
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[var(--color-brand)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Le formulaire suit le scroll : sur une landing page, chaque
                ecran parcouru sans appel a l'action est un lead perdu. */}
            <aside className="h-fit lg:sticky lg:top-32">
              <div className="relative border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
                <CropMarks />
                <Eyebrow>Gratuit</Eyebrow>
                <p className="mt-4 mb-6 font-display text-xl font-medium leading-snug">
                  Recevez-la tout de suite par email
                </p>
                <LeadForm
                  source={resource.slug}
                  tag={resource.n8nTag}
                  redirectTo={`/merci/${resource.slug}`}
                  submitLabel={resource.cta}
                  withFirstName
                />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <Section tone="surface">
        <Eyebrow>Les autres ressources</Eyebrow>
        <div className="mt-8 grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2">
          {others.map((item) => (
            <a
              key={item.slug}
              href={`/ressources/${item.slug}`}
              className="flex flex-col gap-2 bg-[var(--color-surface)] p-7 transition-colors hover:bg-[var(--color-bg)]"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {item.format}
              </span>
              <span className="font-display text-xl font-medium">{item.title}</span>
              <span className="text-sm text-[var(--color-text-muted)]">{item.hook}</span>
              <span className="mt-2 text-sm font-semibold text-[var(--color-brand)]">
                {item.cta} &rarr;
              </span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
