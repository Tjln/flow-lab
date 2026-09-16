/** Contenus de la page d'accueil, separes de la mise en page. */

export const manifesto =
  "Automatiser n'est pas un luxe de grande entreprise. C'est simplement refuser de refaire a la main, chaque semaine, ce qu'une machine fait mieux et sans se tromper.";

/** Outils que nos workflows connectent. Sert de bandeau de credibilite. */
export const tools = [
  "n8n",
  "Google Sheets",
  "Notion",
  "Slack",
  "Airtable",
  "Brevo",
  "HubSpot",
  "OpenAI",
  "Stripe",
  "Google Calendar",
] as const;

export const steps = [
  {
    number: "01",
    title: "On cartographie",
    text: "Un atelier d'une heure pour lister vos taches repetitives et chiffrer le temps qu'elles vous coutent reellement chaque mois.",
  },
  {
    number: "02",
    title: "On priorise",
    text: "Toutes les automatisations ne se valent pas. On classe par rapport temps gagne sur effort de mise en place, et on commence par le haut de la liste.",
  },
  {
    number: "03",
    title: "On construit et on transmet",
    text: "Le workflow tourne dans votre n8n, pas dans le notre. On vous forme a le maintenir pour que vous ne dependiez de personne.",
  },
] as const;

export const differentiators = [
  {
    title: "Vous restez proprietaire",
    text: "Les workflows vivent dans votre instance n8n. Si vous arretez de travailler avec nous, tout continue de tourner.",
  },
  {
    title: "Formation d'abord",
    text: "Notre objectif est de vous rendre autonome, pas de vous rendre dependant d'une agence pour changer une ligne.",
  },
  {
    title: "Du concret, pas des slides",
    text: "Chaque ressource que nous publions est un fichier que vous pouvez importer et faire tourner dans la minute.",
  },
  {
    title: "Mesure du temps gagne",
    text: "Chaque chantier commence par un chiffre et se termine par le meme chiffre, mesure. Sinon, on ne sait pas si ca a servi.",
  },
] as const;

export const team = [
  {
    name: "Timothe Jaulneau",
    role: "Automatisation et integrations",
    text: "Construit les workflows et connecte les outils entre eux.",
  },
  {
    name: "Reda Loutfi",
    role: "Formation et contenu",
    text: "Concoit les parcours de formation et les ressources publiees.",
  },
] as const;

export const faq = [
  {
    question: "Faut-il savoir coder pour utiliser n8n ?",
    answer:
      "Non. n8n s'utilise en assemblant des blocs visuellement. Savoir lire un peu de JSON aide pour les cas avances, mais nos formations partent du niveau zero et la grande majorite des workflows se construisent sans ecrire une ligne de code.",
  },
  {
    question: "Combien de temps pour un premier workflow utile ?",
    answer:
      "Comptez une apres-midi pour un premier workflow simple, par exemple une veille automatisee ou une relance de prospects. Notre mini-formation par email vous y amene en cinq jours a raison de dix minutes par jour.",
  },
  {
    question: "Vos ressources sont-elles vraiment gratuites ?",
    answer:
      "Oui. Nous vous demandons votre email pour vous les envoyer et rester en contact, rien d'autre. Vous pouvez vous desinscrire en un clic et vos donnees ne sont ni vendues ni transmises.",
  },
  {
    question: "Pourquoi n8n plutot que Zapier ou Make ?",
    answer:
      "n8n peut etre heberge chez vous, ce qui change tout pour les donnees sensibles, et son modele de tarification ne vous penalise pas quand le volume augmente. Nous utilisons les autres outils quand ils sont plus adaptes, mais n8n couvre la majorite des besoins.",
  },
  {
    question: "Travaillez-vous avec des freelances et des TPE ?",
    answer:
      "C'est meme notre cible principale. Ce sont les structures ou une heure gagnee chaque jour change le plus de choses, et ou personne n'a le temps de se former seul.",
  },
] as const;
