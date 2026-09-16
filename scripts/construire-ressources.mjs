/**
 * Genere les dix workflows telechargeables du pack.
 *
 * Ce sont de vrais fichiers importables dans n8n, pas des exemples factices :
 * un lead magnet qui ne fonctionne pas coute plus cher que pas de lead magnet.
 *
 * Ils restent volontairement simples et sans identifiants obligatoires : on
 * peut les importer et les executer pour voir la logique tourner, puis
 * brancher ses propres outils. Chaque node porte sa note explicative, parce
 * qu'un workflow qu'on ne comprend pas est un workflow qu'on ne modifiera
 * jamais.
 *
 * Usage : node scripts/construire-ressources.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DOSSIER = join(process.cwd(), "public", "ressources", "pack-workflows");
mkdirSync(DOSSIER, { recursive: true });

/* ------------------------------------------------------------------ */
/* Fabriques de nodes                                                  */
/* ------------------------------------------------------------------ */

function planifie(name, heure, minute = 0) {
  return {
    parameters: { rule: { interval: [{ triggerAtHour: heure, triggerAtMinute: minute }] } },
    name,
    type: "n8n-nodes-base.scheduleTrigger",
    typeVersion: 1.2,
  };
}

function intervalle(name, minutes) {
  return {
    parameters: { rule: { interval: [{ field: "minutes", minutesInterval: minutes }] } },
    name,
    type: "n8n-nodes-base.interval",
    typeVersion: 1.1,
  };
}

function surWebhook(name, chemin) {
  return {
    parameters: { httpMethod: "POST", path: chemin, options: {} },
    name,
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    webhookId: chemin,
  };
}

function code(name, lignes) {
  return {
    parameters: { jsCode: lignes.join("\n") },
    name,
    type: "n8n-nodes-base.code",
    typeVersion: 2,
  };
}

function rss(name, url) {
  return {
    parameters: { url, options: {} },
    name,
    type: "n8n-nodes-base.rssFeedRead",
    typeVersion: 1.2,
  };
}

function requete(name, url) {
  return {
    parameters: { url, options: { timeout: 10000 } },
    name,
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
  };
}

/**
 * Assemble un workflow lineaire : chaque node est relie au suivant.
 * Les positions sont calculees, il n'y a donc rien a placer a la main.
 */
function lineaire(name, nodes) {
  const connections = {};
  const placés = nodes.map((node, index) => ({
    ...node,
    id: "n" + index,
    position: [index * 240, 300],
  }));

  for (let i = 0; i < placés.length - 1; i++) {
    connections[placés[i].name] = {
      main: [[{ node: placés[i + 1].name, type: "main", index: 0 }]],
    };
  }

  return { name, nodes: placés, connections, settings: { executionOrder: "v1" }, pinData: {} };
}

/* ------------------------------------------------------------------ */
/* Les dix workflows                                                   */
/* ------------------------------------------------------------------ */

const PACK = [
  [
    "01-veille-automatisee.json",
    lineaire("flow_lab 01 — Veille automatisee", [
      planifie("Chaque matin a 7 h", 7),
      rss("Lire le flux RSS", "https://news.google.com/rss/search?q=automatisation+n8n&hl=fr"),
      code("Ecarter le bruit", [
        "/* Commencez large pendant une semaine, notez ce que vous ignorez",
        "   systematiquement, puis resserrez : un bon filtre se regle en",
        "   observant, pas en devinant. */",
        "const MOTS = ['n8n', 'automatisation', 'workflow', 'no-code'];",
        "",
        "return items.filter(function (item) {",
        "  const texte = ((item.json.title || '') + ' ' + (item.json.contentSnippet || '')).toLowerCase();",
        "  return MOTS.some(function (mot) { return texte.includes(mot); });",
        "});",
      ]),
      code("Assembler le resume", [
        "/* Un seul message recapitulatif plutot qu'un email par article :",
        "   remplacer une boite mail encombree par une autre ne sert a rien. */",
        "const lignes = items.map(function (item) {",
        "  return '- ' + item.json.title + '\\n  ' + item.json.link;",
        "});",
        "",
        "return [{ json: { total: items.length, resume: lignes.join('\\n') } }];",
      ]),
    ]),
  ],

  [
    "02-relance-prospects.json",
    lineaire("flow_lab 02 — Relance des prospects sans reponse", [
      planifie("Chaque jour a 9 h", 9),
      code("Lire les prospects", [
        "/* Remplacez cette source par votre CRM ou votre Google Sheet.",
        "   Le reste du workflow ne depend pas de l'outil choisi. */",
        "return [",
        "  { json: { email: 'prospect@example.com', prenom: 'Camille', envoyeLe: '2026-09-01', relances: 0 } },",
        "];",
      ]),
      code("A relancer ?", [
        "/* Deux garde-fous : un delai minimum et un plafond de relances.",
        "   Sans le plafond, un prospect silencieux est relance indefiniment,",
        "   ce qui abime la reputation d'envoi de votre domaine. */",
        "const DELAI_JOURS = 5;",
        "const MAX_RELANCES = 2;",
        "const maintenant = Date.now();",
        "",
        "return items.filter(function (item) {",
        "  const jours = (maintenant - new Date(item.json.envoyeLe).getTime()) / 86400000;",
        "  return jours >= DELAI_JOURS && (item.json.relances || 0) < MAX_RELANCES;",
        "});",
      ]),
      code("Rediger la relance", [
        "return items.map(function (item) {",
        "  const p = item.json;",
        "  return { json: Object.assign({}, p, {",
        "    objet: 'Petite relance, ' + (p.prenom || '') ,",
        "    message: 'Bonjour ' + (p.prenom || '') + ',\\n\\nJe reviens vers vous au cas ou mon message precedent serait passe inapercu.',",
        "  }) };",
        "});",
      ]),
    ]),
  ],

  [
    "03-publication-multi-reseaux.json",
    lineaire("flow_lab 03 — Publication multi-reseaux", [
      surWebhook("Recevoir le contenu", "publier"),
      code("Decliner par reseau", [
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
      ]),
    ]),
  ],

  [
    "04-accuse-reception-formulaire.json",
    lineaire("flow_lab 04 — Accuse de reception et routage", [
      surWebhook("Recevoir le formulaire", "formulaire"),
      code("Valider et router", [
        "/* Repondre vite compte autant que repondre bien : un accuse de",
        "   reception immediat evite la relance impatiente du lendemain. */",
        "const f = $json.body || $json;",
        "const email = (f.email || '').trim().toLowerCase();",
        "",
        "if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email)) {",
        "  throw new Error('Adresse invalide : ' + email);",
        "}",
        "",
        "/* Le routage evite qu'une demande commerciale finisse dans la file",
        "   du support, et inversement. */",
        "const texte = (f.message || '').toLowerCase();",
        "let destination = 'general';",
        "if (texte.includes('devis') || texte.includes('tarif')) destination = 'commercial';",
        "if (texte.includes('bug') || texte.includes('probleme')) destination = 'support';",
        "",
        "return [{ json: { email: email, destination: destination, message: f.message || '' } }];",
      ]),
    ]),
  ],

  [
    "05-rapport-hebdomadaire.json",
    lineaire("flow_lab 05 — Rapport hebdomadaire consolide", [
      planifie("Chaque lundi a 8 h", 8),
      code("Rassembler les sources", [
        "/* Remplacez ces valeurs par vos vraies sources : Sheets, base de",
        "   donnees, API interne. La consolidation ne change pas. */",
        "return [",
        "  { json: { source: 'Site', indicateur: 'Visiteurs', valeur: 1240, precedent: 980 } },",
        "  { json: { source: 'Emails', indicateur: 'Inscrits', valeur: 87, precedent: 61 } },",
        "  { json: { source: 'Ventes', indicateur: 'Devis envoyes', valeur: 12, precedent: 15 } },",
        "];",
      ]),
      code("Calculer les evolutions", [
        "/* Une valeur brute ne dit rien sans son evolution : c'est la",
        "   variation qui declenche une decision, pas le chiffre seul. */",
        "return items.map(function (item) {",
        "  const d = item.json;",
        "  const evolution = d.precedent ? ((d.valeur - d.precedent) / d.precedent) * 100 : 0;",
        "  return { json: Object.assign({}, d, {",
        "    evolution: Math.round(evolution),",
        "    sens: evolution >= 0 ? 'hausse' : 'baisse',",
        "  }) };",
        "});",
      ]),
      code("Mettre en forme le rapport", [
        "const lignes = items.map(function (item) {",
        "  const d = item.json;",
        "  const signe = d.evolution >= 0 ? '+' : '';",
        "  return d.indicateur + ' : ' + d.valeur + ' (' + signe + d.evolution + ' %)';",
        "});",
        "",
        "return [{ json: { objet: 'Rapport de la semaine', corps: lignes.join('\\n') } }];",
      ]),
    ]),
  ],

  [
    "06-surveillance-site.json",
    lineaire("flow_lab 06 — Surveillance d'un site", [
      intervalle("Toutes les 15 minutes", 15),
      requete("Appeler le site", "https://example.com"),
      code("Verifier la reponse", [
        "/* Sans alerte, une panne se decouvre par un client mecontent.",
        "   Ce workflow ne remplace pas une supervision professionnelle,",
        "   mais il couvre le cas le plus frequent : le site ne repond plus. */",
        "const reponse = $json;",
        "const enPanne = !reponse || reponse.error !== undefined;",
        "",
        "return [{",
        "  json: {",
        "    enPanne: enPanne,",
        "    verifieLe: new Date().toISOString(),",
        "    message: enPanne ? 'Le site ne repond pas' : 'Le site repond normalement',",
        "  },",
        "}];",
      ]),
    ]),
  ],

  [
    "07-relance-factures.json",
    lineaire("flow_lab 07 — Relance des factures impayees", [
      planifie("Chaque jour a 10 h", 10),
      code("Lire les factures", [
        "/* A brancher sur votre outil de facturation ou une feuille de suivi. */",
        "return [",
        "  { json: { client: 'Exemple SARL', email: 'compta@example.com', numero: 'F-2026-014', montant: 1450, echeance: '2026-09-01', payee: false } },",
        "];",
      ]),
      code("Trier par retard", [
        "/* Le ton de la relance doit suivre le retard. Une premiere relance",
        "   sur le ton de la mise en demeure fait perdre des clients qui",
        "   avaient simplement oublie. */",
        "const jours = function (date) {",
        "  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);",
        "};",
        "",
        "return items",
        "  .filter(function (item) { return !item.json.payee; })",
        "  .map(function (item) {",
        "    const retard = jours(item.json.echeance);",
        "    let ton = 'rappel';",
        "    if (retard > 15) ton = 'ferme';",
        "    if (retard > 45) ton = 'mise en demeure';",
        "    return { json: Object.assign({}, item.json, { retard: retard, ton: ton }) };",
        "  })",
        "  .filter(function (item) { return item.json.retard > 0; });",
      ]),
    ]),
  ],

  [
    "08-qualification-leads.json",
    lineaire("flow_lab 08 — Qualification des leads entrants", [
      surWebhook("Recevoir le lead", "lead"),
      code("Noter le lead", [
        "/* Un score sert a ordonner une file d'attente, pas a juger",
        "   quelqu'un. Gardez les regles peu nombreuses et explicables. */",
        "const lead = $json.body || $json;",
        "const email = (lead.email || '').toLowerCase();",
        "let score = 0;",
        "",
        "/* Une adresse professionnelle signale un cadre d'usage serieux. */",
        "const GRATUITES = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.com'];",
        "const domaine = email.split('@')[1] || '';",
        "if (domaine && !GRATUITES.includes(domaine)) score += 30;",
        "",
        "if ((lead.message || '').length > 80) score += 20;",
        "if (lead.telephone) score += 20;",
        "if ((lead.entreprise || '').trim()) score += 30;",
        "",
        "return [{",
        "  json: {",
        "    email: email,",
        "    domaine: domaine,",
        "    score: score,",
        "    priorite: score >= 60 ? 'haute' : score >= 30 ? 'moyenne' : 'basse',",
        "  },",
        "}];",
      ]),
    ]),
  ],

  [
    "09-sauvegarde-quotidienne.json",
    lineaire("flow_lab 09 — Sauvegarde quotidienne horodatee", [
      planifie("Chaque nuit a 3 h", 3),
      code("Preparer la sauvegarde", [
        "/* Une sauvegarde qui ecrase la precedente ne protege de rien :",
        "   si la corruption passe inapercue une journee, il ne reste plus",
        "   aucune version saine. D'ou l'horodatage. */",
        "const maintenant = new Date();",
        "const horodatage = maintenant.toISOString().slice(0, 19).replace(/[:T]/g, '-');",
        "",
        "return [{",
        "  json: {",
        "    nomFichier: 'sauvegarde-' + horodatage + '.json',",
        "    date: maintenant.toISOString(),",
        "    /* Remplacez par la lecture de votre source reelle. */",
        "    contenu: [],",
        "  },",
        "}];",
      ]),
      code("Purger les anciennes", [
        "/* Conserver indefiniment finit par couter cher. Trente jours",
        "   couvrent largement le delai de detection d'une erreur. */",
        "const RETENTION_JOURS = 30;",
        "const limite = Date.now() - RETENTION_JOURS * 86400000;",
        "",
        "return [{ json: { aSupprimerAvant: new Date(limite).toISOString() } }];",
      ]),
    ]),
  ],

  [
    "10-recapitulatif-social.json",
    lineaire("flow_lab 10 — Recapitulatif des mentions sociales", [
      planifie("Chaque vendredi a 17 h", 17),
      code("Rassembler les mentions", [
        "/* A brancher sur les API des reseaux, ou sur un outil de veille.",
        "   La structure attendue est volontairement minimale. */",
        "return [",
        "  { json: { reseau: 'LinkedIn', auteur: 'Camille', texte: 'Merci pour le pack !', sentiment: 'positif' } },",
        "  { json: { reseau: 'X', auteur: 'Lou', texte: 'Ca ne marche pas chez moi', sentiment: 'negatif' } },",
        "];",
      ]),
      code("Classer et prioriser", [
        "/* Les mentions negatives passent en tete : ce sont les seules qui",
        "   coutent quelque chose si on les laisse sans reponse. */",
        "const ordre = { negatif: 0, neutre: 1, positif: 2 };",
        "",
        "const triees = items",
        "  .map(function (item) { return item.json; })",
        "  .sort(function (a, b) { return ordre[a.sentiment] - ordre[b.sentiment]; });",
        "",
        "const lignes = triees.map(function (m) {",
        "  return '[' + m.sentiment + '] ' + m.reseau + ' — ' + m.auteur + ' : ' + m.texte;",
        "});",
        "",
        "return [{",
        "  json: {",
        "    total: triees.length,",
        "    aRepondre: triees.filter(function (m) { return m.sentiment === 'negatif'; }).length,",
        "    recapitulatif: lignes.join('\\n'),",
        "  },",
        "}];",
      ]),
    ]),
  ],
];

for (const [nom, contenu] of PACK) {
  writeFileSync(join(DOSSIER, nom), JSON.stringify(contenu, null, 2) + "\n", "utf8");
}

console.log(`${PACK.length} workflows ecrits dans public/ressources/pack-workflows/`);
