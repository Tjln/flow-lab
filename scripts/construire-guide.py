"""
Genere le guide PDF livre avec le pack de workflows.

La charte du site est reproduite : fond casse, texte noir, accent orange et
le motif en escalier de carres. La typographie utilise Helvetica, integree a
tous les lecteurs PDF : embarquer la police du site aurait alourdi le fichier
et pose une question de licence pour un document diffuse publiquement.

Usage : python scripts/construire-guide.py
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

# --- Charte -----------------------------------------------------------------

FOND = HexColor("#f1f1f2")
NOIR = HexColor("#191919")
ORANGE = HexColor("#dc7917")
GRIS = HexColor("#6f6f74")
BLANC = HexColor("#ffffff")

LARGEUR, HAUTEUR = A4
MARGE = 22 * mm

SORTIE = Path("public/ressources/pack-workflows/guide-flow_lab.pdf")


def escalier(canvas, x, y, cote, couleur, montant=False):
    """Motif signature de la charte : un escalier de quatre carres."""
    cases = [(0, 2), (1, 1), (1, 0), (2, 0)] if montant else [(0, 0), (1, 1), (2, 1), (2, 2)]
    canvas.setFillColor(couleur)
    for col, ligne in cases:
        canvas.rect(x + col * cote, y - ligne * cote, cote, cote, stroke=0, fill=1)


def page_couverture(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NOIR)
    canvas.rect(0, 0, LARGEUR, HAUTEUR, stroke=0, fill=1)

    escalier(canvas, LARGEUR - MARGE - 45 * mm, HAUTEUR - MARGE, 15 * mm, ORANGE)

    # Logotype reconstitue : carre orange puis le mot, comme dans l'en-tete du site.
    canvas.setFillColor(ORANGE)
    canvas.rect(MARGE, HAUTEUR - MARGE - 4 * mm, 4 * mm, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(FOND)
    canvas.setFont("Helvetica-BoldOblique", 16)
    canvas.drawString(MARGE + 7 * mm, HAUTEUR - MARGE - 3.5 * mm, "flow_lab")

    canvas.setFillColor(FOND)
    canvas.setFont("Helvetica-Bold", 38)
    canvas.drawString(MARGE, 150 * mm, "Le pack de 10")
    canvas.drawString(MARGE, 134 * mm, "workflows n8n")

    canvas.setFillColor(ORANGE)
    canvas.rect(MARGE, 126 * mm, 28 * mm, 1.6 * mm, stroke=0, fill=1)

    canvas.setFillColor(GRIS)
    canvas.setFont("Helvetica", 12)
    canvas.drawString(MARGE, 112 * mm, "Guide d'installation et d'utilisation")

    canvas.setFillColor(FOND)
    canvas.setFont("Helvetica", 10)
    canvas.drawString(MARGE, 40 * mm, "flow_lab — projet etudiant")
    canvas.drawString(MARGE, 34 * mm, "Libre d'usage et de modification, revente interdite")

    escalier(canvas, MARGE, 22 * mm, 6 * mm, ORANGE, montant=True)
    canvas.restoreState()


def page_interieure(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(FOND)
    canvas.rect(0, 0, LARGEUR, HAUTEUR, stroke=0, fill=1)

    # En-tete
    canvas.setFillColor(ORANGE)
    canvas.rect(MARGE, HAUTEUR - MARGE + 4 * mm, 3 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(GRIS)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(MARGE + 6 * mm, HAUTEUR - MARGE + 4.3 * mm, "flow_lab — pack de 10 workflows n8n")

    # Filet de separation
    canvas.setStrokeColor(HexColor("#dcdcde"))
    canvas.setLineWidth(0.5)
    canvas.line(MARGE, HAUTEUR - MARGE + 1 * mm, LARGEUR - MARGE, HAUTEUR - MARGE + 1 * mm)

    # Pied de page
    canvas.setFillColor(GRIS)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(MARGE, 12 * mm, "flow-lab-iota.vercel.app")
    canvas.drawRightString(LARGEUR - MARGE, 12 * mm, str(doc.page - 1))
    canvas.restoreState()


# --- Styles -----------------------------------------------------------------

def style(nom, taille, couleur, gras=False, avant=0, apres=4, interligne=None):
    return ParagraphStyle(
        nom,
        fontName="Helvetica-Bold" if gras else "Helvetica",
        fontSize=taille,
        textColor=couleur,
        leading=interligne or taille * 1.45,
        spaceBefore=avant,
        spaceAfter=apres,
        alignment=TA_LEFT,
    )


TITRE = style("titre", 20, NOIR, gras=True, avant=14, apres=8)
SOUS_TITRE = style("sous_titre", 13, NOIR, gras=True, avant=10, apres=3)
TEXTE = style("texte", 10, GRIS, apres=6)
TEXTE_FORT = style("texte_fort", 10, NOIR, apres=6)
NUMERO = style("numero", 10, ORANGE, gras=True, apres=1)
PUCE = ParagraphStyle(
    "puce", parent=TEXTE, leftIndent=10, bulletIndent=0, spaceAfter=3,
)


# --- Contenu ----------------------------------------------------------------

WORKFLOWS = [
    ("01", "Veille automatisee",
     "Lit un flux RSS chaque matin, ecarte le bruit avec un filtre de mots-cles, "
     "et assemble un resume unique.",
     "Une source RSS, et l'outil ou vous voulez recevoir le resume."),
    ("02", "Relance des prospects sans reponse",
     "Repere les prospects silencieux au-dela d'un delai, dans la limite d'un "
     "nombre de relances, et redige le message.",
     "Votre CRM ou une feuille de suivi, et un envoi d'email."),
    ("03", "Publication multi-reseaux",
     "Recoit un contenu une seule fois et le decline au format de chaque reseau.",
     "Les acces aux reseaux sur lesquels vous publiez."),
    ("04", "Accuse de reception et routage",
     "Valide l'adresse d'un formulaire, repond immediatement, et oriente la "
     "demande vers le commercial, le support ou le general.",
     "Votre formulaire, et les destinations de chaque file."),
    ("05", "Rapport hebdomadaire consolide",
     "Rassemble plusieurs sources chaque lundi, calcule les evolutions et met "
     "en forme un rapport lisible.",
     "Vos sources de donnees reelles a la place des valeurs d'exemple."),
    ("06", "Surveillance d'un site",
     "Appelle votre site toutes les quinze minutes et signale une absence de "
     "reponse.",
     "L'adresse a surveiller, et un canal d'alerte."),
    ("07", "Relance des factures impayees",
     "Trie les factures par retard et adapte le ton de la relance : rappel, "
     "ferme, puis mise en demeure.",
     "Votre outil de facturation ou une feuille de suivi."),
    ("08", "Qualification des leads entrants",
     "Attribue un score a chaque lead selon le domaine de son adresse, la "
     "longueur du message et les informations fournies.",
     "Le formulaire qui recoit vos leads."),
    ("09", "Sauvegarde quotidienne horodatee",
     "Sauvegarde chaque nuit sans ecraser la veille, et purge au-dela de "
     "trente jours.",
     "La source a sauvegarder, et l'espace de stockage."),
    ("10", "Recapitulatif des mentions sociales",
     "Rassemble les mentions de la semaine et fait remonter les negatives en "
     "premier.",
     "Les acces aux reseaux, ou un outil de veille."),
]

ERREURS = [
    ("Ne pas gerer les erreurs",
     "Un workflow sans branche d'erreur echoue en silence. Vous le decouvrez "
     "le jour ou quelqu'un s'etonne de n'avoir rien recu depuis un mois."),
    ("Tout mettre dans un seul workflow",
     "Un workflow de quarante nodes est impossible a debuguer. Decoupez en "
     "plusieurs workflows appeles les uns par les autres."),
    ("Ecrire les identifiants en dur",
     "Les credentials de n8n existent pour cela. Une cle d'API ecrite dans un "
     "node finit toujours par etre partagee par accident lors d'un export."),
    ("Tester sur des donnees reelles",
     "Le premier test qui envoie deux cents emails a de vrais clients est une "
     "experience dont on se souvient. Travaillez sur un jeu de test tant que "
     "le workflow n'est pas stable."),
    ("Ne rien documenter",
     "Dans six mois, vous ne saurez plus pourquoi ce node filtre cette valeur. "
     "Une phrase par node suffit, mais ecrivez-la le jour ou vous le construisez."),
]


def construire():
    SORTIE.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(SORTIE),
        pagesize=A4,
        title="Le pack de 10 workflows n8n — flow_lab",
        author="flow_lab",
        subject="Guide d'installation et d'utilisation",
    )

    cadre = Frame(
        MARGE, 20 * mm, LARGEUR - 2 * MARGE, HAUTEUR - MARGE - 26 * mm, id="corps"
    )
    doc.addPageTemplates([
        PageTemplate(id="couverture", frames=[cadre], onPage=page_couverture),
        PageTemplate(id="interieure", frames=[cadre], onPage=page_interieure),
    ])

    contenu = [NextPageTemplate("interieure"), PageBreak()]

    contenu.append(Paragraph("Avant de commencer", TITRE))
    contenu.append(Paragraph(
        "Ce pack contient dix workflows prets a importer. Ils sont volontairement "
        "simples : l'objectif est que vous compreniez la logique et que vous "
        "puissiez la modifier, pas que vous exécutiez une boite noire.",
        TEXTE))
    contenu.append(Paragraph(
        "Chaque node porte une note explicative. Lisez-les : un workflow qu'on "
        "ne comprend pas est un workflow qu'on ne modifiera jamais, et qui finit "
        "par etre desactive au premier probleme.",
        TEXTE))

    contenu.append(Paragraph("Installer n8n", SOUS_TITRE))
    contenu.append(Paragraph(
        "Deux options. <b>n8n Cloud</b> ne demande aucune installation, avec un "
        "essai gratuit limite dans le temps. <b>L'auto-hebergement</b> vous rend "
        "proprietaire de vos donnees et ne vous penalise pas quand les volumes "
        "augmentent, contre un peu de mise en place.",
        TEXTE))
    contenu.append(Paragraph(
        "Pour un premier essai, le Cloud suffit. Pour de la production avec des "
        "donnees clients, l'auto-hebergement se justifie.",
        TEXTE))

    contenu.append(Paragraph("Importer un workflow", SOUS_TITRE))
    for i, etape in enumerate([
        "Ouvrez n8n, menu <b>Workflows</b>, bouton <b>Import from File</b>.",
        "Choisissez le fichier JSON du pack.",
        "Renseignez vos identifiants dans les nodes qui en demandent.",
        "Executez une fois a la main pour voir les donnees circuler.",
        "Activez le workflow seulement une fois le resultat verifie.",
    ], start=1):
        contenu.append(Paragraph(f"{i}. {etape}", PUCE))

    contenu.append(Spacer(1, 4 * mm))
    contenu.append(Paragraph(
        "<b>Un conseil</b> : ne branchez pas vos vraies donnees au premier essai. "
        "Les workflows du pack fonctionnent avec des valeurs d'exemple, ce qui "
        "vous permet de voir la logique tourner sans risque.",
        TEXTE_FORT))

    contenu.append(PageBreak())
    contenu.append(Paragraph("Les dix workflows", TITRE))
    contenu.append(Paragraph(
        "Pour chacun : ce qu'il fait, et ce que vous devez brancher pour qu'il "
        "serve reellement.",
        TEXTE))
    contenu.append(Spacer(1, 3 * mm))

    for numero, nom, fait, brancher in WORKFLOWS:
        contenu.append(Paragraph(numero, NUMERO))
        contenu.append(Paragraph(nom, SOUS_TITRE))
        contenu.append(Paragraph(fait, TEXTE))
        contenu.append(Paragraph(f"<b>A brancher :</b> {brancher}", TEXTE))
        contenu.append(Spacer(1, 2 * mm))

    contenu.append(PageBreak())
    contenu.append(Paragraph("Les cinq erreurs a eviter", TITRE))
    contenu.append(Paragraph(
        "Nous les avons toutes commises. Les connaitre vous fera gagner vos "
        "premieres semaines.",
        TEXTE))
    contenu.append(Spacer(1, 3 * mm))

    for i, (titre, texte) in enumerate(ERREURS, start=1):
        contenu.append(Paragraph(f"{i:02d}", NUMERO))
        contenu.append(Paragraph(titre, SOUS_TITRE))
        contenu.append(Paragraph(texte, TEXTE))
        contenu.append(Spacer(1, 2 * mm))

    contenu.append(Spacer(1, 6 * mm))
    contenu.append(Paragraph("Aller plus loin", TITRE))
    contenu.append(Paragraph(
        "Nous publions une trouvaille n8n chaque semaine, et le pack s'enrichit "
        "au fil de nos missions. Vous recevrez les nouveaux workflows par email, "
        "sans rien avoir a faire.",
        TEXTE))
    contenu.append(Paragraph(
        "Une question sur un workflow ? Repondez simplement a l'email qui vous a "
        "livre ce pack : nous lisons tout.",
        TEXTE))

    doc.build(contenu)
    print(f"Guide genere : {SORTIE} ({SORTIE.stat().st_size} octets)")


if __name__ == "__main__":
    construire()
