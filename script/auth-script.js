window.onload = function () {
  const userStatus = sessionStorage.getItem("userStatus");
  const UID = sessionStorage.getItem("userID");
  //getData();

  // Wenn der Benutzer nicht eingeloggt ist.
  if (!userStatus || (userStatus !== "guest" && userStatus !== "loggedIn")) {
    window.location.href = "../html/index.html"; // Weiterleitung zur Login-Seite
  }
};
