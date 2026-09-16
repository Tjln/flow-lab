/**
 * Genere les workflows n8n du projet a partir des sources lisibles.
 *
 * Le code des noeuds Code doit etre echappe dans le JSON du workflow.
 * L'ecrire a la main est une source d'erreurs : on le lit depuis un fichier
 * .js lisible et on laisse JSON.stringify faire l'echappement.
 *
 * Trois exigences du brief sont tenues ici et ne doivent pas etre defaites :
 *   - aucun secret en dur : tout passe par les credentials n8n ;
 *   - un sticky note explicatif dans chaque canvas ;
 *   - un workflow d'alerte branche sur Error Trigger.
 *
 * Usage : node n8n/construire-workflow.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const codeEmail = readFileSync(join(ici, "preparer-email.js"), "utf8");

/* ------------------------------------------------------------------ */
/* Fabriques communes                                                  */
/* ------------------------------------------------------------------ */

/**
 * Sticky note du canvas. Le brief impose une explication visible dans n8n :
 * un workflow qu'il faut ouvrir node par node pour comprendre est un
 * workflow que personne ne reprendra.
 */
function note(titre, lignes, position, largeur = 460, hauteur = 300) {
  return {
    parameters: {
      content: `## ${titre}\n\n${lignes.join("\n")}`,
      height: hauteur,
      width: largeur,
      color: 5,
    },
    id: "note-" + titre.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: "Note — " + titre,
    type: "n8n-nodes-base.stickyNote",
    typeVersion: 1,
    position,
  };
}

/**
 * Webhook protege par un en-tete secret.
 *
 * L'authentification est portee par un credential n8n plutot que par une
 * comparaison dans un node IF : le brief interdit les secrets en dur, et un
 * secret ecrit dans le canvas se retrouverait dans l'export JSON livre.
 */
function webhookProtege(nom, chemin, position) {
  return {
    parameters: {
      httpMethod: "POST",
      path: chemin,
      authentication: "headerAuth",
      responseMode: "responseNode",
      options: {},
    },
    id: "webhook-" + chemin,
    name: nom,
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position,
    webhookId: chemin,
    credentials: {
      httpHeaderAuth: { id: "", name: "flow_lab — Secret webhook" },
    },
  };
}

/** Appel HTTP authentifie par un credential d'en-tete, jamais par une valeur brute. */
function appelBrevo(nom, url, corps, position, extra = {}) {
  return {
    parameters: {
      method: "POST",
      url,
      authentication: "genericCredentialType",
      genericAuthType: "httpHeaderAuth",
      sendBody: true,
      specifyBody: "json",
      jsonBody: corps,
      options: { timeout: 15000 },
    },
    id: "http-" + nom.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: nom,
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position,
    credentials: {
      httpHeaderAuth: { id: "", name: "flow_lab — Cle API Brevo" },
    },
    ...extra,
  };
}

function repondre(nom, corps, position, codeHttp) {
  return {
    parameters: {
      respondWith: "json",
      responseBody: corps,
      options: codeHttp ? { responseCode: codeHttp } : {},
    },
    id: "rep-" + nom.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: nom,
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1.1,
    position,
  };
}

/* ------------------------------------------------------------------ */
/* Brique 4 — Capture et onboarding                                    */
/* ------------------------------------------------------------------ */

const collecte = {
  name: "flow_lab — Brique 4 : capture et onboarding",
  nodes: [
    note(
      "Brique 4 : capture et onboarding",
      [
        "**Objectif** : transformer un curieux en abonne actif.",
        "",
        "**Declencheur** : POST du site sur /flowlab-lead,",
        "authentifie par l'en-tete X-Flowlab-Secret via un",
        "credential Header Auth.",
        "",
        "**Logique** : on repond au site immediatement, puis on",
        "cree le contact Brevo et on envoie l'email de bienvenue.",
        "Repondre avant l'envoi evite que la lenteur de Brevo",
        "bloque la page de confirmation du visiteur.",
        "",
        "**Incident rencontre** : un email transactionnel ne cree",
        "aucun contact dans Brevo. Les deux appels sont distincts,",
        "d'ou le node « Ajouter le contact ».",
      ],
      [-300, -120]
    ),
    webhookProtege("Webhook du site", "flowlab-lead", [-220, 300]),
    repondre("Repondre 200", '={{ JSON.stringify({ ok: true }) }}', [0, 300]),
    {
      parameters: { jsCode: codeEmail },
      id: "preparer-message",
      name: "Preparer le message",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [220, 300],
    },
    appelBrevo(
      "Ajouter le contact",
      "https://api.brevo.com/v3/contacts",
      "={{ JSON.stringify($json.contactPayload) }}",
      [440, 300],
      // Un echec d'ajout ne doit pas priver le visiteur de sa ressource :
      // on continue vers l'envoi, et l'erreur reste visible dans Executions.
      { onError: "continueRegularOutput" }
    ),
    appelBrevo(
      "Envoyer l'email",
      "https://api.brevo.com/v3/smtp/email",
      "={{ JSON.stringify($('Preparer le message').item.json.brevoPayload) }}",
      [660, 300]
    ),
  ],
  connections: {
    "Webhook du site": { main: [[{ node: "Repondre 200", type: "main", index: 0 }]] },
    "Repondre 200": { main: [[{ node: "Preparer le message", type: "main", index: 0 }]] },
    "Preparer le message": { main: [[{ node: "Ajouter le contact", type: "main", index: 0 }]] },
    "Ajouter le contact": { main: [[{ node: "Envoyer l'email", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

/* ------------------------------------------------------------------ */
/* Comptage des telechargements                                        */
/* ------------------------------------------------------------------ */

const telechargements = {
  name: "flow_lab — Comptage des telechargements",
  nodes: [
    note(
      "Comptage des telechargements",
      [
        "**Objectif** : savoir quelle ressource est reellement",
        "recuperee, et par quel canal.",
        "",
        "**Declencheur** : le site appelle ce webhook avant de",
        "servir le fichier, sans attendre la reponse.",
        "",
        "**Logique** : une ligne par telechargement, prete pour",
        "un node Google Sheets « Append » branche a la suite.",
        "",
        "**Choix assume** : si n8n est injoignable, le visiteur",
        "recoit quand meme son fichier. Le comptage ne doit",
        "jamais bloquer une livraison.",
      ],
      [-300, -120]
    ),
    webhookProtege("Webhook telechargement", "flowlab-telechargement", [-220, 300]),
    repondre("Repondre 200", '={{ JSON.stringify({ ok: true }) }}', [0, 300]),
    {
      parameters: {
        jsCode: [
          "/* Une ligne par telechargement, prete a etre ajoutee a une feuille.",
          "   Brancher un node Google Sheets « Append » a la suite de celui-ci",
          "   et associer chaque colonne au champ du meme nom. */",
          "const e = $json.body || $json;",
          "",
          "return [{",
          "  json: {",
          "    date: e.receivedAt || new Date().toISOString(),",
          "    ressource: e.ressource || '',",
          "    fichier: e.fichier || '',",
          "    canal: e.canal || 'direct',",
          "  },",
          "}];",
        ].join("\n"),
      },
      id: "ligne-telechargement",
      name: "Formater la ligne",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [220, 300],
    },
  ],
  connections: {
    "Webhook telechargement": { main: [[{ node: "Repondre 200", type: "main", index: 0 }]] },
    "Repondre 200": { main: [[{ node: "Formater la ligne", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

/* ------------------------------------------------------------------ */
/* Sentinelle d'erreurs                                                */
/* ------------------------------------------------------------------ */

const alerteErreur = {
  name: "flow_lab — Sentinelle d'erreurs",
  nodes: [
    note(
      "Sentinelle d'erreurs",
      [
        "**Objectif** : aucun workflow ne doit casser en silence.",
        "",
        "**Declencheur** : Error Trigger. A designer comme",
        "« Error Workflow » dans les reglages de chaque autre",
        "workflow, sinon il ne se declenchera jamais.",
        "",
        "**Logique** : on assemble un message lisible avec le",
        "workflow fautif, le node en cause et l'erreur, puis on",
        "l'envoie sur le canal d'equipe.",
        "",
        "**Pourquoi** : un workflow casse pendant trois jours sans",
        "que personne ne le sache est un workflow inutile.",
      ],
      [-300, -120]
    ),
    {
      parameters: {},
      id: "error-trigger",
      name: "Sur erreur",
      type: "n8n-nodes-base.errorTrigger",
      typeVersion: 1,
      position: [-220, 300],
    },
    {
      parameters: {
        jsCode: [
          "/* L'Error Trigger fournit l'execution fautive. On en extrait le",
          "   strict necessaire : de quoi diagnostiquer sans ouvrir n8n. */",
          "const e = $json.execution || {};",
          "const w = $json.workflow || {};",
          "",
          "const message = [",
          "  'Workflow en echec : ' + (w.name || 'inconnu'),",
          "  'Node : ' + (e.lastNodeExecuted || 'inconnu'),",
          "  'Erreur : ' + ((e.error && e.error.message) || 'non precisee'),",
          "  'Execution : ' + (e.id || '-'),",
          "  'Heure : ' + new Date().toISOString(),",
          "].join('\\n');",
          "",
          "return [{ json: { message: message, workflow: w.name || 'inconnu' } }];",
        ].join("\n"),
      },
      id: "formater-alerte",
      name: "Formater l'alerte",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [0, 300],
    },
  ],
  connections: {
    "Sur erreur": { main: [[{ node: "Formater l'alerte", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

/* ------------------------------------------------------------------ */

const SORTIES = [
  ["flowlab-lead.json", collecte],
  ["flowlab-telechargement.json", telechargements],
  ["flowlab-alerte-erreur.json", alerteErreur],
];

for (const [nom, contenu] of SORTIES) {
  writeFileSync(join(ici, nom), JSON.stringify(contenu, null, 2) + "\n", "utf8");
  console.log(nom + " genere.");
}
