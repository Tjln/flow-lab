# Workflow n8n — collecte de leads

Ce dossier contient le workflow qui recoit les formulaires du site et envoie
l'email de confirmation aux couleurs de la charte.

| Fichier | Role |
| --- | --- |
| `flowlab-lead.json` | Le workflow, a importer dans n8n |
| `preparer-email.js` | Le code du noeud « Preparer l'email », en version lisible |
| `construire-workflow.mjs` | Regenere le JSON a partir du `.js` |
| `apercu-email.html` | Rendu de l'email, a ouvrir dans un navigateur |

Pour modifier les emails : editer `preparer-email.js`, puis

```bash
node n8n/construire-workflow.mjs
```

et reimporter le JSON dans n8n. Ne pas editer le JSON a la main : le code y
est echappe, une erreur d'echappement casse l'import sans message clair.

## Le trajet d'un lead

```
Formulaire du site
   |
   v
/api/lead            (Next.js : validation, piege a bots, limite de debit)
   |  POST + en-tete X-Flowlab-Secret
   v
Webhook du site      (n8n)
   |
   v
Secret valide ?  --- non ---> Refuser 401
   |
  oui
   |
   v
Repondre 200         (le site est libere tout de suite)
   |
   v
Preparer l'email     (choisit le contenu selon le tag, construit le HTML)
   |
   v
Envoyer via Brevo    (API transactionnelle)
```

Le site est libere avant l'envoi : si Brevo met quatre secondes, le visiteur
voit quand meme sa page de confirmation immediatement.

## Les deux valeurs a remplacer apres l'import

Le JSON contient deux marqueurs volontairement explicites :

| Marqueur | Ou | Remplacer par |
| --- | --- | --- |
| `REMPLACER_PAR_VOTRE_SECRET` | noeud « Secret valide ? » | la meme valeur que `N8N_WEBHOOK_SECRET` dans Vercel |
| `REMPLACER_PAR_VOTRE_CLE_BREVO` | noeud « Envoyer via Brevo » | la cle API v3 de Brevo |

## Les tags emis par le site

Le champ `tag` du JSON recu determine le contenu de l'email.

| Tag | Origine |
| --- | --- |
| `pack-workflows` | landing du pack de workflows |
| `livre-blanc` | landing du guide |
| `mini-formation` | mini-formation par email |
| `formation-metier` | liste d'attente du parcours metier |
| `formation-equipes` | liste d'attente de l'atelier equipes |
| `newsletter` | pied de page, blog, page ressources |
| `contact` | formulaire de contact |

Un tag inconnu retombe sur le contenu `newsletter` plutot que d'echouer.

## Ce que ce workflow ne fait pas encore

- Il n'enregistre rien : les adresses ne sont connues que de Brevo. Ajouter un
  noeud Google Sheets apres « Repondre 200 » quand la base de contacts sera
  necessaire.
- Il n'envoie pas la sequence de relance J+1, J+3, J+7.
- La mini-formation envoie un seul email, pas les cinq lecons.
