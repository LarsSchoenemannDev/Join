

import { auth, db } from "./firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

    // Passwort-Check
    if (password !== confirm) {
      errorBox.textContent = "Your passwords don't match. Please try again.";
      return;
    }

    try {
      // Firebase Registrierung
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("User created:", user);

      // User-Daten in Realtime Database speichern
      await set(ref(db, "users/" + user.uid + "/profile"), {
        name: name,
        email: email,
        createdAt: Date.now()
      });

      // Erfolg anzeigen
      messageBox?.classList.add("show");

      setTimeout(() => {
        window.location.href = "../html/login-site.html";
      }, 2000);

    } catch (err) {
      console.error(err);
      errorBox.style.color = "red";

      if (err.code === "auth/email-already-in-use") {
        errorBox.textContent = "Diese Email wird bereits verwendet.";
      } else if (err.code === "auth/invalid-email") {
        errorBox.textContent = "Bitte eine gültige Email eingeben.";
      } else if (err.code === "auth/weak-password") {
        errorBox.textContent = "Passwort muss mindestens 6 Zeichen haben.";
      } else {
        errorBox.textContent = "Unbekannter Fehler. Bitte erneut versuchen.";
      }
    }
  });
});