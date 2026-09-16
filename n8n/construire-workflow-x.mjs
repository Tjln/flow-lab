/**
 * Genere flowlab-file-attente-x.json.
 *
 * Le workflow lit une file d'attente dans Google Sheets et publie deux posts
 * par jour sur X. Le contenu est ecrit a l'avance, la publication devient un
 * automatisme : c'est la regularite qui fait decoller un compte neuf, pas
 * l'inspiration du jour.
 *
 * Usage : node n8n/construire-workflow-x.mjs
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));

/* Code du noeud de selection, tenu ici pour rester lisible. */
const codeSelection = [
  "/**",
  " * Choisit le prochain post a publier et refuse ce qui coute cher ou casse.",
  " *",
  " * X facture 0,015 $ un post sans lien et 0,20 $ un post avec lien, soit",
  " * treize fois plus. Publier un lien par inadvertance sur toute une file",
  " * multiplie la facture sans prevenir. D'ou le garde-fou explicite.",
  " */",
  "",
  "const LIMITE_CARACTERES = 280;",
  "const COUT_SANS_LIEN = 0.015;",
  "const COUT_AVEC_LIEN = 0.2;",
  "",
  "/* La file arrive telle quelle depuis la feuille : on ne garde que les",
  "   lignes marquees a publier, dans leur ordre d'ecriture. */",
  "const enAttente = items",
  "  .map(function (item) { return item.json; })",
  "  .filter(function (ligne) {",
  "    return String(ligne.statut || '').trim().toLowerCase() === 'a publier'",
  "      && String(ligne.texte || '').trim() !== '';",
  "  });",
  "",
  "if (enAttente.length === 0) {",
  "  /* File vide : on ne publie rien plutot que de republier un ancien post.",
  "     Le compteur sert d'alerte pour reapprovisionner. */",
  "  return [{ json: { publier: false, raison: 'file vide', restants: 0 } }];",
  "}",
  "",
  "const ligne = enAttente[0];",
  "const texte = String(ligne.texte).trim();",
  "const contientLien = /https?:\\/\\//i.test(texte);",
  "const lienAutorise = String(ligne.autoriser_lien || '').trim().toLowerCase() === 'oui';",
  "",
  "if (texte.length > LIMITE_CARACTERES) {",
  "  return [{ json: {",
  "    publier: false,",
  "    raison: 'post trop long : ' + texte.length + ' caracteres',",
  "    texte: texte,",
  "  } }];",
  "}",
  "",
  "if (contientLien && !lienAutorise) {",
  "  /* Refus volontaire : treize fois le prix, et X pousse moins loin les",
  "     posts qui sortent les gens de la plateforme. Mettre le lien en bio,",
  "     ou passer autoriser_lien a oui en connaissance de cause. */",
  "  return [{ json: {",
  "    publier: false,",
  "    raison: 'lien non autorise dans ce post',",
  "    texte: texte,",
  "  } }];",
  "}",
  "",
  "return [{",
  "  json: {",
  "    publier: true,",
  "    texte: texte,",
  "    theme: ligne.theme || '',",
  "    ligneFeuille: ligne.row_number || null,",
  "    coutEstime: contientLien ? COUT_AVEC_LIEN : COUT_SANS_LIEN,",
  "    restants: enAttente.length - 1,",
  "  },",
  "}];",
].join("\n");

const workflow = {
  name: "flow_lab — File d'attente X",
  nodes: [
    {
      parameters: {
        rule: {
          /* Deux creneaux : le matin avant la journee de travail, le soir
             apres. Ce sont les heures ou une cible de freelances et de TPE
             consulte son fil. A ajuster avec vos propres statistiques. */
          interval: [
            { triggerAtHour: 8, triggerAtMinute: 30 },
            { triggerAtHour: 18, triggerAtMinute: 30 },
          ],
        },
      },
      id: "declencheur-x",
      name: "Deux fois par jour",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [-220, 300],
    },
    {
      parameters: {
        documentId: { __rl: true, value: "REMPLACER_PAR_ID_DE_LA_FEUILLE", mode: "id" },
        sheetName: { __rl: true, value: "gid=0", mode: "list", cachedResultName: "file" },
        options: {},
      },
      id: "lire-file",
      name: "Lire la file",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      position: [0, 300],
    },
    {
      parameters: { jsCode: codeSelection },
      id: "choisir-post",
      name: "Choisir le post",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [220, 300],
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
              id: "a-publier",
              leftValue: "={{ $json.publier }}",
              rightValue: "true",
              operator: { type: "boolean", operation: "true", singleValue: true },
            },
          ],
          combinator: "and",
        },
        looseTypeValidation: true,
        options: {},
      },
      id: "verif-publication",
      name: "Quelque chose a publier ?",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      position: [440, 300],
    },
    {
      parameters: {
        text: "={{ $json.texte }}",
        additionalFields: {},
      },
      id: "publier-x",
      name: "Publier sur X",
      type: "n8n-nodes-base.twitter",
      typeVersion: 2,
      position: [660, 200],
    },
    {
      parameters: {
        operation: "update",
        documentId: { __rl: true, value: "REMPLACER_PAR_ID_DE_LA_FEUILLE", mode: "id" },
        sheetName: { __rl: true, value: "gid=0", mode: "list", cachedResultName: "file" },
        columns: {
          mappingMode: "defineBelow",
          value: {
            row_number: "={{ $('Choisir le post').item.json.ligneFeuille }}",
            statut: "publie",
            publie_le: "={{ $now.toISO() }}",
          },
          matchingColumns: ["row_number"],
        },
        options: {},
      },
      id: "marquer-publie",
      name: "Marquer comme publie",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      position: [880, 200],
    },
    {
      parameters: {
        jsCode: [
          "/* Rien n'a ete publie : on trace la raison plutot que de laisser",
          "   l'execution se terminer en silence. Une file vide ou un post",
          "   refuse doit se voir dans les executions. */",
          "console.log('Publication ignoree :', $json.raison);",
          "return [{ json: { ignore: true, raison: $json.raison } }];",
        ].join("\n"),
      },
      id: "tracer-refus",
      name: "Tracer le refus",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [660, 420],
    },
  ],
  connections: {
    "Deux fois par jour": { main: [[{ node: "Lire la file", type: "main", index: 0 }]] },
    "Lire la file": { main: [[{ node: "Choisir le post", type: "main", index: 0 }]] },
    "Choisir le post": { main: [[{ node: "Quelque chose a publier ?", type: "main", index: 0 }]] },
    "Quelque chose a publier ?": {
      main: [
        [{ node: "Publier sur X", type: "main", index: 0 }],
        [{ node: "Tracer le refus", type: "main", index: 0 }],
      ],
    },
    "Publier sur X": { main: [[{ node: "Marquer comme publie", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1" },
  pinData: {},
};

writeFileSync(
  join(ici, "flowlab-file-attente-x.json"),
  JSON.stringify(workflow, null, 2) + "\n",
  "utf8"
);

console.log("flowlab-file-attente-x.json genere.");
