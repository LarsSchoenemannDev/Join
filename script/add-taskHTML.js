/**
 * Builds the HTML for a single contact row inside the contacts dropdown.
 * @param {string} initials
 * @param {string} name
 * @param {string} color
 * @param {string|number} id
 * @param {boolean} checked
 * @returns {string}
 */
function renderContactHTML(initials, name, color, id, checked) {
    return `    
    <ul class="contact-row">
    <label class="checkbox">
        <div class="contact-left">
            <span class="initials-circle" style="background-color: ${color};">
                ${initials}
            </span>
            <span class="contact-name">${name}</span>
        </div>        
            <input class="checkbox-input" type="checkbox" ${checked ? "checked" : ""} onclick="toggleContact('${id}')">
            <span class="checkbox-box"></span>
        </label>
    </ul>
    `;
}

/**
 * Builds the HTML for a contact row used in the contact search UI.
 * @param {string} initials
 * @param {string} name
 * @param {string} color
 * @returns {string}
 */
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

/**
 * Builds the HTML for a single selected contact initials badge.
 * @param {{color: string, initials: string}} contact
 * @returns {string}
 */
function letterInitials(contact) {
    return `
    <span class="initials-circle" style="background-color: ${contact.color}">
        ${contact.initials}
    </span>
    `;
}

function letterInitialsMax(contact) {
    return `<span class="initials-circle counter">
            + ${contact}
            </span>
    `;
}


/**
 * Builds the HTML for a single subtask list entry.
 * @param {string} subTaskInput
 * @param {number} i
 * @returns {string}
 */
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

/**
 * Builds the HTML for editing a single subtask entry.
 * @param {number} i
 * @param {string} currentValue
 * @returns {string}
 */
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
