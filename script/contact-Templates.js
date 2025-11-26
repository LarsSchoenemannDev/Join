function renderContactListTemplate(contact, color, showAlphabet = true) {
    const initials = getInitials(contact.name);
    const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : '';

    const alphabetHeader = showAlphabet ? `
                    <h3 class="contact-alphabet">${firstLetter}</h3>
                    <div id="contact-divider">
                        <img src="../assets/img/devider-contact-list.svg" alt="" />
                    </div>` : '';

    return `
    <div class="contact-list-items">
                    ${alphabetHeader}
                    <div class="contact-container"  onclick="showFloatingCard(event)">
                        <div class="contact-badge" style="background-color: ${color}">${initials}</div>
                        <div class="contactDetails">
                            <h3 class="contactName">${contact.name}</h3>
                            <span class="contactEmail">${contact.email}</span>
                        </div>
                    </div>
    </div>`;
}

function renderFloatingContactTemplate(foundContact, color) {
    const initials = getInitials(foundContact.name);
    console.log('Floating template - Color:', color, 'Contact:', foundContact.name);
    // Fallback to default color if undefined
    const backgroundColor = color || 'rgba(255, 122, 0, 1)';
    return `
    <div class="floating-contact">
                <div id="contact-header">
                    <div class="contact-badge" id="contact-symbol" style="background-color: ${backgroundColor}">${initials}</div>
                    <div id="contact-text">
                        <div id="contact-name">${foundContact.name}</div>
                        <div id="contact-edit-tools" >
                            <div id="edit" class="edit-delete-component-default" onclick="openEditContactOverlay()">
                                <img src="" alt="" />
                                <span>Edit</span>
                            </div>
                            <div id="delete" class="edit-delete-component-default" onclick="deleteFloatingData(event)">
                                <img src="" alt="" />
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 id="contact-information">Contact Information</h3>
                <div id="contact-details">
                    <h4 id="contact-email">Email</h4>
                    <span class="span-email" id="span-email">${foundContact.email}</span>
                    <h4 id="contact-phone">Phone</h4>
                    <span id="span-phone">${foundContact.phone}</span>
                </div>
            </div>
    
    `
}

function renderEditContactTemplate(foundContact, color) {
    const initials = getInitials(foundContact.name);
    console.log('Edit template - Color:', color, 'Contact:', foundContact.name);
    // Fallback to default color if undefined
    const backgroundColor = color || 'rgba(255, 122, 0, 1)';
    return `
    
              <div class="edit-contact-overlay">
                <div class="edit-contact-overview">
                  <div class="join-logo-contact">
                    <img src="../assets/img/join-logo-add-contact.svg" alt="" />
                  </div>
                  <div class="edit-contact-text">
                    <h2 class="edit-contact-title">Edit contact</h2>

                    <div class="blue-vector">
                      <img
                        src="../assets/img/add-contact-blue-vector.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div class="edit-contact-container">
                  <div class="close-btn" onclick="closeEditContactOverlay()">
                    <img
                      src="../assets/img/add-contact-close-button.svg"
                      alt=""
                    />
                  </div>
                  <div class="edit-contact-form">
                    <div class="contact-badge" style="background-color: ${backgroundColor}">
                      ${initials}
                    </div>

                    <div class="contactForm">
                      <div class="inputContainer">
                        <input type="text" placeholder="Name" id="nameInput" />
                        <img
                          src="../assets/img/add-contact-person-icon.svg"
                          alt=""
                        />
                      </div>
                      <div class="inputContainer">
                        <input
                          type="email"
                          placeholder="Email"
                          id="emailInput"
                        />
                        <img
                          src="../assets/img/add-contact-mail-icon.svg"
                          alt=""
                        />
                      </div>
                      <div class="inputContainer">
                        <input
                          type="tel"
                          placeholder="Phone"
                          id="phoneInput"
                        />
                        <img
                          src="../assets/img/add-contact-call-icon.svg"
                          alt=""
                        />
                      </div>

                      <div class="edit-contact-buttons">
                        <button
                          class="secondary-btn-default-icon"
                          id="delete-btn"
                          onclick="deleteDataFromEditOverlay(event)"
                        >
                          Delete <img src="" alt="" />
                        </button>
                        <button
                          class="primary-btn-default-icon"
                          id="saveContact-btn"
                          onclick="saveEditedContact()"
                        >
                          Save<img
                            src="../assets/img/create-contact-check.svg"
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
    `
}