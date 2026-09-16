// ========================================
// FICHE D'UN ESPACE
// ========================================

// Rôle : récupérer l'identifiant présent dans l'URL,
// charger les données puis afficher l'espace correspondant.


// --- Éléments du DOM ---

const ficheEspace = document.querySelector("#fiche-espace");
const chargement = document.querySelector("#chargement");
const erreurEspace = document.querySelector("#erreur-espace");

const arianeVille = document.querySelector("#ariane-ville");
const arianeEspace = document.querySelector("#ariane-espace");

const espaceNom = document.querySelector("#espace-nom");
const espaceAdresse = document.querySelector("#espace-adresse");
const espaceNote = document.querySelector("#espace-note");

const espaceGalerie = document.querySelector("#espace-galerie");

const espaceDescription = document.querySelector("#espace-description");
const espaceCapacite = document.querySelector("#espace-capacite");
const espaceConfiguration = document.querySelector("#espace-configuration");
const espaceEquipements = document.querySelector("#espace-equipements");

const tarifHeure = document.querySelector("#tarif-heure");
const tarifDemiJournee = document.querySelector("#tarif-demi-journee");
const tarifJournee = document.querySelector("#tarif-journee");

const boutonFavori = document.querySelector("#bouton-favori");
const lienContact = document.querySelector("#lien-contact");


// ========================================
// RÉCUPÉRATION DE L'IDENTIFIANT
// ========================================

// Récupérer les paramètres présents dans l'URL.
//
// Exemple :
// espace.html?id=1
//
// URLSearchParams permet ensuite de récupérer la valeur de "id".
const parametresUrl = new URLSearchParams(window.location.search);

const espaceId = Number(parametresUrl.get("id"));


// ========================================
// CHARGEMENT DE L'ESPACE
// ========================================

// Rôle : charger les données et rechercher l'espace
// correspondant à l'identifiant présent dans l'URL.
// Paramètres : aucun.
// Retour : aucun.
async function chargerEspace() {
    try {
        chargement.hidden = false;

        // Vérifier qu'un identifiant valide existe dans l'URL.
        if (!espaceId) {
            throw new Error("Identifiant de l'espace invalide.");
        }

        // Charger les données depuis le fichier JSON.
        const reponse = await fetch("data/espaces.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les données.");
        }

        const espaces = await reponse.json();


        // Rechercher l'espace dont l'identifiant
        // correspond à celui récupéré dans l'URL.
        const espace = espaces.find(
            (espace) => espace.id === espaceId
        );


        // Si aucun espace ne correspond à l'identifiant.
        if (!espace) {
            throw new Error("Espace introuvable.");
        }


        // Afficher les informations de l'espace trouvé.
        afficherEspace(espace);

    } catch (erreur) {
        console.error(erreur);

        erreurEspace.hidden = false;

    } finally {
        chargement.hidden = true;
    }
}


// ========================================
// AFFICHAGE DE L'ESPACE
// ========================================

// Rôle : insérer les informations d'un espace dans la page.
// Paramètres : espace (objet contenant les données de l'espace).
// Retour : aucun.
function afficherEspace(espace) {

    // --- Fil d'Ariane ---

    arianeVille.textContent = espace.quartier;
    arianeEspace.textContent = espace.nom;


    // --- Informations principales ---

    espaceNom.textContent = espace.nom;
    espaceAdresse.textContent = espace.adresse;

    espaceNote.textContent =
        `★ ${espace.note} · ${espace.nombreAvis} avis vérifiés`;

    espaceNote.setAttribute(
        "aria-label",
        `Note ${espace.note} sur 5, ${espace.nombreAvis} avis vérifiés`
    );


    // --- Description ---

    espaceDescription.textContent = espace.description;


    // --- Capacité et configuration ---

    espaceCapacite.textContent =
        `Jusqu'à ${espace.capacite} personnes`;

    espaceConfiguration.textContent = espace.configuration;


    // --- Équipements ---

    // Générer la liste des équipements disponibles.
    // L'icône est décorative : le nom de l'équipement
    // fournit déjà l'information nécessaire.
    espaceEquipements.innerHTML = espace.equipements
        .map((equipement) => `
            <li>
                <img
                    src="assets/icons/check.svg"
                    alt=""
                    aria-hidden="true"
                >
                <span>${equipement}</span>
            </li>
        `)
        .join("");


    // --- Tarifs ---

    tarifHeure.textContent =
        `${espace.tarifs.heure} €`;

    tarifDemiJournee.textContent =
        `${espace.tarifs.demiJournee} €`;

    tarifJournee.textContent =
        `${espace.tarifs.journee} €`;


    // --- Galerie ---

    afficherGalerie(espace);


    // --- Bouton favori ---

    // Afficher l'état actuel du favori.
    mettreAJourBoutonFavori(
        espace.id,
        espace.nom
    );

    // Ajouter ou retirer l'espace des favoris au clic.
    boutonFavori.addEventListener("click", () => {

        basculerFavori(espace.id);

        mettreAJourBoutonFavori(
            espace.id,
            espace.nom
        );
    });


    // --- Contact ---

    // Le nom de l'espace est transmis à la page contact.
    // Il pourra ensuite servir à préremplir le formulaire.
    lienContact.href =
        `contact.html?espace=${encodeURIComponent(espace.nom)}`;


    // --- SEO ---

    // Modifier le titre de la page selon l'espace affiché.
    document.title =
        `${espace.nom} - ${espace.capacite} personnes | ProSpace Solutions`;


    // Modifier également la meta description.
    const metaDescription =
        document.querySelector("#meta-description");

    metaDescription.setAttribute(
        "content",
        `Découvrez ${espace.nom} à ${espace.ville}, un espace professionnel pouvant accueillir jusqu'à ${espace.capacite} personnes.`
    );


    // Afficher la fiche une fois toutes les données ajoutées.
    ficheEspace.hidden = false;
}


// ========================================
// GALERIE D'IMAGES
// ========================================

// Rôle : générer les images de la galerie.
// Paramètres : espace (objet contenant notamment le tableau images).
// Retour : aucun.
function afficherGalerie(espace) {

    espaceGalerie.innerHTML = espace.images
        .map((image, index) => {

            // La première image est considérée comme principale.
            const classeImage =
                index === 0
                    ? "fiche-espace__image fiche-espace__image--principale"
                    : "fiche-espace__image";

            return `
                <img
                    class="${classeImage}"
                    src="${image}"
                    alt="${espace.nom} - vue ${index + 1}"
                    loading="lazy"
                >
            `;
        })
        .join("");
}


// ========================================
// INITIALISATION
// ========================================

// Charger la fiche lors de l'ouverture de la page.
chargerEspace();