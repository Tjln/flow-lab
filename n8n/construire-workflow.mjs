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
      name: "Preparer l'email",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [440, 200],
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
        jsonBody: "={{ JSON.stringify($json.brevoPayload) }}",
        options: { timeout: 15000 },
      },
      id: "envoyer-brevo",
      name: "Envoyer via Brevo",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [660, 200],
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
      main: [[{ node: "Preparer l'email", type: "main", index: 0 }]],
    },
    "Preparer l'email": {
      main: [[{ node: "Envoyer via Brevo", type: "main", index: 0 }]],
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
