const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let fetchData = {};
let subTaskInput = [];
let contactsState = [];
let tempPageInputs = {};
let taskData = {};
let valid = { title: false, duedate: false, category: false }


async function init() {
    await getData();
    renderContact();
    clearInputs();
    eventsAddTask();
    console.log("Status", document.readyState)
}

async function getData() {
    try {
        const response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`
            );
        }
        const data = await response.json();
        fetchData = data;
        contactsState = data?.contacts?.filter(c => c).map(contact => ({
            id: contact.id,
            name: contact.name,
            initials: contact.initials,
            color: contact.color,
            checked: false
        })) || [];
    } catch (error) {
        console.log("error: ", error);

    }
}

function renderContact(list = contactsState) {
    let html = "";
    console.log("Dom Activ");
    
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

function toggleCategory(event) {
    if (event) event.stopPropagation();
    const changeArrow = document.getElementById("categoryBtn");
    const toggleCategory = document.getElementById("selectCategory");
    toggleCategory.classList.toggle("open");
    if (toggleCategory.classList.contains("open")) {
        changeArrow.style.backgroundImage = "url('../assets/img/arrowUup.svg')";
    } else {
        changeArrow.style.backgroundImage = "url('../assets/img/arrow_drop_down-icon.svg')";
    }
}

function categorySelector() {
    const selected = document.querySelector('input[name="priorityCategory"]:checked');
    const label = selected ? selected.value : "Select task category";
    const button = document.getElementById("categoryBtn");
    const dropdown = document.getElementById("selectCategory");
    button.textContent = label;
    dropdown.classList.remove("open");
    categorySelectorCheck();
}

function categorySelectorCheck() {
    const selected = document.querySelector('input[name="priorityCategory"]:checked');
    const value = selected ? selected.value.trim() : "";
    valid.category = (value === "Technical Task" || value === "User Story");
    const button = document.getElementById("categoryBtn");
    if (valid.category) {
        button.classList.remove("input-error");
        button.classList.add("input-focus");
    } else {
        button.classList.add("input-error");
    }
}

function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("duedate").value = "";
    document.getElementById("prio-medium").checked = true;
    document.querySelectorAll('input[name="priorityCategory"]').forEach(r => r.checked = false);
    document.getElementById("categoryBtn").textContent = "Select task category";
    valid.category = false;
    subTaskInput = [];
    document.getElementById("subtasks").value = "";
    document.getElementById("SubtaskList").innerHTML = "";
    document.getElementById("selectContact").innerHTML = "";
    document.querySelectorAll(".checkbox-input:checked").forEach(cb => cb.checked = false);
}

function eventsAddTask() {
    console.log(document.readyState);
    if (document.readyState === "complete") {
        let requiredFields = document.querySelectorAll("#title, #duedate ");
        let inputSubtask = document.getElementById("subtasks");
        let subtaskBox = document.getElementById("showHidden");
        inputSubtask.addEventListener("focus", () => {
            subtaskBox.style.display = "flex";
        });
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".input-wrapper")) {
                subtaskBox.style.display = "none";
            }
        });
        document.addEventListener("keyup", function () {
            let subtaskElement = document.getElementById("subtasks");
            if (subtaskElement) {
                subtaskElement.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        addSubtask();
                    }
                });
            }
        });
        document.addEventListener("click", function (event) {
            let dropdown = document.getElementById("selectContacts");
            let button = document.getElementById("BTNToggleContacts");
            let clickedInsideDropdown = dropdown.contains(event.target);
            let clickedButton = button.contains(event.target);
            if (!clickedInsideDropdown && !clickedButton) {
                dropdown.classList.remove("open");
                button.style.display = "flex";
                closeAssigned()
            }
        });

        document.addEventListener("click", function (event) {
            let dropdown = document.getElementById("selectCategory");
            let button = document.getElementById("categoryBtn");
            let clickInside = dropdown.contains(event.target);
            let clickOnButton = button.contains(event.target);
            if (!clickInside && !clickOnButton) {
                dropdown.classList.remove("open");
                button.classList.remove("input-focus");
                button.classList.remove("input-error");
            }
        });
        document.getElementById("categoryBtn").addEventListener("click", categorySelectorCheck);
        requiredFields.forEach((field) => {
            field.addEventListener("focus", onFocus);
            field.addEventListener("blur", noneFocus);
        });
        document.addEventListener("click", isValid);
    } else {
        console.error("####### Events Not Working #######");
    };
}

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

function isValid() {
    const button = document.getElementById("colorChange");
    const allValid = Object.values(valid).every(value => value === true);
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
    };
}

function popup() {
    const createPopUp = document.querySelector(".popup-added");
    createPopUp.classList.remove("show");
    void createPopUp.offsetWidth;
    createPopUp.classList.add("show");
    setTimeout(() => {
        popupHide()
    }, 2000)
}

function popupHide() {
    const popup = document.querySelector(".popup-added");
    popup.classList.remove("show");
    popup.classList.add("hide");
    setTimeout(() => {
        popup.classList.remove("hide");
        popup.style.display = "none";
    }, 300);
}

async function CreateTask() {
    getDataFromPage();
    await postData();
    clearInputs()
    popup()
}
