// ========================================
// GESTION DES FAVORIS
// ========================================

// Rôle : gérer les espaces favoris avec localStorage.
// Les identifiants des espaces sont conservés dans le navigateur
// même après un rechargement ou une fermeture de la page.

const CLE_FAVORIS = "favoris";


// ========================================
// RÉCUPÉRER LES FAVORIS
// ========================================

// Rôle : récupérer la liste des favoris enregistrés.
// Paramètres : aucun.
// Retour : un tableau contenant les identifiants des espaces favoris.
function recupererFavoris() {

    const favorisEnregistres = localStorage.getItem(CLE_FAVORIS);

    // Si aucun favori n'est encore enregistré.
    if (!favorisEnregistres) {
        return [];
    }

    try {
        return JSON.parse(favorisEnregistres);
    } catch (erreur) {
        console.error("Impossible de lire les favoris.", erreur);
        return [];
    }
}


// ========================================
// ENREGISTRER LES FAVORIS
// ========================================

// Rôle : enregistrer la liste des favoris dans localStorage.
// Paramètres : favoris (tableau d'identifiants).
// Retour : aucun.
function enregistrerFavoris(favoris) {

    localStorage.setItem(
        CLE_FAVORIS,
        JSON.stringify(favoris)
    );
}


// ========================================
// VÉRIFIER UN FAVORI
// ========================================

// Rôle : vérifier si un espace est déjà dans les favoris.
// Paramètres : espaceId (identifiant de l'espace).
// Retour : true si l'espace est favori, sinon false.
function estFavori(espaceId) {

    const favoris = recupererFavoris();

    return favoris.includes(espaceId);
}


// ========================================
// AJOUTER UN FAVORI
// ========================================

// Rôle : ajouter un espace aux favoris.
// Paramètres : espaceId (identifiant de l'espace).
// Retour : aucun.
function ajouterFavori(espaceId) {

    const favoris = recupererFavoris();

    // Éviter d'ajouter plusieurs fois le même espace.
    if (!favoris.includes(espaceId)) {

        favoris.push(espaceId);

        enregistrerFavoris(favoris);
    }

    mettreAJourCompteurFavoris();
}


// ========================================
// RETIRER UN FAVORI
// ========================================

// Rôle : retirer un espace des favoris.
// Paramètres : espaceId (identifiant de l'espace).
// Retour : aucun.
function retirerFavori(espaceId) {

    const favoris = recupererFavoris();

    const nouveauxFavoris = favoris.filter(
        (id) => id !== espaceId
    );

    enregistrerFavoris(nouveauxFavoris);

    mettreAJourCompteurFavoris();
}


// ========================================
// BASCULER UN FAVORI
// ========================================

// Rôle : ajouter ou retirer un espace selon son état actuel.
// Paramètres : espaceId (identifiant de l'espace).
// Retour : true si l'espace devient favori, sinon false.
function basculerFavori(espaceId) {

    if (estFavori(espaceId)) {

        retirerFavori(espaceId);

        return false;
    }

    ajouterFavori(espaceId);

    return true;
}


// ========================================
// COMPTEUR DU HEADER
// ========================================

// Rôle : afficher le nombre de favoris dans le header.
// Paramètres : aucun.
// Retour : aucun.
function mettreAJourCompteurFavoris() {

    const compteurFavoris =
        document.querySelector("#compteur-favoris");

    // Certaines pages peuvent ne pas avoir de compteur.
    if (!compteurFavoris) {
        return;
    }

    const favoris = recupererFavoris();

    compteurFavoris.textContent = favoris.length;

    compteurFavoris.setAttribute(
        "aria-label",
        `${favoris.length} espace${favoris.length > 1 ? "s" : ""} favori${favoris.length > 1 ? "s" : ""}`
    );
}


// ========================================
// BOUTON DE LA FICHE ESPACE
// ========================================

// Rôle : mettre à jour le texte, l'icône
// et l'accessibilité du bouton favori présent
// sur une fiche espace.
// Paramètres : espaceId et nomEspace.
// Retour : aucun.
function mettreAJourBoutonFavori(espaceId, nomEspace) {

    const boutonFavori =
        document.querySelector("#bouton-favori");

    // Le bouton n'existe pas sur toutes les pages.
    if (!boutonFavori) {
        return;
    }


    // Vérifier l'état actuel de l'espace.
    const espaceEstFavori = estFavori(espaceId);


    // Choisir l'icône selon l'état du favori.
    const iconeFavori = espaceEstFavori
        ? "assets/icons/favorisplein.svg"
        : "assets/icons/favorisvide.svg";


    // Choisir le texte affiché dans le bouton.
    const texteFavori = espaceEstFavori
        ? "Retirer des favoris"
        : "Sauvegarder dans mes espaces";


    // Ajouter l'icône et le texte dans le bouton.
    //
    // L'icône est décorative car le texte du bouton
    // indique déjà clairement l'action disponible.
    boutonFavori.innerHTML = `
        <img
            src="${iconeFavori}"
            alt=""
            aria-hidden="true"
        >
        <span>${texteFavori}</span>
    `;


    // Adapter le texte annoncé par le lecteur d'écran.
    boutonFavori.setAttribute(
        "aria-label",
        espaceEstFavori
            ? `Retirer ${nomEspace} des favoris`
            : `Ajouter ${nomEspace} aux favoris`
    );


    // Indiquer l'état actuel du bouton
    // aux technologies d'assistance.
    boutonFavori.setAttribute(
        "aria-pressed",
        espaceEstFavori ? "true" : "false"
    );
}


// ========================================
// INITIALISATION
// ========================================

// Mettre à jour le compteur dès l'ouverture de la page.
mettreAJourCompteurFavoris();