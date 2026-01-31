//Hier bitte alle globale Variablen setzen
let menuButton = document.getElementById("menu-button");
let user_icon = document.getElementById("user-icon");
let switchHelp = document.getElementById("switch_help");
const userName = sessionStorage.getItem("name");
const userNameWelcomeMsg = document.getElementById("userName");
const signedUser = document.getElementById("signedUser");
let initials = "";

if (!userName || typeof userName !== "string") {
  initials = "??";
} else {
  const nameParts = userName.trim().split(" ");
  const firstInitial = nameParts[0]
    ? nameParts[0].charAt(0).toUpperCase() || ""
    : "";
  const lastInitial = nameParts[nameParts.length - 1]
    ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() || ""
    : "";

  initials = firstInitial + lastInitial;
  getNameInitialsMenuButton();
  showUserNameWelcomeMsg();
  showSignedUserName();
}

function getNameInitialsMenuButton() {
  menuButton.textContent = initials;
}

function showUserNameWelcomeMsg() {
  if (userNameWelcomeMsg) {
    userNameWelcomeMsg.textContent = userName;
  } else {
    return;
  }
}

function showSignedUserName() {
  if (!signedUser) {
    return;
  }
  if (!userName) {
    signedUser.textContent = "";
  } else {
    signedUser.textContent = userName;
  }
}

// if (userName !== null && userName.trim() !== "") {
//   if (userName.length === 1) {
//     // Nur ein Name vorhanden
//     initials = userName[0][0].toUpperCase();
//     menuButtonName();
//   } else {
//     // Mehrere Namen: erstes und letztes Wort
//     initials =
//       userName[0][0].toUpperCase() +
//       userName[userName.length - 1][0].toUpperCase();
//     menuButtonName();
//   }
// } else {
//   menuButton.textContent = "";
// }

// function menuButtonName() {
//   menuButton.textContent = initials;
// }

function tooglemenu() {
  let msg = document.getElementById("dropDown-menu");
  msg.classList.toggle("show");
}

function helpOnResizeSwitch() {
  if (window.innerWidth <= 768) {
    switchHelp.classList.remove("hide");
  } else {
    switchHelp.classList.add("hide");
  }
}

window.onresize = helpOnResizeSwitch;
