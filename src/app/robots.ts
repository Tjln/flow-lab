import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Les pages de confirmation n'ont de sens qu'apres un formulaire :
      // indexees seules, elles gaspillent du budget d'exploration et
      // presentent une ressource sans son argumentaire.
      disallow: ["/merci/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
