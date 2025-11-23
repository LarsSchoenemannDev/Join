let BASE_URL = "#"


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");

  const errorBox = document.getElementById("error-message");
  const messageBox = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorBox.textContent = "";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();
    const hashedPassword = await hashPassword(password);

 // SHA-256 Hash-Funktion
  async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // in HEX umwandeln
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

    // Passwort-Check
    if (password !== confirm) {
      errorBox.textContent = "Your passwords don't match. Please try again.";
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
      todos: {},
      contacts: {}
    }

    try {
      const response = await fetch(BASE_URL + "/users" + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }


      const result = await response.json();
      console.log("User created:", result.name);


      // Erfolg anzeigen
      messageBox?.classList.add("show");

      setTimeout(() => {
        window.location.href = "../html/login-site.html";
      }, 2000);

    } catch (err) {
      console.error(err);
      errorBox.style.color = "red";
      errorBox.textContent = "Registration failed. Please try again.";
    }
  });
});