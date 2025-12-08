
let password_input = document.getElementById('password');
let email_input = document.getElementById('email')
let fetchedData;
let emailFound = false;

async function loginValidation() {
    emailFound = false;
    await loginDatafetch();

    for (const id in fetchedData) {
        const user = fetchedData[id]

        if (user.email === email_input.value) {
            emailFound = true;
            if (user.password === password_input.value) {
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


function testFunction() {
console.log("Login erfolgreich für");
sessionStorage.setItem("userID", "-euneunre");
sessionStorage.setItem('userStatus', "loggedIn");
sessionStorage.setItem('name', "Gustav");
                
 window.location.href = "../html/summary.html";
}