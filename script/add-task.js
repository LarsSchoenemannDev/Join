const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let FetchData = {};
let subTaskInput = [];
let contactsState = [];
let tempPageInputs = {};
let taskData = {};
let createState = false;

const requiredFields = document.querySelectorAll("#title, #duedate, #category");
const inputSubtask = document.getElementById("subtasks");
const subtaskBox = document.getElementById("showHidden");

async function init() {
    await getData();
    renderContact();
    clearInputs();
    priorityMedium();
}

async function getData() {
    try {
        const response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`
            );
        }
        const data = await response.json();
        FetchData = data;
        contactsState = data.contacts.map(contact => ({
            id: contact.id,
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            checked: false
        }));
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function renderContact(list = contactsState) {
    let html = "";
    for (let i = 0; i < list.length; i++) {
        const contact = list[i];
        html += renderContactHTML(contact.initials, contact.name, contact.color, contact.id, contact.checked);
    }
    document.getElementById("selectContacts").innerHTML = html;
}

function assignedToLettersCheckContact() {
    const container = document.getElementById("selectContact");
    container.innerHTML = "";
    contactsState.filter(c => c.checked).forEach(c => {
        container.innerHTML += letterInitials(c);
    });
}

function contactSearch() {
    const value = document.getElementById("searchContacts").value.toLowerCase();
    if (value.length === 0) {
        renderContact();
        return;
    }

    const filtered = contactsState.filter(c =>
        c.name.toLowerCase().includes(value)
    );
    renderContact(filtered);
}

async function postAddTask(data) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
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

function priorityMedium() {
    let priorityMedium = document.querySelector('input[name="priority"]:checked')
}

function toggleContacts() {
    document.getElementById("searchContacts").value = "";
    document.getElementById("selectContacts").classList.add("open");
    document.getElementById("BTNToggleContacts").style.display = "none";
    document.getElementById("searchContacts").classList.remove("d-none");
    document.getElementById("closeAssigned").style.display = "flex";
    document.getElementById("searchContacts").focus();
}

function toggleContact(id) {
    const contact = contactsState.find(c => c.id === id);
    contact.checked = !contact.checked;
    assignedToLettersCheckContact();
}


function closeAssigned() {
    document.getElementById("selectContacts").classList.remove('open');
    document.getElementById("BTNToggleContacts").style.display = 'flex';
    document.getElementById("searchContacts").classList.add('d-none');
    document.getElementById("closeAssigned").style.display = "none";
    document.getElementById("searchContacts").value = "";
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
    renderSubtasks();
    subTask.value = ``;
    subTask.focus();
}

function renderSubtasks() {
    const subTaskContent = document.getElementById("SubtaskList");
    let htmlContent = "";
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
    el.classList.add("input-focus");
    el.classList.remove("input-error");
}

function noneFocus(event) {
    const el = event.target;
    const value = el.value.trim();
    el.classList.remove("input-focus");
    if (!value) {
        el.classList.add("input-error");
    } else {
        el.classList.remove("input-error");
    }
}

requiredFields.forEach((field) => {
    field.addEventListener("focus", onFocus);
    field.addEventListener("blur", noneFocus);
});

function toggleCategory() {
    const changeArrow = document.getElementById("category");
    const toggleCategory = document.getElementById("selectCategory");
    toggleCategory.classList.toggle("open")
    if (toggleCategory.classList.contains("open")) {
        changeArrow.style.backgroundImage = "url('../assets/img/arrowUup.svg')"
    } else {
        changeArrow.style.backgroundImage = "url('../assets/img/arrow_drop_down-icon.svg"
    }
}

function categorySelector() {
    const selectedInput = document.querySelector('input[name="priorityCategory"]:checked');
    const selectedCategoryValue = selectedInput.value;
    const categoryContainer = document.getElementById("selectCategoryHtml");
    categoryContainer.innerHTML = setCategoryHTML(selectedCategoryValue);
    document.getElementById("selectCategory").classList.remove("open");
}

function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("duedate").value = "";
    document.getElementById("prio-medium").checked = true;
    document.getElementById("SelectTaskCategory").checked = true;
    categorySelector()
    document.getElementById("subtasks").value = "";
    document.getElementById("selectContact").innerHTML = "";
    document.querySelectorAll(".checkbox-input:checked").forEach((Checkbox) => { Checkbox.checked = false; });
}

document.addEventListener("DOMContentLoaded", function () {
    const subtaskElement = document.getElementById("subtasks");
    if (subtaskElement) {
        subtaskElement.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addSubtask();
            }
        });
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
    const button = document.getElementById("BTNToggleContacts");
    const clickedInsideDropdown = dropdown.contains(event.target);
    const clickedButton = button.contains(event.target);
    if (!clickedInsideDropdown && !clickedButton) {
    }
});

document.addEventListener("click", function (event) {
    const category = document.getElementById("selectCategory");
    const button = document.querySelector("#selectCategoryHtml button");
    const clickInsideCategory = category.contains(event.target);
    const clickOnButton = button.contains(event.target);
    if (!clickInsideCategory && !clickOnButton) {
        category.classList.remove("open");
    }
});

function getDataFromPage() {
    let inputs = document.querySelectorAll("#title, #description, #duedate");
    inputs.forEach(function (input) {
        taskData[input.id] = input.value;
    });
    let selectedCategory = document.querySelector('input[name="priorityCategory"]:checked');
    taskData.category = selectedCategory ? selectedCategory.value : "";
    taskData.contacts = contactsState.filter(function (contact) {
        return contact.checked;
    });
    taskData.subtasks = subTaskInput;
    let priority = document.querySelector('input[name="priority"]:checked');
    taskData.priority = priority ? priority.value : "medium";
    return taskData;
}

function validationRequired() {
    const taskData = getDataFromPage();
    const requiredFieldsValidation = ["title", "duedate", "category"];
    const createTaskBTN = document.getElementById("colorChange")
    let validationRequiredCheck = true;
    requiredFieldsValidation.forEach((key) => {
        const value = taskData[key];
        const element = document.getElementById(key);
        if (element) {
            element.style.borderColor = "";
        }
        if (!value || value.trim() === "") {
            console.warn("Validierung fehlgeschlagen:", key, "ist leer");
            validationRequiredCheck = false;
            if (element) {
                element.style.borderColor = "#E60026";
            }
            return;
        }
        if (key === "category" && !["technical task", "user story"].includes(value.toLowerCase().trim())) {
            console.warn("Validierung fehlgeschlagen: Kategorie nicht gewählt");
            validationRequiredCheck = false;
            if (element) {
                element.style.borderColor = "#E60026";
            }
        }
        if (validationRequiredCheck === true){
        createTaskBTN.style.background = "#2A3647";
    }

});
return validationRequiredCheck;
}


async function pushTask() {
    const isValid = validationRequired();
    if (isValid === true) {
        let data = getDataFromPage();
        console.log("Daten gesammelt:", data);
        document.querySelector(".popup-added").style.display = "flex";
        try {
            const response = await postData(path = "/tasks",);
            console.log("Erfolgreich Daten an API übergeben", response);

        } catch (error) {
            console.error("Fehler beim Senden der Daten:", error);
            document.querySelector(".popup-added").style.display = "none";
        }
    }
}

async function postData() {
    let response = await fetch(BASE_URL + "/tasks" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
    return responseToJSON = await response.json();
}

async function CreateTask() {
    await pushTask();
    await postData();
}