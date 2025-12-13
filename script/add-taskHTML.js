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

function subTaskContentHMTL(subTaskInput, i) {
    return `
    <div class="sub-container" data-index="${i}">    
    <span class="display-flex">&bull; ${subTaskInput}</span>  
    
    <img src="../assets/img/Subtasks change.svg" class="input-icon-cancel" onclick="changeSubtask(${i})">
    <div class="seperator-small"></div>
    <img src="../assets/img/SubTask delete.svg" class="input-icon-accept" onclick="deleteSubtask(${i})">      
    </div>    
    </div>
    `;
}

function renderContactSearchHTML(indexNameSearch, i) {
    return `    
    <ul class="contact-row">
    <div class="contact-left">
    <span class="initials-circlegab"></span>
    <span class="contact-name">${indexNameSearch.name}</span>
    </div>
    <label class="checkbox">
    <input id="checkbox" onclick="checkBox(this)" class="checkbox-input" name="checked" type="checkbox" value="">
    <span class="checkbox-box"></span>
        </label>
      </ul>
    `;
}

function searchRenderHTMLZero() {
    return `<div class="contactSearch"> no search found.</div>`;
}

function renderContactHTML(contact, initials, colorClass,) {
    return `    
    <ul class="contact-row">
    <div class="contact-left">
    <span class="initials-circle ${colorClass} gab">${initials}</span>
    <span class="contact-name">${contact.name}</span>
    </div>
    <label class="checkbox">
    <input id="checkbox" onclick="checkBox(this)" class="checkbox-input" name="checked" type="checkbox" value="${contact.name}">
    <span class="checkbox-box"></span>
        </label>
      </ul>
    `;
}

function setCategoryHTML(categoryLabel) {
    return `<button type="button" onclick="toggelCategory()"
                class="input-styling input-icon-arrow-down custom-select-select input-Required">${categoryLabel}</button>
                 
`;
}