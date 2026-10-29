
// ========================================
// 1. DONNEES DE L'APPLICATION
// ========================================

// Tableau contenant les tâches initiales
const tasks = [
    {
        title: "Préparer le cours DevOps",
        done: true
    },
    {
        title: "Corriger les TP",
        done: false
    },
    {
        title: "Préparer la séance 2",
        done: false
    }
];

// ========================================
// 2. SELECTION DES ELEMENTS HTML
// ========================================

const list = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");

const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

const progressBar = document.getElementById("progress-bar");
const progressPercentage = document.getElementById("progress-percentage");

const taskCounter = document.getElementById("task-counter");
const emptyMessage = document.getElementById("empty-message");
const formMessage = document.getElementById("form-message");

const currentDate = document.getElementById("current-date");

// ========================================
// 3. AFFICHER LA DATE DU JOUR
// ========================================

const today = new Date();

currentDate.textContent = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

// ========================================
// 4. AFFICHER LES TACHES
// ========================================

function render() {

    // Vider la liste avant de la reconstruire
    list.innerHTML = "";

    // Parcourir toutes les tâches
    tasks.forEach(function (task, index) {

        // Créer un élément li
        const item = document.createElement("li");
        item.className = "task-item";

        // Créer une case à cocher
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.done;

        checkbox.setAttribute(
            "aria-label",
            "Marquer " + task.title + " comme terminée"
        );

        // Gérer le changement d'état
        checkbox.addEventListener("change", function () {

            tasks[index].done = checkbox.checked;

            render();
        });

        // Créer le titre de la tâche
        const label = document.createElement("span");

        label.className = "task-title";
        label.textContent = task.title;

        // Créer le statut
        const status = document.createElement("span");

        status.className = "task-status";

        if (task.done) {

            status.textContent = "Terminée";
            item.classList.add("completed");

        } else {

            status.textContent = "En attente";

        }

        // Créer le bouton supprimer
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        deleteButton.setAttribute(
            "aria-label",
            "Supprimer " + task.title
        );

        // Supprimer la tâche
        deleteButton.addEventListener("click", function () {

            tasks.splice(index, 1);

            render();

        });

        // Ajouter les éléments dans li
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(status);
        item.appendChild(deleteButton);

        // Ajouter li dans la liste
        list.appendChild(item);

    });

    // Mettre à jour les statistiques
    updateStatistics();

    // Gérer le message lorsque la liste est vide
    emptyMessage.classList.toggle("hidden", tasks.length !== 0);

}

// ========================================
// 5. METTRE A JOUR LES STATISTIQUES
// ========================================

function updateStatistics() {

    // Nombre total de tâches
    const total = tasks.length;

    // Nombre de tâches terminées
    const completed = tasks.filter(function (task) {
        return task.done;
    }).length;

    // Nombre de tâches en attente
    const pending = total - completed;

    // Calcul du pourcentage
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    // Afficher les statistiques
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    // Afficher la progression
    progressPercentage.textContent = percentage + "%";
    progressBar.style.width = percentage + "%";

    // Mettre à jour le compteur
    taskCounter.textContent =
        total + (total > 1 ? " tâches" : " tâche");

}

// ========================================
// 6. AJOUTER UNE NOUVELLE TACHE
// ========================================

form.addEventListener("submit", function (event) {

    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer le texte et supprimer les espaces inutiles
    const title = input.value.trim();

    // Vérifier que le champ n'est pas vide
    if (title === "") {

        formMessage.textContent =
            "Veuillez saisir une tâche avant de continuer.";

        input.focus();

        return;
    }

    // Vérifier les doublons
    const exists = tasks.some(function (task) {

        return task.title.toLowerCase() === title.toLowerCase();

    });

    if (exists) {

        formMessage.textContent =
            "Cette tâche existe déjà dans votre liste.";

        input.focus();

        return;
    }

    // Créer un nouvel objet tâche
    const newTask = {
        title: title,
        done: false
    };

    // Ajouter la tâche au tableau
    tasks.push(newTask);

    // Réinitialiser le formulaire
    input.value = "";
    formMessage.textContent = "";

    // Actualiser l'affichage
    render();

    // Replacer le curseur dans le champ
    input.focus();

});

// ========================================
// 7. INITIALISATION DE L'APPLICATION
// ========================================

// Afficher les tâches au démarrage
render();

// ========================================
// 7. CALENDRIER INTERACTIF
// ========================================

const calendarButton = document.getElementById("calendar-button");
const calendarPopup = document.getElementById("calendar-popup");
const calendarMonth = document.getElementById("calendar-month");
const calendarDays = document.getElementById("calendar-days");

const previousMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today-button");

const selectedDate = new Date();
let displayedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
);

function updateDateLabel() {
    currentDate.textContent = selectedDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function renderCalendar() {
    calendarDays.innerHTML = "";

    calendarMonth.textContent = displayedMonth.toLocaleDateString(
        "fr-FR",
        {
            month: "long",
            year: "numeric"
        }
    );

    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Le calendrier commence le lundi
    const startingDay = (firstDay.getDay() + 6) % 7;

    // Afficher les jours du mois précédent
    const previousLastDay = new Date(year, month, 0).getDate();

    for (let i = 0; i < startingDay; i++) {
        const day = previousLastDay - startingDay + i + 1;
        createCalendarDay(day, "other-month");
    }

    // Afficher les jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);

        let className = "";

        if (date.toDateString() === new Date().toDateString()) {
            className += " today";
        }

        if (date.toDateString() === selectedDate.toDateString()) {
            className += " selected";
        }

        createCalendarDay(day, className, date);
    }

    // Compléter la dernière semaine
    const totalCells = startingDay + lastDay.getDate();
    const remainingCells = (7 - totalCells % 7) % 7;

    for (let day = 1; day <= remainingCells; day++) {
        createCalendarDay(day, "other-month");
    }
}

function createCalendarDay(day, className, date = null) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "calendar-day " + className;
    button.textContent = day;

    if (date) {
        button.addEventListener("click", function () {
            selectedDate.setTime(date.getTime());

            updateDateLabel();
            renderCalendar();

            calendarPopup.classList.add("hidden");
        });
    } else {
        button.disabled = true;
    }

    calendarDays.appendChild(button);
}

// Ouvrir et fermer le calendrier
calendarButton.addEventListener("click", function () {
    calendarPopup.classList.toggle("hidden");
    renderCalendar();
});

// Mois précédent
previousMonthButton.addEventListener("click", function () {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    renderCalendar();
});

// Mois suivant
nextMonthButton.addEventListener("click", function () {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);
    renderCalendar();
});

// Revenir à aujourd'hui
todayButton.addEventListener("click", function () {
    selectedDate.setTime(new Date().getTime());

    displayedMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
    );

    updateDateLabel();
    renderCalendar();

    calendarPopup.classList.add("hidden");
});

// Initialisation
updateDateLabel();
renderCalendar();
