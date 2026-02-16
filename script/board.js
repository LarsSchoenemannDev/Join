/**
 * Loads data, normalizes missing task fields, renders the board and initializes subtasks.
 * @async
 * @returns {Promise<void>}
 */
async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
  updateAllEmptyMessages();
  await subTasksStateAdd();
  initSearch();
}

/**
 * Attaches drag-and-drop listeners to all board columns that expose a `data-status` attribute.
 * @returns {void}
 */
function initDragAndDrop() {
  document.querySelectorAll(".in-progress[data-status]").forEach((col) => {
    col.addEventListener("dragover", onDragOver);
    col.addEventListener("dragenter", onDragEnter);
    col.addEventListener("dragleave", onDragLeave);
    col.addEventListener("drop", onDrop);
  });
}

/**
 * Ensures that each task has a `state` field.
 * If missing, a default state is applied.
 * @returns {void}
 */
function stateAdd() {
  if (!fetchData?.tasks) return;
  Object.values(fetchData.tasks).forEach((task) => {
    if (task.state === undefined) task.state = "todu";
  });
}

/**
 * Collects tasks matching the provided state.
 * @param {"todu"|"inProgress"|"feedBack"|"done"|string} state
 * @returns {Array<{id: string, task: Task}>}
 */
function taskByState(state) {
  if (!fetchData?.tasks) return [];
  const entries = Object.entries(fetchData.tasks);
  const result = [];
  for (const [id, task] of entries) {
    if (task.state === state) result.push({ id, task });
  }
  return result;
}

/**
 * Renders the board columns based on task states and initializes drag-and-drop.
 * @returns {void}
 */
function renderBoard() {
  const todo = taskByState("todu");
  const inProgress = taskByState("inProgress");
  const feedBack = taskByState("feedBack");
  const done = taskByState("done");
  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

/**
 * Renders a column header (title + count).
 * @param {string} headId
 * @param {string} title
 * @param {number} count
 * @returns {void}
 */
function headRenderHTML(headId, title, count) {
  const contentHead = document.getElementById(headId);
  if (!contentHead) return;
  contentHead.innerHTML = headcardHTML(title, count);
}

/**
 * Renders task cards into a column container.
 * @param {string} contentId
 * @param {Array<{id: string, task: Task}>} tasks
 * @returns {void}
 */
function maincardHTML(contentId, tasks) {
  const contentRef = document.getElementById(contentId);
  if (!contentRef) return;

  let html = "";
  for (let i = 0; i < tasks.length; i++) {
    html += renderTasksHTML(tasks[i].task, tasks[i].id);
  }
  contentRef.innerHTML = html;
}

/**
 * Renders avatar HTML for checked contacts.
 * @param {Contact[]} [contacts=[]]
 * @returns {string}
 */
function renderTaskContact(contacts = []) {
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].checked) html += renderContactAvatarHTML(contacts[i]);
  }
  return html;
}

/**
 * Normalizes priority values and returns a CSS state string.
 * @param {string|string[]} priority
 * @returns {"urgent"|"medium"|"low"|""}
 */
function filterPriority(priority) {
  const prioArray = Array.isArray(priority) ? priority : [priority];
  for (let i = 0; i < prioArray.length; i++) {
    if (prioArray[i] === "urgent") return "urgent";
    if (prioArray[i] === "medium") return "medium";
    if (prioArray[i] === "low") return "low";
  }
  return "";
}

/**
 * Maps category labels to CSS class names.
 * @param {string|string[]} category
 * @returns {"technical-task"|"user-story"|""}
 */
function filterCategory(category) {
  const categoryArray = Array.isArray(category) ? category : [category];
  for (let i = 0; i < categoryArray.length; i++) {
    if (categoryArray[i] === "Technical Task") return "technical-task";
    if (categoryArray[i] === "User Story") return "user-story";
  }
  return "";
}

/**
 * Persists the current `fetchData` state to the backend using PATCH.
 * @async
 * @returns {Promise<any>}
 * @throws {Error} If the HTTP response is not OK.
 */
async function postState() {
  const response = await fetch(`${BASE_URL}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fetchData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

/**
 * Drag start handler: stores the card id in the dataTransfer and marks the element.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragStart(e) {
  const card = /** @type {HTMLElement} */ (e.currentTarget);
  const id = card.getAttribute("data-id") || "";
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
}

/**
 * Drag end handler: removes the dragging marker.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragEnd(e) {
  const card = /** @type {HTMLElement} */ (e.currentTarget);
  card.classList.remove("dragging");
}

/**
 * Drag over handler: enables dropping.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragOver(e) {
  e.preventDefault();
  updateAllEmptyMessages();
}

/**
 * 
 * @param {DragEvent} e 
 */
function onDragEnter(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drop-target");
}

/**
 * 
 * @param {DragEvent} e 
 */
function onDragLeave(e) {
  const col = e.currentTarget;
  if (!col.contains(e.relatedTarget)) {
    col.classList.remove("drop-target");
  }
}

/**
 * Drop handler: updates the task state based on the column and persists changes.
 * @async
 * @param {DragEvent} e
 * @returns {Promise<void>}
 */
async function onDrop(e) {
  e.preventDefault();
  const col = /** @type {HTMLElement} */ (e.currentTarget);
  const newState = col.getAttribute("data-status") || "";
  const cardId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = /** @type {any} */ (newState);
    await postState();
  }
  col.classList.remove("drop-target");
  renderBoard();
  updateAllEmptyMessages();
}

/**
 * Updates visibility of empty messages per column depending on whether cards exist.
 * @returns {void}
 */
function updateAllEmptyMessages() {
  const columns = document.querySelectorAll(".in-progress[data-status]");
  columns.forEach((column) => {
    const cardContainer = column.querySelector(".cardsContainer");
    const emptyMessage = column.querySelector(".empty");
    if (!cardContainer || !emptyMessage) return;
    if (cardContainer.children.length === 0) {
      emptyMessage.classList.remove("emptyDisplay");
    } else {
      emptyMessage.classList.add("emptyDisplay");
    }
  });
}

/**
 * Reads the board search input and filters tasks by title.
 * Only runs if the board page exists (board-container is present).
 * If the input has less than 3 characters, the full board will be rendered again.
 * @returns {void}
 */
function searchBar() {
  const input = document.getElementById("searchInput");
  const board = document.querySelector(".board-container");
  if (!board || !input || !fetchData?.tasks) return;
  const q = input.value.trim().toLowerCase();
  if (q.length < 3) {
    renderBoard();
    updateAllEmptyMessages();
    return;
  }
  const filtered = Object.entries(fetchData.tasks).filter(([id, task]) => {
    return typeof task?.title === "string" && task.title.toLowerCase().includes(q);
  });
  renderBoardFromEntries(filtered);
  updateAllEmptyMessages();
}

/**
 * Renders the board using a filtered list of task entries.
 * Each entry must be a tuple of [taskId, taskObject].
 * @param {Array<[string, any]>} entries - Filtered tasks as [id, task] pairs.
 * @returns {void}
 */
function renderBoardFromEntries(entries) {
  const tasks = entries.map(([id, task]) => ({ id, task }));
  const todo = tasks.filter((t) => t.task.state === "todu");
  const inProgress = tasks.filter((t) => t.task.state === "inProgress");
  const feedBack = tasks.filter((t) => t.task.state === "feedBack");
  const done = tasks.filter((t) => t.task.state === "done");
  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

/**
 * Binds the search input listener on the board page.
 * Should be called once during board initialization.
 * @returns {void}
 */
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", searchBar);
}

/**
 * Opens the task details overlay for the given card element.
 * @param {Element} el
 * @returns {void}
 */
function openTaskDetailsOverlay(el) {
  const taskID = (el.getAttribute("data-id") || "").trim();
  const task = fetchData?.tasks?.[taskID];
  if (!task) return;
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  let contentRef = document.getElementById("contentRefTaskCard");
  if (!contentRef) {
    wrapper.innerHTML = `<div id="contentRefTaskCard"></div>`;
    contentRef = document.getElementById("contentRefTaskCard");
    if (!contentRef) return;
  }
  contentRef.innerHTML = taskPopup(task, taskID);
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
}

/**
 * Closes the task details overlay and re-renders the board.
 * @returns {void}
 */
function closetaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
}


/**
 * Converts a date string from "YYYY-MM-DD" to "DD/MM/YYYY".
 * @param {string} taskduedate
 * @returns {string}
 */
function dateStringChange(taskduedate) {
  const [y, m, d] = taskduedate.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Capitalizes the first letter of the given string.
 * @param {string} value
 * @returns {string}
 */
function capitalizeLetters(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : "";
}

/**
 * Renders avatars for checked contacts.
 * @param {Contact[]} contacts
 * @returns {string}
 */
function capitalizeLettersFullName(contacts) {
  return renderTaskContact(contacts);
}

/**
 * Renders detailed contact entries for checked contacts.
 * @param {Contact[]} [contacts=[]]
 * @returns {string}
 */
function renderTaskContactDetails(contacts = []) {
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].checked) html += renderTaskContactDetailsHTML(contacts[i]);
  }
  return html;
}

/**
 * Renders the subtasks list for a task.
 * @param {string} taskId
 * @returns {string}
 */
function renderTaskSubTaskDetails(taskId) {
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks || !Array.isArray(task.subtasks)) return "";
  let html = "";
  for (let i = 0; i < task.subtasks.length; i++) {
    html += renderTaskSubTaskDetailsHTML(task.subtasks[i], i, taskId);
  }
  return html;
}

/**
 * Toggles a subtask state and persists the updated data.
 * @async
 * @param {string} taskId
 * @param {number} subtaskIndex
 * @returns {Promise<void>}
 */
async function toggleSubtask(taskId, subtaskIndex) {
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks?.[subtaskIndex]) return;
  const subtask = task.subtasks[subtaskIndex];
  subtask.state = subtask.state === "uncheck" ? "check" : "uncheck";
  await postState();
}

/**
 * Normalizes subtasks so each entry is an object with `title` and `state`, then persists changes.
 * @async
 * @returns {Promise<void>}
 */
async function subTasksStateAdd() {
  if (!fetchData?.tasks) return;
  Object.values(fetchData.tasks).forEach((task) => {
    if (!Array.isArray(task.subtasks)) return;
    task.subtasks = task.subtasks.map((subtask) => {
      if (typeof subtask === "string") return { title: subtask, state: "uncheck" };
      if (subtask.state === undefined) subtask.state = "uncheck";
      return subtask;
    });
  });
  await postState();
}

/**
 * Deletes a task, closes the overlay and persists the change.
 * @async
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteTaskOnBoard(id) {
  if (!fetchData?.tasks?.[id]) return;
  delete fetchData.tasks[id];
  closetaskDetailsOverlay();
  renderBoard();
  await postState();
}

/**
 * Switches the task overlay into edit mode.
 * @param {string} id
 * @returns {void}
 */
function editTaskOnBoard(id) {
  const task = fetchData?.tasks?.[id];
  const overlay = document.getElementById("taskDetailsOverlay");
  if (!task || !overlay) return;
  prepareEditState(task);
  overlay.innerHTML = taskPopupEditMode(task, id);
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  bindAddTaskListeners(document);
  renderContact();
  assignedToLettersCheckContact();
  renderSubtasks();
}

/**
 * Renders edit-mode subtasks for a task.
 * @param {Task} task
 * @param {string} id
 * @returns {string}
 */
function renderSubtasksDetailsEdit(task, id) {
  if (!task?.subtasks || !Array.isArray(task.subtasks) || task.subtasks.length === 0) return "";
  let html = "";
  for (let i = 0; i < task.subtasks.length; i++) {
    const subtask = task.subtasks[i];
    if (!subtask?.title) continue;
    html += renderSubtasksDetailsEditHTML(subtask, i, id);
  }
  return html;
}

/**
 * Updates a subtask edit view in-place by replacing its HTML with the edit template.
 * @param {string} taskId
 * @param {number} i
 * @returns {void}
 */
function editChangeSubtask(taskId, i) {
  const subContainer = document.querySelector(`.sub-container[data-index="${i}"]`);
  if (!subContainer) return;
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks?.[i]) return;
  const currentValue = task.subtasks[i].title;
  subContainer.innerHTML = changeSubtaskHtml(i, currentValue);
  const newInputField = document.getElementById(`edit-input-${i}`);
  if (newInputField) newInputField.focus();
}

/**
 * Opens the edit mode overlay for one task.
 * @param {string} id Firebase task id
 * @returns {void}
 */
function editTaskOnBoard(id) {
  const task = fetchData?.tasks?.[id];
  const overlay = document.getElementById("taskDetailsOverlay");
  if (!task || !overlay) return;
  loadEditState(task);
  overlay.innerHTML = taskPopupEditMode(task, id);
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  bindAddTaskListeners(document);
  renderContact();
  assignedToLettersCheckContact();
  renderSubtasks();
}

/**
 * Loads task values into the global edit states.
 * @param {any} task
 * @returns {void}
 */
function loadEditState(task) {
  subTaskInput = (task.subtasks || []).map((s) => (typeof s === "string" ? s : s.title));
  const assignedIds = new Set((task.contacts || []).map((c) => c.id));
  contactsState = contactsState.map((c) => ({
    ...c,
    checked: assignedIds.has(c.id),
  }));
}

/**
 * Opens the edit mode overlay for one task.
 * @param {string} id Firebase task id
 * @returns {void}
 */
function editTaskOnBoard(id) {
  const task = fetchData?.tasks?.[id];
  const overlay = document.getElementById("taskDetailsOverlay");
  if (!task || !overlay) return;
  loadEditState(task);
  overlay.innerHTML = taskPopupEditMode(task, id);
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  bindAddTaskListeners(document);
  renderContact();
  assignedToLettersCheckContact();
  renderSubtasks();
}

/**
 * Loads task values into the global edit states.
 * @param {any} task
 * @returns {void}
 */
function loadEditState(task) {
  subTaskInput = (task.subtasks || []).map((s) => (typeof s === "string" ? s : s.title));
  const assignedIds = new Set((task.contacts || []).map((c) => c.id));
  contactsState = contactsState.map((c) => ({
    ...c,
    checked: assignedIds.has(c.id),
  }));
}

/**
 * Opens the edit mode overlay for one task.
 * @param {string} id Firebase task id
 * @returns {void}
 */
function editTaskOnBoard(id) {
  const task = fetchData?.tasks?.[id];
  const overlay = document.getElementById("taskDetailsOverlay");
  if (!task || !overlay) return;
  loadEditState(task);
  overlay.innerHTML = taskPopupEditMode(task, id);
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  bindAddTaskListeners(document);
  renderContact();
  assignedToLettersCheckContact();
  renderSubtasks();
}

/**
 * Reads an input/textarea value by id.
 * @param {string} id
 * @returns {string}
 */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/**
 * Reads the checked radio value of a group.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function getCheckedValue(name, fallback = "") {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}

/**
 * Loads task values into the global edit states.
 * @param {any} task
 * @returns {void}
 */
function loadEditState(task) {
  subTaskInput = (task.subtasks || []).map((s) => (typeof s === "string" ? s : s.title));
  const assignedIds = new Set((task.contacts || []).map((c) => c.id));
  contactsState = contactsState.map((c) => ({
    ...c,
    checked: assignedIds.has(c.id),
  }));
}

/**
 * Saves the edited task and updates Firebase.
 * @param {string} id Firebase task id
 * @returns {Promise<void>}
 */
async function saveEditedTask(id) {
  const task = fetchData?.tasks?.[id];
  if (!task) return;
  task.title = getValue("title");
  task.description = getValue("description");
  task.duedate = getValue("duedate");
  task.priority = getCheckedValue("priority", task.priority);
  task.category = getCheckedValue("priorityCategory", task.category);
  task.contacts = contactsState.filter((c) => c.checked);
  task.subtasks = subTaskInput.map((title) => ({ title, state: "uncheck" }));
  await postState();
  closetaskDetailsOverlay();
  renderBoard();
}


