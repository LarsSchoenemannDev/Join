// firebase-init.js
// auf ALLEN HTML-Seiten einbinden!

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

// Firebase Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Realtime Database
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ==== HIER NUR DIE KONFIGURATION EINTRAGEN ====
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJECT.firebaseapp.com", // später eintragen
  databaseURL: "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "joinproject"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);   // Realtime Database