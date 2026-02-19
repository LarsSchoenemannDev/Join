/**
 * Öffnet das Overlay zum Erstellen einer neuen Aufgabe.
 * Lädt das Formular in das Overlay, initialisiert die Daten und deaktiviert das Body-Scrolling.
 * @returns {void}
 */
function openAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "flex";
  loadAddTaskFormIntoOverlay();
  bindAddTaskListeners(document);
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
}

/**
 * function to close the add task overlay when clicking outside the form
 */
const addTaskOverlayEl = document.getElementById("addTaskOverlay");
addTaskOverlayEl.addEventListener("click", (event) => {
  if (event.target === addTaskOverlayEl) {
    closeAddTaskOverlay();
  }
});

/**
 * Closes the task details overlay and re-renders the board.
 * @returns {void}
 */
function closeTaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
}

/**
 * function to close the task details overlay when clicking outside the form
 */
const taskDetailsOverlayEl = document.getElementById("taskDetailsOverlay");
taskDetailsOverlayEl.addEventListener("click", (event) => {
  if (event.target === taskDetailsOverlayEl) {
    closeTaskDetailsOverlay();
  }
});
