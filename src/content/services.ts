/** Les huit domaines d'intervention, presentes en grille numerotee. */

export type Service = {
  number: string;
  tag: string;
  title: string;
  items: string[];
};

export const services: Service[] = [
  {
    number: "01",
    tag: "Audit",
    title: "Diagnostic de vos process",
    items: [
      "Cartographie des taches repetitives",
      "Chiffrage du temps reellement perdu",
      "Priorisation par retour sur investissement",
      "Feuille de route sur trois mois",
    ],
  },
  {
    number: "02",
    tag: "Construction",
    title: "Workflows n8n sur mesure",
    items: [
      "Conception et developpement",
      "Tests sur vos donnees reelles",
      "Mise en production dans votre instance",
      "Documentation de chaque node",
    ],
  },
  {
    number: "03",
    tag: "Integrations",
    title: "Connexion de vos outils",
    items: [
      "Integration des API metier",
      "Webhooks et synchronisation continue",
      "Reprise de donnees existantes",
      "Gestion des erreurs et des reprises",
    ],
  },
  {
    number: "04",
    tag: "Formation",
    title: "Montee en competence",
    items: [
      "Parcours debutant en cinq jours",
      "Atelier pratique en equipe",
      "Accompagnement sur vos propres cas",
      "Support ecrit apres la formation",
    ],
  },
  {
    number: "05",
    tag: "Contenu",
    title: "Publication automatisee",
    items: [
      "Diffusion multi-reseaux depuis une source unique",
      "Veille sectorielle automatisee",
      "Generation et envoi de newsletters",
      "Rapport de performance hebdomadaire",
    ],
  },
  {
    number: "06",
    tag: "Prospection",
    title: "Acquisition automatisee",
    items: [
      "Enrichissement automatique des leads",
      "Sequences de relance personnalisees",
      "Scoring et qualification",
      "Synchronisation avec votre CRM",
    ],
  },
  {
    number: "07",
    tag: "Pilotage",
    title: "Reporting et alertes",
    items: [
      "Tableaux de bord alimentes en continu",
      "Consolidation de sources multiples",
      "Alertes sur seuils metier",
      "Exports programmes vers vos outils",
    ],
  },
  {
    number: "08",
    tag: "Maintenance",
    title: "Supervision dans la duree",
    items: [
      "Surveillance de l'execution des workflows",
      "Correction des erreurs bloquantes",
      "Evolutions au fil de vos besoins",
      "Transfert de competence continu",
    ],
  },
];
