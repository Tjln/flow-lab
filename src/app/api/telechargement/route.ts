import { NextResponse } from "next/server";
import { resources } from "@/content/resources";

/**
 * Compte un telechargement, puis redirige vers le fichier.
 *
 * Les evenements personnalises de la mesure d'audience Vercel sont reserves
 * aux offres payantes : on compte donc via n8n, qui est deja en place.
 *
 * Le comptage ne doit jamais empecher le telechargement. Si n8n est
 * injoignable, le visiteur recoit son fichier quand meme et seule la
 * statistique est perdue.
 */

export const runtime = "nodejs";

/** Chemins autorises, releves depuis le contenu du site. */
const FICHIERS_AUTORISES = new Set(
  resources.flatMap((resource) => resource.files.map((file) => file.path))
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fichier = url.searchParams.get("f");
  const ressource = url.searchParams.get("r") ?? "inconnue";

  // Sans cette verification, le parametre permettrait de faire rediriger le
  // site vers n'importe quelle adresse, y compris externe.
  if (!fichier || !FICHIERS_AUTORISES.has(fichier)) {
    return NextResponse.json({ error: "Fichier inconnu." }, { status: 404 });
  }

  const webhook = process.env.N8N_WEBHOOK_TELECHARGEMENT_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Flowlab-Secret": process.env.N8N_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({
          evenement: "telechargement",
          ressource,
          fichier,
          // Origine de la visite, pour savoir si le clic vient de l'email.
          canal: url.searchParams.get("utm_source") ?? "direct",
          receivedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(3000),
      });
    } catch (error) {
      console.error("[telechargement] n8n injoignable", error);
    }
  }

  return NextResponse.redirect(new URL(fichier, url.origin), 302);
}
