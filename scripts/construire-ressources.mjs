/**
 * Genere les fichiers telechargeables du pack de workflows.
 *
 * Ce sont de vrais workflows n8n importables, pas des fichiers factices : un
 * lead magnet qui ne fonctionne pas coute plus cher qu'un lead magnet absent.
 * Ils restent volontairement simples, chaque node porte sa note explicative.
 *
 * Usage : node scripts/construire-ressources.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DOSSIER = join(process.cwd(), "public", "ressources", "pack-workflows");
mkdirSync(DOSSIER, { recursive: true });

/** Enveloppe commune : nom, reglages et structure attendus par n8n. */
function workflow(name, nodes, connections) {
  return {
    name,
    nodes,
    connections,
    settings: { executionOrder: "v1" },
    pinData: {},
  };
}

/* ------------------------------------------------------------------ */
/* 01 — Veille automatisee                                             */
/* ------------------------------------------------------------------ */

const veille = workflow(
  "flow_lab 01 — Veille automatisee",
  [
    {
      parameters: {
        rule: { interval: [{ triggerAtHour: 7, triggerAtMinute: 0 }] },
      },
      id: "declencheur",
      name: "Chaque matin a 7 h",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [0, 300],
    },
    {
      parameters: {
        url: "https://news.google.com/rss/search?q=automatisation+n8n&hl=fr",
        options: {},
      },
      id: "lire-flux",
      name: "Lire le flux RSS",
      type: "n8n-nodes-base.rssFeedRead",
      typeVersion: 1.2,
      position: [220, 300],
    },
    {
      parameters: {
        jsCode: [
          "/* Filtre sur mots-cles. Commencez large pendant une semaine, notez",
          "   ce que vous ignorez systematiquement, puis resserrez : un bon",
          "   filtre se regle en observant, pas en devinant. */",
          "const MOTS = ['n8n', 'automatisation', 'workflow', 'no-code'];",
          "",
          "return items.filter(function (item) {",
          "  const texte = ((item.json.title || '') + ' ' + (item.json.contentSnippet || '')).toLowerCase();",
          "  return MOTS.some(function (mot) { return texte.includes(mot); });",
          "});",
        ].join("\n"),
      },
      id: "filtrer",
      name: "Ecarter le bruit",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [440, 300],
    },
    {
      parameters: {
        jsCode: [
          "/* Un seul message recapitulatif plutot qu'un email par article :",
          "   remplacer une boite mail encombree par une autre ne sert a rien. */",
          "const lignes = items.map(function (item) {",
          "  return '- ' + item.json.title + '\\n  ' + item.json.link;",
          "});",
          "",
          "return [{ json: { total: items.length, resume: lignes.join('\\n') } }];",
        ].join("\n"),
      },
      id: "resumer",
      name: "Assembler le resume",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [660, 300],
    },
  ],
  {
    "Chaque matin a 7 h": { main: [[{ node: "Lire le flux RSS", type: "main", index: 0 }]] },
    "Lire le flux RSS": { main: [[{ node: "Ecarter le bruit", type: "main", index: 0 }]] },
    "Ecarter le bruit": { main: [[{ node: "Assembler le resume", type: "main", index: 0 }]] },
  }
);

/* ------------------------------------------------------------------ */
/* 02 — Relance des prospects sans reponse                             */
/* ------------------------------------------------------------------ */

const relance = workflow(
  "flow_lab 02 — Relance des prospects sans reponse",
  [
    {
      parameters: { rule: { interval: [{ triggerAtHour: 9, triggerAtMinute: 0 }] } },
      id: "declencheur",
      name: "Chaque jour a 9 h",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [0, 300],
    },
    {
      parameters: {
        jsCode: [
          "/* Remplacez cette source par votre CRM ou votre Google Sheet.",
          "   Le reste du workflow ne depend pas de l'outil choisi. */",
          "return [",
          "  { json: { email: 'prospect@example.com', prenom: 'Camille', envoyeLe: '2026-09-01', relances: 0 } },",
          "];",
        ].join("\n"),
      },
      id: "source",
      name: "Lire les prospects",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [220, 300],
    },
    {
      parameters: {
        jsCode: [
          "/* Deux garde-fous : un delai minimum, et un plafond de relances.",
          "   Sans le plafond, un prospect silencieux est relance indefiniment,",
          "   ce qui abime la reputation d'envoi du domaine. */",
          "const DELAI_JOURS = 5;",
          "const MAX_RELANCES = 2;",
          "const maintenant = Date.now();",
          "",
          "return items.filter(function (item) {",
          "  const jours = (maintenant - new Date(item.json.envoyeLe).getTime()) / 86400000;",
          "  return jours >= DELAI_JOURS && (item.json.relances || 0) < MAX_RELANCES;",
          "});",
        ].join("\n"),
      },
      id: "filtrer",
      name: "A relancer ?",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [440, 300],
    },
  ],
  {
    "Chaque jour a 9 h": { main: [[{ node: "Lire les prospects", type: "main", index: 0 }]] },
    "Lire les prospects": { main: [[{ node: "A relancer ?", type: "main", index: 0 }]] },
  }
);

/* ------------------------------------------------------------------ */
/* 03 — Publication d'un contenu sur plusieurs reseaux                 */
/* ------------------------------------------------------------------ */

const publication = workflow(
  "flow_lab 03 — Publication multi-reseaux",
  [
    {
      parameters: { httpMethod: "POST", path: "publier", options: {} },
      id: "declencheur",
      name: "Recevoir le contenu",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [0, 300],
      webhookId: "publier",
    },
    {
      parameters: {
        jsCode: [
          "/* Une source unique, plusieurs formats : chaque reseau a ses",
          "   contraintes, et publier le meme texte partout se voit. */",
          "const contenu = $json.body || $json;",
          "const titre = contenu.titre || '';",
          "const lien = contenu.lien || '';",
          "const resume = contenu.resume || '';",
          "",
          "return [{",
          "  json: {",
          "    linkedin: titre + '\\n\\n' + resume + '\\n\\n' + lien,",
          "    x: (titre.length > 200 ? titre.slice(0, 197) + '...' : titre) + '\\n' + lien,",
          "    instagram: titre + '\\n\\n' + resume + '\\n\\nLien en bio.',",
          "  },",
          "}];",
        ].join("\n"),
      },
      id: "decliner",
      name: "Decliner par reseau",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [220, 300],
    },
  ],
  {
    "Recevoir le contenu": { main: [[{ node: "Decliner par reseau", type: "main", index: 0 }]] },
  }
);

const FICHIERS = [
  ["01-veille-automatisee.json", veille],
  ["02-relance-prospects.json", relance],
  ["03-publication-multi-reseaux.json", publication],
];

for (const [nom, contenu] of FICHIERS) {
  writeFileSync(join(DOSSIER, nom), JSON.stringify(contenu, null, 2) + "\n", "utf8");
}

const lisezMoi = `# Pack de workflows n8n — flow_lab

Trois workflows prets a importer. Les sept autres arrivent : ce pack est
enrichi au fil de nos missions, et vous recevrez les nouveaux par email.

## Importer un workflow

1. Ouvrez n8n, menu Workflows, bouton « Import from File ».
2. Choisissez le fichier JSON.
3. Renseignez vos identifiants dans les nodes qui en demandent.
4. Activez le workflow.

## Les fichiers

| Fichier | Ce qu'il fait |
| --- | --- |
| 01-veille-automatisee.json | Lit un flux RSS chaque matin, ecarte le bruit, assemble un resume |
| 02-relance-prospects.json | Relance les prospects sans reponse, avec delai et plafond |
| 03-publication-multi-reseaux.json | Decline un contenu au format de chaque reseau |

## Deux conseils avant la mise en production

Testez sur un jeu de donnees factice tant que le workflow n'est pas stable.
Le premier test qui envoie deux cents emails a de vrais clients est une
experience dont on se souvient.

Ajoutez une branche d'erreur. Un workflow sans gestion d'erreur echoue en
silence, et vous le decouvrez le jour ou quelqu'un s'etonne de n'avoir rien
recu depuis un mois.

---

flow_lab — projet etudiant. Ces fichiers sont libres d'usage et de
modification, mais ne peuvent pas etre revendus en l'etat.
`;

writeFileSync(join(DOSSIER, "LISEZ-MOI.md"), lisezMoi, "utf8");

console.log(`${FICHIERS.length + 1} fichiers ecrits dans public/ressources/pack-workflows/`);
