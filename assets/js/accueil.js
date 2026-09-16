// ========================================
// PAGE D'ACCUEIL
// ========================================

// Rôle : récupérer les espaces depuis le fichier JSON,
// les afficher sous forme de cartes et gérer les filtres de recherche.


// --- Éléments du DOM ---

const listeEspaces = document.querySelector("#liste-espaces");
const chargement = document.querySelector("#chargement");
const aucunResultat = document.querySelector("#aucun-resultat");
const nombreResultats = document.querySelector("#nombre-resultats");

const filtreVille = document.querySelector("#filtre-ville");
const filtreCapacite = document.querySelector("#filtre-capacite");
const filtresEquipements = document.querySelectorAll(
    'input[name="equipement"]'
);


// Tableau contenant les espaces récupérés depuis le fichier JSON.
let espaces = [];


// ========================================
// CHARGEMENT DES DONNÉES
// ========================================

// Rôle : récupérer les espaces depuis espaces.json.
// Paramètres : aucun.
// Retour : aucun, les données sont enregistrées dans le tableau espaces.
async function chargerEspaces() {
    try {
        // Afficher l'état de chargement avant la requête.
        chargement.hidden = false;

        // Récupérer le fichier JSON avec la Fetch API.
        const reponse = await fetch("data/espaces.json");

        // Vérifier que la requête s'est correctement déroulée.
        if (!reponse.ok) {
            throw new Error("Impossible de charger les espaces.");
        }

        // Transformer la réponse JSON en données JavaScript.
        espaces = await reponse.json();

        // Afficher les espaces récupérés.
        afficherEspaces(espaces);
    } catch (erreur) {
        // Afficher une erreur compréhensible si le chargement échoue.
        listeEspaces.innerHTML = `
            <p class="resultats__erreur" role="alert">
                Une erreur est survenue pendant le chargement des espaces.
            </p>
        `;

        console.error(erreur);
    } finally {
        // Masquer l'indicateur, que la requête réussisse ou échoue.
        chargement.hidden = true;
    }
}


// ========================================
// CRÉATION D'UNE CARTE
// ========================================

// Rôle : créer le HTML correspondant à un espace.
// Paramètres : espace (objet contenant les informations d'un espace).
// Retour : chaîne de caractères contenant le HTML de la carte.
function creerCarteEspace(espace) {

// Afficher uniquement les équipements courts
// présents sur les cartes de la maquette.
const equipements = espace.equipements
    .filter((equipement) => {
        const nomEquipement = equipement.toLowerCase();

        return (
            nomEquipement.includes("fibre") ||
            nomEquipement.includes("pmr") ||
            nomEquipement.includes("4k")
        );
    })
    .map((equipement) => {
        const nomEquipement = equipement.toLowerCase();

        let libelle = "";
        let icone = "";

        // Adapter le nom et l'icône à l'affichage compact
        // utilisé sur les cartes de la maquette.
        if (nomEquipement.includes("fibre")) {
            libelle = "Fibre";
            icone = "assets/icons/fibre.svg";
        } else if (nomEquipement.includes("pmr")) {
            libelle = "PMR";
            icone = "assets/icons/pmr.svg";
        } else if (nomEquipement.includes("4k")) {
            libelle = "4K";
            icone = "assets/icons/4k.svg";
        }

        return `
            <li>
                <img
                    src="${icone}"
                    alt=""
                    aria-hidden="true"
                >
                ${libelle}
            </li>
        `;
    })
    .join("");


    // Vérifier si l'espace est déjà enregistré dans les favoris.
    const estFavori = recupererFavoris().includes(espace.id);


    // Choisir l'icône correspondant à l'état du favori.
    const iconeFavori = estFavori
        ? "assets/icons/favorisplein.svg"
        : "assets/icons/favorisvide.svg";


    return `
        <article class="carte-espace">

            <div class="carte-espace__image-conteneur">

                <img
                    class="carte-espace__image"
                    src="${espace.images[0]}"
                    alt="${espace.nom}"
                    loading="lazy"
                >

                <button
                    class="carte-espace__favori"
                    type="button"
                    data-favori-id="${espace.id}"
                    aria-pressed="${estFavori}"
                    aria-label="${
                        estFavori
                            ? `Retirer ${espace.nom} des favoris`
                            : `Ajouter ${espace.nom} aux favoris`
                    }"
                >
                    <img
                        src="${iconeFavori}"
                        alt=""
                        aria-hidden="true"
                    >
                </button>

            </div>


            <div class="carte-espace__contenu">

                <div class="carte-espace__entete">

                    <div>

                        <h3 class="carte-espace__titre">
                            ${espace.nom}
                        </h3>

                        <p class="carte-espace__localisation">
                            <img
                                src="assets/icons/point.svg"
                                alt=""
                                aria-hidden="true"
                            >
                            ${espace.quartier}
                        </p>

                    </div>


                    <p
                        class="carte-espace__note"
                        aria-label="Note ${espace.note} sur 5, ${espace.nombreAvis} avis"
                    >
                        <!-- Les cinq étoiles sont décoratives :
                            la note exacte reste annoncée par aria-label. -->
                        <span
                            class="carte-espace__etoiles"
                            aria-hidden="true"
                        >
                            <img src="assets/icons/etoilepleine.svg" alt="">
                            <img src="assets/icons/etoilepleine.svg" alt="">
                            <img src="assets/icons/etoilepleine.svg" alt="">
                            <img src="assets/icons/etoilepleine.svg" alt="">
                            <img src="assets/icons/etoilepleine.svg" alt="">
                        </span>

                        <strong>${espace.note}</strong>

                        <span>
                            (${espace.nombreAvis} avis)
                        </span>
                    </p>

                </div>


                <div class="carte-espace__caracteristiques">

                    <p class="carte-espace__capacite">
                        <img
                            src="assets/icons/duo.svg"
                            alt=""
                            aria-hidden="true"
                        >
                        ${espace.capacite} pers.
                    </p>

                    <ul
                        class="carte-espace__equipements"
                        aria-label="Équipements disponibles"
                    >
                        ${equipements}
                    </ul>

                </div>


                <div class="carte-espace__bas">

                    <p class="carte-espace__prix">
                        <strong>${espace.tarifs.heure} €</strong>
                        <span>/ heure</span>
                    </p>

                    <a
                        class="carte-espace__lien"
                        href="espace.html?id=${espace.id}"
                        aria-label="Voir la fiche de ${espace.nom}"
                    >
                        Voir la fiche
                    </a>

                </div>

            </div>

        </article>
    `;
}


// ========================================
// AFFICHAGE DES ESPACES
// ========================================

// Rôle : afficher une liste d'espaces dans la grille.
// Paramètres : liste (tableau des espaces à afficher).
// Retour : aucun.
function afficherEspaces(liste) {
    // Vider la grille avant chaque nouvel affichage.
    listeEspaces.innerHTML = "";

    // Mettre à jour le nombre de résultats.
    nombreResultats.textContent = liste.length;

    // Afficher le message si aucun espace ne correspond.
    if (liste.length === 0) {
        aucunResultat.hidden = false;
        return;
    }

    aucunResultat.hidden = true;

    // Créer puis ajouter les cartes dans la grille.
    listeEspaces.innerHTML = liste
        .map((espace) => creerCarteEspace(espace))
        .join("");
}


// ========================================
// FAVORIS SUR LES CARTES
// ========================================

// Rôle : ajouter ou retirer un espace des favoris depuis la page d'accueil.
// Paramètres : evenement (clic effectué dans la grille des espaces).
// Retour : aucun, met à jour le localStorage, l'icône et le compteur.
function gererFavoriCarte(evenement) {
    // Vérifier si le clic a été effectué sur un bouton favori
    // ou sur l'icône contenue dans le bouton.
    const boutonFavori = evenement.target.closest(
        "[data-favori-id]"
    );

    // Ne rien faire si le clic ne concerne pas un bouton favori.
    if (!boutonFavori) {
        return;
    }

    // Récupérer l'identifiant de l'espace concerné.
    const espaceId = Number(boutonFavori.dataset.favoriId);

    // Retrouver l'espace correspondant dans les données chargées.
    const espace = espaces.find(
        (espace) => espace.id === espaceId
    );

    // Arrêter la fonction si aucun espace ne correspond.
    if (!espace) {
        return;
    }

    // Vérifier si l'espace est déjà enregistré dans les favoris.
    const estDejaFavori = recupererFavoris().includes(espaceId);

    if (estDejaFavori) {
        // Retirer l'espace des favoris.
        retirerFavori(espaceId);
    } else {
        // Ajouter l'espace aux favoris.
        ajouterFavori(espaceId);
    }

    // Vérifier le nouvel état après la modification.
    const estMaintenantFavori =
        recupererFavoris().includes(espaceId);

    // Mettre à jour l'état accessible du bouton.
    boutonFavori.setAttribute(
        "aria-pressed",
        String(estMaintenantFavori)
    );

    // Mettre à jour le texte lu par les technologies d'assistance.
    boutonFavori.setAttribute(
        "aria-label",
        estMaintenantFavori
            ? `Retirer ${espace.nom} des favoris`
            : `Ajouter ${espace.nom} aux favoris`
    );

    // Récupérer l'icône présente dans le bouton.
    const icone = boutonFavori.querySelector("img");

    // Afficher le cœur plein ou vide selon le nouvel état.
    icone.src = estMaintenantFavori
        ? "assets/icons/favorisplein.svg"
        : "assets/icons/favorisvide.svg";

    // Synchroniser le compteur de favoris affiché dans le header.
    mettreAJourCompteurFavoris();
}


// ========================================
// FILTRAGE DES ESPACES
// ========================================

// Rôle : filtrer les espaces selon les critères sélectionnés.
// Paramètres : aucun.
// Retour : aucun, affiche directement les résultats filtrés.
function filtrerEspaces() {
    const villeSelectionnee = filtreVille.value;

    const capaciteSelectionnee = Number(filtreCapacite.value);

    // Récupérer tous les équipements actuellement cochés.
    const equipementsSelectionnes = Array.from(filtresEquipements)
        .filter((caseEquipement) => caseEquipement.checked)
        .map((caseEquipement) => caseEquipement.value);

    const espacesFiltres = espaces.filter((espace) => {
        // Vérifier la ville.
        const correspondVille =
            villeSelectionnee === ""
            || espace.ville === villeSelectionnee;

        // Vérifier la capacité.
        const correspondCapacite =
            capaciteSelectionnee === 0
            || espace.capacite <= capaciteSelectionnee;

        // Vérifier les équipements sélectionnés.
        const correspondEquipements = equipementsSelectionnes.every(
            (equipementSelectionne) =>
                espace.equipements.some((equipement) =>
                    equipement
                        .toLowerCase()
                        .includes(equipementSelectionne.toLowerCase())
                )
        );

        return (
            correspondVille
            && correspondCapacite
            && correspondEquipements
        );
    });

    afficherEspaces(espacesFiltres);
}


// ========================================
// ÉVÉNEMENTS
// ========================================

// Gérer les clics sur les boutons favoris des cartes.
// L'événement est placé sur la grille car les cartes
// sont recréées dynamiquement lors du filtrage.
listeEspaces.addEventListener(
    "click",
    gererFavoriCarte
);

// Relancer le filtrage dès qu'un critère est modifié.
filtreVille.addEventListener("change", filtrerEspaces);
filtreCapacite.addEventListener("change", filtrerEspaces);

filtresEquipements.forEach((caseEquipement) => {
    caseEquipement.addEventListener("change", filtrerEspaces);
});


// ========================================
// INITIALISATION
// ========================================

// Charger les données lors de l'ouverture de la page.
chargerEspaces();