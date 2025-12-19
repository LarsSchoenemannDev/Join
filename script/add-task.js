const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let FetchData = [];
let subTaskInput = [];
let tempTaskData = [];
processedContacts = [];
const requiredFields = document.querySelectorAll('#title, #duedate, #category');
const inputSubtask = document.getElementById("subtasks");
const subtaskBox = document.getElementById("showHidden");
const assignedTo = document.getElementById("BTNToggelContacts")

async function init() {
    await getData();
    clearInputs();
    PriorityBTN();
    renderContact();
    categorySelector();
    console.log(FetchData);
}

async function createTask(e) {
    const formIsValid = validateRequiredFields();
    if (!formIsValid) {
        e?.preventDefault?.();
        console.warn("Validierung fehlgeschlagen. Task wird nicht erstellt.");
        return;
    }
    const taskData = addtoTask(e);
    e?.preventDefault?.();
    const result = await postAddTask(taskData);
    if (result) {
        PriorityBTN();
        clearInputs();
        await getData();
    }
    console.log('taksData', taskData);
    console.log('result', result);

}

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
}

function validateRequiredFields() {
    const requiredFields = document.querySelectorAll('#title, #duedate, #category');
    let requiredCheck = true;
    const categoryValue = document.querySelector('input[name="priorityCategory"]:checked')?.value;
    const categoryButton = document.getElementById('selectCategoryHtml');
    requiredFields.forEach(required => {
        if (required.value.trim() === '') {
            required.classList.add('input-error');
            requiredCheck = false;
        } else {
            required.classList.remove('input-error');
        }
    });
    if (!categoryValue || categoryValue === 'Select task category') {
        categoryButton.classList.add('input-error');
        requiredCheck = false;
    } else {
        categoryButton.classList.remove('input-error');
    }
    return requiredCheck;
}


function addtoTask(element) {
    element?.preventDefault?.();
    const get = id => (document.getElementById(id)?.value ?? '').trim();
    tempTaskData = {
        title: get('title'),
        description: get('description'),
        duedate: get('duedate'),
        priority: document.querySelector('input[name="priority"]:checked')?.value ?? null,
        assignedTo: getSelectedContacts(),
        category: get('category'),
        subtasks: getSubtasks()
    };
    return tempTaskData;
}

async function postAddTask(data) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Task erfolgreich erstellt:", responseData);
        return responseData;
    } catch (error) {
        console.error("Fehler beim Speichern des Tasks:", error);
    }
}


function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('duedate').value = '';
    document.getElementById('prio-medium').checked = true;
    document.querySelector('input[name="priorityCategory"]:checked')
    document.getElementById('subtasks').value = '';
}

function PriorityBTN() {
    BTNStyling = document.querySelector('input[name="priority"]:checked')
}

function getSelectedContacts() {
    return Array.from(
        document.querySelectorAll('.checkbox-input:checked')
    ).map(checkBox => checkBox.value);
}

function getSubtasks() {
    return Array.from(
        document.querySelectorAll('[data-index]')
    ).map(subtaskElements => subtaskElements.value);
}


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
        const ele = contacts[i];
        const name = ele.name;
        const initials = ele.initials;
        const color = ele.color;
        html += renderContactHTML(initials, name, color, i)
    }
    CONTACT_LIST_CONTAINER.innerHTML = html;
}


function toggelContacts() {
    document.getElementById("selectContacts").classList.add('open');
    document.getElementById("BTNToggelContacts").style.display = 'none';
    document.getElementById("searchContacts").classList.remove('d-none');
    document.getElementById("closeAssigned").style.display = 'flex';
    document.getElementById("searchContacts").focus();
}

function closeAssigned() {
    document.getElementById("selectContacts").classList.remove('open');
    document.getElementById("BTNToggelContacts").style.display = 'flex';
    document.getElementById("searchContacts").classList.add('d-none');
    document.getElementById("closeAssigned").style.display = "none";
    document.getElementById("searchContacts").value = "";
}

function renderContact() {
    const contacts = FetchData.contacts;
    let html = "";

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        processedContacts[i] = {
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            originalIndex: i
        };
        html += renderContactHTML(
            contact.initials,
            contact.name,
            contact.color,
            i
        );
    }
    document.getElementById("selectContacts").innerHTML = html;
}


function checkBox(inputElement) {
    const row = inputElement.closest(".contact-row");
    if (!row) return;

    if (inputElement.checked) {
        row.style.backgroundColor = "#2A3647";
        row.style.color = "white";
    } else {
        row.style.backgroundColor = "";
        row.style.color = "";
    }

    refreshIcons();
}

function refreshIcons() {
    const container = document.getElementById("selectContact");
    container.innerHTML = "";
    const allCheckboxes = document.querySelectorAll(".checkbox-input");
    for (let i = 0; i < allCheckboxes.length; i++) {
        const checkbox = allCheckboxes[i];
        const rawIndex = checkbox.dataset.index;
        const index = Number(rawIndex);
        if (checkbox.checked) {
            const index = checkbox.dataset.index;
            container.innerHTML += letterInitials(index);
        }
    }
}

function createSubtasks() {
    const subtask = document.getElementById("showHidden");
    const input = document.getElementById("subtasks");
    input.focus();
    input.classList.toggle("input-icon-cancel,.input-icon-accept,.seperator-small")
}

function addSubtask() {
    const subTask = document.getElementById("subtasks");
    let subTaskValue = subTask.value.trim()
    if (subTaskValue.length <= 3) return;
    subTaskInput.push(subTask.value);
    renderSubtasks(subTaskValue);
    subTask.value = ``;

    subTask.focus();
}

function renderSubtasks() {
    const subTaskContent = document.getElementById("SubtaskList");
    let htmlContent = ``;
    for (let i = 0; i < subTaskInput.length; i++) {
        let subTaskNote = subTaskInput[i]
        htmlContent += subTaskContentHMTL(subTaskNote, i);
    }
    subTaskContent.innerHTML = htmlContent;
}

function changeSubtask(i) {
    const newSubtask = document.querySelector(`.sub-container[data-index="${i}"]`)
    let currentValue = subTaskInput[i];
    newSubtask.innerHTML = changeSubtaskHtml(i, currentValue)
    const newInputField = document.getElementById(`edit-input-${i}`);
    newInputField.focus();
}

function saveSubtaskEdit(i) {
    const subEdit = document.getElementById(`edit-input-${i}`);
    const subEditValue = subEdit.value.trim();
    subTaskInput[i] = subEditValue;
    renderSubtasks();
}


function deleteSubtask(i) {
    let focusinput = document.getElementById("subtasks")
    subTaskInput.splice(i, 1);
    renderSubtasks();
    focusinput.focus();
}

function cancelSubtask() {
    const input = document.getElementById("subtasks")
    input.value = ``;
    input.focus();
    document.getElementById("showHidden").style.display = "";
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


function toggelCategory() {
    document.getElementById("selectCategory").classList.toggle("open");
}

function categorySelector() {
    const selectedInput = document.querySelector('input[name="priorityCategory"]:checked');
    const selectedCategoryValue = selectedInput.value;
    const categoryContainer = document.getElementById("selectCategoryHtml");
    categoryContainer.innerHTML = setCategoryHTML(selectedCategoryValue);
    document.getElementById("selectCategory").classList.remove("open");
}

document.addEventListener('DOMContentLoaded', function () {
    const subtaskElement = document.getElementById("subtasks");
    if (subtaskElement) {
        subtaskElement.addEventListener("keydown", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addSubtask();
            }
        });
    } else {
        return;
    }
});

inputSubtask.addEventListener("focus", () => {
    subtaskBox.style.display = "flex";
});
document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-wrapper")) {
        subtaskBox.style.display = "none";
    }
});

document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("selectContacts");
    const button = document.getElementById("BTNToggelContacts");

    const clickedInsideDropdown = dropdown.contains(event.target);
    const clickedButton = button.contains(event.target);

    if (!clickedInsideDropdown && !clickedButton) {
        closeAssigned();
    }
});

document.addEventListener("click", function (event) {
    const category = document.getElementById("selectCategory");
    const button = document.querySelector('#selectCategoryHtml button');

    const clickInsideCategory = category.contains(event.target);
    const clickOnButton = button.contains(event.target);

    if (!clickInsideCategory && !clickOnButton) {
        category.classList.remove("open");
    }
});
