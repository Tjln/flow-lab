import type { Metadata } from "next";
import { Eyebrow, Section, SectionTitle } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { CropMarks } from "@/components/ui/PixelStack";
import { LeadForm } from "@/components/lead/LeadForm";
import { courses } from "@/content/courses";

export const metadata: Metadata = {
  title: "Formations",
  description:
    "Trois parcours pour devenir autonome sur n8n, du premier workflow a l'industrialisation en equipe. Gratuit.",
};

export default function FormationsPage() {
  return (
    <>
      <PageHero
        title="Devenez autonome sur n8n"
        intro="Trois parcours, du premier workflow a l'instance partagee par toute une equipe."
        crumbs={[{ label: "Formations" }]}
      />

      <Section>
        <div className="flex flex-col gap-16">
          {courses.map((course, index) => (
            <article
              key={course.slug}
              className="grid gap-10 border-t border-[var(--color-border)] pt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-3xl font-medium text-[var(--color-border-strong)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="bg-[var(--color-ink)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-inverted)]">
                    {course.level}
                  </span>
                  {!course.available && (
                    <span className="border border-[var(--color-border-strong)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Ouverture prochaine
                    </span>
                  )}
                </div>

                <SectionTitle as="h2">{course.title}</SectionTitle>
                <p className="max-w-2xl text-lg text-[var(--color-text-muted)]">{course.hook}</p>

                <dl className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
                  {[
                    { term: "Duree", value: course.duration },
                    { term: "Format", value: course.format },
                    { term: "Pour qui", value: course.audience },
                  ].map((row) => (
                    <div key={row.term} className="bg-[var(--color-bg)] p-4">
                      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        {row.term}
                      </dt>
                      <dd className="mt-1.5 text-sm">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Au programme
                  </h3>
                  <ul className="mt-4 flex flex-col">
                    {course.modules.map((module) => (
                      <li
                        key={module}
                        className="flex gap-3 border-b border-[var(--color-border)] py-3 text-[var(--color-text-muted)] last:border-0"
                      >
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[var(--color-brand)]" />
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="border-l-2 border-[var(--color-brand)] py-2 pl-4">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    A la fin
                  </span>
                  <br />
                  {course.outcome}
                </p>
              </div>

              {/* Le formulaire accompagne chaque parcours : un visiteur convaincu
                  par une formation ne doit pas avoir a chercher ou s'inscrire. */}
              <aside className="h-fit lg:sticky lg:top-32">
                <div className="relative border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
                  <CropMarks />
                  <Eyebrow>{course.available ? "Acces immediat" : "Liste d'attente"}</Eyebrow>
                  <p className="mt-4 mb-6 text-sm text-[var(--color-text-muted)]">
                    {course.available
                      ? "Laissez votre email, la premiere lecon part dans la foulee."
                      : "Laissez votre email, vous serez prevenu en premier a l'ouverture."}
                  </p>
                  <LeadForm
                    source={`formation-${course.slug}`}
                    tag={course.n8nTag}
                    redirectTo={course.available ? "/merci/mini-formation-n8n" : undefined}
                    submitLabel={course.cta}
                    withFirstName
                    reassurance="Gratuit. Desinscription en un clic."
                  />
                </div>
              </aside>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
