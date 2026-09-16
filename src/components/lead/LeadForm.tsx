"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import { buttonClass } from "@/components/ui/Button";

type Props = {
  /** D'ou vient le lead : slug de ressource, "newsletter", "contact"... */
  source: string;
  /** Tag transmis a n8n pour declencher la bonne sequence Brevo. */
  tag: string;
  /** Vers quelle page /merci rediriger. Absent = message inline. */
  redirectTo?: string;
  submitLabel?: string;
  withFirstName?: boolean;
  withMessage?: boolean;
  /** Variante pour les fonds sombres. */
  inverted?: boolean;
  /** Micro-copy sous le bouton, leve la derniere objection avant l'email. */
  reassurance?: string;
};

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm({
  source,
  tag,
  redirectTo,
  submitLabel = "Recevoir la ressource",
  withFirstName = false,
  withMessage = false,
  inverted = false,
  reassurance = "Pas de spam. Desinscription en un clic.",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          firstName: data.get("firstName") || undefined,
          message: data.get("message") || undefined,
          company: data.get("company") || undefined, // honeypot
          source,
          tag,
          attribution: readAttribution(),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setError(payload.error ?? "Une erreur est survenue.");
        return;
      }

      setStatus("success");
      form.reset();
      if (redirectTo) router.push(redirectTo);
    } catch {
      setStatus("error");
      setError("Connexion impossible. Verifiez votre reseau et reessayez.");
    }
  }

  /* Champs a simple soulignement, comme sur la maquette. */
  const fieldClass = inverted
    ? "w-full border-0 border-b border-white/25 bg-transparent px-0 py-2.5 text-[var(--color-text-inverted)] placeholder:text-white/35 outline-none transition-colors focus-visible:border-[var(--color-brand)]"
    : "w-full border-0 border-b border-[var(--color-border-strong)] bg-transparent px-0 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 outline-none transition-colors focus-visible:border-[var(--color-brand)]";

  const labelClass = `font-mono text-[0.68rem] uppercase tracking-[0.14em] ${
    inverted ? "text-[var(--color-text-inverted-muted)]" : "text-[var(--color-text-muted)]"
  }`;

  if (status === "success" && !redirectTo) {
    return (
      <p
        className={`border-l-2 border-[var(--color-brand)] py-3 pl-4 ${
          inverted ? "text-[var(--color-text-inverted)]" : "text-[var(--color-text)]"
        }`}
      >
        C&apos;est note. Verifiez votre boite mail dans quelques instants.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      {/* Piege a bots : jamais visible, jamais lu par un lecteur d'ecran. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={`company-${source}`}>Ne pas remplir</label>
        <input id={`company-${source}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {withFirstName && (
        <div className="flex flex-col gap-1">
          <label htmlFor={`firstName-${source}`} className={labelClass}>
            / Prenom
          </label>
          <input
            id={`firstName-${source}`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Votre prenom"
            className={fieldClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor={`email-${source}`} className={labelClass}>
          / Email
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@entreprise.fr"
          aria-describedby={error ? `error-${source}` : undefined}
          className={fieldClass}
        />
      </div>

      {withMessage && (
        <div className="flex flex-col gap-1">
          <label htmlFor={`message-${source}`} className={labelClass}>
            / Votre message
          </label>
          <textarea
            id={`message-${source}`}
            name="message"
            rows={4}
            placeholder="La tache qui vous fait perdre le plus de temps..."
            className={`${fieldClass} resize-none`}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`${buttonClass(inverted ? "inverted" : "ink")} mt-1 w-full sm:w-auto`}
      >
        <span aria-hidden="true" className="size-2 shrink-0 bg-[var(--color-brand)]" />
        {status === "loading" ? "Envoi en cours..." : submitLabel}
      </button>

      {error && (
        <p id={`error-${source}`} role="alert" className="text-sm text-[var(--color-error)]">
          {error}
        </p>
      )}

      <p
        className={`text-xs ${
          inverted ? "text-[var(--color-text-inverted-muted)]" : "text-[var(--color-text-muted)]"
        }`}
      >
        {reassurance}
      </p>
    </form>
  );
}
