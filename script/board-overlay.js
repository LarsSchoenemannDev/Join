
/**
 * Öffnet das Overlay zum Erstellen einer neuen Aufgabe.
 * Lädt das Formular in das Overlay, initialisiert die Daten und deaktiviert das Body-Scrolling.
 * @returns {void}
 */
function openAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "flex";
  loadAddTaskFormIntoOverlay(); 
  addTaskinit(); 
  document.body.style.overflow = "hidden";
}

/**
 * Schließt das Add-Task-Overlay und stellt das Body-Scrolling wieder her.
 * @returns {void}
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * Initialisiert die Add-Task-Ansicht: lädt benötigte Daten und registriert Event-Handler.
 * @async
 * @returns {Promise<void>}
 */
async function addTaskinit() {
  await getData();
  eventsAddTask();
}