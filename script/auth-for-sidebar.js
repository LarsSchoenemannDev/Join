let normalUserLinks = document.getElementById('user-links');
let notUserLoginLinks = document.getElementById('not-user-links');
let headerIcons = document.getElementById('user-icon');
const userStatus = sessionStorage.getItem('userStatus');

if (!userStatus || (userStatus !== 'guest' && userStatus !== 'loggedIn')) {
    normalUserLinks.classList.add('hide')
    notUserLoginLinks.classList.remove('hide')
}


