"use client";

import type { Attribution } from "./lead";

const STORAGE_KEY = "flowlab.attribution";

/**
 * Capture l'origine du visiteur a sa PREMIERE visite et la conserve.
 * Sans ca, un visiteur venu de TikTok qui lit trois articles avant de
 * donner son email serait compte comme trafic direct : on ne saurait
 * jamais quel reseau ramene vraiment des leads.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(STORAGE_KEY)) return; // premiere touche uniquement

    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      ref: params.get("ref") ?? undefined,
      referrer: document.referrer || undefined,
      landingPath: window.location.pathname,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Navigation privee ou stockage bloque : l'attribution est un bonus,
    // jamais un prerequis a la collecte de l'email.
  }
}

export function readAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}
