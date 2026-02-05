//Hier bitte alle globale Variablen setzen
let menuButton = document.getElementById("menu-button");
let userIcon = document.getElementById("user-icon");
let switchHelp = document.getElementById("switch_help");
const dropDownMenu = document.getElementById("dropDown-menu");
const userName = sessionStorage.getItem("name");
const userNameWelcomeMsg = document.getElementById("userName");
const signedUser = document.getElementById("signedUser");
let initials = "";

// Ensure dropdown starts hidden
if (dropDownMenu && !dropDownMenu.classList.contains("hide")) {
  dropDownMenu.classList.add("hide");
}

/**
 * a function to get the initials from the user name to show in header
 */
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
  if (sessionStorage.getItem("name") === "Guest") {
    initials = "G";
    menuButton.textContent = initials;
    return;
  }
  menuButton.textContent = initials;
}

function showUserNameWelcomeMsg() {
  if (userNameWelcomeMsg) {
    if (sessionStorage.getItem("name") === "Guest") {
      userNameWelcomeMsg.textContent = "";
    } else {
      userNameWelcomeMsg.textContent = userName;
    }
  }
}

function showSignedUserName() {
  if (signedUser) {
    if (sessionStorage.getItem("name") === "Guest") {
      signedUser.textContent = "";
    } else {
      signedUser.textContent = userName;
    }
  }
}

function toggleMenu() {
  if (!dropDownMenu) {
    console.error("dropDownMenu element not found");
    return;
  }
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
  if (!dropDownMenu) return;

  const checkQueries = window.matchMedia("(max-width: 991px)");

  if (checkQueries.matches) {
    if (switchHelp) switchHelp.classList.remove("hide");
    dropDownMenu.style.top = "280px";
  } else {
    if (switchHelp) switchHelp.classList.add("hide");
    dropDownMenu.style.top = "230px";
  }
  dropDownMenu.style.position = "absolute";
  dropDownMenu.style.right = "0";
}
