//Hier bitte alle globale Variablen setzen
let menuButton = document.getElementById("menu-button");
let userIcon = document.getElementById("user-icon");
let switchHelp = document.getElementById("switch_help");
const dropDownMenu = document.getElementById("dropDown-menu");
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
  }
}

function showSignedUserName() {
  if (signedUser) {
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

function toggleMenu() {
  updateMenuPosition();
  dropDownMenu.classList.toggle("hide");
}

// function helpOnResizeSwitch() {
//   if (window.innerWidth <= 768) {
//     switchHelp.classList.remove("hide");
//     dropDownMenu.style.position = "absolute";
//     dropDownMenu.style.right = "0";
//     dropDownMenu.style.top = "280px";
//   } else {
//     switchHelp.classList.add("hide");
//   }
// }

// window.addEventListener("resize", updateMenuPosition);

function updateMenuPosition() {
  const checkQueries = window.matchMedia("(max-width: 991px)");

  if (checkQueries.matches) {
    switchHelp.classList.remove("hide");
    dropDownMenu.style.top = "280px";
  } else {
    switchHelp.classList.add("hide");
    dropDownMenu.style.top = "230px";
  }
  dropDownMenu.style.position = "absolute";
  dropDownMenu.style.right = "0";
}
