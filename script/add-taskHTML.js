function renderContactHTML(initials, name, color, id, checked) {
    return `    
    <ul class="contact-row">
        <div class="contact-left">
            <span class="initials-circle" style="background-color: ${color};">
                ${initials}
            </span>
            <span class="contact-name">${name}</span>
        </div>
        <label class="checkbox">
            <input class="checkbox-input" type="checkbox" ${checked ? "checked" : ""} onclick="toggleContact('${id}')">
            <span class="checkbox-box"></span>
        </label>
    </ul>
    `;
}

function renderContactSearchHTML(initials, name, color) {
    return `    
    <ul class="contact-row">
        <div class="contact-left">
            <span class="initials-circle" style="background-color: ${color};">${initials}</span>
            <span class="contact-name">${name}</span>
        </div>
        <label class="checkbox">
            <input id="checkbox" class="checkbox-input" name="checked" type="checkbox" value="">
            <span class="checkbox-box"></span>
        </label>
    </ul>
    `;
}

function letterInitials(contact) {
    return `
    <span class="initials-circle" style="background-color: ${contact.color}">
        ${contact.initials}
    </span>
    `;
}

function setCategoryHTML(categoryLabel) {
    return `    <button type="button" onclick="toggleCategory()" id="category"
        class="input-styling input-icon-arrow-down custom-select-select input-Required">${categoryLabel}</button>             
    `;
}

function subTaskContentHMTL(subTaskInput, i) {
    return `
    <div class="sub-container" data-index="${i}">
        <span class="display-flex">&bull; ${subTaskInput}</span>
        <div class="hover-show">
            <img src="../assets/img/Subtasks change.svg" class="input-icon-cancel" onclick="changeSubtask(${i})">
            <div class="seperator-small"></div>
            <img src="../assets/img/SubTask delete.svg" class="input-icon-accept" onclick="deleteSubtask(${i})">
        </div>
    </div>
    </div>
    `;
}

function changeSubtaskHtml(i, currentValue) {
    return `<div class="input-wrapper"><input type="text" value="${currentValue}" id="edit-input-${i}"
    title="Enter the new text">
    
    <div class="img-container" style="display: flex;">
    <img src="../assets/img/Subtasks accept.svg" class="input-icon-accept" onclick="saveSubtaskEdit(${i})">
    <div class="seperator-small"></div>
    <img src="../assets/img/Subtasks cancel.svg" class="input-icon-cancel" onclick="renderSubtasks()">
    </div>    
    `;
}










