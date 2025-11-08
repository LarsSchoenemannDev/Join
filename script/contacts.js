const contactContainer = document.querySelector('.contacts .contact-list .contact-list-items .contact-container');
const contactName = document.querySelector('.contacts .contact-list .contact-list-items .contact-container .contactName');
const addContactPopup = document.querySelector('.add-contact-popup');
const contactListEl = document.querySelector('.contacts .contact-list');
const contactBadge = document.querySelector('.contacts .contact-list .contact-list-items .contact-badge');
const contactAlphabet = document.querySelector('.contacts .contact-list .contact-list-items .contact-alphabet');
const cancelBtn = document.getElementById('cancel-btn');
const createContactBtn = document.getElementById('createContact-btn');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');



// Validate inputs and enable/disable create button
// function validateInputs() {
//     if (!nameInput || !emailInput || !phoneInput || !createContactBtn) return;

//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();
//     const phone = phoneInput.value.trim();

//     // Enable button only if all fields are filled
//     createContactBtn.disabled = !(name && email && phone);
// }

// // Add event listeners to inputs for real-time validation
// if (nameInput) nameInput.addEventListener('input', validateInputs);
// if (emailInput) emailInput.addEventListener('input', validateInputs);
// if (phoneInput) phoneInput.addEventListener('input', validateInputs);

// // Initialize button as disabled
// if (createContactBtn) createContactBtn.disabled = true;



// create contact list from contacts Array
function createContactList() {
    let html = '';
    let lastInitial = '';

    contacts.forEach((contact, index) => {
        const color = colors[index % colors.length];
        const currentInitial = contact.name.charAt(0).toUpperCase();

        // Only show alphabet header if it's different from the last one
        const showAlphabet = currentInitial !== lastInitial;
        lastInitial = currentInitial;
        html += renderContactListTemplate(contact, color, showAlphabet);
    });
    contactListEl.innerHTML = html;
}

//to extract the first and last initials
function getInitials(fullName) {
    const nameParts = fullName.trim().split(' ');
    const firstInitial = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() || '' : '';
    const lastInitial = nameParts[nameParts.length - 1] ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() || '' : '';
    return firstInitial + lastInitial;
}

// add new contacts to the list from add-contact-popup
function addNewContact() {
    // Prevent execution if inputs don't exist
    if (!nameInput || !emailInput || !phoneInput) {
        return;
    }

    const newContact = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    if (newContact.name && newContact.email && newContact.phone) {
        contacts.push(newContact);

        // update the contact list and close the popup
        createContactList();
        closePopupOverlay();

        // Clear input fields
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
    } else {
        alert('Please fill in all fields');
    }
}

// open add contact popup overlay
function openPopupOverlay() {
    addContactPopup.classList.remove('d-none');

    // clear fields when opening
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

// close add contact popup overlay
function closePopupOverlay() {
    addContactPopup.classList.add('d-none');

    // Clear input fields when closing
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}