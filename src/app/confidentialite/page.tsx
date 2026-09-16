import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBlock, LegalList } from "@/components/layout/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description: "Comment flow_lab collecte, utilise et protege vos donnees personnelles.",
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        title="Confidentialite"
        intro="Nous collectons une adresse email et rien d'autre. Voici precisement ce qu'elle devient."
        crumbs={[{ label: "Confidentialite" }]}
      />

      <Section>
        <Container className="max-w-3xl px-0 sm:px-0">
          <LegalBlock title="Qui traite vos donnees">
            <p>
              Les donnees collectees sur ce site sont traitees par les responsables du
              projet etudiant flow_lab, joignables a l&apos;adresse {site.email}.
            </p>
          </LegalBlock>

          <LegalBlock title="Ce que nous collectons">
            <LegalList
              items={[
                "Votre adresse email, toujours",
                "Votre prenom, lorsque le formulaire le propose",
                "Votre message, si vous nous ecrivez via le formulaire de contact",
                "L'origine de votre visite : parametres de campagne, site referent et page d'arrivee",
              ]}
            />
            <p>
              L&apos;origine de la visite nous sert uniquement a savoir quel canal
              amene des visiteurs. Elle n&apos;est jamais utilisee pour vous
              identifier individuellement.
            </p>
          </LegalBlock>

          <LegalBlock title="Pourquoi nous les collectons">
            <LegalList
              items={[
                "Vous envoyer la ressource que vous avez demandee",
                "Vous adresser nos publications si vous vous y etes abonne",
                "Repondre a votre message",
                "Mesurer l'audience du site dans le cadre du projet",
              ]}
            />
            <p>
              La base legale de ces traitements est votre consentement, donne au
              moment ou vous soumettez le formulaire. Vous pouvez le retirer a tout
              moment.
            </p>
          </LegalBlock>

          <LegalBlock title="Qui y a acces">
            <p>
              Vos donnees transitent par les services suivants, uniquement pour les
              finalites decrites ci-dessus :
            </p>
            <LegalList
              items={[
                "n8n, pour l'acheminement et l'automatisation des envois",
                "Google Sheets, comme base de contacts",
                "Brevo, pour l'envoi des emails",
                "Vercel, pour l'hebergement du site",
              ]}
            />
            <p>
              Nous ne vendons, ne louons et ne transmettons vos donnees a aucun autre
              tiers.
            </p>
          </LegalBlock>

          <LegalBlock title="Combien de temps">
            <p>
              Les adresses email sont conservees jusqu&apos;a votre desinscription, et
              au maximum jusqu&apos;a la fin du projet pedagogique, apres quoi la base
              est supprimee.
            </p>
          </LegalBlock>

          <LegalBlock title="Vos droits">
            <p>
              Vous disposez d&apos;un droit d&apos;acces, de rectification,
              d&apos;effacement, de limitation et d&apos;opposition sur vos donnees,
              ainsi que du droit a la portabilite.
            </p>
            <p>
              Chaque email comporte un lien de desinscription en un clic. Pour toute
              autre demande, ecrivez a {site.email} : nous repondons sous trente jours.
              Vous pouvez egalement introduire une reclamation aupres de la CNIL.
            </p>
          </LegalBlock>

          <LegalBlock title="Cookies">
            <p>
              Ce site ne depose aucun cookie publicitaire ni traceur tiers. Les
              informations d&apos;origine de visite sont conservees dans le stockage
              local de votre navigateur, sur votre appareil uniquement, et disparaissent
              lorsque vous videz les donnees du site.
            </p>
          </LegalBlock>
        </Container>
      </Section>
    </>
  );
}
