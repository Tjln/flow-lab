# Workflow n8n — collecte de leads

Ce dossier contient le workflow qui recoit les formulaires du site et envoie
l'email de confirmation aux couleurs de la charte.

| Fichier | Role |
| --- | --- |
| `flowlab-lead.json` | Workflow principal : formulaires du site |
| `flowlab-telechargement.json` | Workflow secondaire : comptage des telechargements |
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
Preparer le message  (choisit le contenu selon le tag, construit le HTML
   |                  et la fiche contact)
   v
Ajouter le contact   (POST /v3/contacts : alimente la base Brevo)
   |
   v
Envoyer l'email      (POST /v3/smtp/email : transactionnel)
```

Le site est libere avant l'envoi : si Brevo met quatre secondes, le visiteur
voit quand meme sa page de confirmation immediatement.

## Les deux valeurs a remplacer apres l'import

Le JSON contient deux marqueurs volontairement explicites :

| Marqueur | Ou | Remplacer par |
| --- | --- | --- |
| `REMPLACER_PAR_VOTRE_SECRET` | noeud « Secret valide ? » | la meme valeur que `N8N_WEBHOOK_SECRET` dans Vercel |
| `REMPLACER_PAR_VOTRE_CLE_BREVO` | noeuds « Ajouter le contact » **et** « Envoyer l'email » | la cle API v3 de Brevo |

## Les listes Brevo

Un email transactionnel ne cree aucun contact : les deux appels sont
distincts. C'est « Ajouter le contact » qui alimente la base sur laquelle se
mesurent les taux d'ouverture et se lancent les campagnes.

Avant que cela fonctionne, il faut :

1. Creer les listes dans Brevo (Contacts, onglet Lists). Au minimum une liste
   generale, qui recevra tout le monde.
2. Creer trois attributs texte dans Contacts, Settings, Contact attributes :
   `SOURCE`, `TAG` et `CANAL`. Brevo refuse les attributs inconnus.
   `PRENOM` existe deja sur un compte en francais.
3. Reporter les identifiants de liste en haut de `preparer-email.js` :
   `LISTE_PRINCIPALE` puis, si besoin, une liste par tag. L'identifiant est le
   nombre visible dans l'URL de la liste.
4. Regenerer et reimporter le workflow.

`updateEnabled: true` est indispensable : sans lui, une deuxieme inscription
avec la meme adresse renvoie une erreur au lieu de mettre le contact a jour.

Le noeud « Ajouter le contact » est regle pour laisser passer en cas d'echec :
un probleme de liste ne doit pas priver le visiteur de sa ressource. L'erreur
reste visible dans Executions.

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

## Le second workflow : comptage des telechargements

Les evenements personnalises de la mesure d'audience Vercel sont reserves aux
offres payantes. Le comptage passe donc par n8n, deja en place.

1. Importer `flowlab-telechargement.json`, remplacer le secret, activer.
2. Copier la Production URL du webhook.
3. La renseigner dans Vercel sous `N8N_WEBHOOK_TELECHARGEMENT_URL`, puis
   redeployer.
4. Brancher un node Google Sheets « Append » apres « Formater la ligne » : les
   colonnes `date`, `ressource`, `fichier` et `canal` sont deja preparees.

Le site appelle ce webhook puis sert le fichier sans attendre la reponse. Si
n8n est injoignable, le visiteur recoit sa ressource et seule la statistique
est perdue : le comptage ne doit jamais bloquer un telechargement.

## Ce que ce workflow ne fait pas encore

- Il n'envoie pas la sequence de relance J+1, J+3, J+7.
- Il ne recopie rien dans Google Sheets : la base vit uniquement dans Brevo.
- La mini-formation envoie un seul email, pas les cinq lecons.
