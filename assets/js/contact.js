// ========================================
// FORMULAIRE DE CONTACT
// ========================================

// Rôle : gérer le préremplissage depuis une fiche espace,
// valider les champs obligatoires et afficher une confirmation
// sans recharger la page.


// --- Éléments du DOM ---

const formulaireContact =
    document.querySelector("#formulaire-contact");

const champNom =
    document.querySelector("#nom");

const champEmail =
    document.querySelector("#email");

const champEntreprise =
    document.querySelector("#entreprise");

const champSujet =
    document.querySelector("#sujet");

const champMessage =
    document.querySelector("#message");

const champConsentement =
    document.querySelector("#consentement");

const blocEspace =
    document.querySelector("#bloc-espace");

const champEspace =
    document.querySelector("#espace-concerne");

const confirmationContact =
    document.querySelector("#confirmation-contact");


// ========================================
// AFFICHER UNE ERREUR
// ========================================

// Rôle : afficher un message d'erreur accessible sous un champ.
// Paramètres : champ, identifiant du message et texte de l'erreur.
// Retour : aucun.
function afficherErreur(champ, erreurId, message) {

    const zoneErreur =
        document.querySelector(`#${erreurId}`);

    zoneErreur.textContent = message;

    champ.setAttribute(
        "aria-invalid",
        "true"
    );
}


// ========================================
// SUPPRIMER UNE ERREUR
// ========================================

// Rôle : supprimer le message d'erreur d'un champ valide.
// Paramètres : champ et identifiant du message d'erreur.
// Retour : aucun.
function supprimerErreur(champ, erreurId) {

    const zoneErreur =
        document.querySelector(`#${erreurId}`);

    zoneErreur.textContent = "";

    champ.removeAttribute("aria-invalid");
}


// ========================================
// VALIDATION DU NOM
// ========================================

// Rôle : vérifier que le nom complet a été renseigné.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerNom() {

    if (champNom.value.trim() === "") {

        afficherErreur(
            champNom,
            "erreur-nom",
            "Veuillez renseigner votre nom complet."
        );

        return false;
    }

    supprimerErreur(
        champNom,
        "erreur-nom"
    );

    return true;
}


// ========================================
// VALIDATION DE L'EMAIL
// ========================================

// Rôle : vérifier que l'adresse email est renseignée
// et respecte le format d'un email.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerEmail() {

    if (champEmail.value.trim() === "") {

        afficherErreur(
            champEmail,
            "erreur-email",
            "Veuillez renseigner votre email professionnel."
        );

        return false;
    }


    if (!champEmail.validity.valid) {

        afficherErreur(
            champEmail,
            "erreur-email",
            "Veuillez saisir une adresse email valide."
        );

        return false;
    }


    supprimerErreur(
        champEmail,
        "erreur-email"
    );

    return true;
}


// ========================================
// VALIDATION DE L'ENTREPRISE
// ========================================

// Rôle : vérifier que le nom de l'entreprise est renseigné.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerEntreprise() {

    if (champEntreprise.value.trim() === "") {

        afficherErreur(
            champEntreprise,
            "erreur-entreprise",
            "Veuillez renseigner votre entreprise."
        );

        return false;
    }


    supprimerErreur(
        champEntreprise,
        "erreur-entreprise"
    );

    return true;
}


// ========================================
// VALIDATION DU SUJET
// ========================================

// Rôle : vérifier qu'un type de demande a été sélectionné.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerSujet() {

    if (champSujet.value === "") {

        afficherErreur(
            champSujet,
            "erreur-sujet",
            "Veuillez sélectionner un type de demande."
        );

        return false;
    }


    supprimerErreur(
        champSujet,
        "erreur-sujet"
    );

    return true;
}


// ========================================
// VALIDATION DU MESSAGE
// ========================================

// Rôle : vérifier que le message a été renseigné.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerMessage() {

    if (champMessage.value.trim() === "") {

        afficherErreur(
            champMessage,
            "erreur-message",
            "Veuillez décrire votre projet ou votre question."
        );

        return false;
    }


    supprimerErreur(
        champMessage,
        "erreur-message"
    );

    return true;
}


// ========================================
// VALIDATION DU CONSENTEMENT
// ========================================

// Rôle : vérifier que l'utilisateur accepte
// le traitement de ses données.
// Paramètres : aucun.
// Retour : true si valide, sinon false.
function validerConsentement() {

    if (!champConsentement.checked) {

        afficherErreur(
            champConsentement,
            "erreur-consentement",
            "Vous devez accepter la politique de confidentialité."
        );

        return false;
    }


    supprimerErreur(
        champConsentement,
        "erreur-consentement"
    );

    return true;
}


// ========================================
// CHARGEMENT DES ESPACES
// ========================================

// Rôle : charger les espaces depuis le fichier JSON,
// remplir la liste et présélectionner l'espace reçu dans l'URL.
// Paramètres : aucun.
// Retour : aucun.
async function chargerEspaces() {

    try {

        const reponse =
            await fetch("data/espaces.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les espaces.");
        }

        const espaces =
            await reponse.json();

        espaces.forEach((espace) => {

            const option =
                document.createElement("option");

            option.value = espace.nom;
            option.textContent = espace.nom;

            champEspace.appendChild(option);
        });


        // Récupérer l'espace éventuellement transmis
        // depuis une fiche espace.
        const parametres =
            new URLSearchParams(window.location.search);

        const espaceSelectionne =
            parametres.get("espace");


        if (espaceSelectionne) {

            champEspace.value =
                espaceSelectionne;

            champSujet.value =
                "reservation";
        }

    } catch (erreur) {

        console.error(
            "Erreur lors du chargement des espaces :",
            erreur
        );
    }
}


// ========================================
// VALIDATION EN TEMPS RÉEL
// ========================================

// Vérifier les champs lorsqu'ils sont modifiés.

champNom.addEventListener(
    "input",
    validerNom
);

champEmail.addEventListener(
    "input",
    validerEmail
);

champEntreprise.addEventListener(
    "input",
    validerEntreprise
);

champSujet.addEventListener(
    "change",
    validerSujet
);

champMessage.addEventListener(
    "input",
    validerMessage
);

champConsentement.addEventListener(
    "change",
    validerConsentement
);


// ========================================
// ENVOI DU FORMULAIRE
// ========================================

// Rôle : empêcher le rechargement, vérifier tous les champs
// puis afficher une confirmation dynamique.
formulaireContact.addEventListener(
    "submit",
    (evenement) => {

        evenement.preventDefault();


        const nomValide =
            validerNom();

        const emailValide =
            validerEmail();

        const entrepriseValide =
            validerEntreprise();

        const sujetValide =
            validerSujet();

        const messageValide =
            validerMessage();

        const consentementValide =
            validerConsentement();


        const formulaireValide =
            nomValide
            && emailValide
            && entrepriseValide
            && sujetValide
            && messageValide
            && consentementValide;


        // Si une erreur existe, placer le focus
        // sur le premier champ invalide.
        if (!formulaireValide) {

            const premierChampInvalide =
                formulaireContact.querySelector(
                    '[aria-invalid="true"]'
                );

            if (premierChampInvalide) {
                premierChampInvalide.focus();
            }

            return;
        }


        // Afficher la confirmation sans recharger la page.
        confirmationContact.textContent =
            "Merci ! Votre demande a bien été prise en compte. Notre équipe vous répondra sous 2 heures ouvrées.";

        confirmationContact.hidden = false;


        // Réinitialiser le formulaire.
        formulaireContact.reset();


        // Remettre l'espace dans le formulaire si l'utilisateur
        // est arrivé depuis une fiche.
        preremplirEspace();


        // Annoncer la confirmation aux technologies d'assistance.
        confirmationContact.focus();
    }
);


// ========================================
// INITIALISATION
// ========================================

chargerEspaces();

// ========================================
// CARROUSEL DE L'ÉQUIPE
// ========================================

// Rôle : gérer le carrousel de l'équipe.
// Sur ordinateur, les quatre membres restent visibles.
// Sur les écrans plus petits, les boutons permettent
// de faire défiler les membres.
// Le carrousel est également utilisable au clavier.


// --- Éléments du DOM ---

const carrouselEquipe =
    document.querySelector("#carrousel-equipe");

const boutonPrecedent =
    document.querySelector("#carrousel-precedent");

const boutonSuivant =
    document.querySelector("#carrousel-suivant");

const annonceCarrousel =
    document.querySelector("#annonce-carrousel");

const membresEquipe =
    document.querySelectorAll("[data-membre]");

const indicateursCarrousel =
    document.querySelectorAll(".equipe__indicateur");


// Index utilisé pour suivre la position du carrousel.
let indexCarrousel = 0;


// ========================================
// METTRE À JOUR LE CARROUSEL
// ========================================

// Rôle : déplacer le carrousel vers le membre sélectionné,
// mettre à jour l'indicateur actif et annoncer le changement.
// Paramètres : aucun.
// Retour : aucun.
function mettreAJourCarrousel() {

    const membreActuel =
        membresEquipe[indexCarrousel];


    // Faire défiler horizontalement le carrousel
    // jusqu'au membre sélectionné.
    membreActuel.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
    });


    // Mettre à jour les indicateurs visuels.
    indicateursCarrousel.forEach(
        (indicateur, index) => {

            indicateur.classList.toggle(
                "equipe__indicateur--actif",
                index === indexCarrousel
            );
        }
    );


    // Récupérer le nom et le poste du membre
    // actuellement sélectionné.
    const nomMembre =
        membreActuel.querySelector("h3").textContent.trim();

    const posteMembre =
        membreActuel.querySelector("p").textContent.trim();


    // Informer les lecteurs d'écran du changement.
    annonceCarrousel.textContent =
        `${nomMembre}, ${posteMembre}. `
        + `Membre ${indexCarrousel + 1} `
        + `sur ${membresEquipe.length}.`;
}


// ========================================
// MEMBRE SUIVANT
// ========================================

// Rôle : avancer dans le carrousel.
// Après le dernier membre, revenir au premier.
// Paramètres : aucun.
// Retour : aucun.
function afficherMembreSuivant() {

    indexCarrousel++;

    if (indexCarrousel >= membresEquipe.length) {
        indexCarrousel = 0;
    }

    mettreAJourCarrousel();
}


// ========================================
// MEMBRE PRÉCÉDENT
// ========================================

// Rôle : reculer dans le carrousel.
// Depuis le premier membre, revenir au dernier.
// Paramètres : aucun.
// Retour : aucun.
function afficherMembrePrecedent() {

    indexCarrousel--;

    if (indexCarrousel < 0) {
        indexCarrousel =
            membresEquipe.length - 1;
    }

    mettreAJourCarrousel();
}


// ========================================
// ÉVÉNEMENTS DES BOUTONS
// ========================================

// Afficher le membre précédent.
boutonPrecedent.addEventListener(
    "click",
    afficherMembrePrecedent
);


// Afficher le membre suivant.
boutonSuivant.addEventListener(
    "click",
    afficherMembreSuivant
);


// ========================================
// NAVIGATION AU CLAVIER
// ========================================

// Rôle : permettre de contrôler le carrousel
// avec les flèches gauche et droite lorsque
// la zone du carrousel possède le focus.
carrouselEquipe.addEventListener(
    "keydown",
    (evenement) => {

        if (evenement.key === "ArrowLeft") {

            evenement.preventDefault();

            afficherMembrePrecedent();
        }


        if (evenement.key === "ArrowRight") {

            evenement.preventDefault();

            afficherMembreSuivant();
        }
    }
);