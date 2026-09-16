// ========================================
// PAGE MES ESPACES SAUVEGARDÉS
// ========================================

// Rôle : charger les espaces enregistrés dans localStorage,
// afficher les espaces correspondants et permettre leur suppression.


// --- Éléments du DOM ---

const listeFavoris = document.querySelector("#liste-favoris");
const selectionVide = document.querySelector("#selection-vide");
const chargement = document.querySelector("#chargement");
const boutonViderSelection = document.querySelector("#vider-selection");
const nombreSelection = document.querySelector("#nombre-selection");


// Contient les espaces récupérés depuis espaces.json.
let espaces = [];


// ========================================
// CHARGEMENT DES ESPACES
// ========================================

// Rôle : récupérer les données du fichier espaces.json.
// Paramètres : aucun.
// Retour : aucun.
async function chargerEspaces() {

    try {

        chargement.hidden = false;

        const reponse = await fetch("data/espaces.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les espaces.");
        }

        espaces = await reponse.json();

        afficherFavoris();

    } catch (erreur) {

        listeFavoris.innerHTML = `
            <p class="mes-espaces__erreur" role="alert">
                Impossible de charger vos espaces sauvegardés.
            </p>
        `;

        console.error(erreur);

    } finally {

        chargement.hidden = true;
    }
}


// ========================================
// CRÉATION D'UNE CARTE
// ========================================

// Rôle : créer une carte compacte correspondant à la maquette.
// Paramètres : espace (objet contenant les données de l'espace).
// Retour : chaîne HTML représentant la carte.
function creerCarteFavori(espace) {

    return `
        <article class="favori">

            <img
                class="favori__image"
                src="${espace.images[0]}"
                alt="${espace.nom}"
                loading="lazy"
            >


            <div class="favori__contenu">

                <h2 class="favori__titre">
                    ${espace.nom}
                </h2>


                <p class="favori__localisation">
                    <img
                        src="assets/icons/point.svg"
                        alt=""
                        aria-hidden="true"
                    >
                    ${espace.quartier}
                </p>


                <div class="favori__informations">

                    <span class="favori__capacite">
                        <img
                            src="assets/icons/duo.svg"
                            alt=""
                            aria-hidden="true"
                        >
                        ${espace.capacite} pers.
                    </span>

                    <span class="favori__prix">
                        <strong>${espace.tarifs.heure}€</strong>
                        <span>/h</span>
                    </span>

                    <span
                        class="favori__note"
                        aria-label="Note ${espace.note} sur 5, ${espace.nombreAvis} avis"
                    >
                        ★★★★★
                        <span>
                            (${espace.nombreAvis})
                        </span>
                    </span>

                </div>

            </div>


            <div class="favori__actions">

                <a
                    href="espace.html?id=${espace.id}"
                    class="favori__voir"
                    aria-label="Voir la fiche de ${espace.nom}"
                >
                    Voir Fiche
                </a>

                <button
                    type="button"
                    class="favori__retirer"
                    data-id="${espace.id}"
                    aria-label="Retirer ${espace.nom} de mes espaces sauvegardés"
                >
                    <img
                        src="assets/icons/poubellegrise.svg"
                        alt=""
                        aria-hidden="true"
                    >
                    Retirer
                    
                </button>

            </div>

        </article>
    `;
}

// ========================================
// COMPTEUR DE LA SÉLECTION
// ========================================

// Rôle : afficher le nombre d'espaces actuellement sauvegardés.
// Paramètres : nombre (nombre de favoris).
// Retour : aucun.
function afficherNombreSelection(nombre) {

    const motEspace =
        nombre > 1 ? "espaces" : "espace";

    nombreSelection.textContent =
        `${nombre} ${motEspace} dans votre sélection`;
}


// ========================================
// AFFICHAGE DES FAVORIS
// ========================================

// Rôle : afficher uniquement les espaces dont l'ID
// est présent dans localStorage.
// Paramètres : aucun.
// Retour : aucun.
function afficherFavoris() {

    const favoris = recupererFavoris();

    const espacesFavoris = espaces.filter(
        (espace) => favoris.includes(espace.id)
    );


    // Mettre à jour le compteur sous le titre.
    afficherNombreSelection(espacesFavoris.length);


    // Nettoyer l'affichage précédent.
    listeFavoris.innerHTML = "";


    // Aucun espace sauvegardé.
    if (espacesFavoris.length === 0) {

        selectionVide.hidden = false;
        boutonViderSelection.hidden = true;

        return;
    }


    // Au moins un espace sauvegardé.
    selectionVide.hidden = true;
    boutonViderSelection.hidden = false;


    listeFavoris.innerHTML = espacesFavoris
        .map((espace) => creerCarteFavori(espace))
        .join("");
}


// ========================================
// RETIRER UN FAVORI
// ========================================

// Rôle : retirer un espace de la sélection.
// Paramètres : espaceId (identifiant de l'espace).
// Retour : aucun.
function supprimerFavori(espaceId) {

    retirerFavori(espaceId);

    afficherFavoris();
}


// ========================================
// VIDER LA SÉLECTION
// ========================================

// Rôle : supprimer tous les espaces sauvegardés.
// Paramètres : aucun.
// Retour : aucun.
function viderSelection() {

    enregistrerFavoris([]);

    mettreAJourCompteurFavoris();

    afficherFavoris();
}


// ========================================
// ÉVÉNEMENTS
// ========================================

// Rôle : détecter un clic sur un bouton "Retirer"
// même si les cartes ont été créées dynamiquement.
listeFavoris.addEventListener("click", (evenement) => {

    const boutonRetirer =
        evenement.target.closest(".favori__retirer");


    if (!boutonRetirer) {
        return;
    }


    const espaceId =
        Number(boutonRetirer.dataset.id);


    supprimerFavori(espaceId);
});


// Vider tous les espaces sauvegardés.
boutonViderSelection.addEventListener(
    "click",
    viderSelection
);


// ========================================
// INITIALISATION
// ========================================

chargerEspaces();