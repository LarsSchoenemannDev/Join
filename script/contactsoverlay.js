/**
 * get contact data from edit overlay input fields
 * @returns {object|null} contactName and contactEmail or null if missing
 */
function findDataFromEditOverlayToDelete() {
  const nameInputEdit = document.getElementById("nameInput");
  const emailInputEdit = document.getElementById("emailInput");
  if (!nameInputEdit || !emailInputEdit) {
    console.error("Input fields not found");
    alert("Error: Input fields not found");
    return null;
  }
  const contactName = nameInputEdit.value.trim();
  const contactEmail = emailInputEdit.value.trim();
  if (!contactName || !contactEmail) {
    console.error("Contact name or email is missing");
    alert("Error: Contact information is missing");
    return null;
  }
  return { contactName, contactEmail };
}

/**
 * defines function to find contact and ID from edit overlay input fields
 * calls findDataFromEditOverlayToDelete to get contactName and contactEmail
 * iterates through fetchedData entries to find matching contact
 * compares name and email to find the correct contact
 * if match is found, assigns foundContact and foundId variables
 * @returns {Object|null} foundContact, foundId, contactName, contactEmail or null
 */
function foundContactUndIdEditOverlay() {
  const contactData = findDataFromEditOverlayToDelete();
  if (!contactData) return null;
  const { contactName, contactEmail } = contactData;
  for (const [id, data] of Object.entries(fetchedData)) {
    if (data.name === contactName && data.email === contactEmail) {
      return { foundContact: data, foundId: id, contactName, contactEmail };
    }
  }
  console.error("No match found in fetchedData");
  return null;
}

/**
 * * @param {Event} event
 * defines a async function to handle delete contact from edit overlay
 * defines a contactData variable to get contact name, contact email and ID
 * checks if foundContact is available
 * calls deleteContact with foundId to remove contact from Firebase
 * reloads database and updates contact list
 * closes edit contact overlay and hides container
 * shows popup message on successful deletion
 */
async function deleteContactFromEditOverlay(event) {
  const contactData = foundContactUndIdEditOverlay();
  if (!contactData) return;
  const { foundContact, foundId, contactName, contactEmail } = contactData;
  if (!foundContact) {
    console.error(
      "Contact not found for deletion - Name:",
      contactName,
      "Email:",
      contactEmail,
    );
    alert("Error: Contact could not be found");
    return;
  }
  try {
    await deleteContact(foundId);
    await loadDataBase();
    await createContactList();
    closeEditContactOverlay();
    container.classList.add("d-none");
    popupMessage("Contact successfully deleted!");
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact. Please try again.");
  }
}

/**
 * defines function to open edit contact overlay
 * defines foundContact, foundID, and contactColor variables
 * searches for contact in fetchedData matching displayed contact details
 * checks if data.name , data.email, and data.phone match displayed values
 * if found, assigns foundContact and foundID variables
 * retrieves contact color from floating contact card (contact-symbol)
 * @returns {Object} foundContact, foundID, and contactColor
 */
function openEditContactOverlay() {
  let foundContact,
    foundID,
    contactColor = null;
  const contactSymbol = document.getElementById("contact-symbol");
  if (contactSymbol) {
    contactColor = contactSymbol.style.backgroundColor;
  }
  for (const [id, data] of Object.entries(fetchedData)) {
    if (
      data.name ===
        document.getElementById("contact-name").textContent.trim() &&
      data.email === document.getElementById("span-email").textContent.trim() &&
      data.phone === document.getElementById("span-phone").textContent.trim()
    ) {
      foundContact = data;
      foundID = id;
      break;
    }
  }
  return { foundContact, foundID, contactColor };
}

/**
 * defines function to render edit contact overlay
 * checks if foundContact is available
 * Add ID to contact object for later use in edit/delete
 * Set innerHTML FIRST, before accessing the overlay and calls openEditContactOverlay to get contact data
 * render edit contact template with found contact data and color
 * triggers slide-in animation to show overlay
 * sets input values with fallback for name, email and phone
 */
function renderEditContactOverlay() {
  const contactData = openEditContactOverlay();
  const { foundContact, foundID, contactColor } = contactData;
  if (foundContact) {
    foundContact.id = foundID;
    const initials = getInitials(foundContact.name);
    editContactPopup.innerHTML = renderEditContactTemplate(
      foundContact.name,
      foundContact.email,
      foundContact.phone,
      contactColor,
      initials,
    );
    const overlay = editContactPopup.querySelector(".edit-contact-overlay");
    editContactPopup.classList.remove("d-none");
    overlay.offsetHeight;
    overlay.classList.remove("slide-out");
    overlay.classList.add("slide-in");
  }
}

/**
 * defines function to close edit contact overlay by pressing cancel button
 * checks if editContactPopup exists
 * selects overlay element within editContactPopup
 * triggers slide-out animation by modifying class list
 * adds d-none class to hide popup after animation completes (500ms)
 */
function closeEditContactOverlay() {
  if (!editContactPopup) {
    return;
  }
  const overlay = editContactPopup.querySelector(".edit-contact-overlay");
  if (!overlay) {
    return;
  }
  overlay.classList.remove("slide-in");
  overlay.classList.add("slide-out");
  setTimeout(() => {
    editContactPopup.classList.add("d-none");
  }, 500);
}

/**
 * gets input values from shown contact data in floating contact card
 * @returns {object|null} editedName, editedEmail, editedPhone or null if validation fails
 */
function getEditedContactData() {
  const editedName = document.getElementById("nameInput").value.trim();
  const editedEmail = document.getElementById("emailInput").value.trim();
  const editedPhone = document.getElementById("phoneInput").value.trim();
  if (!editedName || !editedEmail || !editedPhone) {
    alert("Please fill in all fields");
    return null;
  }
  return { editedName, editedEmail, editedPhone };
}

/**
 * save got values in new varibales
 * making a for loop to find ID and get Data from fetchedData object
 * finds contact ID by matching currently displayed contact with fetchedData
 * @returns {string|null} contactId or null if not found
 */
function findContactIdFromDisplayed() {
  const contactName = document
    .getElementById("contact-name")
    .textContent.trim();
  const contactEmail = document.getElementById("span-email").textContent.trim();
  const contactPhone = document.getElementById("span-phone").textContent.trim();
  for (const [id, data] of Object.entries(fetchedData)) {
    if (
      data.name === contactName &&
      data.email === contactEmail &&
      data.phone === contactPhone
    ) {
      return id;
    }
  }
  return null;
}

/**
 * makes a async function to save edited contact to Firebase
 * defines editedData variable to get edited contact data from input fields
 * defines contactId variable to find contact ID from displayed data
 * checks if editedData and contactId are available
 * creates updatedContact object with edited values
 * updates contact in Firebase using updateContactInFirebase with 2 parameters:
 * @param {String} contactId
 * @param {Object} updatedContact
 * reloads database and updates contact list
 * closes edit contact overlay and hides container
 * shows popup message on successful save
 */
async function saveEditedContact() {
  const editedData = getEditedContactData();
  if (!editedData) return;
  const contactId = findContactIdFromDisplayed();
  if (!contactId) {
    alert("Contact not found");
    return;
  }
  const updatedContact = {
    name: editedData.editedName,
    email: editedData.editedEmail,
    phone: editedData.editedPhone,
  };
  try {
    await updateContactInFirebase(contactId, updatedContact);
    await loadDataBase();
    await createContactList();
    closeEditContactOverlay();
    container.classList.add("d-none");
    popupMessage("Contact successfully saved!");
  } catch (error) {
    console.error("Error saving edited contact:", error);
    alert("Failed to save contact. Please try again.");
  }
}

async function contactEmailValidation() {
  const contactEmail = document
    .getElementById("email_input")
    .value.trim()
    .toLowerCase();
  const contactEmailInput = document.getElementById("email_input");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ErrorMsgBox = document.getElementById("validationErrorMsg");

  if (!contactEmail) {
    contactErrorMsg("Email cannot be empty.");
    contactEmailInput.value = "";
    contactEmailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (!emailRegex.test(contactEmail)) {
    contactErrorMsg("Please enter a valid email address.");
    contactEmailInput.value = "";
    contactEmailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  const isEmailAvailable = await existingEmailValidation();
  if (!isEmailAvailable) {
    return false;
  }

  contactEmailInput.parentElement.style.borderColor = "#ccc";
  ErrorMsgBox.style.visibility = "hidden";
  return true;
}

/**
 * an async function which checks if the email is already registered in Firebase by fetching the existing user emails and comparing them with the input email. If the email is already registered, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if email is available, false if already exists
 */
async function existingEmailValidation() {
  const contactEmail = document
    .getElementById("email_input")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("email_input");

  try {
    const existingContactEmails = await fetchExistingContactEmail();
    if (
      existingContactEmails.find(
        (existingEmail) => existingEmail.toLowerCase() === contactEmail,
      )
    ) {
      contactErrorMsg("This email already exists.");
      emailInput.value = "";
      emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating email:", error);
    // Bei Fehler: Allow registration (fail-safe)
    return true;
  }
}

function contactErrorMsg(message) {
  const ErrorMsgBox = document.getElementById("validationErrorMsg");
  ErrorMsgBox.style.visibility = "visible";
  ErrorMsgBox.textContent = message;
}

/**
 * a name validation function which checks if the name input is empty.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */

async function contactNameValidation() {
  const contactName = document
    .getElementById("name_input")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("name_input");
  const ErrorMsgBox = document.getElementById("validationErrorMsg");

  if (!contactName) {
    contactErrorMsg("Name cannot be empty.");
    nameInput.value = "";
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  //   if (/[0-9]/.test(contactName)) {
  //     contactErrorMsg("Name cannot contain numbers.");
  //     nameInput.value = contactName.replace(/[0-9]/g, "");
  //     return false;
  //   }

  const isNameAvailable = await existingNameValidation();
  if (!isNameAvailable) {
    return false;
  }

  ErrorMsgBox.style.visibility = "hidden";
  nameInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * an async function which checks if the contact name is already exists in Firebase by fetching the existing contact names and comparing them with the input name. If the contact name is already exists, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */
async function existingNameValidation() {
  const contactName = document
    .getElementById("name_input")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("name_input");

  try {
    const existingUserNames = await fetchExistingContactName();
    if (
      existingUserNames.find(
        (existingName) => existingName.toLowerCase() === contactName,
      )
    ) {
      contactErrorMsg("Contact with this name already exists.");
      nameInput.value = "";
      nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating name:", error);
    return true;
  }
}

function contactPhoneValidation() {
  const contactPhone = document.getElementById("phone_input").value.trim();
  const phoneInput = document.getElementById("phone_input");
  const ErrorMsgBox = document.getElementById("validationErrorMsg");
  const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;

  if (!contactPhone) {
    contactErrorMsg("Phone number cannot be empty.");
    phoneInput.value = "";
    phoneInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (!phoneRegex.test(contactPhone)) {
    contactErrorMsg("Invalid phone number format.");
    phoneInput.value = "";
    phoneInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  ErrorMsgBox.style.visibility = "hidden";
  phoneInput.parentElement.style.borderColor = "#ccc";
  return true;
}

async function validateContactForm() {
  const isNameValid = await contactNameValidation();
  const isEmailValid = await contactEmailValidation();
  const isPhoneValid = contactPhoneValidation();
  return isNameValid && isEmailValid && isPhoneValid;
}
