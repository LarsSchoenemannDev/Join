const BASE_URL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app";
const guestURL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/guest";

const form = document.getElementById("login_form");
// let passwordInput = document.getElementById("password");
// let emailInput = document.getElementById("email");
let fetchedData;
let fetchedDataGuest;
let emailFound = false;
const inputs = document.querySelectorAll("input");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

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

async function loginValidation() {
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  passwordErrorMsg.style.visibility = "hidden";
  emailErrorMsg.style.visibility = "hidden";

  inputs.forEach((input) => {
    input.style.borderColor = "#29abe2";
  });
  emailFound = false;
  await loginDatafetch();

  for (const id in fetchedData) {
    const user = fetchedData[id];

    if (user.email === emailInput.value) {
      emailFound = true;
      let passwor2 = passwordInput.value;
      let passwordHased = await hashPassword(passwor2);
      if (user.password === passwordHased) {
        sessionStorage.setItem("userID", user.id);
        sessionStorage.setItem("userStatus", "loggedIn");
        sessionStorage.setItem("name", user.name);

        window.location.href = "../html/summary.html";
      } else {
        passwordErrorMsg.style.visibility = "visible";
        passwordErrorMsg.textContent = "Check your password and try again.";
        passwordInput.style.borderColor = "#e60026";
      }
    }
  }
  if (!emailFound) {
    emailErrorMsg.style.visibility = "visible";
    emailErrorMsg.textContent = "Check your email and try again.";
    emailInput.style.borderColor = "#e60026";
  }
}

/**
 * fetch data from firebase with "GET" Methode for the registered users
 */
async function loginDatafetch() {
  try {
    const response = await fetch(BASE_URL + "/users.json");
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }

    const responseToJson = await response.json();

    if (responseToJson && typeof responseToJson === "object") {
      fetchedData = {};
      for (const [id, userData] of Object.entries(responseToJson)) {
        fetchedData[id] = {
          id: id,
          email: userData.email,
          password: userData.password,
          name: userData.name,
        };
      }
    } else {
      fetchedData = {};
    }
  } catch (error) {
    console.error("Fehler beim laden der Daten:", error);

    fetchedData = {};
  }
}

/**
 * the function to direct the "guest" to summary page by checking the guest data from firebase
 * and rendering the guest name initial "G" in the header
 * and ignore the name of guest in welcome message
 */

async function guestLogin() {
  await loginDatafetchGuest();

  if (fetchedDataGuest && fetchedDataGuest.name === "Guest") {
    sessionStorage.setItem("name", fetchedDataGuest.name);
    window.location.href = "../html/summary.html";
  } else {
    console.error("Guest login failed - invalid guest data");
  }
}

/**
 * fetch data from firebase with "GET" Methode for guest user
 * @returns fetched data from firebase for guest in a direct structure, so the information can be used to extract initials for header.
 */
async function loginDatafetchGuest() {
  try {
    const response = await fetch(guestURL + ".json");
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }

    const responseToJson = await response.json();

    if (responseToJson && typeof responseToJson === "object") {
      // Check if data is directly the guest object or nested
      if (responseToJson.name) {
        // Direct structure: { "name": "Guest" }
        fetchedDataGuest = { name: responseToJson.name };
      } else {
        // Nested structure: { "id": { "name": "Guest" } }
        const firstEntry = Object.values(responseToJson)[0];
        fetchedDataGuest = firstEntry ? { name: firstEntry.name } : {};
      }
    } else {
      fetchedDataGuest = {};
    }
  } catch (error) {
    console.error("Fehler beim laden der Daten:", error);
    fetchedDataGuest = {};
  }
}

function handleForm(event) {
  event.preventDefault();
}

form.addEventListener("submit", handleForm);
