const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let FetchData = [];
let subTaskInput = [];
const requiredFields = document.querySelectorAll('#title, #duedate, #category');

/**
 * This function collects data from input fields 
 * 
 * 
 */
//* -- Create Task Button -- sammeln von denn daten  --
async function createTask() {
    await getData();
    addtoTask();
    clearInputs();
    renderContact()

}

//* -- Daten von Firebase holen --
async function getData() {
    try {
        const response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        FetchData = data;
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
    console.log(FetchData);
}

/**
 * This function colltects data from input fields
 * 
 * @param {SubmitEvent} [e] - Optional form submit event to prevent page reload.
 * @returns - Data Object, title, description, duedate, category, subtasks and priority
 *  Object with the collected task data.
 */
//* -- Sammeln von denn inputs --
function addtoTask(e) {
    e?.preventDefault?.();
    const get = id => (document.getElementById(id)?.value ?? '').trim();
    const result = {
        title: get('title'),
        description: get('description'),
        duedate: get('duedate'),
        category: get('category'),
        subtasks: get('subtasks'),
        priority: document.querySelector('input[name="priority"]:checked')?.value ?? null
    };
    return result;
}

/**
 * Function to clear input fields after create a task
 * 
 */

//* --- Eingabefelder leeren --
function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('duedate').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
}
/**
 * Function to change and get priority button checked
 */
function PriorityBTN() {
    BTNStyling = document.querySelector('input[name="priority"]:checked')
}


//* -- Kontakt-Liste rendern --
function renderContact() {
    const CONTACT_LIST_CONTAINER = document.getElementById("selectContacts");
    CONTACT_LIST_CONTAINER.innerHTML = "";

    if (!FetchData || !Array.isArray(FetchData.contacts)) {
        console.error("Kontakt-Daten sind nicht verfügbar.");
        return;
    }
    const contacts = FetchData.contacts;
    let html = "";
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const initials = contact.name.split(' ').map(x => x[0]).join('');
        const colorClass = getRandomColorClass();
        html += renderContactHTML(contact, initials, colorClass)
    }
    CONTACT_LIST_CONTAINER.innerHTML = html;
}

//* -- Zufällige Farbklasse für Initialen auswählen --
function getRandomColorClass() {
    const colorClasses = [
        "initials-Variant1",
        "initials-Variant2",
        "initials-Variant3",
        "initials-Variant4",
        "initials-Variant5",
        "initials-Variant6",
        "initials-Variant7",
        "initials-Variant8",
        "initials-Variant9",
        "initials-Variant10",
        "initials-Variant11",
        "initials-Variant12",
        "initials-Variant13",
        "initials-Variant14",
        "initials-Variant15"
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

/**
 * 
 * @param {string} contact - Contact Object
 * @param {string} initials - Initials of Contact 
 * @param {number} colorClass - Random Color class of Initails
 * @returns - inner HTML for Rendering
 */
function renderContactHTML(contact, initials, colorClass) {
    return `    
    <ul class="contact-row">
    <div class="contact-left">
    <div class="initials-circle ${colorClass}">${initials}</div>
    <span class="contact-name">${contact.name}</span>
    </div>
    <label class="checkbox">
    <input id="checkbox" onclick="checkBox(this)" class="checkbox-input" name="checked" type="checkbox" value="${contact.name}">
    <span class="checkbox-box"></span>
        </label>
      </ul>
    `;
}

function toggelContacts() {
    const dropdown = document.getElementById("selectContacts");
    dropdown.classList.toggle('open');
}

function checkBox(inputElement) {
    const BGChange = inputElement.closest(".contact-row");
    if (BGChange) {
        const contactNameElement = BGChange.querySelector(".contact-name");
        if (inputElement.checked) {
            BGChange.style.borderRadius = "12px";
            BGChange.style.backgroundColor = "#2A3647";
            if (contactNameElement) {
                contactNameElement.style.color = "#ffff";
            }
        } else {
            BGChange.style.backgroundColor = "";
            BGChange.style.borderRadius = "";
            if (contactNameElement) {
                contactNameElement.style.color = "";
            }
        }
    }
}


function createSubtasks() {
    const subtask = document.getElementById("showHidden");
    const input = document.getElementById("subtasks");
    subtask.style.display = "flex";
    input.focus();
}

function addSubtask() {
    let subTask = document.getElementById("subtasks");
    let subTaskValue = subTask.value.trim()
    if (subTaskValue.length <= 3) return;
    subTaskInput.push(subTask.value);
    renderSubtasks(subTaskValue);
    subTask.value = ``;
}

function renderSubtasks() {
    let subTaskContent = document.getElementById("SubtaskList");
    let htmlContent = ``;
    for (let i = 0; i < subTaskInput.length; i++) {
        let subTaskNote = subTaskInput[i]
        htmlContent += subTaskContentHMTL(subTaskNote, i);
    }
    subTaskContent.innerHTML = htmlContent;
}
/**
 * 
 * @param {string} subTaskInput -  
 * @param {number} i - index of subTaskInput
 * @returns - innerHTML for the Subtask Element
 */
function subTaskContentHMTL(subTaskInput, i) {
    return `
    <div class="sub-container" data-index="${i}">
    <span class="display-flex">&bull; ${subTaskInput}</span>
    <img src="../assets/img/Subtasks change.svg" class="input-icon-cancel" onclick="changeSubtask(${i})">
    <div class="seperator-small"></div>
    <img src="../assets/img/SubTask delete.svg" class="input-icon-accept" onclick="deleteSubtask(${i})">
    </span>
    </div>
    
    `;
}


/**
 * 
 * @param {number} i - Index of the Subtask point
 */
function changeSubtask(i) { // index vom array
    let newSubtask = document.querySelector(`.sub-container[data-index="${i}"]`) // wert suchen mit index vom html 
    let currentValue = subTaskInput[i]; // gleich setzung
    newSubtask.innerHTML = `    
    <input type="text" class="subtask-edit-input" value="${currentValue}" id="edit-input-${i}"
    title="Geben Sie den neuen Text ein">
    <img src="../assets/img/Subtasks accept.svg" class="input-icon-accept" onclick="saveSubtaskEdit(${i})">
    <div class="seperator-small"></div>
    <img src="../assets/img/Subtasks cancel.svg" class="input-icon-cancel" onclick="renderSubtasks()">
    `;
    const newInputField = document.getElementById(`edit-input-${i}`); // zugriff auf das eddit arry index aber wo für     
}

function saveSubtaskEdit(i) {
    const subEdit = document.getElementById(`edit-input-${i}`);
    const subEditValue = subEdit.value.trim();
    subTaskInput[i] = subEditValue;
    renderSubtasks();
}


function deleteSubtask(i) {
    subTaskInput.splice(i, 1);
    renderSubtasks();
}

function cancelSubtask() {
    document.getElementById("subtasks").value = ``;
    document.getElementById("showHidden").classList.add("img-container");

}

function onFocus(event) {
    const el = event.target;
    el.classList.add('input-focus');
    el.classList.remove('input-error');
}

function noneFocus(event) {
    const el = event.target;
    const value = el.value.trim();

    el.classList.remove('input-focus');

    if (!value) {
        el.classList.add('input-error');
    } else {
        el.classList.remove('input-error');
    }
}

requiredFields.forEach((field) => {
    field.addEventListener('focus', onFocus);
    field.addEventListener('blur', noneFocus);
});



