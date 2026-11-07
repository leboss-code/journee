/* =====================================
   JOURNEE - SCRIPT PRINCIPAL
===================================== */

// RECUPERATION DES DONNEES

let taches = JSON.parse(localStorage.getItem("taches")) || [];
let devoirs = JSON.parse(localStorage.getItem("devoirs")) || [];
let objectifs = JSON.parse(localStorage.getItem("objectifs")) || [];

// SAUVEGARDE

function sauvegarder() {
    localStorage.setItem("taches", JSON.stringify(taches));
    localStorage.setItem("devoirs", JSON.stringify(devoirs));
    localStorage.setItem("objectifs", JSON.stringify(objectifs));
}

// =====================================
// DATE ET HEURE
// =====================================

function afficherDate() {

    const maintenant = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("date").textContent =
        maintenant.toLocaleDateString("fr-FR", options);

}

afficherDate();

// =====================================
// NAVIGATION ENTRE LES PAGES
// =====================================

const boutonsNavigation = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

boutonsNavigation.forEach(bouton => {

    bouton.addEventListener("click", () => {

        const pageChoisie = bouton.dataset.page;

        boutonsNavigation.forEach(btn => {
            btn.classList.remove("active");
        });

        pages.forEach(page => {
            page.classList.remove("active");
        });

        bouton.classList.add("active");

        document.getElementById(pageChoisie).classList.add("active");

    });

});

// =====================================
// CREATION D'UNE TACHE
// =====================================

const formTache = document.getElementById("form-tache");

formTache.addEventListener("submit", function(e) {

    e.preventDefault();

    const champ = document.getElementById("nouvelle-tache");
    const texte = champ.value.trim();

    if (texte === "") return;

    taches.push({
        id: Date.now(),
        texte: texte,
        terminee: false
    });

    champ.value = "";

    sauvegarder();
    afficherTaches();

});

// =====================================
// AFFICHAGE DES TACHES
// =====================================

function afficherTaches() {

    const liste = document.getElementById("liste-taches");
    const accueil = document.getElementById("accueil-taches");

    liste.innerHTML = "";
    accueil.innerHTML = "";

    if (taches.length === 0) {

        liste.innerHTML =
            '<p class="empty-message">Aucune tâche pour le moment.</p>';

        accueil.innerHTML =
            '<p class="empty-message">Tu n’as aucune tâche prévue ! 🎉</p>';

    }

    taches.forEach(tache => {

        const element = document.createElement("div");

        element.className = "task-item";

        if (tache.terminee) {
            element.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tache.terminee;

        checkbox.addEventListener("change", () => {

            tache.terminee = checkbox.checked;

            sauvegarder();
            afficherTaches();

        });

        const texte = document.createElement("span");
        texte.textContent = tache.texte;

        const supprimer = document.createElement("button");
        supprimer.className = "delete-btn";
        supprimer.textContent = "Supprimer";

        supprimer.addEventListener("click", () => {

            taches = taches.filter(t => t.id !== tache.id);

            sauvegarder();
            afficherTaches();

        });

        element.appendChild(checkbox);
        element.appendChild(texte);
        element.appendChild(supprimer);

        liste.appendChild(element);

        // AFFICHAGE SUR L'ACCUEIL

        if (!tache.terminee) {

            const copie = element.cloneNode(true);

            const checkboxAccueil = copie.querySelector("input");
            const boutonAccueil = copie.querySelector("button");

            checkboxAccueil.addEventListener("change", () => {

                tache.terminee = checkboxAccueil.checked;

                sauvegarder();
                afficherTaches();

            });

            boutonAccueil.addEventListener("click", () => {

                taches = taches.filter(t => t.id !== tache.id);

                sauvegarder();
                afficherTaches();

            });

            accueil.appendChild(copie);

        }

    });

    afficherStatistiques();

}

// =====================================
// STATISTIQUES
// =====================================

function afficherStatistiques() {

    const total = taches.length;

    const terminees = taches.filter(t => t.terminee).length;

    const progression = total === 0
        ? 0
        : Math.round((terminees / total) * 100);

    document.getElementById("total-taches").textContent =
        total - terminees;

    document.getElementById("terminees").textContent =
        terminees;

    document.getElementById("progression").textContent =
        progression + "%";

}

// =====================================
// CREATION DES DEVOIRS
// =====================================

const formDevoir = document.getElementById("form-devoir");

formDevoir.addEventListener("submit", function(e) {

    e.preventDefault();

    const matiere = document.getElementById("matiere");
    const date = document.getElementById("date-devoir");

    if (!matiere.value.trim() || !date.value) return;

    devoirs.push({
        id: Date.now(),
        texte: matiere.value.trim(),
        date: date.value
    });

    matiere.value = "";
    date.value = "";

    sauvegarder();
    afficherDevoirs();

});

// =====================================
// AFFICHAGE DES DEVOIRS
// =====================================

function afficherDevoirs() {

    const liste = document.getElementById("liste-devoirs");

    liste.innerHTML = "";

    if (devoirs.length === 0) {

        liste.innerHTML =
            '<p class="empty-message">Aucun devoir enregistré.</p>';

        return;

    }

    const devoirsTries = [...devoirs].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    devoirsTries.forEach(devoir => {

        const element = document.createElement("div");
        element.className = "task-item";

        const texte = document.createElement("span");

        const dateFormatee = new Date(
            devoir.date + "T00:00:00"
        ).toLocaleDateString("fr-FR");

        texte.textContent = devoir.texte + " — " + dateFormatee;

        const supprimer = document.createElement("button");

        supprimer.className = "delete-btn";
        supprimer.textContent = "Supprimer";

        supprimer.addEventListener("click", () => {

            devoirs = devoirs.filter(d => d.id !== devoir.id);

            sauvegarder();
            afficherDevoirs();

        });

        element.appendChild(texte);
        element.appendChild(supprimer);

        liste.appendChild(element);

    });

}

// =====================================
// CREATION DES OBJECTIFS
// =====================================

const formObjectif = document.getElementById("form-objectif");

formObjectif.addEventListener("submit", function(e) {

    e.preventDefault();

    const champ = document.getElementById("nouvel-objectif");

    const texte = champ.value.trim();

    if (texte === "") return;

    objectifs.push({
        id: Date.now(),
        texte: texte,
        termine: false
    });

    champ.value = "";

    sauvegarder();
    afficherObjectifs();

});

// =====================================
// AFFICHAGE DES OBJECTIFS
// =====================================

function afficherObjectifs() {

    const liste = document.getElementById("liste-objectifs");

    liste.innerHTML = "";

    if (objectifs.length === 0) {

        liste.innerHTML =
            '<p class="empty-message">Ajoute ton premier objectif !</p>';

        return;

    }

    objectifs.forEach(objectif => {

        const element = document.createElement("div");

        element.className = "task-item";

        if (objectif.termine) {
            element.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = objectif.termine;

        checkbox.addEventListener("change", () => {

            objectif.termine = checkbox.checked;

            sauvegarder();
            afficherObjectifs();

        });

        const texte = document.createElement("span");
        texte.textContent = objectif.texte;

        const supprimer = document.createElement("button");

        supprimer.className = "delete-btn";
        supprimer.textContent = "Supprimer";

        supprimer.addEventListener("click", () => {

            objectifs = objectifs.filter(o => o.id !== objectif.id);

            sauvegarder();
            afficherObjectifs();

        });

        element.appendChild(checkbox);
        element.appendChild(texte);
        element.appendChild(supprimer);

        liste.appendChild(element);

    });

}

// =====================================
// CALENDRIER
// =====================================

function afficherCalendrier() {

    const maintenant = new Date();

    const annee = maintenant.getFullYear();
    const mois = maintenant.getMonth();

    const premierJour = new Date(annee, mois, 1).getDay();

    const nombreJours = new Date(
        annee,
        mois + 1,
        0
    ).getDate();

    const decalage = (premierJour + 6) % 7;

    const nomMois = maintenant.toLocaleDateString(
        "fr-FR",
        { month: "long", year: "numeric" }
    );

    document.getElementById("mois-calendrier").textContent =
        nomMois;

    const grille = document.getElementById("jours-calendrier");

    grille.innerHTML = "";

    const joursSemaine = [
        "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"
    ];

    joursSemaine.forEach(jour => {

        const element = document.createElement("div");

        element.className = "calendar-day header";
        element.textContent = jour;

        grille.appendChild(element);

    });

    for (let i = 0; i < decalage; i++) {

        const vide = document.createElement("div");

        grille.appendChild(vide);

    }

    for (let jour = 1; jour <= nombreJours; jour++) {

        const element = document.createElement("div");

        element.className = "calendar-day";
        element.textContent = jour;

        if (jour === maintenant.getDate()) {
            element.classList.add("today");
        }

        grille.appendChild(element);

    }

}

// =====================================
// LANCEMENT DE L'APPLICATION
// =====================================

function initialiserApplication() {

    afficherTaches();
    afficherDevoirs();
    afficherObjectifs();
    afficherCalendrier();

}

initialiserApplication();

// ENREGISTREMENT DE L'APPLICATION

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("JOURNÉE est prête !"))
            .catch(error => console.log("Erreur :", error));

    });

}