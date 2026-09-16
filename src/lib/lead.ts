/** Contrat de donnees partage entre le formulaire et l'API. */

export type LeadPayload = {
  email: string;
  firstName?: string;
  /** Slug de la ressource demandee, ou "newsletter" / "contact". */
  source: string;
  /** Tag transmis a n8n pour router vers la bonne sequence Brevo. */
  tag: string;
  /** Message libre (formulaire de contact uniquement). */
  message?: string;
  attribution?: Attribution;
  /** Champ piege : doit toujours etre vide. */
  company?: string;
};

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
  /** Code de parrainage present dans l'URL (?ref=xxxx). */
  ref?: string;
};

/**
 * Validation volontairement permissive sur la forme de l'email :
 * on bloque les saisies manifestement invalides sans rejeter les
 * adresses exotiques mais legitimes.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(input: unknown):
  | { ok: true; data: LeadPayload }
  | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Requete invalide." };
  }
  const body = input as Record<string, unknown>;

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, error: "Cette adresse email ne semble pas valide." };
  }

  // Honeypot : un bot remplit tous les champs, un humain ne voit pas celui-ci.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return { ok: false, error: "spam" };
  }

  const source = typeof body.source === "string" && body.source ? body.source.slice(0, 80) : "inconnu";
  const tag = typeof body.tag === "string" && body.tag ? body.tag.slice(0, 80) : source;

  return {
    ok: true,
    data: {
      email,
      firstName: typeof body.firstName === "string" ? body.firstName.trim().slice(0, 80) : undefined,
      source,
      tag,
      message: typeof body.message === "string" ? body.message.slice(0, 2000) : undefined,
      attribution: (body.attribution as Attribution) ?? undefined,
    },
  };
}
