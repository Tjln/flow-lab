import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBlock, LegalList } from "@/components/layout/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Informations legales relatives au site flow_lab.",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero title="Mentions legales" crumbs={[{ label: "Mentions legales" }]} />

      <Section>
        <Container className="max-w-3xl px-0 sm:px-0">
          <p className="pb-8 text-[var(--color-text-muted)]">
            flow_lab est un projet realise dans un cadre pedagogique. Aucun bien ni
            service n&apos;y est vendu. Les mentions ci-dessous doivent etre completees
            avec les informations reelles de l&apos;etablissement avant toute mise en
            ligne publique durable.
          </p>

          <LegalBlock title="Editeur du site">
            <LegalList
              items={[
                "Denomination : flow_lab, projet etudiant",
                "Responsables de la publication : Timothe Jaulneau et Reda Loutfi",
                `Contact : ${site.email}`,
                "Etablissement de rattachement : a completer",
              ]}
            />
          </LegalBlock>

          <LegalBlock title="Hebergement">
            <p>
              Le site est heberge par Vercel Inc., 440 N Barranca Ave #4133, Covina,
              CA 91723, Etats-Unis.
            </p>
          </LegalBlock>

          <LegalBlock title="Propriete intellectuelle">
            <p>
              Les textes, l&apos;identite visuelle et les workflows publies sur ce site
              sont la propriete de leurs auteurs. Les ressources telechargeables
              peuvent etre utilisees et modifiees librement dans un cadre
              professionnel ou personnel, mais ne peuvent pas etre revendues en
              l&apos;etat.
            </p>
            <p>
              Les marques et logos des outils cites, notamment n8n, appartiennent a
              leurs detenteurs respectifs et ne sont mentionnes qu&apos;a titre
              descriptif.
            </p>
          </LegalBlock>

          <LegalBlock title="Donnees personnelles">
            <p>
              Le traitement des adresses email collectees par les formulaires est
              decrit dans notre politique de confidentialite.
            </p>
          </LegalBlock>

          <LegalBlock title="Limitation de responsabilite">
            <p>
              Les contenus et workflows sont fournis a titre informatif et sans
              garantie. Il vous appartient de les tester sur des donnees non
              sensibles avant toute mise en production.
            </p>
          </LegalBlock>
        </Container>
      </Section>
    </>
  );
}
