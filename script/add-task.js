const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let addTaskTemp = [];
let FetchData = [];
let Subtasks = [];
let subTaskInput = [];

console.log(subtaskInput);



async function createTask() {
    await getData();
    addtoTask();
    clearInputs();
    renderContact()

}
async function getData() {
    try {
        const response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error("HTTP error: ${response.status}")
        }
        const data = await response.json();
        FetchData = data;
    } catch (error) {
        console.log("HTTP error: ${response.status}");
    }
    console.log(FetchData)
}

function addtoTask(e) {
    e?.preventDefault?.();
    const get = id => (document.getElementById(id)?.value ?? '').trim();
    const result = {
        title: get('title'),
        description: get('description'),
        duedate: get('due-date'),
        category: get('category'),
        subtasks: get('subtasks'),
        priority: document.querySelector('input[name="priority"]:checked')?.value ?? null
    };
    return result;
}

function clearInputs() {
    title.value = '';
    description.value = '';
    duedate.value = '';
    category.value = 'Select task category';
    subtasks.value = '';
}

function PriorityBTN() {
    BTNStyling = document.querySelector('input[name="priority"]:checked')
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
        const initials = contact.name.split(' ').map(x => x[0]).join('');
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

function renderContactHTML(contact, initials, colorClass) {
    return `    
       <ul class="contact-row" id="BG-Change">
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
    subtask.style.display = "flex";
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

function subTaskContentHMTL(subTaskInput, i) {
    return `
    <div class="sub-container" data-index="${i}">
        <span class="display-flex">&bull; ${subTaskInput}</span>
            <img src="../assets/img/Subtasks change.svg" class="input-icon-cancel" onclick="changeSubtask(${i})">
            <div class="seperator-small"></div>
                 <img src="../assets/img/SubTask delete.svg" class="input-icon-accept" onclick="deleteSubtask(${i})">
    </div>
    
    `;
}

function changeSubtask(i){
    let newSubtask = document.querySelector(`.sub-container[data-index="${i}"]`).innerText;
    console.log(newSubtask);
    
}


function deleteSubtask(i){
    subTaskInput.splice(i, 1);
    renderSubtasks();
}

function cancelSubtask() {
    document.getElementById("subtasks").value = ``;d
}