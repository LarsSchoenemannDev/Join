const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let FetchData = [];
let subTaskInput = [];
let tempTaskData = [];
const requiredFields = document.querySelectorAll('#title, #duedate, #category');
const input = document.getElementById("subtasks");
const box = document.getElementById("showHidden");
console.log(tempTaskData);

async function init() {
    await getData();
    clearInputs();
    PriorityBTN();
    renderContact();
    categorySelector();
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
    console.log('result',result);   
    
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
    console.log(FetchData);
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
        title: get('title'), // abfrage required
        description: get('description'),
        duedate: get('duedate'), // abfrage required
        priority: document.querySelector('input[name="priority"]:checked')?.value ?? null,
        assignedTo: getSelectedContacts(),
        category: get('category'), // abfrage required
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
        const contact = contacts[i];
        const initials = contact.name.trim().split(' ').map(x => x[0]).join('');
        const colorClass = getRandomColorClass();
        html += renderContactHTML(contact, initials, colorClass)
    }
    CONTACT_LIST_CONTAINER.innerHTML = html;
}

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


function toggelContacts() {
    const dropdown = document.getElementById("selectContacts");
    const BTNContactsToggel = document.getElementById("BTNToggelContacts")
    const searchContacts = document.getElementById("searchContacts")
    const testBox = document.querySelector("body")
    dropdown.classList.toggle('open');
    BTNContactsToggel.style.display = 'none';
    searchContacts.classList.toggle('d-none');
    searchContacts.focus();
}

function contactSearch() {
    const searchInput = document.getElementById("searchContacts");
    const searchArray = searchInput.value.toLowerCase();
    const searchRenderHTML = document.getElementById("selectContacts");
    let nameSearch = FetchData.contacts.filter(contact => contact.name.toLowerCase().includes(searchArray));
    if (searchInput.value.length === 0) {
        renderContact();
    } else {
        searchRenderHTML.innerHTML = "";
        let html = "";
        for (let i = 0; i < nameSearch.length; i++) {
            const contact = nameSearch[i];
            const initials = contact.name.trim().split(' ').map(x => x[0]).join('');
            const colorClass = getRandomColorClass();
            html += renderContactSearchHTML(contact, initials, colorClass, i);
        }
        searchRenderHTML.innerHTML = html;
        if (nameSearch.length === 0) {
            searchRenderHTML.innerHTML = searchRenderHTMLZero();

        }
    }
    console.log(nameSearch);
}

function checkBox(inputElement) {
    const BGChange = inputElement.closest(".contact-row");
    if (BGChange) {
        const contactNameElement = BGChange.querySelector(".contact-name");
        if (inputElement.checked) {
            BGChange.style.borderRadius = "12px";
            BGChange.style.backgroundColor = "#2A3647";
            BGChange.style.color = "#ffff"
            if (contactNameElement) {
                contactNameElement.style.color = "#ffff";
            }
        } else {
            BGChange.style.backgroundColor = "";
            BGChange.style.borderRadius = "";
            BGChange.style.color = ""
            if (contactNameElement) {
                contactNameElement.style.color = "";
            }
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
    const categorydropdown = document.getElementById("selectCategory");
    categorydropdown.classList.toggle("open");
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

input.addEventListener("focus", () => {
    box.style.display = "flex";
});
document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-wrapper")) {
        box.style.display = "none";
    }
});
