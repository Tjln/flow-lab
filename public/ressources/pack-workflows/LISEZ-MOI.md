# Pack de workflows n8n — flow_lab

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
