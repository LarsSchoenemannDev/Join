
const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app"
const form = document.getElementById('login_form')
let password_input = document.getElementById('password');
let email_input = document.getElementById('email')
let fetchedData;
let emailFound = false;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // in HEX umwandeln
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

async function loginValidation() {
    emailFound = false;
    await loginDatafetch();

    for (const id in fetchedData) {
        const user = fetchedData[id]

        if (user.email === email_input.value) {
            emailFound = true;
            let passwor2 = password_input.value
            let passwordHased = await hashPassword(passwor2)
            if (user.password === passwordHased) {
                console.log("Login erfolgreich für:", user.id);
                sessionStorage.setItem("userID", user.id);
                sessionStorage.setItem('userStatus', "loggedIn");
                sessionStorage.setItem('name', user.name);
                
                window.location.href = "../html/summary.html"; 
            } else {
                console.error("Login daten sind falsch");
                //hier vllt noch error text in login seite hinzufügen
            }
        }
        
    }
     if (!emailFound) {
        console.error("Benutzer nicht gefunden");
        
     }
};

async function guestLogin() {
    await loginDatafetchGuest();
    


}



async function loginDatafetch() {
    
    try {
        const response = await fetch(BASE_URL + "/users.json");
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            
        }

        const responseToJson = await response.json();

        if (responseToJson && typeof responseToJson === 'object') {
            fetchedData = {};
            for (const [id, userData] of Object.entries(responseToJson)) {
                fetchedData[id] = {
                    id : id,
                    email: userData.email,
                    password: userData.password,
                    name: userData.name
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


async function loginDatafetchGuest() {
    
    try {
        const response = await fetch(BASE_URL + "/Guest.json");
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            
        }

        const responseToJson = await response.json();

        if (responseToJson && typeof responseToJson === 'object') {
            fetchedData = {};
            for (const [id, userData] of Object.entries(responseToJson)) {
                fetchedData = {
                    email: userData.email,
                    password: userData.password
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


function handleForm(event) {
    event.preventDefault();
}

form.addEventListener('submit', handleForm);