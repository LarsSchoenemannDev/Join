let normalUserLinks = document.getElementById('user-links');
let allUserLinks = normalUserLinks.querySelectorAll("a");
let notUserLoginLinks = document.getElementById('not-user-links');
let headerIcons = document.getElementById('user-icons');
const userStatus = sessionStorage.getItem('userStatus');

if (!userStatus || (userStatus !== 'guest' && userStatus !== 'loggedIn')) {
    normalUserLinks.classList.add('hide')
    notUserLoginLinks.classList.remove('hide')
    headerIcons.classList.add('hide')
    disableLinks()

}

function disableLinks() {
    allUserLinks.forEach(link =>{
        link.classList.add('disabled-link');
    });
}


