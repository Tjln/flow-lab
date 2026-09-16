/**
 * Code du noeud « Preparer l'email » du workflow n8n.
 *
 * Ce fichier est la version lisible de ce qui est embarque dans
 * flowlab-lead.json. Pour modifier les emails, modifier ici puis
 * regenerer le workflow avec : node n8n/construire-workflow.mjs
 *
 * Un seul gabarit HTML, decline par tag : le message change, la mise en
 * forme reste celle de la charte. Ajouter une ressource sur le site
 * revient donc a ajouter une entree dans CONTENUS, rien d'autre.
 */

const SITE = 'https://flow-lab-iota.vercel.app';

/* Couleurs de la charte. Les emails ne connaissent pas les variables CSS :
   il faut les repeter en dur, donc on les centralise ici. */
const NOIR = '#191919';
const ORANGE = '#dc7917';
const FOND = '#f1f1f2';
const GRIS = '#6f6f74';

/**
 * Listes Brevo. Un email transactionnel ne cree aucun contact : c'est un
 * appel distinct, et c'est lui qui alimente la base sur laquelle on mesure
 * les taux d'ouverture et on lance les campagnes.
 *
 * LISTE_PRINCIPALE recoit tout le monde : c'est elle qu'on vise pour la
 * newsletter et les annonces d'articles.
 * LISTES_PAR_TAG ajoute une liste ciblee, pour pouvoir relancer par centre
 * d'interet sans ecrire a toute la base.
 *
 * Les identifiants sont des nombres, lisibles dans l'URL de chaque liste
 * dans Brevo. Mettre 0 pour desactiver une liste ciblee.
 */
const LISTE_PRINCIPALE = 4;

const LISTES_PAR_TAG = {
  'pack-workflows': 0,
  'livre-blanc': 0,
  'mini-formation': 0,
  'formation-metier': 0,
  'formation-equipes': 0,
  newsletter: 0,
  contact: 0,
};

const CONTENUS = {
  'pack-workflows': {
    objet: 'Votre pack de 10 workflows n8n',
    titre: 'Votre pack est pret',
    intro: "Merci ! Voici les 10 workflows que nous deployons le plus souvent chez nos clients. Chaque fichier s'importe directement dans n8n.",
    points: [
      '10 fichiers JSON a importer',
      "Un guide d'installation pas a pas",
      'La liste des acces necessaires pour chaque workflow',
    ],
    cta: 'Telecharger le pack',
    lien: SITE + '/telechargement/pack-10-workflows-n8n',
  },
  'livre-blanc': {
    objet: 'Votre guide : automatiser son business en 2026',
    titre: 'Votre guide est pret',
    intro: 'Merci ! Voici notre methode pour reperer et chiffrer les taches qui vous coutent le plus de temps.',
    points: [
      "La methode d'audit en 4 etapes",
      'Le tableau de calcul du temps economise',
      "15 cas d'usage classes par metier",
    ],
    cta: 'Telecharger le guide',
    lien: SITE + '/telechargement/guide-automatiser-son-business',
  },
  'mini-formation': {
    objet: 'Votre premiere lecon arrive demain',
    titre: 'Bienvenue dans la formation',
    intro: 'Vous recevrez une lecon par jour pendant cinq jours. Dix minutes chaque matin, et un workflow qui tourne pour de vrai a la fin.',
    points: [
      'Jour 1 : installer n8n et comprendre les nodes',
      'Jour 2 : les declencheurs',
      'Jour 3 : connecter deux outils',
    ],
    cta: 'Voir le programme complet',
    lien: SITE + '/formations',
  },
  'formation-metier': {
    objet: "Vous etes sur la liste d'attente",
    titre: 'Votre place est reservee',
    intro: "Merci ! Vous serez prevenu en premier a l'ouverture du parcours Construire vos workflows metier.",
    points: [],
    cta: 'Voir les autres parcours',
    lien: SITE + '/formations',
  },
  'formation-equipes': {
    objet: "Vous etes sur la liste d'attente",
    titre: 'Votre place est reservee',
    intro: "Merci ! Vous serez prevenu en premier a l'ouverture de l'atelier n8n a l'echelle d'une equipe.",
    points: [],
    cta: 'Voir les autres parcours',
    lien: SITE + '/formations',
  },
  newsletter: {
    objet: 'Bienvenue chez flow_lab',
    titre: 'Vous etes inscrit',
    intro: "Chaque semaine, vous recevrez un workflow n8n utile, avec le fichier a importer. Rien d'autre.",
    points: [],
    cta: 'Decouvrir les ressources gratuites',
    lien: SITE + '/ressources',
  },
  contact: {
    objet: 'Nous avons bien recu votre message',
    titre: 'Message bien recu',
    intro: 'Merci de nous avoir ecrit. Nous revenons vers vous sous 48 heures ouvrees avec une premiere piste.',
    points: [],
    cta: 'Voir nos services',
    lien: SITE + '/services',
  },
};

/**
 * Marque les liens de l'email pour que le clic soit reconnaissable.
 *
 * Brevo compte les clics de son cote, mais ne dit rien de ce que la personne
 * fait ensuite sur le site. Ces parametres sont lus par la mesure d'audience
 * et par la capture d'origine du site, qui les conserve jusqu'a une eventuelle
 * conversion ulterieure.
 */
function marquer(url, campagne) {
  const separateur = url.indexOf('?') === -1 ? '?' : '&';
  return url + separateur
    + 'utm_source=email&utm_medium=transactionnel&utm_campaign='
    + encodeURIComponent(campagne);
}

/* Le site poste un JSON : selon la configuration du webhook, il arrive
   sous $json.body ou directement dans $json. On accepte les deux. */
const lead = $json.body || $json;
const tag = lead.tag || 'newsletter';
const contenu = CONTENUS[tag] || CONTENUS.newsletter;
const prenom = (lead.firstName || '').trim();
const bonjour = prenom ? 'Bonjour ' + prenom + ',' : 'Bonjour,';

/* Escalier de carres de la charte, construit en cellules de tableau :
   c'est le seul moyen fiable d'obtenir le meme rendu dans Gmail,
   Outlook et Apple Mail, qui ignorent une bonne partie du CSS. */
const CARRES = [[0, 0], [1, 1], [2, 1], [2, 2]];
let escalier = '<table role="presentation" cellpadding="0" cellspacing="0" border="0">';
for (let ligne = 0; ligne < 3; ligne++) {
  escalier += '<tr>';
  for (let col = 0; col < 3; col++) {
    const plein = CARRES.some(function (c) { return c[0] === col && c[1] === ligne; });
    escalier += '<td width="14" height="14" style="width:14px;height:14px;line-height:14px;font-size:0;background:'
      + (plein ? ORANGE : 'transparent') + ';">&nbsp;</td>';
  }
  escalier += '</tr>';
}
escalier += '</table>';

let listePoints = '';
if (contenu.points.length) {
  const lignes = contenu.points.map(function (point) {
    return '<tr>'
      + '<td width="18" valign="top" style="padding:4px 0;"><div style="width:6px;height:6px;background:' + ORANGE + ';margin-top:8px;"></div></td>'
      + '<td style="padding:4px 0;font-size:15px;line-height:22px;color:' + GRIS + ';">' + point + '</td>'
      + '</tr>';
  }).join('');
  listePoints = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;">'
    + lignes + '</table>';
}

const RESEAUX = [
  ['LinkedIn', 'https://linkedin.com/company/flow-lab'],
  ['X', 'https://x.com/flowlab_fr'],
  ['YouTube', 'https://youtube.com/@flowlab'],
  ['Instagram', 'https://instagram.com/flowlab.fr'],
  ['TikTok', 'https://tiktok.com/@flowlab.fr'],
];
const liensReseaux = RESEAUX.map(function (r) {
  return '<a href="' + marquer(r[1], 'email-' + tag) + '" style="color:' + FOND + ';text-decoration:none;font-size:13px;padding:0 7px;">' + r[0] + '</a>';
}).join('<span style="color:#4a4a4a;">&middot;</span>');

const html = '<!DOCTYPE html>'
  + '<html lang="fr"><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>' + contenu.objet + '</title></head>'
  + '<body style="margin:0;padding:0;background:' + FOND + ';">'
  // Texte d'apercu : ce que la boite mail affiche a cote de l'objet.
  + '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + contenu.intro + '</div>'
  + '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:' + FOND + ';">'
  + '<tr><td align="center" style="padding:32px 16px;">'
  + '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">'

  // Bandeau superieur, avec le logotype reconstitue en texte.
  + '<tr><td style="background:' + NOIR + ';padding:20px 32px;">'
  + '<span style="display:inline-block;width:10px;height:10px;background:' + ORANGE + ';vertical-align:middle;"></span>'
  + '<span style="color:' + FOND + ';font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:bold;font-style:italic;letter-spacing:-0.3px;padding-left:10px;vertical-align:middle;">'
  + 'flow<span style="color:' + ORANGE + ';">_</span>lab</span>'
  + '</td></tr>'

  // Corps du message.
  + '<tr><td style="background:#ffffff;padding:40px 32px;font-family:Helvetica,Arial,sans-serif;">'
  + escalier
  + '<h1 style="margin:24px 0 0 0;font-size:30px;line-height:36px;color:' + NOIR + ';font-weight:bold;letter-spacing:-0.5px;">' + contenu.titre + '</h1>'
  + '<p style="margin:20px 0 0 0;font-size:16px;line-height:25px;color:' + NOIR + ';">' + bonjour + '</p>'
  + '<p style="margin:12px 0 0 0;font-size:16px;line-height:25px;color:' + GRIS + ';">' + contenu.intro + '</p>'
  + listePoints
  + '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;"><tr>'
  + '<td style="background:' + ORANGE + ';"><a href="' + marquer(contenu.lien, tag) + '" style="display:inline-block;padding:15px 32px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">' + contenu.cta + '</a></td>'
  + '</tr></table>'
  + '<p style="margin:28px 0 0 0;font-size:13px;line-height:20px;color:' + GRIS + ';">Une question ? Repondez simplement a cet email, nous lisons tout.</p>'
  + '</td></tr>'

  // Pied de page.
  + '<tr><td style="background:' + NOIR + ';padding:28px 32px;font-family:Helvetica,Arial,sans-serif;text-align:center;">'
  + '<div style="margin-bottom:14px;">' + liensReseaux + '</div>'
  + '<p style="margin:0;font-size:12px;line-height:19px;color:#9a9a9f;">'
  + 'flow_lab, projet etudiant. Aucune vente.<br>'
  + "Vous recevez cet email parce que vous l'avez demande sur notre site.<br>"
  + '<a href="{{ unsubscribe }}" style="color:#9a9a9f;text-decoration:underline;">Se desinscrire en un clic</a>'
  + '</p></td></tr>'

  + '</table></td></tr></table></body></html>';

/* Listes auxquelles rattacher ce contact, doublons et zeros ecartes. */
const listIds = [LISTE_PRINCIPALE, LISTES_PAR_TAG[tag]]
  .filter(function (id) { return Number.isInteger(id) && id > 0; })
  .filter(function (id, i, tous) { return tous.indexOf(id) === i; });

const attribution = lead.attribution || {};

/* Charges utiles attendues par l'API Brevo, pretes a etre envoyees. */
return [{
  json: {
    objet: contenu.objet,
    destinataire: lead.email,
    tag: tag,
    contactPayload: {
      email: lead.email,
      attributes: {
        PRENOM: prenom || '',
        SOURCE: lead.source || '',
        TAG: tag,
        CANAL: attribution.utmSource || attribution.referrer || 'direct',
      },
      listIds: listIds,
      // Sans ceci, une seconde inscription avec la meme adresse renvoie une
      // erreur au lieu de mettre le contact a jour.
      updateEnabled: true,
    },
    brevoPayload: {
      sender: { name: 'flow_lab', email: 'flow.lab003@gmail.com' },
      to: [prenom ? { email: lead.email, name: prenom } : { email: lead.email }],
      subject: contenu.objet,
      htmlContent: html,
      tags: [tag],
    },
  },
}];
