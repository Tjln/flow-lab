import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";

/**
 * Point d'entree unique de toute la collecte d'emails du site.
 * Le navigateur ne parle jamais directement a n8n : l'URL du webhook
 * reste cote serveur, ce qui evite qu'elle soit spammee depuis l'exterieur.
 */

export const runtime = "nodejs";

/** Fenetre glissante par IP. Reinitialisee a chaque redemarrage d'instance :
 *  suffisant pour arreter le spam basique, ce n'est pas un pare-feu. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonyme";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez dans une minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requete invalide." }, { status: 400 });
  }

  const result = validateLead(body);
  if (!result.ok) {
    // On repond 200 au spam detecte : le bot croit avoir reussi et
    // n'essaie pas de contourner le piege.
    if (result.error === "spam") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] N8N_WEBHOOK_URL absente de l'environnement.");
    return NextResponse.json(
      { error: "Le service est momentanement indisponible." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Secret partage : n8n rejette tout appel qui ne le presente pas.
        "X-Flowlab-Secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({
        ...result.data,
        receivedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") ?? undefined,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[lead] n8n a repondu", response.status);
      return NextResponse.json(
        { error: "Nous n'avons pas pu enregistrer votre demande." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[lead] appel n8n echoue", error);
    return NextResponse.json(
      { error: "Nous n'avons pas pu enregistrer votre demande." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
