window.onload = function() {
  const userStatus = sessionStorage.getItem('userStatus');
  const UID = sessionStorage.getItem('userID');


  // Wenn der Benutzer nicht eingeloggt ist oder die Sitzung abgelaufen ist
  if (!userStatus || (userStatus !== 'guest' && userStatus !== 'loggedIn')) {
    window.location.href = "../html/login-site.html"; // Weiterleitung zur Login-Seite
  }
}
