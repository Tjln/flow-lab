/**
 * Parcours de formation.
 * Projet etudiant : rien n'est vendu. Chaque parcours ouvre soit sur la
 * ressource gratuite correspondante, soit sur une liste d'attente, ce qui
 * reste dans les deux cas une collecte d'email.
 */

export type Course = {
  slug: string;
  level: "Debutant" | "Intermediaire" | "Avance";
  title: string;
  hook: string;
  duration: string;
  format: string;
  audience: string;
  modules: string[];
  outcome: string;
  /** Tag transmis a n8n. */
  n8nTag: string;
  cta: string;
  /** Disponible tout de suite, ou sur liste d'attente. */
  available: boolean;
};

export const courses: Course[] = [
  {
    slug: "premiers-pas-n8n",
    level: "Debutant",
    title: "Vos 5 premiers jours avec n8n",
    hook: "De l'installation au premier workflow qui tourne vraiment, a raison de dix minutes par jour.",
    duration: "5 jours",
    format: "Mini-formation par email",
    audience: "Freelances et independants qui n'ont jamais touche a l'automatisation",
    modules: [
      "Jour 1 — Installer n8n et comprendre la logique des nodes",
      "Jour 2 — Declencheurs : horaire, webhook, formulaire",
      "Jour 3 — Connecter deux outils et faire circuler la donnee",
      "Jour 4 — Conditions, boucles et gestion des erreurs",
      "Jour 5 — Mettre en production et surveiller",
    ],
    outcome: "Un workflow qui tourne dans votre business, pas un tutoriel de plus dans vos favoris.",
    n8nTag: "mini-formation",
    cta: "Commencer la formation",
    available: true,
  },
  {
    slug: "workflows-metier",
    level: "Intermediaire",
    title: "Construire vos workflows metier",
    hook: "Passer du workflow d'exercice aux automatisations qui portent votre activite.",
    duration: "4 semaines",
    format: "Ateliers en visio, deux heures par semaine",
    audience: "TPE et PME ayant deja un ou deux workflows en production",
    modules: [
      "Semaine 1 — Cartographier et chiffrer ses process",
      "Semaine 2 — Prospection et relances automatisees",
      "Semaine 3 — Reporting et tableaux de bord alimentes en continu",
      "Semaine 4 — Fiabiliser : erreurs, reprises, alertes",
    ],
    outcome: "Trois automatisations metier en production et la methode pour en construire d'autres.",
    n8nTag: "formation-metier",
    cta: "Rejoindre la liste d'attente",
    available: false,
  },
  {
    slug: "n8n-pour-les-equipes",
    level: "Avance",
    title: "n8n a l'echelle d'une equipe",
    hook: "Gouvernance, environnements et bonnes pratiques quand plusieurs personnes construisent.",
    duration: "2 jours",
    format: "Atelier intensif, en presentiel ou en visio",
    audience: "Equipes ops et techniques qui industrialisent leurs automatisations",
    modules: [
      "Heberger et securiser son instance",
      "Separer les environnements de test et de production",
      "Versionner et documenter les workflows",
      "Superviser, alerter et reprendre sur incident",
    ],
    outcome: "Une instance n8n que plusieurs personnes peuvent faire evoluer sans se marcher dessus.",
    n8nTag: "formation-equipes",
    cta: "Rejoindre la liste d'attente",
    available: false,
  },
];
