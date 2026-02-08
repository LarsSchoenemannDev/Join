
/**
 * Initialisiert das Board: lädt Daten, setzt Stati, rendert das Board und Subtasks.
 * @async
 * @returns {Promise<void>}
 */
async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
  updateAllEmptyMessages();
  subTasksStateAdd();
}

/**
 * Registriert Drag-&-Drop-Event-Listener für alle Spalten mit `data-status`.
 * @returns {void}
 */
function initDragAndDrop() {
  document.querySelectorAll(".in-progress[data-status]").forEach(col => {
    col.addEventListener("dragover", onDragOver);
    col.addEventListener("dragenter", onDragEnter);
    col.addEventListener("dragleave", onDragLeave);
    col.addEventListener("drop", onDrop);
  });
}

/**
 * Stellt sicher, dass alle Tasks ein `state`-Feld haben. Falls nicht, wird `todu` gesetzt.
 * @returns {void}
 */
function stateAdd() {
  if (!fetchData) {
    return
  };
  Object.values(fetchData["tasks"]).forEach(task => {
    if (task.state === undefined) {
      task.state = "todu";
    }
  })
}

/**
 * Liefert eine Liste von Aufgaben mit dem angegebenen Zustand.
 * @param {string} state - Gesuchter Task-State (z.B. "todu", "inProgress").
 * @returns {Array<{id:string, task:Object}>} Array von Paaren aus ID und Task-Objekt.
 */
function taskByState(state) {
  let entries = Object.entries(fetchData.tasks);
  let result = [];
  for (const [id, task] of entries) {
    if (task.state === state) result.push({ id, task });
  }
  return result
}

/**
 * Rendert das komplette Board: verteilt Tasks auf die Spalten und initialisiert Drag&Drop.
 * @returns {void}
 */
function renderBoard() {
  let todo = taskByState("todu");
  let inProgress = taskByState("inProgress");
  let feedBack = taskByState("feedBack");
  let done = taskByState("done");

  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

/**
 * Rendert den Header-Bereich einer Spalte (Titel + Zähler).
 * @param {string} headId - Element-ID des Header-Containers.
 * @param {string} title - Anzuzeigender Titel.
 * @param {number} count - Anzahl der Tasks.
 * @returns {void}
 */
function headRenderHTML(headId, title, count) {
  const contentHead = document.getElementById(headId);
  contentHead.innerHTML = "";
  contentHead.innerHTML = headcardHTML(title, count);
}

/**
 * Fügt die Task-Cards in den angegebenen Container ein.
 * @param {string} contentId - ID des Containers, in den die Cards eingefügt werden.
 * @param {Array<{id:string,task:Object}>} tasks - Array der anzuzeigenden Tasks.
 * @returns {void}
 */
function maincardHTML(contentId, tasks) {
  let contentRef = document.getElementById(contentId);
  contentRef.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    contentRef.innerHTML += renderTasksHTML(task.task, task.id)
  }
}

/**
 * Rendert Avatare der zugewiesenen Kontakte für eine Task.
 * @param {Array<Object>} [contacts=[]] - Array von Kontaktobjekten, jedes sollte ein `checked`-Flag haben.
 * @returns {string} HTML-String mit den Avatar-Elementen.
 */
function renderTaskContact(contacts = []) {
  let html = "";
  contacts.forEach(contact => {
    if (contact.checked) {
      html += renderContactAvatarHTML(contact);
    }
  });
  return html;
}

/**
 * Normalisiert und filtert Prioritäts-Werte und gibt eine CSS-Klasse zurück.
 * @param {string|Array<string>} priority - Priorität oder Array von Prioritäten.
 * @returns {string} CSS-Klassenname für die Priorität ("urgent" | "medium" | "low" | "").
 */
function filterPriority(priority) {
  let prioArray = Array.isArray(priority) ? priority : [priority];
  let priorityState = "";
  prioArray.forEach(prio => {
    if (prio === "urgent") {
      priorityState = "urgent";
    } else if (prio === "medium") {
      priorityState = "medium";
    } else if (prio === "low") {
      priorityState = "low";
    }
  });
  return priorityState;
}

/**
 * Mapping von Kategorie-Namen zu CSS-Klassen.
 * @param {string|Array<string>} category - Kategorie-Name oder Array von Kategorien.
 * @returns {string} CSS-Klassenname für die Kategorie.
 */
function filterCategory(category) {
  const categoryArray = Array.isArray(category) ? category : [category];
  let categoryState = "";
  categoryArray.forEach(category => {
    if (category === "Technical Task") {
      categoryState = "technical-task";
    } else if (category === "User Story") {
      categoryState = "user-story"
    }
  })
  return categoryState;
}

/**
 * Sendet den aktuellen `fetchData`-Zustand an das Backend (PATCH auf BASE_URL).
 * Bei Fehlern wird die Exception geloggt.
 * @async
 * @returns {Promise<Object|undefined>} Rückgabe der Antwortdaten oder `undefined` bei Fehler.
 */
async function postState() {
  try {
    const response = await fetch(BASE_URL + ".json", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(fetchData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Fehler beim update:", error);
  }
}

/**
 * (Unbenutzte Hilfsfunktion) Sollte eigentlich Drag-Events an ein Card-Element binden.
 * Hinweis: Implementierung nutzt `e` und `id`, die aktuell nicht definiert sind.
 * @param {Element} card - Card-Element.
 * @returns {void}
 */
function bindDragEvents(card) {
  e.dataTransfer.setData("text", id);
  e.dataTransfer.effectAllowed = "move";

}

/**
 * Drag-Start-Handler: setzt die Card-ID in den DataTransfer und markiert die Card.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragStart(e) {
  const card = e.currentTarget;
  const id = card.getAttribute('data-id');
  e.dataTransfer.setData('text/plain', id);
  card.classList.add('dragging');

}

/**
 * Drag-End-Handler: entfernt die Drag-Markierung.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}

/**
 * Drag-Over-Handler: verhindert das Default-Verhalten, sodass Drop möglich ist.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragOver(e) {
  e.preventDefault();
  updateAllEmptyMessages()

}

/**
 * Drag-Enter-Handler: markiert die Zielspalte visuell.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragEnter(e) {
  e.currentTarget.classList.add('drop-target');
  updateAllEmptyMessages()
}

/**
 * Drag-Leave-Handler: entfernt die visuelle Markierung der Zielspalte.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragLeave(e) {
  e.currentTarget.classList.remove('drop-target');
  updateAllEmptyMessages()
}

/**
 * Drop-Handler: aktualisiert den State der losgelassenen Card und speichert ihn.
 * @async
 * @param {DragEvent} e
 * @returns {Promise<void>}
 */
async function onDrop(e) {
  e.preventDefault();
  const col = e.currentTarget;
  const newState = col.getAttribute("data-status");
  const cardId = e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = newState;
  }
  col.classList.remove("drop-target");
  renderBoard();
  updateAllEmptyMessages()
  await postState()
}

/**
 * Aktualisiert die Sichtbarkeit der "empty"-Hinweise in allen Spalten.
 * @returns {void}
 */
function updateAllEmptyMessages() {
  const columns = document.querySelectorAll(".in-progress[data-status]");
  columns.forEach(column => {
    const cardContainer = column.querySelector(".cardsContainer");
    const emptyMessage = column.querySelector(".empty");
    if (cardContainer && emptyMessage) {
      if (cardContainer.children.length === 0) {
        emptyMessage.classList.remove("emptyDisplay");
      } else {
        emptyMessage.classList.add("emptyDisplay");
      }
    }
  });
}

/**
 * Sucht nach Tasks anhand des Inhalts des Suchfelds `#searchInput`.
 * Schreibt gefundene Aufgaben in die Konsole (nur bei ≥3 Zeichen).
 * @returns {void}
 */
function searchBar() {
  const inputElement = document.getElementById("searchInput");
  if (!inputElement) return console.error("Suchfeld mit ID 'searchInput' nicht gefunden!");
  const searchInput = inputElement.value.trim().toLowerCase();
  if (searchInput.length >= 3 && fetchData?.tasks) {
    const filteredTasks = Object.values(fetchData.tasks).filter(task =>
      task?.title && typeof task.title === 'string' &&
      task.title.toLowerCase().includes(searchInput)
    );
    console.log("Gefundene Aufgaben:", filteredTasks);
  }
}

/**
 * Öffnet das Detail-Overlay für eine Task und füllt den Inhalt.
 * @param {Element} id - Das Card-Element (wird zur Beschaffung der `data-id` genutzt).
 * @returns {void}
 */
function openTaskDetailsOverlay(id) {
  const taskID = id.getAttribute("data-id").trim();
  const task = fetchData.tasks[taskID];
  let wrapper = document.getElementById("taskDetailsOverlay");
  let contentRef = document.getElementById("contentRefTaskCard")
  contentRef.innerHTML = taskPopup(task, taskID)
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden"
}

/**
 * Schließt das Task-Detail-Overlay, setzt das Scrolling zurück und rendert das Board neu.
 * @returns {void}
 */
function closetaskDetailsOverlay() {
  document.getElementById("taskDetailsOverlay").style.display = "none"
  document.body.style.overflow = "auto";
  renderBoard()
}

/**
 * Formatiert ein Datum von `YYYY-MM-DD` nach `DD/MM/YYYY`.
 * @param {string} taskduedate - Datum im Format `YYYY-MM-DD`.
 * @returns {string} Formatiertes Datum `DD/MM/YYYY`.
 */
function dateStringChange(taskduedate) {
  const [y, m, d] = taskduedate.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Capitalizes the first letter of a priority string.
 * @param {string} taskpriority - Prioritäts-String.
 * @returns {string}
 */
function capitalizeLetters(taskpriority) {
  return taskpriority[0].toUpperCase() + taskpriority.slice(1);
}

/**
 * Rendert Avatare für vollständige Namen (genutzt z.B. in Detail-Ansichten).
 * @param {Array<Object>} taskFullName - Array von Kontaktobjekten.
 * @returns {string} HTML-String mit Avatar-Elementen.
 */
function capitalizeLettersFullName(taskFullName) {
  let html = "";
  taskFullName.forEach(contact => {
    if (contact.checked) {

      html += renderContactAvatarHTML(contact);
    }
  });
  return html;
}

/**
 * Rendert die detaillierten Kontakt-Elemente für eine Task (Name + Initialen).
 * @param {Array<Object>} [contacts=[]] - Array von Kontaktobjekten.
 * @returns {string} HTML-String mit Kontakt-Details.
 */
function renderTaskContactDetails(contacts = []) {
  let html = "";
  contacts.forEach(contact => {
    if (contact.checked) {
      html += renderTaskContactDetailsHTML(contact);
    }
  });
  return html;
}

/**
 * Erzeugt das HTML für ein einzelnes Kontakt-Detail-Element.
 * @param {{color:string, initials:string, name:string}} contact
 * @returns {string} HTML-String für das Kontakt-Detail.
 */
function renderTaskContactDetailsHTML(contact) {
  return `<div class="assignee-item">
          <section class="contact-section">
          <div class="initials-circle" style="background-color: ${(contact.color)}">${(contact.initials)}</div>          
          <p>${(contact.name)}</p>
          </section>
        </div>
  `;
}

/**
 * Rendert die Subtask-Liste für eine Task.
 * @param {string} taskId - ID der Task.
 * @returns {string} HTML-String mit Subtask-Items.
 */
function renderTaskSubTaskDetails(taskId) {
  const task = fetchData.tasks[taskId];
  let html = "";
  task.subtasks.forEach((subtask, i) => {
    html += renderTaskSubTaskDetailsHTML(subtask, i, taskId);
  });
  return html;
}

/**
 * Erzeugt das HTML für ein einzelnes Subtask-Element.
 * @param {{title:string,state:string}} subtask - Subtask-Objekt.
 * @param {number} i - Index der Subtask in der Liste.
 * @param {string} taskId - ID der übergeordneten Task.
 * @returns {string} HTML-String für das Subtask-Element.
 */
function renderTaskSubTaskDetailsHTML(subtask, i, taskId) {
  const isChecked = subtask.state === "check" ? "checked" : "";
  return ` 
      <div class="subtask-item">
        <input class="checkbox-input-subtask" type="checkbox" id="subtask-${taskId}-${i}" onchange="toggleSubtask('${taskId}', ${i})"${isChecked}>
        <label for="subtask-${taskId}-${i}">${subtask.title}</label>
      </div>
    `;
}

/**
 * Toggles den Zustand einer Subtask zwischen `check` und `uncheck` und speichert den Stand.
 * @async
 * @param {string} taskId - ID der Task.
 * @param {number} subtaskIndex - Index der Subtask.
 * @returns {Promise<void>}
 */
async function toggleSubtask(taskId, subtaskIndex) {
  const subtask = fetchData.tasks[taskId].subtasks[subtaskIndex];
  if (subtask.state === "uncheck") {
    subtask.state = "check";
  } else {
    subtask.state = "uncheck";
  }
  await postState()
}

/**
 * Normalisiert Subtasks: wandelt string-Subtasks in Objektform um und stellt sicher, dass `state` gesetzt ist.
 * @async
 * @returns {Promise<void>}
 */
async function subTasksStateAdd() {
  if (!fetchData) return;
  Object.values(fetchData.tasks).forEach(task => {
    if (task.subtasks && Array.isArray(task.subtasks)) {
      task.subtasks = task.subtasks.map((subtask, index) => {
        if (typeof subtask === "string") {
          return {
            title: subtask,
            state: "uncheck"
          };
        }
        if (subtask.state === undefined) {
          subtask.state = "uncheck";
        }
        return subtask;
      });
    }
  });
  await postState()
}

/**
 * Löscht eine Task aus `fetchData`, schliesst das Overlay und persistiert die Änderung.
 * @async
 * @param {string} id - ID der zu löschenden Task.
 * @returns {Promise<void>}
 */
async function deleteTaskOnBoard(id) {
  if (fetchData.tasks[id]) {
    delete fetchData.tasks[id];
    closetaskDetailsOverlay()
    renderBoard()
    await postState()
  } else {
    return
  }
}

/**
 * Wechselt eine Task in den Edit-Modus, indem das Detail-Overlay mit Edit-HTML befüllt wird.
 * @param {string} id - ID der zu editierenden Task.
 * @returns {void}
 */
function editTaskOnBoard(id) {
  const task = fetchData.tasks[id];
  const overlayContainer = document.getElementById('taskDetailsOverlay'); 
  if (!overlayContainer) {
    console.error("Das Haupt-Overlay 'taskDetailsOverlay' wurde nicht gefunden!");
    return;
  }
  if (task) {    
    overlayContainer.innerHTML = taskPopupEditMode(task, id);   
    overlayContainer.classList.remove('d-none'); 
    eventsAddTask();
  }
}