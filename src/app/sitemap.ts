import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { resourceSlugs } from "@/content/resources";
import { postSlugs, posts } from "@/content/posts";

/**
 * Plan du site, genere a partir du contenu.
 * Ajouter une ressource ou un article le reference automatiquement : rien a
 * maintenir a la main, donc rien a oublier.
 *
 * Les pages /merci et les pages legales en sont volontairement absentes :
 * elles n'ont aucune valeur en resultat de recherche.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: "", priority: 1 },
    { path: "/ressources", priority: 0.9 },
    { path: "/formations", priority: 0.8 },
    { path: "/services", priority: 0.8 },
    { path: "/blog", priority: 0.7 },
    { path: "/a-propos", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ].map((page) => ({
    url: `${site.url}${page.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  // Les landing pages de ressources sont les portes d'entree de la collecte :
  // ce sont elles qu'on veut voir remonter en priorite.
  const resourcePages = resourceSlugs.map((slug) => ({
    url: `${site.url}/ressources/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const postPages = postSlugs.map((slug) => ({
    url: `${site.url}/blog/${slug}`,
    lastModified: new Date(posts.find((post) => post.slug === slug)!.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...resourcePages, ...postPages];
}
