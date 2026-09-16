/**
 * Genere flowlab-lead.json a partir de preparer-email.js.
 *
 * Le code du noeud « Preparer l'email » doit etre echappe dans le JSON du
 * workflow. L'ecrire a la main est une source d'erreurs : on le lit depuis
 * un fichier .js lisible et on laisse JSON.stringify faire l'echappement.
 *
 * Usage : node n8n/construire-workflow.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const codeEmail = readFileSync(join(ici, "preparer-email.js"), "utf8");

const workflow = {
  name: "flow_lab — Collecte de leads",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "flowlab-lead",
        // On repond via un noeud dedie : le site recoit son accuse de
        // reception sans attendre que Brevo ait fini d'envoyer.
        responseMode: "responseNode",
        options: {},
      },
      id: "webhook-lead",
      name: "Webhook du site",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [-220, 300],
      webhookId: "flowlab-lead",
    },
    {
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
            version: 2,
          },
          conditions: [
            {
              id: "verif-secret",
              leftValue: "={{ $json.headers['x-flowlab-secret'] }}",
              rightValue: "REMPLACER_PAR_VOTRE_SECRET",
              operator: { type: "string", operation: "equals" },
            },
          ],
          combinator: "and",
        },
        looseTypeValidation: true,
        options: {},
      },
      id: "verif-secret",
      name: "Secret valide ?",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      position: [0, 300],
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: '={{ JSON.stringify({ ok: true }) }}',
        options: {},
      },
      id: "reponse-ok",
      name: "Repondre 200",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [220, 200],
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: '={{ JSON.stringify({ error: "secret invalide" }) }}',
        options: { responseCode: 401 },
      },
      id: "reponse-refus",
      name: "Refuser 401",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [220, 420],
    },
    {
      parameters: {
        jsCode: codeEmail,
      },
      id: "preparer-email",
      name: "Preparer le message",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [440, 200],
    },
    {
      parameters: {
        method: "POST",
        url: "https://api.brevo.com/v3/contacts",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "api-key", value: "REMPLACER_PAR_VOTRE_CLE_BREVO" },
            { name: "content-type", value: "application/json" },
          ],
        },
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify($json.contactPayload) }}",
        options: { timeout: 15000 },
      },
      id: "ajouter-contact",
      name: "Ajouter le contact",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 200],
      // Un echec d'ajout ne doit pas priver le visiteur de sa ressource :
      // on continue vers l'envoi, et l'erreur reste visible dans Executions.
      onError: "continueRegularOutput",
    },
    {
      parameters: {
        method: "POST",
        url: "https://api.brevo.com/v3/smtp/email",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "api-key", value: "REMPLACER_PAR_VOTRE_CLE_BREVO" },
            { name: "content-type", value: "application/json" },
          ],
        },
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify($('Preparer le message').item.json.brevoPayload) }}",
        options: { timeout: 15000 },
      },
      id: "envoyer-brevo",
      name: "Envoyer l'email",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [880, 200],
    },
  ],
  connections: {
    "Webhook du site": {
      main: [[{ node: "Secret valide ?", type: "main", index: 0 }]],
    },
    "Secret valide ?": {
      main: [
        [{ node: "Repondre 200", type: "main", index: 0 }],
        [{ node: "Refuser 401", type: "main", index: 0 }],
      ],
    },
    "Repondre 200": {
      main: [[{ node: "Preparer le message", type: "main", index: 0 }]],
    },
    "Preparer le message": {
      main: [[{ node: "Ajouter le contact", type: "main", index: 0 }]],
    },
    "Ajouter le contact": {
      main: [[{ node: "Envoyer l'email", type: "main", index: 0 }]],
    },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

writeFileSync(
  join(ici, "flowlab-lead.json"),
  JSON.stringify(workflow, null, 2) + "\n",
  "utf8"
);

console.log("flowlab-lead.json genere.");

/* ------------------------------------------------------------------ */
/* Second workflow : comptage des telechargements                      */
/* ------------------------------------------------------------------ */

/**
 * Le site appelle ce webhook a chaque telechargement, puis sert le fichier
 * sans attendre la reponse. Le comptage ne peut donc jamais empecher un
 * visiteur d'obtenir sa ressource.
 */
const telechargements = {
  name: "flow_lab — Telechargements",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "flowlab-telechargement",
        responseMode: "responseNode",
        options: {},
      },
      id: "webhook-telechargement",
      name: "Webhook telechargement",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [-220, 300],
      webhookId: "flowlab-telechargement",
    },
    {
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
            version: 2,
          },
          conditions: [
            {
              id: "verif-secret-dl",
              leftValue: "={{ $json.headers['x-flowlab-secret'] }}",
              rightValue: "REMPLACER_PAR_VOTRE_SECRET",
              operator: { type: "string", operation: "equals" },
            },
          ],
          combinator: "and",
        },
        looseTypeValidation: true,
        options: {},
      },
      id: "verif-secret-dl",
      name: "Secret valide ?",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      position: [0, 300],
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: '={{ JSON.stringify({ ok: true }) }}',
        options: {},
      },
      id: "reponse-dl",
      name: "Repondre 200",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [220, 200],
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: '={{ JSON.stringify({ error: "secret invalide" }) }}',
        options: { responseCode: 401 },
      },
      id: "refus-dl",
      name: "Refuser 401",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [220, 420],
    },
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
      position: [440, 200],
    },
  ],
  connections: {
    "Webhook telechargement": {
      main: [[{ node: "Secret valide ?", type: "main", index: 0 }]],
    },
    "Secret valide ?": {
      main: [
        [{ node: "Repondre 200", type: "main", index: 0 }],
        [{ node: "Refuser 401", type: "main", index: 0 }],
      ],
    },
    "Repondre 200": {
      main: [[{ node: "Formater la ligne", type: "main", index: 0 }]],
    },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

writeFileSync(
  join(ici, "flowlab-telechargement.json"),
  JSON.stringify(telechargements, null, 2) + "\n",
  "utf8"
);

console.log("flowlab-telechargement.json genere.");

