# flow_lab

Site vitrine et machine a collecter des leads pour flow_lab, agence
specialisee en automatisation n8n. Projet etudiant : aucune vente, aucun
paiement. L'objectif est la collecte d'emails et d'abonnes sur les reseaux.

Echeance du projet : 6 octobre 2026. Equipe de deux personnes.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4, entierement pilote par des tokens CSS
- Hebergement Vercel (offre gratuite)
- n8n Cloud pour l'automatisation, Google Sheets pour le stockage des leads,
  Brevo pour l'envoi des emails

## Demarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

## Direction artistique

Charte fournie dans `Downloads/flow_lab/flow_lab DA`, appliquee telle quelle :

| Token | Valeur | Usage |
| --- | --- | --- |
| `--color-bg` | `#f1f1f2` | fond de page |
| `--color-ink` | `#191919` | texte, cartes sombres, bande contact |
| `--color-brand` | `#dc7917` | accent, motifs pixel, liens |

Le motif signature est l'escalier de carres (`PixelStack`), accompagne des
reperes de coupe aux angles des blocs (`CropMarks`).

Typographies : Space Grotesk pour les titres, Inter pour le texte courant,
JetBrains Mono pour les intitules en capitales. Elles sont branchees sur les
variables `--font-app-*` : en changer ne touche aucun composant.

Le logotype est utilise en SVG vectorise, en trois declinaisons dans
`public/brand/` (sombre, clair, orange).

## Animations

Reprises du template de reference (wpriverthemes.com/agenio), qui utilise
GSAP + ScrollTrigger + SplitText, WOW.js et odometer. On a garde GSAP et
reecrit le reste sans jQuery.

| Composant | Effet | Repris de |
| --- | --- | --- |
| `motion/SplitReveal` | Les mots du titre remontent avec une legere inclinaison | `skew_up`, `title_animation` |
| `motion/Reveal` | Apparition en cascade des cartes au defilement | `wowActive` (WOW.js) |
| `motion/Counter` | Chiffres qui s'incrementent a l'entree dans l'ecran | `odoMeter` |
| `motion/Parallax` | Les decors pixel defilent moins vite que le contenu | `imageParalax` |
| `motion/MagicCursor` | Carre orange qui suit la souris et grossit sur les liens | `magicCoursor` |
| `motion/BackToTop` | Bouton de remontee avec anneau de progression | `backToTopInit` |
| `layout/Header` | En-tete qui se compacte apres 150 px de defilement | `stickyHeader` |
| `ui/Marquee` | Bandeaux defilants | `scrollingText` |

Le preloader du template n'a pas ete repris : sur un site dont le but est la
collecte, retarder l'affichage coute des leads.

Trois regles tenues partout :

1. **Le contenu est rendu visible cote serveur.** Les animations ne font que
   le masquer temporairement depuis un effet. Sans JavaScript, la page reste
   entierement lisible et indexable.
2. **`prefers-reduced-motion` coupe tout.** Les animations sont decoratives :
   si le systeme demande a les reduire, on n'anime pas du tout.
3. **Les declencheurs sont recalcules** une fois les polices chargees
   (`motion/MotionProvider`), sinon une section peut rester invisible parce
   que sa position a ete mesuree avec la police de secours.

Verifie : a huit hauteurs de defilement differentes sur la page d'accueil,
aucun element present a l'ecran n'est reste invisible.


## Ou se trouve quoi

| Chemin | Role |
| --- | --- |
| `src/app/globals.css` | Tous les tokens de design. Seul fichier a modifier pour faire evoluer la charte |
| `src/config/site.ts` | Navigation, reseaux sociaux, annonce, metadonnees |
| `src/content/resources.ts` | Les lead magnets. Ajouter un objet cree sa landing page et sa page merci |
| `src/content/courses.ts` | Les parcours de formation |
| `src/content/posts.ts` | Les articles du blog |
| `src/content/services.ts` | Les huit domaines d'intervention |
| `src/app/api/lead/route.ts` | Point d'entree unique de la collecte, relaie vers n8n |
| `src/components/lead/LeadForm.tsx` | Formulaire reutilisable (honeypot, attribution, etats) |
| `src/lib/attribution.ts` | Capture UTM et referent a la premiere visite |
| `src/components/motion/` | Toutes les animations, voir la section dediee |

## Le parcours de collecte

Chaque page mene a un formulaire. Tous pointent vers la meme API.

```
Formulaire -> /api/lead -> webhook n8n
                             |- validation, honeypot, limite de debit
                             |- stockage du lead (Google Sheets)
                             |- envoi de la ressource (Brevo)
                             |- tag selon la source et l'UTM d'origine
                             `- sequence de relance J+1, J+3, J+7
```

Points d'entree presents sur le site :

- la carte du hero de l'accueil
- une landing page dediee par ressource
- un formulaire par parcours de formation
- le content upgrade en fin de chaque article de blog
- la colonne laterale du blog
- la bande de contact sombre, presente en bas de toutes les pages

La page `/merci/[slug]` est le second etage : elle presente la collecte comme
une etape 1 sur 2, et consacre l'etape 2 au suivi des comptes sociaux. C'est la
que se joue la conversion email vers abonne.

## Le workflow n8n a construire

Le site envoie un seul POST JSON par lead, vers `N8N_WEBHOOK_URL`. Charge utile
reelle, relevee lors d'un test de bout en bout :

```json
{
  "email": "prenom@entreprise.fr",
  "firstName": "Prenom",
  "source": "pack-10-workflows-n8n",
  "tag": "pack-workflows",
  "message": "optionnel, formulaire de contact",
  "attribution": {
    "utmSource": "linkedin",
    "utmMedium": "post",
    "utmCampaign": "lancement",
    "referrer": "https://www.linkedin.com/",
    "landingPath": "/ressources/pack-10-workflows-n8n",
    "ref": "code-de-parrainage"
  },
  "receivedAt": "2026-09-16T11:19:03.014Z",
  "userAgent": "..."
}
```

L'email est normalise (minuscules, espaces retires) avant l'envoi.

Cote n8n, le workflow attendu :

1. **Webhook** (POST) — verifier l'en-tete `X-Flowlab-Secret`, rejeter sinon.
2. **Google Sheets — Append** : une ligne par lead (email, prenom, source, tag,
   utm_source, date). C'est la base consultable par l'equipe.
3. **Switch sur `tag`** : chaque lead magnet part vers sa propre branche.
4. **Brevo — Add contact to list** : une liste par tag, pour pouvoir segmenter
   les relances ensuite.
5. **Brevo — Send transactional email** : livraison immediate de la ressource.
6. **Wait + Brevo** pour la sequence de relance J+1, J+3, J+7.

Tags emis par le site : `pack-workflows`, `livre-blanc`, `mini-formation`,
`formation-metier`, `formation-equipes`, `newsletter`, `contact`.

Le tag `mini-formation` utilise la meme mecanique avec cinq etapes `Wait` d'un
jour, une par lecon.

## Protections en place

Verifiees par test de bout en bout :

- email invalide : reponse 400
- champ piege rempli : reponse 200 sans transmission, le bot ne sait pas qu'il
  a ete ecarte
- plus de cinq envois par minute et par IP : reponse 429
- webhook injoignable ou non configure : reponse 503, le visiteur voit un
  message clair plutot qu'une page cassee

L'URL du webhook n'est jamais exposee au navigateur : elle reste cote serveur.

## Deploiement

Depot : https://github.com/Tjln/flow-lab. Chaque push sur `main` declenche un
deploiement.

Seules deux variables sont a renseigner dans Vercel : `N8N_WEBHOOK_URL` et
`N8N_WEBHOOK_SECRET`. L'adresse publique du site est deduite du domaine de
production fourni par Vercel ; `NEXT_PUBLIC_SITE_URL` ne sert qu'a la forcer,
le jour ou un vrai nom de domaine sera pose.

Attention : n8n Cloud en offre d'essai est limite dans le temps. A son
expiration, le site continue d'afficher les formulaires mais les leads ne sont
plus traites. Basculer vers un n8n auto-heberge ne demande que de changer
`N8N_WEBHOOK_URL` dans Vercel.

## Ce qui reste a faire

- [ ] Construire le workflow n8n decrit ci-dessus
- [ ] Creer les comptes sociaux et remplacer les URL dans `src/config/site.ts`
- [ ] Produire les ressources reelles (fichiers JSON, PDF, sequence email)
- [ ] Completer les mentions legales avec les informations de l'etablissement
- [ ] Ajouter les images d'illustration et une image de partage social
- [ ] Boucle de parrainage : compteur sur le code `ref` deja transmis a n8n
