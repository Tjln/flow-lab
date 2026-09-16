/**
 * Articles du blog.
 *
 * Le corps est decrit par blocs plutot qu'en HTML : le rendu reste maitrise,
 * et on evite d'injecter du balisage brut. Pour passer plus tard a des
 * fichiers MDX, seule la fonction de rendu changera, pas les pages.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  /** Date ISO, convertie a l'affichage. */
  date: string;
  readingMinutes: number;
  excerpt: string;
  tags: string[];
  /**
   * Ressource proposee en fin d'article. C'est le « content upgrade » :
   * une offre liee au sujet lu convertit bien mieux qu'une newsletter generique.
   */
  upgradeSlug: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "par-quoi-commencer-automatisation",
    title: "Par quoi commencer quand tout semble automatisable",
    category: "Methode",
    date: "2026-09-08",
    readingMinutes: 6,
    excerpt:
      "La premiere erreur n'est pas de mal automatiser, c'est d'automatiser la mauvaise tache. Voici comment choisir.",
    tags: ["Methode", "Audit"],
    upgradeSlug: "guide-automatiser-son-business",
    body: [
      {
        type: "p",
        text: "Quand on decouvre n8n, l'envie immediate est d'automatiser ce qui est le plus amusant a construire. C'est aussi la meilleure facon de passer trois soirees sur un workflow qui ne fera gagner que dix minutes par mois.",
      },
      { type: "h2", text: "Mesurer avant de construire" },
      {
        type: "p",
        text: "Pendant une semaine, notez chaque tache repetitive et le temps qu'elle vous prend reellement. Pas le temps que vous imaginez : le temps mesure. La plupart des gens se trompent d'un facteur deux, dans un sens comme dans l'autre.",
      },
      {
        type: "p",
        text: "Multipliez ensuite par la frequence mensuelle. Une tache de cinq minutes faite trois fois par jour coute plus cher qu'une corvee d'une heure faite une fois par mois, et pourtant c'est la seconde qui attire l'attention.",
      },
      { type: "h2", text: "Classer par effort, pas par envie" },
      {
        type: "p",
        text: "Face a votre liste, estimez pour chaque ligne le temps de construction. Vous obtenez deux colonnes : temps gagne par mois, effort de mise en place. Commencez systematiquement par le meilleur rapport entre les deux.",
      },
      {
        type: "ul",
        items: [
          "Gain eleve, effort faible : a faire cette semaine",
          "Gain eleve, effort important : a planifier, c'est la que se trouve la vraie valeur",
          "Gain faible, effort faible : a garder pour un moment creux",
          "Gain faible, effort important : a ne jamais faire",
        ],
      },
      {
        type: "quote",
        text: "Une automatisation qui n'a pas de chiffre avant et apres n'est pas une automatisation, c'est un passe-temps.",
      },
      { type: "h2", text: "Accepter de ne pas tout automatiser" },
      {
        type: "p",
        text: "Certaines taches changent trop souvent pour valoir un workflow. D'autres demandent un jugement humain que vous ne voulez pas deleguer. Les laisser de cote n'est pas un echec : c'est ce qui vous laisse le temps de bien traiter les autres.",
      },
    ],
  },
  {
    slug: "n8n-zapier-make-comparaison",
    title: "n8n, Zapier ou Make : comment choisir sans se tromper",
    category: "Outils",
    date: "2026-08-27",
    readingMinutes: 7,
    excerpt:
      "Les trois outils font le meme travail en apparence. La difference se voit sur la facture et sur vos donnees.",
    tags: ["Outils", "n8n"],
    upgradeSlug: "pack-10-workflows-n8n",
    body: [
      {
        type: "p",
        text: "La question revient a chaque premier rendez-vous. La reponse honnete est qu'aucun des trois n'est mauvais, mais qu'ils ne coutent pas la meme chose au meme moment de votre croissance.",
      },
      { type: "h2", text: "Le modele de facturation change tout" },
      {
        type: "p",
        text: "Zapier et Make facturent a la tache executee. Tant que vos volumes restent faibles, c'est indolore. Le jour ou un workflow traite quelques milliers d'elements par mois, la facture grimpe plus vite que la valeur produite.",
      },
      {
        type: "p",
        text: "n8n facture a l'execution du workflow, pas a l'operation. Un workflow qui traite mille lignes compte pour une execution. Sur des traitements par lot, l'ecart devient considerable.",
      },
      { type: "h2", text: "Ou vivent vos donnees" },
      {
        type: "p",
        text: "n8n peut etre heberge chez vous. Pour un cabinet qui manipule des donnees clients, ou une structure soumise a des contraintes reglementaires, ce seul point tranche souvent le debat avant meme la question du prix.",
      },
      {
        type: "ul",
        items: [
          "Zapier : le plus simple pour demarrer, le plus cher a l'echelle",
          "Make : bon compromis visuel, logique de scenario un peu rigide",
          "n8n : plus technique au depart, beaucoup plus libre ensuite",
        ],
      },
      {
        type: "quote",
        text: "Choisissez l'outil que vous pourrez encore vous payer quand vos volumes auront double.",
      },
      { type: "h2", text: "Notre parti pris" },
      {
        type: "p",
        text: "Nous travaillons avec n8n parce qu'il ne penalise pas la reussite et parce qu'il vous laisse proprietaire de vos automatisations. Cela dit, nous avons deja recommande Zapier a des clients dont le besoin tenait en deux connexions simples. L'outil juste est celui que vous saurez maintenir.",
      },
    ],
  },
  {
    slug: "workflow-veille-automatisee",
    title: "Construire une veille automatisee en une apres-midi",
    category: "Tutoriel",
    date: "2026-08-14",
    readingMinutes: 9,
    excerpt:
      "Un workflow n8n qui lit vos sources, filtre le bruit et vous livre l'essentiel chaque matin.",
    tags: ["Tutoriel", "n8n", "Contenu"],
    upgradeSlug: "pack-10-workflows-n8n",
    body: [
      {
        type: "p",
        text: "La veille est le cas d'usage ideal pour un premier workflow : le besoin est reel, les briques sont simples, et le resultat se voit des le lendemain matin.",
      },
      { type: "h2", text: "Les quatre briques" },
      {
        type: "ul",
        items: [
          "Un declencheur horaire, regle sur six heures du matin",
          "Un ou plusieurs noeuds de lecture de flux RSS",
          "Un filtre sur mots-cles pour ecarter le bruit",
          "Un envoi vers l'endroit ou vous lisez vraiment : email, Slack ou Notion",
        ],
      },
      { type: "h2", text: "Le filtre est la partie qui compte" },
      {
        type: "p",
        text: "Sans filtre, vous remplacez une boite mail encombree par une autre. Commencez large pendant une semaine, notez ce que vous ignorez systematiquement, puis resserrez. Un bon filtre se regle en observant, pas en devinant.",
      },
      {
        type: "quote",
        text: "Une veille qu'on ne lit pas coute plus cher que pas de veille du tout : elle donne l'illusion d'etre informe.",
      },
      { type: "h2", text: "Prevoir les pannes" },
      {
        type: "p",
        text: "Un flux RSS finit toujours par tomber. Ajoutez une branche d'erreur qui vous previent au lieu de laisser le workflow echouer en silence pendant trois semaines. C'est cinq minutes de travail et cela evite la mauvaise surprise.",
      },
    ],
  },
  {
    slug: "erreurs-premiers-workflows",
    title: "Les cinq erreurs de tous les premiers workflows",
    category: "Methode",
    date: "2026-07-30",
    readingMinutes: 5,
    excerpt:
      "Nous les avons toutes commises. Les connaitre vous fera gagner vos premieres semaines.",
    tags: ["Methode", "n8n"],
    upgradeSlug: "mini-formation-n8n",
    body: [
      {
        type: "p",
        text: "Apres une quarantaine de workflows deployes, les memes erreurs reviennent. Aucune n'est grave, toutes font perdre du temps.",
      },
      { type: "h2", text: "1. Ne pas gerer les erreurs" },
      {
        type: "p",
        text: "Un workflow sans branche d'erreur echoue silencieusement. Vous le decouvrez le jour ou un client s'etonne de n'avoir rien recu depuis un mois.",
      },
      { type: "h2", text: "2. Tout mettre dans un seul workflow" },
      {
        type: "p",
        text: "Un workflow de quarante noeuds est impossible a debuguer. Decoupez en plusieurs workflows appeles les uns par les autres : chacun reste lisible et testable seul.",
      },
      { type: "h2", text: "3. Coder les identifiants en dur" },
      {
        type: "p",
        text: "Les credentials de n8n existent pour cela. Une cle d'API ecrite dans un noeud finit toujours par etre partagee par accident lors d'un export.",
      },
      { type: "h2", text: "4. Tester sur des donnees reelles" },
      {
        type: "p",
        text: "Le premier test qui envoie deux cents emails a vos vrais clients est une experience dont on se souvient. Travaillez sur un jeu de donnees de test tant que le workflow n'est pas stable.",
      },
      { type: "h2", text: "5. Ne rien documenter" },
      {
        type: "p",
        text: "Dans six mois, vous ne vous souviendrez plus pourquoi ce noeud filtre cette valeur. n8n permet d'annoter chaque noeud : une phrase suffit, mais ecrivez-la le jour ou vous le construisez.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export const postSlugs = posts.map((post) => post.slug);

/** Categories avec leur nombre d'articles, pour la colonne laterale. */
export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}

export function getTags(): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
