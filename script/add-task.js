const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let fetchData = {};
let subTaskInput = [];
let contactsState = [];
let tempPageInputs = {};
let taskData = {};
let valid = { title: false, duedate: false, category: false };

/**
 * Initializes the add-task page: loads data, resets inputs and registers event handlers.
 * @async
 * @returns {Promise<void>}
 */
async function initAddTask() {
  await getData();
  clearInputs();
  bindAddTaskListeners(document);
}

/**
 * Fetches data from the backend and initializes `fetchData` and `contactsState`.
 * @async
 * @returns {Promise<void>}
 */
async function getData() {
  const response = await fetch(`${BASE_URL}.json`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  /** @type {FetchData} */
  const data = await response.json();
  fetchData = data;
  contactsState = Object.values(data?.contacts || {}).map(contact => ({
    id: contact.id,
    name: contact.name,
    initials: contact.initials,
    color: contact.color,
    checked: false,
  }));

}

/**
 * Renders the contacts list inside the contacts dropdown.
 * @param {Contact[]} [list=contactsState]
 * @returns {void}
 */
function renderContact(list = contactsState) {
  const el = document.getElementById("selectContacts");
  if (!el) return;
  let content = "";
  for (const contact of list) {
    content += renderContactHTML(contact.initials, contact.name, contact.color, contact.id, contact.checked);
  }
  el.innerHTML = content;
}

/**
 * Renders selected contacts initials into the assigned-to container.
 * @returns {void}
 */
function assignedToLettersCheckContact() {
  const container = document.getElementById("selectContact");
  if (!container) return;
  container.innerHTML = "";
  let contactCounter = 0;
  contactsState.filter(c => c.checked).forEach(c => {
    contactCounter++;
    if (contactCounter <= 8) {
      container.innerHTML += letterInitials(c);
    } else if (contactCounter === 9) {
      const totalChecked = contactsState.filter(x => x.checked).length;
      container.innerHTML += letterInitialsMax(totalChecked - 8);
    }
  });
}


/**
 * Filters contacts by the search input and re-renders the list.
 * @returns {void}
 */
function contactSearch() {
  const input = document.getElementById("searchContacts");
  if (!input) return;
  const value = input.value.toLowerCase();
  if (value.length === 0) {
    renderContact();
    return;
  }
  const filtered = contactsState.filter((c) => c.name.toLowerCase().includes(value));
  renderContact(filtered);
}

/**
 * Posts a new task payload to the backend.
 * @async
 * @param {TaskPayload} data
 * @returns {Promise<any>}
 */
async function postAddTask(data) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

/**
 * Opens the contacts dropdown and prepares the search input.
 * @returns {void}
 */
function toggleContacts() {
  renderContact();
  const search = document.getElementById("searchContacts");
  const dropdown = document.getElementById("selectContacts");
  const button = document.getElementById("BTNToggleContacts");
  const closeBtn = document.getElementById("closeAssigned");
  if (!search || !dropdown || !button || !closeBtn) return;
  search.value = "";
  dropdown.classList.add("open");
  button.style.display = "none";
  search.classList.remove("d-none");
  closeBtn.style.display = "flex";
  search.focus();
}

/**
 * Toggles the checked state of a contact by id and updates the assigned display.
 * @param {string|number} id
 * @returns {void}
 */
function toggleContact(id) {
  const contact = contactsState.find((c) => c.id === id);
  if (!contact) return;
  contact.checked = !contact.checked;
  assignedToLettersCheckContact();
}

/**
 * Closes the contacts dropdown and resets related UI elements.
 * @returns {void}
 */
function closeAssigned() {
  const dropdown = document.getElementById("selectContacts");
  const button = document.getElementById("BTNToggleContacts");
  const search = document.getElementById("searchContacts");
  const closeBtn = document.getElementById("closeAssigned");
  if (!dropdown || !button || !search || !closeBtn) return;
  dropdown.classList.remove("open");
  button.style.display = "flex";
  search.classList.add("d-none");
  closeBtn.style.display = "none";
  search.value = "";
}

/**
 * Focuses the subtask input and toggles input icon classes.
 * @returns {void}
 */
function createSubtasks() {
  const input = document.getElementById("subtasks");
  if (!input) return;
  input.focus();
  input.classList.toggle("input-icon-cancel,.input-icon-accept,.seperator-small");
}

/**
 * Adds a new subtask from the input field to the list and re-renders the subtasks.
 * @returns {void}
 */
function addSubtask() {
  const subTask = document.getElementById("subtasks");
  if (!subTask) return;
  const subTaskValue = subTask.value.trim();
  if (subTaskValue.length <= 3) return;
  subTaskInput.push(subTaskValue);
  renderSubtasks();
  subTask.value = "";
  subTask.focus();
}

/**
 * Renders the current subtask list into the subtask container.
 * @returns {void}
 */
function renderSubtasks() {
  const subTaskContent = document.getElementById("SubtaskList");
  if (!subTaskContent) return;
  let htmlContent = "";
  for (let i = 0; i < subTaskInput.length; i++) {
    htmlContent += subTaskContentHMTL(subTaskInput[i], i);
  }
  subTaskContent.innerHTML = htmlContent;
}

/**
 * Switches a subtask item into edit mode.
 * @param {number} i
 * @returns {void}
 */
function changeSubtask(i) {
  const newSubtask = document.querySelector(`.sub-container[data-index="${i}"]`);
  if (!newSubtask) return;
  const currentValue = subTaskInput[i] || "";
  newSubtask.innerHTML = changeSubtaskHtml(i, currentValue);
  const newInputField = document.getElementById(`edit-input-${i}`);
  if (newInputField) newInputField.focus();
}

/**
 * Saves an edited subtask value and re-renders the list.
 * @param {number} i
 * @returns {void}
 */
function saveSubtaskEdit(i) {
  const subEdit = document.getElementById(`edit-input-${i}`);
  if (!subEdit) return;
  subTaskInput[i] = subEdit.value.trim();
  renderSubtasks();
}

/**
 * Deletes a subtask at the given index and re-renders the list.
 * @param {number} i
 * @returns {void}
 */
function deleteSubtask(i) {
  const focusinput = document.getElementById("subtasks");
  subTaskInput.splice(i, 1);
  renderSubtasks();
  if (focusinput) focusinput.focus();
}

/**
 * Clears the subtask input and closes the subtask box.
 * @returns {void}
 */
function cancelSubtask() {
  const input = document.getElementById("subtasks");
  const box = document.getElementById("showHiddenSubtasks");
  if (!input || !box) return;
  input.value = "";
  input.focus();
  box.style.display = "";
}

/**
 * Adds focus styling and clears error state for an input element.
 * @param {FocusEvent} event
 * @returns {void}
 */
function onFocus(event) {
  const el = /** @type {HTMLElement} */ (event.target);
  el.classList.add("input-focus");
  el.classList.remove("input-error");
}

/**
 * Removes focus styling and updates validation state for the field.
 * @param {FocusEvent} event
 * @returns {void}
 */
function noneFocus(event) {
  const el = /** @type {HTMLInputElement} */ (event.target);
  const value = el.value.trim();
  const id = el.id;
  el.classList.remove("input-focus");
  if (!value) {
    el.classList.add("input-error");
    valid[id] = false;
  } else {
    el.classList.remove("input-error");
    valid[id] = true;
  }
}

/**
 * Toggles the category dropdown and updates the arrow icon.
 * @param {Event} [event]
 * @returns {void}
 */
function toggleCategory(event) {
  if (event) event.stopPropagation();
  const changeArrow = document.getElementById("categoryBtn");
  const dropdown = document.getElementById("selectCategory");
  if (!changeArrow || !dropdown) return;
  dropdown.classList.toggle("open");
  if (dropdown.classList.contains("open")) {
    changeArrow.style.backgroundImage = "url('../assets/img/arrowUup.svg')";
  } else {
    changeArrow.style.backgroundImage = "url('../assets/img/arrow_drop_down-icon.svg')";
  }
}

/**
 * Applies the selected category label to the category button and validates the selection.
 * @returns {void}
 */
function categorySelector() {
  const selected = document.querySelector('input[name="priorityCategory"]:checked');
  const label = selected ? selected.value : "Select task category";
  const button = document.getElementById("categoryBtn");
  const dropdown = document.getElementById("selectCategory");
  if (!button || !dropdown) return;
  button.textContent = label;
  dropdown.classList.remove("open");
  categorySelectorCheck();
}

/**
 * Validates category selection and updates visual state on the category button.
 * @returns {void}
 */
function categorySelectorCheck() {
  const selected = document.querySelector('input[name="priorityCategory"]:checked');
  const value = selected ? selected.value.trim() : "";
  valid.category = value === "Technical Task" || value === "User Story";
  const button = document.getElementById("categoryBtn");
  if (!button) return;
  if (valid.category) {
    button.classList.remove("input-error");
    button.classList.add("input-focus");
  } else {
    button.classList.add("input-error");
  }
}

/**
 * Resets all add-task inputs and UI states to defaults.
 * @returns {void}
 */
function clearInputs() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const duedate = document.getElementById("duedate");
  const prioMedium = document.getElementById("prio-medium");
  const categoryBtn = document.getElementById("categoryBtn");
  const subtasks = document.getElementById("subtasks");
  const subtaskList = document.getElementById("SubtaskList");
  const selectContact = document.getElementById("selectContact");
  if (title) title.value = "";
  if (description) description.value = "";
  if (duedate) duedate.value = "";
  if (prioMedium) prioMedium.checked = true;
  document.querySelectorAll('input[name="priorityCategory"]').forEach((r) => (r.checked = false));
  if (categoryBtn) categoryBtn.textContent = "Select task category";
  valid.category = false;
  subTaskInput = [];
  if (subtasks) subtasks.value = "";
  if (subtaskList) subtaskList.innerHTML = "";
  if (selectContact) selectContact.innerHTML = "";
  contactsState.forEach(contact => { contact.checked = false; })
}


/**
 * Reads values from the add-task form and builds a task payload.
 * @returns {TaskPayload}
 */
function getDataFromPage() {
  const inputs = document.querySelectorAll("#title, #description, #duedate");
  inputs.forEach((input) => {
    taskData[input.id] = input.value;
  });
  const selectedCategory = document.querySelector('input[name="priorityCategory"]:checked');
  taskData.category = selectedCategory ? selectedCategory.value : "";
  taskData.contacts = contactsState.filter((contact) => contact.checked);
  taskData.subtasks = subTaskInput.slice();
  const priority = document.querySelector('input[name="priority"]:checked');
  taskData.priority = priority ? priority.value : "medium";
  return /** @type {TaskPayload} */ (taskData);
}

/**
 * Posts `taskData` to the backend tasks collection.
 * @async
 * @returns {Promise<any>}
 */
async function postData() {
  const response = await fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return response.json();
}

/**
 * Updates the create button UI state based on current validation flags.
 * @returns {void}
 */
function isValid() {
  const button = document.getElementById("colorChange");
  if (!button) return;
  const allValid = Object.values(valid).every((value) => value === true);
  if (allValid) {
    button.classList.remove("btn-State");
    button.classList.add("btn-clear");
    button.classList.remove("no-hover");
    button.style.cursor = "pointer";
    button.disabled = false;
  } else {
    button.classList.remove("btn-clear");
    button.classList.add("btn-State");
    button.classList.add("no-hover");
    button.style.cursor = "not-allowed";
    button.disabled = true;
  }
}

/**
 * Shows the "task added" popup with an animation.
 * @returns {void}
 */
function popup() {
  const createPopUp = document.querySelector(".popup-added");
  if (!createPopUp) return;
  createPopUp.classList.remove("show");
  void createPopUp.offsetWidth;
  createPopUp.classList.add("show");
  setTimeout(() => {
    popupHide();
  }, 2000);
}

/**
 * Hides the popup and resets its display after the animation.
 * @returns {void}
 */
function popupHide() {
  const popupEl = document.querySelector(".popup-added");
  if (!popupEl) return;
  popupEl.classList.remove("show");
  popupEl.classList.add("hide");
  setTimeout(() => {
    popupEl.classList.remove("hide");
    popupEl.style.display = "none";
  }, 300);
}

/**
 * Creates a task by reading form data, posting it and resetting the UI.
 * @async
 * @returns {Promise<void>}
 */
async function CreateTask() {
  getDataFromPage();
  await postData();
  clearInputs();
  popup();
}

let addTaskListenersBound = false;

function bindAddTaskListeners(root = document) {
  if (addTaskListenersBound) return;
  addTaskListenersBound = true;

  root.addEventListener("click", handleGlobalClick);
  root.addEventListener("input", handleGlobalInput);
  root.addEventListener("focusin", handleGlobalFocusIn);
  root.addEventListener("focusout", handleGlobalFocusOut);
  root.addEventListener("keydown", handleGlobalKeyDown);
}

function handleGlobalClick(e) {
  const subtaskBox = document.getElementById("showHiddenSubtasks");
  if (subtaskBox && !e.target.closest(".input-wrapper")) subtaskBox.style.display = "none";

  const contactsDropdown = document.getElementById("selectContacts");
  const contactsBtn = document.getElementById("BTNToggleContacts");
  if (contactsDropdown && contactsBtn) {
    const inside = contactsDropdown.contains(e.target) || contactsBtn.contains(e.target);
    if (!inside) closeAssigned();
  }

  const categoryDropdown = document.getElementById("selectCategory");
  const categoryBtn = document.getElementById("categoryBtn");
  if (categoryDropdown && categoryBtn) {
    const inside = categoryDropdown.contains(e.target) || categoryBtn.contains(e.target);
    if (!inside) {
      categoryDropdown.classList.remove("open");
      categoryBtn.classList.remove("input-focus");
      categoryBtn.classList.remove("input-error");
    }
  }

  if (typeof isValid === "function") isValid();
}

function handleGlobalInput(e) {
  if (e.target && e.target.id === "searchContacts") contactSearch();
}

function handleGlobalFocusIn(e) {
  if (!e.target) return;
  if (e.target.id === "subtasks") {
    const subtaskBox = document.getElementById("showHiddenSubtasks");
    if (subtaskBox) subtaskBox.style.display = "flex";
  }
  if (e.target.id === "title" || e.target.id === "duedate") onFocus(e);
}

function handleGlobalFocusOut(e) {
  if (!e.target) return;
  if (e.target.id === "title" || e.target.id === "duedate") noneFocus(e);
}

function handleGlobalKeyDown(e) {
  if (e.target && e.target.id === "subtasks" && e.key === "Enter") {
    e.preventDefault();
    addSubtask();
  }
}

