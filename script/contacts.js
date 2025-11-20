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
const createMessage = document.querySelector('.popup-message');
const editContactPopup = document.querySelector('.edit-contact-popup');




// Initialize app: load data from Firebase, then create contact list
async function initContacts() {
    await loadDataBase();
    createContactList();
}

// create contact list from contacts Array
function createContactList() {
    // if (!contactListEl) {
    //     console.warn('createContactList: contactListEl not found');
    //     return;
    // }

    // Use fetchedData if available (from Firebase), convert to array
    let source;
    if (fetchedData && typeof fetchedData === 'object' && Object.keys(fetchedData).length > 0) {
        source = Object.entries(fetchedData)
            .map(([id, data]) => ({ id, ...data }))
            .filter(contact => contact.name && contact.email); // Filter out contacts without name or email
    } else {
        source = [];
    }

    if (!source || source.length === 0) {
        contactListEl.innerHTML = '<div class="no-contacts" style="padding: 20px; text-align: center; color: #888;">No contacts available</div>';
        return;
    }

    // Sort contacts alphabetically by name
    const sortedContacts = [...source].sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Build HTML string
    let html = '';
    let lastInitial = '';

    sortedContacts.forEach((contact, index) => {
        const color = colors[index % colors.length];
        const currentInitial = contact.name ? contact.name.charAt(0).toUpperCase() : '#';

        // Only show alphabet header if it's different from the last one
        const showAlphabet = currentInitial !== lastInitial;
        lastInitial = currentInitial;
        html += renderContactListTemplate(contact, color, showAlphabet);
    });

    // Render once after building complete HTML
    contactListEl.innerHTML = html;
    console.log('Contact list rendered with', sortedContacts.length, 'contacts');
}

//to extract the first and last initials
function getInitials(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return '?';
    }
    const nameParts = fullName.trim().split(' ');
    const firstInitial = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() || '' : '';
    const lastInitial = nameParts[nameParts.length - 1] ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() || '' : '';
    return firstInitial + lastInitial;
}

// rendering contact data in floating container 
let container = document.querySelector('.floating-contact');

// Find or create floating contact container
function floatingContainer() {

    if (!container) {
        const parent = document.querySelector('.contact-dashboard') || document.querySelector('main');
        container = document.createElement('div');
        container.className = 'floating-contact';
        if (parent) parent.appendChild(container);
    }
}

function showFloatingCard(event) {
    floatingContainer();

    // Reset search variables
    let foundContact = null;
    let foundId = null;

    // Find the clicked contact container
    const clicked = event.target.closest('.contact-container');
    if (!clicked) {
        console.warn('No contact-container found');
        return;
    }

    // Get contact name and email from the clicked element
    const contactName = clicked.querySelector('.contactName').textContent.trim();
    const contactEmail = clicked.querySelector('.contactEmail').textContent.trim();
    if (!contactName || !contactEmail) {
        console.error('Contact data missing');
        return;
    }

    // Search in Firebase data (object with IDs as keys)
    if (fetchedData && typeof fetchedData === 'object') {
        for (const [id, data] of Object.entries(fetchedData)) {
            if (data.name === contactName && data.email === contactEmail) {
                foundContact = data;
                foundId = id;
                console.log('Found contact with ID:', foundId);
                break;
            }
        }
    }

    if (foundContact) {
        // foundContact already has id property from loadDataBase
        console.log('Rendering contact:', foundContact);
        container.innerHTML = renderFloatingContactTemplate(foundContact);
        container.classList.remove('d-none');
    } else {
        console.error('Contact not found:', contactName, contactEmail);
        container.innerHTML = '<h2>Contact not found</h2>';
        container.classList.remove('d-none');
    }
}

// add new contacts to the list from add-contact-popup
async function addNewContact() {
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
        try {
            // Save to Firebase
            await saveContact(newContact);

            // Reload data from Firebase to get the updated list
            await loadDataBase();

            // Update the contact list display
            createContactList();

            // Close the popup and clear input fields
            closePopupOverlay();
            popupMessage('Contact successfully created!');

        } catch (error) {
            alert('Failed to add contact. Please try again.');
        }
    } else {
        alert('Please fill in all fields');
    }
}

// open add contact popup overlay
function openPopupOverlay() {
    const overlay = addContactPopup.querySelector('.add-contact-overlay');
    addContactPopup.classList.remove('d-none');

    // Force reflow
    overlay.offsetHeight;

    overlay.classList.remove('slide-out');
    overlay.classList.add('slide-in');
    clearInputFields();
}

// close add contact popup overlay
function closePopupOverlay() {
    const overlay = addContactPopup.querySelector('.add-contact-overlay');
    overlay.classList.remove('slide-in');
    overlay.classList.add('slide-out');

    // Wait for animation to finish before hiding
    setTimeout(() => {
        addContactPopup.classList.add('d-none');
    }, 500);
    clearInputFields();
}

//clear input fields
function clearInputFields() {
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

function popupMessage(message) {
    createMessage.textContent = `${message}`;
    createMessage.classList.remove('d-none');

    // Force reflow to ensure transition works
    createMessage.offsetHeight;

    // Slide in from right
    createMessage.classList.add('slide-in');

    // After 2 seconds, slide out
    setTimeout(() => {
        createMessage.classList.remove('slide-in');
        createMessage.classList.add('slide-out');

        // Hide after animation completes
        setTimeout(() => {
            createMessage.classList.add('d-none');
            createMessage.classList.remove('slide-out');
        }, 500);
    }, 2000);
}

async function deleteData(event) {
    let foundContact = null;
    let foundId = null;
    const clicked = event.target.closest('.edit-delete-component-default');
    const contactName = document.getElementById('contact-name').textContent.trim();
    const contactEmail = document.getElementById('span-email').textContent.trim();

    for (const [id, data] of Object.entries(fetchedData)) {
        if (data.name === contactName && data.email === contactEmail) {
            foundContact = data;
            foundId = id;
            break;
        }
    }

    if (foundContact) {
        // foundContact already has id property from loadDataBase
        await deleteContact(foundContact.id);
        await loadDataBase();
        createContactList();
        container.classList.add('d-none');
        popupMessage('Contact successfully deleted!');
    } else {
        console.error('Contact not found for deletion');
    }
}

function openEditContactOverlay() {
    editContactPopup.classList.remove('d-none');
    const overlay = editContactPopup.querySelector('.edit-contact-overlay');

    // Force reflow
    overlay.offsetHeight;

    overlay.classList.remove('slide-out');
    overlay.classList.add('slide-in');
}