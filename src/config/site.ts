/**
 * Configuration globale du site flow_lab.
 * Point unique de verite pour la navigation, les reseaux et le SEO.
 */

/**
 * Adresse publique du site, utilisee par les metadonnees de partage, le
 * sitemap et les liens de partage social.
 *
 * Vercel expose le domaine de production a la construction : on s'en sert
 * pour que le site s'auto-configure, plutot que de dependre d'une variable
 * a renseigner a la main. Une URL fausse ici casse silencieusement les
 * apercus de partage, ce qui est invisible en navigation mais coute cher
 * quand tout le trafic vient des reseaux.
 */
function resolveSiteUrl(): string {
  // 1. Valeur explicite : indispensable le jour ou un vrai domaine sera pose.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  // 2. Domaine de production fourni par Vercel, sans protocole.
  const vercelDomain = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return "http://localhost:3000";
}

export const site = {
  name: "flow_lab",
  tagline: "Automatisez ce qui vous fait perdre du temps",
  description:
    "flow_lab forme les freelances, PME et equipes ops a n8n, et livre des workflows prets a l'emploi. Formations, ressources gratuites et conseil en automatisation.",
  url: resolveSiteUrl(),
  locale: "fr_FR",
  email: "flow.lab003@gmail.com",
  phone: "+33 6 12 34 56 78",
} as const;

/** Bandeau haut de page : rare, donc lu. Sert a pousser la ressource du moment. */
export const announcement = {
  prefix: "Nouveau",
  text: "le pack de 10 workflows n8n est disponible gratuitement",
  href: "/ressources/pack-10-workflows-n8n",
} as const;

export const mainNav = [
  { label: "Accueil", href: "/" },
  { label: "Formations", href: "/formations" },
  { label: "Services", href: "/services" },
  { label: "Ressources", href: "/ressources" },
  { label: "Blog", href: "/blog" },
  { label: "A propos", href: "/a-propos" },
] as const;

export const legalNav = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "Confidentialite", href: "/confidentialite" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Reseaux sociaux : utilises dans le footer ET sur la page /merci, ou se joue
 * la conversion email -> abonne. L'ordre correspond a la priorite de
 * conversion, le premier etant le plus mis en avant.
 */
export const socials = [
  { id: "linkedin", label: "LinkedIn", handle: "@flow-lab", url: "https://linkedin.com/company/flow-lab" },
  { id: "x", label: "X", handle: "@flowlab_fr", url: "https://x.com/flowlab_fr" },
  { id: "youtube", label: "YouTube", handle: "@flowlab", url: "https://youtube.com/@flowlab" },
  { id: "instagram", label: "Instagram", handle: "@flowlab.fr", url: "https://instagram.com/flowlab.fr" },
  { id: "tiktok", label: "TikTok", handle: "@flowlab.fr", url: "https://tiktok.com/@flowlab.fr" },
] as const;

export type SocialId = (typeof socials)[number]["id"];

/**
 * Chiffres de la section preuve. Projet d'ecole : ce sont des objectifs
 * affiches. La valeur est numerique pour pouvoir etre animee au defilement.
 */
export const metrics = [
  {
    value: 12,
    suffix: " h",
    label: "economisees par semaine",
    detail: "en moyenne apres un premier chantier d'automatisation",
  },
  {
    value: 40,
    suffix: "+",
    label: "workflows deployes",
    detail: "chez des freelances, TPE et equipes ops",
  },
  {
    value: 5,
    suffix: " j",
    label: "pour etre autonome",
    detail: "duree de notre parcours de formation initial",
  },
] as const;
