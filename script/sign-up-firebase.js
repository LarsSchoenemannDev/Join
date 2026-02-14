/**
 * an async function to register a user by sending their data to the Firebase Realtime Database
 */
const firebaseURL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/users";

async function registerUser(name, email, password) {
  const userData = {
    name: name,
    email: email,
    password: password,
  };

  try {
    const response = await fetch(firebaseURL + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
  } catch (err) {
    console.error(err);
    showErrorMessage("Registration failed. Please try again.");
  }
}

/**
 * an async function to fetch existing user names from the Firebase Realtime Database and return them as an array. This function is used to check if a user name is already registered before allowing a new registration.
 * @returns an Array with possible registered Names
 */
async function fetchExistingUserName() {
  try {
    const response = await fetch(firebaseURL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const existingNames = [];

    if (data && typeof data === "object") {
      for (const [id, userData] of Object.entries(data)) {
        if (userData.name) {
          existingNames.push(userData.name);
        }
      }
      return existingNames;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * an async function to fetch existing user emails from the Firebase Realtime Database and return them as an array. This function is used to check if an email is already registered before allowing a new registration.
 * @returns an Array of possible registered Emails
 */
async function fetchExistingUserEmail() {
  try {
    const response = await fetch(firebaseURL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const existingEmails = [];

    if (data && typeof data === "object") {
      for (const [id, userData] of Object.entries(data)) {
        if (userData.email) {
          existingEmails.push(userData.email);
        }
      }
      return existingEmails;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
fetchExistingUserEmail();
fetchExistingUserName();

/**
 * Function to show a success message after signing up
 */
function showSuccessMessage() {
  const messageBox = document.getElementById("message");
  messageBox?.classList.add("show");
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
 * function to reset the form and hide error messages after successful registration
 */
function resetPageDefaults() {
  const form = document.getElementById("signupForm");
  form.reset();
  const errorMsg = document.getElementById("error-message");
  errorMsg.style.visibility = "hidden";
  UpdateIcon(passwordInput, iconPasswordDivMain);
  UpdateIcon(passwordConfirm, iconPasswordDivConfirm);
}

// SHA-256 Hash-Funktion
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // in HEX umwandeln
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
