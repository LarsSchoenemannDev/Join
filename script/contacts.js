const contactContainer = document.querySelector('.contacts .contact-list .contact-list-items .contact-container');
const contactName = document.querySelector('.contacts .contact-list .contact-list-items .contact-container .contactName');
const addContactPopup = document.querySelector('.add-contact-popup');
const contactListEl = document.querySelector('.contacts .contact-list');
const contactBadge = document.querySelector('.contacts .contact-list .contact-list-items .contact-badge');
const contactAlphabet = document.querySelector('.contacts .contact-list .contact-list-items .contact-alphabet');
const cancelBtn = document.getElementById('cancelBtn');
const createContactBtn = document.getElementById('createContactBtn');
const nameInput = document.getElementById('name_input');
const emailInput = document.getElementById('email_input');
const phoneInput = document.getElementById('phone_input');
const createMessage = document.querySelector('.popup-message');
const editContactPopup = document.querySelector('.edit-contact-popup');



/**
 * Load contacts from Firebase realtime Database, then render the updated contact list
 */
async function initContacts() {
    await loadDataBase();
    createContactList();
}

/**
 * checked if fetchedData from firebase is available
 * get the data from fetchedData object
 * create a new array from the fetched Data object
 * filter out contacts without name or email
 * sort contacts alphabetically by name
 */
function getContactArray() {
    let source;
    if (!fetchedData || !Object.keys(fetchedData).length) {
        return [];
    }
    source = Object.entries(fetchedData)
        .map(([id, data]) => ({ id, ...data }))
        .filter(contact => contact.name && contact.email);
    const sortedContacts = [...source].sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    return sortedContacts;
}

/**
 * 
 * get first letter of contact name for alphabet header
 * get first and last initials for contact badge
 * checks if alphabet header should be shown
 * build contact item HTML using template
 * @param {*string} contact 
 * @param {*string} color 
 * @param {*boolean} showAlphabet 
 * @returns 
 */
function buildContactItemHTML(contact, color, showAlphabet) {
    const initials = getInitials(contact.name);
    const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : '#';
    const alphabetHeader = showAlphabet ? `<h3 class="contact-alphabet">${firstLetter}</h3><div id="contact-divider"><img src="../assets/img/devider-contact-list.svg" alt="" /></div>` : '';
    return renderContactListTemplate(contact.name, contact.email, color, initials, alphabetHeader);
}

/**
 * checks if there are contacts to display
 * make a new array and use Modulo operator to assign colors to contacts for badges
 * determines when to show alphabet headers
 * iterates through contact array to build HTML
 * updates contactListEl innerHTML with generated html
 * debugging log for number of contacts rendered
 * @returns 
 */
function createContactList() {
    const array = getContactArray();
    if (!array.length) {
        contactListEl.innerHTML = '<div class="no-contacts" style="padding: 20px; text-align: center; color: #888;">No contacts available</div>';
        return;
    }
    let last = '';
    const html = array.map((contact, index) => {
        contact.color = colors[index % colors.length];
        const first = contact.name ? contact.name.charAt(0).toUpperCase() : '#';
        const show = first !== last;
        if (show) last = first;
        return buildContactItemHTML(contact, contact.color, show);
    }).join('');
    contactListEl.innerHTML = html;
    console.log('Contact list rendered with', array.length, 'contacts');
}

//
/**
 * checks for valid fullName string
 * to extract the first and last initials from fullName and splits it into parts
 * gets first character of first and last parts, converts to uppercase
 * concatenates initials and returns
 * @param {string} fullName 
 * @returns 
 */
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
    let contactColor = null;

    // Find the clicked contact container
    const clicked = event.target.closest('.contact-container');
    if (!clicked) {
        console.warn('No contact-container found');
        return;
    }

    // Get contact color from the badge in the DOM
    const badge = clicked.querySelector('.contact-badge');
    if (badge) {
        contactColor = badge.style.backgroundColor;
        console.log('Found color from DOM:', contactColor);
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
        container.innerHTML = renderFloatingContactTemplate(foundContact, contactColor);
        container.classList.remove('d-none');
    } else {
        console.error('Contact not found:', contactName, contactEmail);
        container.innerHTML = '<h2>Contact not found</h2>';
        container.classList.remove('d-none');
    }
}

// add new contacts to the list from add-contact-popup
async function addNewContact() {
    // Get input elements dynamically (they are created by openPopupOverlay)
    const nameInputField = document.getElementById('name_input');
    const emailInputField = document.getElementById('email_input');
    const phoneInputField = document.getElementById('phone_input');

    // Prevent execution if inputs don't exist
    if (!nameInputField || !emailInputField || !phoneInputField) {
        console.error('Input fields not found in DOM');
        alert('Error: Form fields not available');
        return;
    }

    const newContact = {
        name: nameInputField.value.trim(),
        email: emailInputField.value.trim(),
        phone: phoneInputField.value.trim()
    };

    console.log('Creating new contact:', newContact);

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
            console.error('Error adding contact:', error);
            alert('Failed to add contact. Please try again.');
        }
    } else {
        alert('Please fill in all fields');
    }
}

// open add contact popup overlay
function openPopupOverlay() {
    addContactPopup.innerHTML = renderAddContactTemplate();
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

// delete contacts when floating container is open
async function deleteFloatingData(event) {
    let foundContact = null;
    let foundId = null;
    let contactName = null;
    let contactEmail = null;

    // Called from Floating Container - get values from display elements
    const nameElement = document.getElementById('contact-name');
    const emailElement = document.getElementById('span-email');

    if (nameElement && emailElement) {
        contactName = nameElement.textContent.trim();
        contactEmail = emailElement.textContent.trim();
        console.log('Delete from Floating Container - Name:', contactName, 'Email:', contactEmail);
    }

    if (!contactName || !contactEmail) {
        console.error('Contact name or email is missing');
        alert('Error: Contact information is missing');
        return;
    }

    // Find contact in fetched data
    console.log('Searching for - Name:', `"${contactName}"`, 'Email:', `"${contactEmail}"`);
    console.log('fetchedData keys:', Object.keys(fetchedData));
    console.log('fetchedData content:', fetchedData);

    for (const [id, data] of Object.entries(fetchedData)) {
        console.log(`Comparing "${data.name}" === "${contactName}":`, data.name === contactName);
        console.log(`Comparing "${data.email}" === "${contactEmail}":`, data.email === contactEmail);

        if (data.name === contactName && data.email === contactEmail) {
            foundContact = data;
            foundId = id;
            console.log('✓ Match found! ID:', id);
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
        console.error('Contact not found for deletion - Name:', contactName, 'Email:', contactEmail);
        alert('Error: Contact could not be found');
    }
}

// delete contacts when edit overlay is open
async function deleteDataFromEditOverlay(event) {
    let foundContact = null;
    let foundId = null;
    let contactName = null;
    let contactEmail = null;


    const nameInputEdit = document.getElementById('nameInput');
    const emailInputEdit = document.getElementById('emailInput');

    if (nameInputEdit && emailInputEdit && nameInputEdit.value) {
        // Called from Edit Overlay - get values from input fields
        contactName = nameInputEdit.value.trim();
        contactEmail = emailInputEdit.value.trim();
        console.log('Delete from Edit Overlay - Name:', contactName, 'Email:', contactEmail);
    }

    if (!contactName || !contactEmail) {
        console.error('Contact name or email is missing');
        alert('Error: Contact information is missing');
        return;
    }

    // Find contact in fetched data
    console.log('Searching for - Name:', `"${contactName}"`, 'Email:', `"${contactEmail}"`);
    console.log('fetchedData keys:', Object.keys(fetchedData));
    console.log('fetchedData content:', fetchedData);

    for (const [id, data] of Object.entries(fetchedData)) {
        console.log(`Comparing "${data.name}" === "${contactName}":`, data.name === contactName);
        console.log(`Comparing "${data.email}" === "${contactEmail}":`, data.email === contactEmail);

        if (data.name === contactName && data.email === contactEmail) {
            foundContact = data;
            foundId = id;
            console.log('✓ Match found! ID:', id);
            break;
        }
    }

    if (foundContact) {
        // foundContact already has id property from loadDataBase
        await deleteContact(foundContact.id);
        await loadDataBase();
        createContactList();

        closeEditContactOverlay();

        popupMessage('Contact successfully deleted!');
    } else {
        console.error('Contact not found for deletion - Name:', contactName, 'Email:', contactEmail);
        alert('Error: Contact could not be found');
    }
}

// Edit-Overlay functions:  
function openEditContactOverlay() {
    let foundContact = null;
    let foundID = null;
    let contactColor = null;

    // Get color from the floating contact card's contact-symbol
    const contactSymbol = document.getElementById('contact-symbol');
    if (contactSymbol) {
        contactColor = contactSymbol.style.backgroundColor;
        console.log('Found color from floating card:', contactColor);
    }

    for (const [id, data] of Object.entries(fetchedData)) {
        if (data.name === document.getElementById('contact-name').textContent.trim() &&
            data.email === document.getElementById('span-email').textContent.trim() &&
            data.phone === document.getElementById('span-phone').textContent.trim()) {
            foundContact = data;
            foundID = id;
            break;
        }
    }

    if (foundContact) {
        // Add ID to contact object for later use in edit/delete
        foundContact.id = foundID;

        // Set innerHTML FIRST, before accessing the overlay
        editContactPopup.innerHTML = renderEditContactTemplate(foundContact, contactColor);

        // NOW get the overlay reference (after innerHTML is set)
        const overlay = editContactPopup.querySelector('.edit-contact-overlay');

        // Set input values with fallback for phone
        document.getElementById('nameInput').value = foundContact.name || '';
        document.getElementById('emailInput').value = foundContact.email || '';
        document.getElementById('phoneInput').value = foundContact.phone || '';

        // Show popup and trigger animation
        editContactPopup.classList.remove('d-none');

        // Force reflow to ensure animation works
        overlay.offsetHeight;

        overlay.classList.remove('slide-out');
        overlay.classList.add('slide-in');
    }
}

function closeEditContactOverlay() {
    if (!editContactPopup) return;

    const overlay = editContactPopup.querySelector('.edit-contact-overlay');
    if (!overlay) return;

    overlay.classList.remove('slide-in');
    overlay.classList.add('slide-out');

    // Wait for animation to finish before hiding
    setTimeout(() => {
        editContactPopup.classList.add('d-none');
    }, 500);
}

async function saveEditedContact() {
    // Get edited values from input fields
    const editedName = document.getElementById('nameInput').value.trim();
    const editedEmail = document.getElementById('emailInput').value.trim();
    const editedPhone = document.getElementById('phoneInput').value.trim();

    // Validate that all fields are filled
    if (!editedName || !editedEmail || !editedPhone) {
        alert('Please fill in all fields');
        return;
    }

    // Get the contact ID from the currently displayed contact
    const contactName = document.getElementById('contact-name').textContent.trim();
    const contactEmail = document.getElementById('span-email').textContent.trim();
    const contactPhone = document.getElementById('span-phone').textContent.trim();

    // Find the contact ID
    let contactId = null;
    for (const [id, data] of Object.entries(fetchedData)) {
        if (data.name === contactName && data.email === contactEmail && data.phone === contactPhone) {
            contactId = id;
            break;
        }
    }

    if (!contactId) {
        alert('Contact not found');
        return;
    }

    // Create updated contact object
    const updatedContact = {
        name: editedName,
        email: editedEmail,
        phone: editedPhone
    };

    try {
        // Update contact in Firebase
        await updateContactInFirebase(contactId, updatedContact);

        // Reload data from Firebase
        await loadDataBase();

        // Update the contact list display
        createContactList();

        // Close the edit overlay
        closeEditContactOverlay();

        // Hide the floating contact card (since contact details changed)
        container.classList.add('d-none');

        // Show success message
        popupMessage('Contact successfully saved!');

    } catch (error) {
        console.error('Error saving edited contact:', error);
        alert('Failed to save contact. Please try again.');
    }
}


// function createContactList() {

//     /**
//      * Use fetchedData (from Firebase), convert to array
//      */
//     let source;
//     if (fetchedData && typeof fetchedData === 'object' && Object.keys(fetchedData).length > 0) {
//         source = Object.entries(fetchedData)
//             .map(([id, data]) => ({ id, ...data }))
//             .filter(contact => contact.name && contact.email); // Filter out contacts without name or email
//     } else {
//         source = [];
//     }

//     if (!source || source.length === 0) {
//         contactListEl.innerHTML = '<div class="no-contacts" style="padding: 20px; text-align: center; color: #888;">No contacts available</div>';
//         return;
//     }


//     /**
//      * Sort contacts alphabetically by their name property
//      */
//     const sortedContacts = [...source].sort((a, b) => {
//         const nameA = (a.name || '').toLowerCase();
//         const nameB = (b.name || '').toLowerCase();
//         return nameA.localeCompare(nameB);
//     });

//     // Build HTML string
//     let html = '';
//     let lastInitial = '';

//     sortedContacts.forEach((contact, index) => {
//         // Assign and store color with contact for consistency
//         contact.color = colors[index % colors.length];

//         // Calculate initials from contact name
//         const initials = getInitials(contact.name);

//         // Get first letter for alphabet header
//         const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : '#';

//         // Determine if we should show alphabet header (only when letter changes)
//         const currentInitial = firstLetter;
//         const showAlphabet = currentInitial !== lastInitial;
//         lastInitial = currentInitial;

//         // Build alphabet header HTML if needed
//         const alphabetHeader = showAlphabet ? `
//                     <h3 class="contact-alphabet">${firstLetter}</h3>
//                     <div id="contact-divider">
//                         <img src="../assets/img/devider-contact-list.svg" alt="" />
//                     </div>` : '';

//         // Render template with all calculated values
//         html += renderContactListTemplate(contact.name, contact.email, contact.color, initials, alphabetHeader);
//     });

//     // Render once after building complete HTML
//     contactListEl.innerHTML = html;
//     console.log('Contact list rendered with', sortedContacts.length, 'contacts');
// }