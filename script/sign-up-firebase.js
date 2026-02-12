/**
 * This script handles the user registration process by sending user data to a Firebase Realtime Database.
 */

// let BASE_URL =
//   "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app";

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("signupForm");
//   const nameInput = document.getElementById("name");
//   const emailInput = document.getElementById("email");
//   const passwordInput = document.getElementById("password");
//   const confirmInput = document.getElementById("confirm-password");

//   const errorBox = document.getElementById("error-message");
//   const messageBox = document.getElementById("message");

//   // SHA-256 Hash-Funktion
//   async function hashPassword(password) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(password);

//     const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));

//     // in HEX umwandeln
//     const hashHex = hashArray
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("");

//     return hashHex;
//   }

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     errorBox.textContent = "";

//     const trimName = nameInput.value.trim();
//     const trimEmail = emailInput.value.trim();
//     const trimPassword = passwordInput.value.trim();
//     const confirm = confirmInput.value.trim();
//     const hashedPassword = await hashPassword(trimPassword);

//     // Passwort-Check
//     if (trimPassword !== confirm) {
//       errorBox.textContent = "Your passwords don't match. Please try again.";
//       return;
//     }

//     const userData = {
//       name: trimName,
//       email: trimEmail,
//       password: hashedPassword,
//     };

//     try {
//       const response = await fetch(BASE_URL + "/users" + ".json", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         console.error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("User created:", result.name);

//       // Erfolg anzeigen
//       messageBox?.classList.add("show");
//       showSuccessMessage();

//       form.reset();
//       button.disabled = true;
//       UpdateIcon(passwordInput, iconPasswordDivMain);
//       UpdateIcon(passwordConfirm, iconPasswordDivConfirm);

//       setTimeout(() => {
//         window.location.href = "../html/index.html";
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       errorBox.style.color = "red";
//       errorBox.textContent = "Registration failed. Please try again.";
//     }
//   });
// });

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
    console.log("User created:", result.name, result.email);
  } catch (err) {
    console.error(err);
    showErrorMessage("Registration failed. Please try again.");
  }
}

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
