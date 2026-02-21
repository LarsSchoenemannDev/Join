const submitBtn = document.getElementById("submit_button");
const policyCheckbox = document.getElementById("privacy");
const inputFields = document.querySelectorAll(".input-icon input");
const signupForm = document.getElementById("signupForm");
// const errorMsg = document.getElementById("error-message");
const checkboxAcceptance = document.getElementById("signupCheckedMsg");

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
 * Enable or disable the submit button based on the checkbox state and form validation.
 * Button is only enabled when checkbox is checked AND all fields are valid.
 */
policyCheckbox.addEventListener("change", async () => {
  if (policyCheckbox.checked) {
    const isValid = await signupValidation();
    if (isValid) {
      // Form is valid, checkbox is checked - enable submit
      submitBtn.disabled = false;
      checkboxAcceptance.style.visibility = "hidden";
    } else {
      // Form is NOT valid - uncheck and show validation message
      policyCheckbox.checked = false;
      submitBtn.disabled = true;
      checkboxAcceptance.style.visibility = "visible";
      checkboxAcceptance.textContent = "the form must be validated first.";
    }
  } else {
    // Checkbox unchecked - disable submit and show policy message
    submitBtn.disabled = true;
    checkboxAcceptance.style.visibility = "visible";
    checkboxAcceptance.textContent = "privacy policy must be accepted.";
  }
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
});

/**
 * signup Validation functions, which checks for empty fields, validates the name, email, password and confirm password inputs. If any validation fails, it shows an appropriate error message and highlights the relevant input fields in red.
 * @returns {Promise<boolean>} - Returns true if all validations pass, false otherwise.
 */

async function signupValidation() {
  const isNullCheckValid = nullCheckValidation();
  const isNameValid = await nameValidation();
  const isEmailValid = await emailValidation();
  const isPasswordValid = passwordValidation();
  const isConfirmPasswordValid = confirmPasswordValidation();

  if (
    !isNullCheckValid ||
    !isNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    if (
      isNullCheckValid &&
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      confirmPasswordErrorMessage(
        "something went wrong. check the fields and try again.",
      );
    }
    return false;
  } else {
    resetBorderColors();
    const errorMsg = document.getElementById("confirmpassword-error-message");
    errorMsg.style.visibility = "hidden";
    return true;
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
    // showErrorMessage("Please fill in all fields.");
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
async function nameValidation() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");

  if (!name) {
    nameErrorMessage("Name cannot be empty.");
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (/[0-9]/.test(name)) {
    nameErrorMessage("Name cannot contain numbers.");
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    // nameInput.value = name.replace(/[0-9]/g, "");
    return false;
  }

  const isNameAvailable = await existingNameValidation();
  if (!isNameAvailable) {
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  const errorMsg = document.getElementById("name-error-message");
  errorMsg.style.visibility = "hidden";
  nameInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * an async function which checks if the name is already taken in Firebase by fetching the existing user names and comparing them with the input name. If the name is already taken, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */
async function existingNameValidation() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");

  try {
    const existingUserNames = await fetchExistingUserName();
    if (
      existingUserNames.find(
        (existingName) => existingName.toLowerCase() === name,
      )
    ) {
      nameErrorMessage("User with name already exists.");
      nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating name:", error);
    return true;
  }
}

/**
 * an email validation function which checks if the email input matches a basic email format using a regular expression. If the email is invalid, it shows an error message and clears the input field.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
async function emailValidation() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailErrorMessage("Email cannot be empty.");
    emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (!emailRegex.test(email)) {
    emailErrorMessage("Please enter a valid email address.");
    emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  const isEmailAvailable = await existingEmailValidation();
  if (!isEmailAvailable) {
    return false;
  }
  const errorMsg = document.getElementById("email-error-message");
  errorMsg.style.visibility = "hidden";
  emailInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * an async function which checks if the email is already registered in Firebase by fetching the existing user emails and comparing them with the input email. If the email is already registered, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if email is available, false if already exists
 */
async function existingEmailValidation() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");

  try {
    const existingUserEmails = await fetchExistingUserEmail();
    if (
      existingUserEmails.find(
        (existingEmail) => existingEmail.toLowerCase() === email,
      )
    ) {
      emailErrorMessage("This email is already registered.");
      emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating email:", error);
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
    passwordErrorMessage("Password must be at least 6 characters long.");
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  if (/\s/.test(password)) {
    passwordErrorMessage("Password cannot contain spaces.");
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }

  // Password is valid
  const errorMsg = document.getElementById("password-error-message");
  errorMsg.style.visibility = "hidden";
  passwordInput.parentElement.style.borderColor = "#ccc";
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
    confirmPasswordErrorMessage(
      "Your passwords don't match. Please try again.",
    );
    confirmPasswordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  if (confirmPassword.length >= 6 && password === confirmPassword) {
    const errorMsg = document.getElementById("confirmpassword-error-message");
    errorMsg.style.visibility = "hidden";
    confirmPasswordInput.parentElement.style.borderColor = "#29abe2";
    checkboxAcceptance.style.visibility = "visible";
    checkboxAcceptance.textContent = "privacy policy must be accepted.";
    // checkboxAcceptance.style.visibility = policyCheckbox.checked
    //   ? "hidden"
    //   : "visible";
    return true;
  }
}

function nullConfirmationPasswordValidation() {
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password",
  );

  if (!confirmPassword) {
    confirmPasswordErrorMessage("please confirm your password.");
    confirmPasswordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
}

// function confirmPasswordValidationOnInput() {
//   const password = document.getElementById("signup-password").value.trim();
//   const confirmPassword = document
//     .getElementById("signup-confirm-password")
//     .value.trim();
//   const confirmPasswordInput = document.getElementById(
//     "signup-confirm-password",
//   );

//   if (password === confirmPassword) {
//     errorMsg.style.visibility = "hidden";
//     confirmPasswordInput.parentElement.style.borderColor = "#29abe2";
//     return true;
//   }
// }

/**
 * a function which triggers the registration process in Firebase if all the validation checks pass successfully. It retrieves the values from the input fields and calls the registerUser function, which is responsible for creating a new user account in Firebase with the provided name, email, and password.
 * @returns {Promise<void>} - Returns a promise that resolves when the registration process is complete.
 */
async function signupRegistrationInFirebase() {
  if (!(await signupValidation())) {
    return;
  }
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "wait...";

    const name = document
      .getElementById("signup-name")
      .value.trim()
      .toLowerCase();
    const email = document
      .getElementById("signup-email")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("signup-password").value.trim();
    const hashedPassword = await hashPassword(password);

    await registerUser(name, email, hashedPassword);
    showSuccessMessage();
    resetPageDefaults();
    setTimeout(() => {
      window.location.href = "../html/index.html";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    confirmPasswordErrorMessage("Registration failed. Please try again.");
    submitBtn.disabled = !policyCheckbox.checked;
    submitBtn.textContent = "Sign up";
  }
}

/**
 * function to show an error message if registration fails
 * @param {String} message
 */
// function showErrorMessage(message) {
//   const errorMsg = document.getElementById("error-message");
//   errorMsg.textContent = message;
//   errorMsg.style.visibility = "visible";
// }

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
