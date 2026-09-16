/**
 * Bibliotheque de lead magnets.
 * Chaque entree genere automatiquement :
 *   - sa carte sur /ressources
 *   - sa landing page /ressources/[slug]
 *   - sa page de conversion /merci/[slug]
 * Ajouter une ressource = ajouter un objet ici, rien d'autre.
 */

export type ResourceKind = "workflow-pack" | "livre-blanc" | "mini-formation";

export type Resource = {
  slug: string;
  kind: ResourceKind;
  title: string;
  /** Promesse courte affichee sur la carte. */
  hook: string;
  /** Argumentaire long de la landing page. */
  description: string;
  /** Ce que le lead recoit concretement, en puces. */
  deliverables: string[];
  /** Format annonce au visiteur (rassure avant de donner son email). */
  format: string;
  /** Texte du bouton de la landing page. */
  cta: string;
  /** Identifiant envoye a n8n : sert a router vers le bon email Brevo. */
  n8nTag: string;
  featured?: boolean;
};

export const resources: Resource[] = [
  {
    slug: "pack-10-workflows-n8n",
    kind: "workflow-pack",
    title: "Le pack de 10 workflows n8n prets a l'emploi",
    hook: "10 automatisations business a importer en 30 secondes dans votre n8n.",
    description:
      "Arretez de partir de la page blanche. Ce pack reunit les 10 workflows que nous deployons le plus souvent chez nos clients : veille, prospection, reporting, publication sociale, relances. Chaque fichier JSON s'importe directement dans n8n et fonctionne apres avoir renseigne vos identifiants.",
    deliverables: [
      "10 fichiers JSON importables dans n8n",
      "Un guide d'installation pas a pas",
      "La liste des credentials necessaires pour chaque workflow",
      "Nos commentaires dans chaque node pour comprendre la logique",
    ],
    format: "10 fichiers .json + guide PDF",
    cta: "Recevoir le pack gratuitement",
    n8nTag: "pack-workflows",
    featured: true,
  },
  {
    slug: "guide-automatiser-son-business",
    kind: "livre-blanc",
    title: "Automatiser son business en 2026",
    hook: "Le guide de 40 pages pour identifier et automatiser vos taches qui coutent le plus cher.",
    description:
      "Avant d'automatiser, il faut savoir quoi automatiser. Ce guide vous donne notre methode d'audit en 4 etapes pour cartographier vos process, chiffrer le temps perdu, prioriser les automatisations par retour sur investissement et eviter les pieges classiques des premiers workflows.",
    deliverables: [
      "La methode d'audit en 4 etapes",
      "Le tableau de calcul du temps et du cout economises",
      "15 cas d'usage classes par metier",
      "Les 7 erreurs qui font echouer un projet d'automatisation",
    ],
    format: "PDF, 40 pages",
    cta: "Telecharger le guide",
    n8nTag: "livre-blanc",
  },
  {
    slug: "mini-formation-n8n",
    kind: "mini-formation",
    title: "Vos 5 premiers jours avec n8n",
    hook: "Une lecon par jour pendant 5 jours pour construire votre premier workflow utile.",
    description:
      "Une mini-formation par email, concue pour les debutants complets. Chaque jour, une lecon courte et un exercice concret. A la fin des 5 jours, vous avez un workflow qui tourne pour de vrai dans votre business, pas un tutoriel de plus dans vos favoris.",
    deliverables: [
      "5 lecons par email, une par jour",
      "Un exercice pratique a chaque lecon",
      "Le workflow final a importer si vous bloquez",
      "Notre canal de reponse aux questions",
    ],
    format: "5 emails, 10 minutes par jour",
    cta: "Commencer la formation",
    n8nTag: "mini-formation",
  },
];

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export const resourceSlugs = resources.map((r) => r.slug);
