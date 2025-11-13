
//Hier bitte alle globale Variablen setzen
let user_icon = document.getElementById('user-icon')
let switch_help = document.getElementById('switch_help')

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
