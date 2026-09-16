import { Container, Eyebrow } from "@/components/ui/Container";
import { LeadForm } from "@/components/lead/LeadForm";
import { site, socials } from "@/config/site";

/**
 * Bande de contact sombre, reprise en bas de chaque page.
 * Elle porte le dernier formulaire du parcours : celui des visiteurs
 * qui veulent parler a quelqu'un plutot que telecharger une ressource.
 */
export function ContactBand() {
  return (
    <section className="bg-[var(--color-ink)] py-20 text-[var(--color-text-inverted)]">
      <Container className="grid gap-14 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow inverted>Contact</Eyebrow>
            <a
              href={`mailto:${site.email}`}
              className="font-display text-3xl font-medium transition-colors hover:text-[var(--color-brand)] sm:text-4xl"
            >
              {site.email}
            </a>
            <p className="font-display text-2xl text-[var(--color-text-inverted-muted)] sm:text-3xl">
              {site.phone}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Eyebrow inverted>Nous suivre</Eyebrow>
            <ul className="flex flex-col gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-baseline gap-3 transition-colors hover:text-[var(--color-brand)]"
                  >
                    <span className="font-medium">{social.label}</span>
                    <span className="font-mono text-xs text-[var(--color-text-inverted-muted)]">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-l border-white/10 lg:pl-14">
          <Eyebrow inverted>Un projet d&apos;automatisation</Eyebrow>
          <p className="mt-4 mb-6 text-[var(--color-text-inverted-muted)]">
            Decrivez-nous la tache qui vous fait perdre le plus de temps. On vous
            repond sous 48 heures avec une premiere piste.
          </p>
          <LeadForm
            source="contact-band"
            tag="contact"
            submitLabel="Envoyer le message"
            withFirstName
            withMessage
            inverted
            reassurance="Vos donnees servent uniquement a vous repondre."
          />
        </div>
      </Container>
    </section>
  );
}
