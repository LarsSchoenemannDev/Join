// ===================== SVG ICONS ===================== //
// These constants store the SVG markup for each icon.
// They are dynamically injected into the icon container elements.

// const eyeOpen = `
// <svg viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M10.825 12C12.075 12 13.1375 11.5625 14.0125 10.6875C14.8875 9.8125 15.325 8.75 15.325 7.5C15.325 6.25 14.8875 5.1875 14.0125 4.3125C13.1375 3.4375 12.075 3 10.825 3C9.575 3 8.5125 3.4375 7.6375 4.3125C6.7625 5.1875 6.325 6.25 6.325 7.5C6.325 8.75 6.7625 9.8125 7.6375 10.6875C8.5125 11.5625 9.575 12 10.825 12ZM10.825 10.2C10.075 10.2 9.4375 9.9375 8.9125 9.4125C8.3875 8.8875 8.125 8.25 8.125 7.5C8.125 6.75 8.3875 6.1125 8.9125 5.5875C9.4375 5.0625 10.075 4.8 10.825 4.8C11.575 4.8 12.2125 5.0625 12.7375 5.5875C13.2625 6.1125 13.525 6.75 13.525 7.5C13.525 8.25 13.2625 8.8875 12.7375 9.4125C12.2125 9.9375 11.575 10.2 10.825 10.2ZM10.825 15C8.50833 15 6.39167 14.3875 4.475 13.1625C2.55833 11.9375 1.10833 10.2833 0.125 8.2C0.075 8.11667 0.0416667 8.0125 0.025 7.8875C0.00833333 7.7625 0 7.63333 0 7.5C0 7.36667 0.00833333 7.2375 0.025 7.1125C0.0416667 6.9875 0.075 6.88333 0.125 6.8C1.10833 4.71667 2.55833 3.0625 4.475 1.8375C6.39167 0.6125 8.50833 0 10.825 0C13.1417 0 15.2583 0.6125 17.175 1.8375C19.0917 3.0625 20.5417 4.71667 21.525 6.8C21.575 6.88333 21.6083 6.9875 21.625 7.1125C21.6417 7.2375 21.65 7.36667 21.65 7.5C21.65 7.63333 21.6417 7.7625 21.625 7.8875C21.6083 8.0125 21.575 8.11667 21.525 8.2C20.5417 10.2833 19.0917 11.9375 17.175 13.1625C15.2583 14.3875 13.1417 15 10.825 15ZM10.825 13C12.7083 13 14.4375 12.5042 16.0125 11.5125C17.5875 10.5208 18.7917 9.18333 19.625 7.5C18.7917 5.81667 17.5875 4.47917 16.0125 3.4875C14.4375 2.49583 12.7083 2 10.825 2C8.94167 2 7.2125 2.49583 5.6375 3.4875C4.0625 4.47917 2.85833 5.81667 2.025 7.5C2.85833 9.18333 4.0625 10.5208 5.6375 11.5125C7.2125 12.5042 8.94167 13 10.825 13Z" fill="#A8A8A8"/>
// </svg>
// `;

// const eyeClosed = `<svg viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M14.925 10.075L13.475 8.625C13.625 7.84167 13.4 7.10833 12.8 6.425C12.2 5.74167 11.425 5.475 10.475 5.625L9.025 4.175C9.30833 4.04167 9.59583 3.94167 9.8875 3.875C10.1792 3.80833 10.4917 3.775 10.825 3.775C12.075 3.775 13.1375 4.2125 14.0125 5.0875C14.8875 5.9625 15.325 7.025 15.325 8.275C15.325 8.60833 15.2917 8.92083 15.225 9.2125C15.1583 9.50417 15.0583 9.79167 14.925 10.075ZM18.125 13.225L16.675 11.825C17.3083 11.3417 17.8708 10.8125 18.3625 10.2375C18.8542 9.6625 19.275 9.00833 19.625 8.275C18.7917 6.59167 17.5958 5.25417 16.0375 4.2625C14.4792 3.27083 12.7417 2.775 10.825 2.775C10.3417 2.775 9.86667 2.80833 9.4 2.875C8.93333 2.94167 8.475 3.04167 8.025 3.175L6.475 1.625C7.15833 1.34167 7.85833 1.12917 8.575 0.9875C9.29167 0.845833 10.0417 0.775 10.825 0.775C13.2083 0.775 15.35 1.40417 17.25 2.6625C19.15 3.92083 20.575 5.55833 21.525 7.575C21.575 7.65833 21.6083 7.7625 21.625 7.8875C21.6417 8.0125 21.65 8.14167 21.65 8.275C21.65 8.40833 21.6375 8.5375 21.6125 8.6625C21.5875 8.7875 21.5583 8.89167 21.525 8.975C21.1417 9.825 20.6625 10.6083 20.0875 11.325C19.5125 12.0417 18.8583 12.675 18.125 13.225ZM17.925 18.675L14.425 15.225C13.8417 15.4083 13.2542 15.5458 12.6625 15.6375C12.0708 15.7292 11.4583 15.775 10.825 15.775C8.44167 15.775 6.3 15.1458 4.4 13.8875C2.5 12.6292 1.075 10.9917 0.125 8.975C0.075 8.89167 0.0416667 8.7875 0.025 8.6625C0.00833333 8.5375 0 8.40833 0 8.275C0 8.14167 0.00833333 8.01667 0.025 7.9C0.0416667 7.78333 0.075 7.68333 0.125 7.6C0.475 6.85 0.891667 6.15833 1.375 5.525C1.85833 4.89167 2.39167 4.30833 2.975 3.775L0.9 1.675C0.716667 1.49167 0.625 1.2625 0.625 0.9875C0.625 0.7125 0.725 0.475 0.925 0.275C1.10833 0.0916667 1.34167 0 1.625 0C1.90833 0 2.14167 0.0916667 2.325 0.275L19.325 17.275C19.5083 17.4583 19.6042 17.6875 19.6125 17.9625C19.6208 18.2375 19.525 18.475 19.325 18.675C19.1417 18.8583 18.9083 18.95 18.625 18.95C18.3417 18.95 18.1083 18.8583 17.925 18.675ZM4.375 5.175C3.89167 5.60833 3.45 6.08333 3.05 6.6C2.65 7.11667 2.30833 7.675 2.025 8.275C2.85833 9.95833 4.05417 11.2958 5.6125 12.2875C7.17083 13.2792 8.90833 13.775 10.825 13.775C11.1583 13.775 11.4833 13.7542 11.8 13.7125C12.1167 13.6708 12.4417 13.625 12.775 13.575L11.875 12.625C11.6917 12.675 11.5167 12.7125 11.35 12.7375C11.1833 12.7625 11.0083 12.775 10.825 12.775C9.575 12.775 8.5125 12.3375 7.6375 11.4625C6.7625 10.5875 6.325 9.525 6.325 8.275C6.325 8.09167 6.3375 7.91667 6.3625 7.75C6.3875 7.58333 6.425 7.40833 6.475 7.225L4.375 5.175Z" fill="#A8A8A8"/>
// </svg>`;
// const lockIcon = `<svg
//             viewBox="0 0 16 21"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"
//               fill="#A8A8A8"
//             />
//           </svg>`;

// // ===================== DOM ELEMENT REFERENCES ===================== //
// // These variables reference the input fields and their corresponding
// // icon containers in the HTML document.

// const passwordInput = document.getElementById("password");
// const passwordConfirm = document.getElementById("confirm-password");
// const passwordConfirmDiv = document.getElementById(
//   "confirm-password-container",
// );
// const iconPasswordDivMain = document.getElementById(
//   "icon_password_switch_main",
// );
// const iconPasswordDivConfirm = document.getElementById(
//   "icon_password_switch_confirm",
// );
// const backArrow = document.getElementById("back-arrow");
// const checkbox = document.getElementById("privacy");
// const button = document.getElementById("submit_button");
// const error = document.getElementById("error-message");
// const form = document.getElementById("signupForm");

// // ===================== EVENT LISTENERS ===================== //
// // These listeners trigger whenever the user types something
// // in the password or confirm password fields.
// // When text is entered, the lock icon switches to an eye icon.
// passwordInput.addEventListener("input", () => {
//   UpdateIcon(passwordInput, iconPasswordDivMain);
//   updateSubmitButtonState();
// });

// passwordConfirm.addEventListener("input", () => {
//   UpdateIcon(passwordConfirm, iconPasswordDivConfirm);
//   checkPassword();
//   updateSubmitButtonState();
// });

// checkbox.addEventListener("change", () => {
//   //button.disabled = !checkbox.checked;
//   updateSubmitButtonState();
// });

// // ===================== FUNCTION: UpdateIcon ===================== //
// // This function runs every time the input value changes.
// //
// // - If the input is empty → show the lock icon.
// // - If the input has text → show the closed-eye icon (password hidden)
// //   and make the icon clickable (to toggle password visibility).

// function UpdateIcon(input, iconDiv) {
//   if (input.value.length > 0) {
//     // Eingabe vorhanden → Icon bleibt, Typ bleibt unverändert
//     // Das Auge zeigt je nach aktuellem Zustand (password/text)
//     if (input.type === "password") {
//       iconDiv.innerHTML = eyeClosed;
//     } else {
//       iconDiv.innerHTML = eyeOpen;
//     }
//     iconDiv.onclick = () => togglePassword(input, iconDiv);
//     iconDiv.classList.add("eye_switch");
//   } else {
//     // Nur wenn das Feld WIRKLICH leer ist → alles zurücksetzen
//     iconDiv.innerHTML = lockIcon;
//     iconDiv.onclick = null;
//     iconDiv.classList.remove("eye_switch");

//     // Jetzt darf er den Type wieder zurücksetzen
//     input.type = "password";
//   }
// }
// // ===================== FUNCTION: togglePassword ===================== //
// // This function toggles the input type between "password" and "text".
// //
// // - If type is "password" → reveal the password and show open-eye icon.
// // - If type is "text" → hide the password and show closed-eye icon.

// function togglePassword(input, iconDiv) {
//   if (!input.value) return; // Falls leer → nichts tun

//   if (input.type === "password") {
//     input.type = "text";
//     iconDiv.innerHTML = eyeOpen;
//   } else {
//     input.type = "password";
//     iconDiv.innerHTML = eyeClosed;
//   }
// }

// // Test function for Password abglich
// function checkPassword() {
//   if (passwordConfirm.value.length === 0) {
//     error.textContent = "";
//     passwordConfirmDiv.classList.remove("error-input-red");
//     return;
//   }

//   if (passwordInput.value === passwordConfirm.value) {
//     error.textContent = "";
//     error.style.color = "";
//     passwordConfirmDiv.classList.remove("error-input-red");
//   } else {
//     error.textContent = "Your passwords don't match. Please try again.";
//     error.style.color = "red";
//     passwordConfirmDiv.classList.add("error-input-red");
//   }
// }

// /**
//  * Function to show a success message after signing up
//  */
// function showSuccessMessage() {
//   const msg = document.getElementById("message");
//   msg.classList.add("show");

//   setTimeout(() => {
//     msg.classList.remove("show");
//   }, 3000);
// }

// function updateSubmitButtonState() {
//   const passwordsMatch =
//     passwordInput.value === passwordConfirm.value &&
//     passwordConfirm.value.length > 0;
//   button.disabled = !(passwordsMatch && checkbox.checked);
// }

const submitBtn = document.getElementById("submit_button");
const policyCheckbox = document.getElementById("privacy");
const inputFields = document.querySelectorAll(".input-icon input");
const signupForm = document.getElementById("signupForm");
const errorMsg = document.getElementById("error-message");

/**
 * This event listener prevents the default form submission behavior, which would cause a page reload. Instead, it allows  to handle the form submission with JavaScript, enabling us to perform validation and send the data to the server without refreshing the page.
 */
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signupRegistrationInFirebase();
});
/**
 * the register button is disabled on page load by default until the user accepts the privacy policy by checking the checkbox.
 */
submitBtn.disabled = !policyCheckbox.checked;

/**
 * Enable or disable the submit button based on the checkbox state.
 */
policyCheckbox.addEventListener("change", () => {
  submitBtn.disabled = !policyCheckbox.checked;
});

/**
 * Input field focus and blur event handlers to manage the "active" class, which gives users visual feedback, when they interact with the input fields.
 */

inputFields.forEach((input) => {
  const inputContainer = input.parentElement;

  input.addEventListener("focus", () => {
    inputContainer.classList.add("active");
  });

  input.addEventListener("blur", () => {
    if (input.value.trim() !== "") {
      inputContainer.classList.add("active");
    } else {
      inputContainer.classList.remove("active");
    }
  });

  // input.addEventListener("input", nullCheckValidation);
});

/**
 * signup Validation functions, which checks for empty fields, validates the name, email, password and confirm password inputs. If any validation fails, it shows an appropriate error message and highlights the relevant input fields in red.
 * @returns {boolean} - Returns true if all validations pass, false otherwise.
 */

function signupValidation() {
  const isNullCheckValid = nullCheckValidation();
  const isNameValid = nameValidation();
  const isEmailValid = emailValidation();
  const isPasswordValid = passwordValidation();
  const isConfirmPasswordValid = confirmPasswordValidation();

  if (
    !isNullCheckValid ||
    !isNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    showErrorMessage("something went wrong. check the fields and try again.");
  } else {
    resetBorderColors();
    errorMsg.style.visibility = "hidden";
    return (
      isNullCheckValid &&
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  }
}

/**
 * This function checks if any of the input fields are empty. If so, it highlights the empty fields in red and displays an error message prompting the user to fill in all fields.
 * @returns {boolean} - Returns true if all fields are filled, false otherwise.
 */
function nullCheckValidation() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();

  resetBorderColors();

  if (!name || !email || !password || !confirmPassword) {
    inputBorderColorsRed();
    showErrorMessage("Please fill in all fields.");
    return false;
  }
  return true;
}

/**
 * a function which highlights the input fields with red borders if they are empty.
 */
function inputBorderColorsRed() {
  const nameContainer = document.getElementById("signup-name").parentElement;
  const emailContainer = document.getElementById("signup-email").parentElement;
  const passwordContainer =
    document.getElementById("signup-password").parentElement;
  const confirmPasswordContainer = document.getElementById(
    "signup-confirm-password",
  ).parentElement;

  if (!document.getElementById("signup-name").value.trim()) {
    nameContainer.style.borderColor = "rgb(170, 22, 22)";
  }
  if (!document.getElementById("signup-email").value.trim()) {
    emailContainer.style.borderColor = "rgb(170, 22, 22)";
  }
  if (!document.getElementById("signup-password").value.trim()) {
    passwordContainer.style.borderColor = "rgb(170, 22, 22)";
  }
  if (!document.getElementById("signup-confirm-password").value.trim()) {
    confirmPasswordContainer.style.borderColor = "rgb(170, 22, 22)";
  }
}

/**
 * a function which sets the border color of the input fields back to the default color (#ccc) when the user starts typing in the fields or when they are not empty anymore.
 */
function resetBorderColors() {
  const nameContainer = document.getElementById("signup-name").parentElement;
  const emailContainer = document.getElementById("signup-email").parentElement;
  const passwordContainer =
    document.getElementById("signup-password").parentElement;
  const confirmPasswordContainer = document.getElementById(
    "signup-confirm-password",
  ).parentElement;

  nameContainer.style.borderColor = "#ccc";
  emailContainer.style.borderColor = "#ccc";
  passwordContainer.style.borderColor = "#ccc";
  confirmPasswordContainer.style.borderColor = "#ccc";
}

/**
 * a name validation function which checks if the name input contains any numbers. If it does, it shows an error message and removes the numbers from the input field.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */
function nameValidation() {
  const name = document.getElementById("signup-name").value.trim();
  const nameInput = document.getElementById("signup-name");
  if (/[0-9]/.test(name)) {
    showErrorMessage("Name cannot contain numbers.");
    nameInput.value = name.replace(/[0-9]/g, "");
    return false;
  } else {
    errorMsg.style.visibility = "hidden";
    nameInput.parentElement.classList.add("active");
    nameInput.addEventListener("blur", () => {
      nameInput.parentElement.classList.remove("active");
    });
    return true;
  }
}

/**
 * an email validation function which checks if the email input matches a basic email format using a regular expression. If the email is invalid, it shows an error message and clears the input field.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
function emailValidation() {
  const email = document.getElementById("signup-email").value.trim();
  const emailInput = document.getElementById("signup-email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showErrorMessage("Please enter a valid email address.");
    emailInput.value = "";
    emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  } else {
    // emailInput.parentElement.style.borderColor = "#29abe2";
    errorMsg.style.visibility = "hidden";
    return true;
  }
}

/**
 * a password validation function which checks if the password input is at least 6 characters long. If the password is too short, it shows an error message and clears the input field.
 * it also checks if the password contains any spaces. If it does, it shows an error message and clears the input field.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
function passwordValidation() {
  const password = document.getElementById("signup-password").value.trim();
  const passwordInput = document.getElementById("signup-password");

  if (password.length < 6) {
    showErrorMessage("Password must be at least 6 characters long.");
    passwordInput.value = "";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (/\s/.test(password)) {
    showErrorMessage("Password cannot contain spaces.");
    passwordInput.value = "";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  // Password is valid
  errorMsg.style.visibility = "hidden";
  // passwordInput.parentElement.style.borderColor = "#29abe2";
  return true;
}

/**
 * confirmation password validation function which checks if the confirm password input matches the password input. If they don't match, it shows an error message and clears the confirm password input field.
 * @returns {boolean} - Returns true if the confirm password matches the password, false otherwise.
 */
function confirmPasswordValidation() {
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password",
  );
  if (password !== confirmPassword) {
    showErrorMessage("Your passwords don't match. Please try again.");
    confirmPasswordInput.value = "";
    confirmPasswordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  } else {
    errorMsg.style.visibility = "hidden";
    // confirmPasswordInput.parentElement.style.borderColor = "#29abe2";
    return true;
  }
}

/**
 * a function which triggers the registration process in Firebase if all the validation checks pass successfully. It retrieves the values from the input fields and calls the registerUser function, which is responsible for creating a new user account in Firebase with the provided name, email, and password.
 * @returns {Promise<void>} - Returns a promise that resolves when the registration process is complete.
 */
async function signupRegistrationInFirebase() {
  if (!signupValidation()) {
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing up...";

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const hashedPassword = await hashPassword(password);

    await registerUser(name, email, hashedPassword);
    console.log(`user with following details registered: ${name}, ${email}`);
    showSuccessMessage();
    resetPageDefaults();
    setTimeout(() => {
      window.location.href = "../html/index.html";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    showErrorMessage("Registration failed. Please try again.");
    submitBtn.disabled = !policyCheckbox.checked;
    submitBtn.textContent = "Sign up";
  }
}

/**
 * function to show an error message if registration fails
 * @param {String} message
 */
function showErrorMessage(message) {
  const errorMsg = document.getElementById("error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

/**
 * Toggles password visibility between hidden (type="password") and visible (type="text")
 * If type is "password" → reveal the password and show open-eye icon.
 * If type is "text" → hide the password and show closed-eye icon.
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLElement} iconDiv - The icon container element
 */

const eyeOpen = `<i class="fa-regular fa-eye"></i>`;
const eyeClosed = `<i class="fa-regular fa-eye-slash"></i>`;
const lockIcon = `<i class="fa-solid fa-lock"></i>`;

function togglePassword(input, iconDiv) {
  if (!input || !input.value.trim()) return;

  if (input.type === "password") {
    // Reveal password
    input.type = "text";
    if (iconDiv.innerHTML !== eyeOpen) {
      iconDiv.innerHTML = eyeOpen;
    }
  } else {
    // Hide password
    input.type = "password";
    if (iconDiv.innerHTML !== eyeClosed) {
      iconDiv.innerHTML = eyeClosed;
    }
  }
}

/**
 * This function runs every time the input value changes.
 * If the input is empty → show the lock icon.
 * If the input has text → show the closed-eye icon (password hidden)
  and make the icon clickable (to toggle password visibility).
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLElement} iconDiv - The icon container element
 */

function UpdateIcon(input, iconDiv) {
  const value = input.value.trim();
  if (value.length > 0) {
    const newIcon = input.type === "password" ? eyeClosed : eyeOpen;
    if (iconDiv.innerHTML !== newIcon) {
      iconDiv.innerHTML = newIcon;
    }
    iconDiv.onclick = () => togglePassword(input, iconDiv);
    iconDiv.classList.add("eye_switch");
  } else {
    iconDiv.innerHTML = lockIcon;
    iconDiv.onclick = null;
    iconDiv.classList.remove("eye_switch");
    input.type = "password";
  }
}

/**
 * These listeners trigger whenever the user types something
 * in the password or confirm password fields.
 * When text is entered, the lock icon switches to an eye icon.
 */

const passwordInput = document.getElementById("signup-password");
const passwordConfirm = document.getElementById("signup-confirm-password");

const iconPasswordDivMain = document.getElementById(
  "icon_password_switch_main",
);
const iconPasswordDivConfirm = document.getElementById(
  "icon_password_switch_confirm",
);

passwordInput.addEventListener("input", () => {
  UpdateIcon(passwordInput, iconPasswordDivMain);
  passwordInput.addEventListener("blur", () => {
    passwordInput.parentElement.classList.remove("active");
  });
});

passwordConfirm.addEventListener("input", () => {
  UpdateIcon(passwordConfirm, iconPasswordDivConfirm);
  passwordConfirm.addEventListener("blur", () => {
    passwordConfirm.parentElement.classList.remove("active");
  });
});

// go back to login page function, a function applies to the back arrow in the top left corner of the sign-up page, which allows users to navigate back to the login page if they change their mind about signing up or want to log in instead.:

function goBackToLogin() {
  window.location.href = "../html/index.html";
}
