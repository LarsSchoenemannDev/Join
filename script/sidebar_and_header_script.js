//Hier bitte alle globale Variablen setzen
let menuButton = document.getElementById('menu-button');
let user_icon = document.getElementById('user-icon');
let switch_help = document.getElementById('switch_help');
const userName = sessionStorage.getItem('name');
let initials = "";

if (userName !== null && userName.trim() !== "") {

    if (userName.length === 1) {
    // Nur ein Name vorhanden
    initials = userName[0][0].toUpperCase();
    menuButtonName();
} else {
    // Mehrere Namen: erstes und letztes Wort
    initials = userName[0][0].toUpperCase() + userName[userName.length - 1][0].toUpperCase();
    menuButtonName();
}

} else{
    menuButton.textContent = "";
}

function menuButtonName() {
    menuButton.textContent = initials
}

function tooglemenu() {
    let msg = document.getElementById('dropDown-menu')
    msg.classList.toggle('show')
}

function helpOnResizeSwitch() {
if (window.innerWidth <= 768 ) {
    switch_help.classList.remove('hide');
}else{
    switch_help.classList.add('hide');
}
}

window.onresize = helpOnResizeSwitch;


