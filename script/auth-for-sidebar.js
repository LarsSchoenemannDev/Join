let normalUserLinks = document.getElementById('user-links');
let allUserLinks = normalUserLinks.querySelectorAll("a");
let notUserLoginLinks = document.getElementById('not-user-links');
let headerIcons = document.getElementById('user-icons');
let footerMobile = document.getElementById('footermobile');
const userStatus = sessionStorage.getItem('userStatus');

if (!userStatus || (userStatus !== 'guest' && userStatus !== 'loggedIn')) {
    normalUserLinks.classList.add('hide')
    notUserLoginLinks.classList.remove('hide')
    headerIcons.classList.add('hide')
    disableLinks()
    helponResizemobileSwitch()
}

function disableLinks() {
    allUserLinks.forEach(link =>{
        link.classList.add('disabled-link');
    });
}

function helponResizemobileSwitch() {
if (window.innerWidth <= 1000 ) {
    footerMobile.classList.remove('hide');
}else{
    footerMobile.classList.add('hide');
}
}

window.addEventListener("resize", helponResizemobileSwitch);




