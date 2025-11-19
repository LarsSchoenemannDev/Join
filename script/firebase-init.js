// firebase-init.js
// bei Allen Html seiten einbinden!!!
// Firebase App (erforderlich)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

// Firebase Auth & Firestore
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ==== HIER NUR DIE KONFIGURATION EINTRAGEN ====
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJECT.firebaseapp.com",
  projectId: "DEIN_PROJECT",
  storageBucket: "DEIN_PROJECT.appspot.com",
  messagingSenderId: "1234567890",
  appId: "APP_ID"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);