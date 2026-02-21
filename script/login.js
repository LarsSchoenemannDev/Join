const errorMsg = document.querySelector(".error-msg");

/**
 * Function to toggle password visibility and update the icon accordingly
 * Called on click of the toggle password icon in index.html
 */
function togglePassword() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");

  if (p.type === "password") {
    p.type = "text";
    img.src = "../assets/img/visibility.svg";
  } else {
    p.type = "password";
    img.src = p.value
      ? "../assets/img/visibility_off.svg"
      : "../assets/img/lock.svg";
  }
}

function updateIcon() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");

  if (p.type === "password") {
    img.src = p.value
      ? "../assets/img/visibility_off.svg"
      : "../assets/img/lock.svg";
  }
}

/**
 *  function to show the logo animation on page load
 */
async function loadImageSequence() {
  const container = document.getElementById("image-sequence");
  container.innerHTML = '<img src="../assets/img/Capa 2.svg" alt="Logo Intro">';
  container.style.display = "block";

  container.classList.add("animate-logo");
  setTimeout(() => {
    container.style.display = "none";
    document.querySelector(".logo").style.visibility = "visible";
  }, 1500);
}

window.addEventListener("load", loadImageSequence);

// sign Up Button Function

function goToSignUp() {
  window.location.href = "../html/sign-up.html";
}

/**
 * a function which checks the password input for empty value, spaces and minimum length of 6 characters
 * @returns boolean
 */
function valildatePassword() {
  const password = document.getElementById("password").value;
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const passwordInput = document.getElementById("password");
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");

  if (!password || !password.trim()) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent = "password cannot be empty.";
    passwordInput.classList.add("error");
    return false;
  }

  if (/\s/.test(password)) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent = "Password cannot contain spaces.";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    passwordInput.classList.add("error");
    return false;
  }

  if (password.length < 6) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent =
      "Password must be at least 6 characters long.";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    passwordInput.classList.add("error");
    return false;
  }

  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  passwordInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks the email input for empty value and valid email format
 * @returns boolean
 */
function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const emailInput = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailErrorMsg.style.visibility = "visible";
    emailErrorMsg.textContent = "email cannot be empty.";
    emailInput.classList.add("error");
    return false;
  }
  if (!emailPattern.test(email)) {
    emailErrorMsg.style.visibility = "visible";
    emailErrorMsg.textContent = "Please enter a valid email address.";
    emailInput.classList.add("error");
    return false;
  } else {
    emailErrorMsg.style.visibility = "hidden";
    emailInput.classList.remove("error");
    return true;
  }
}

/**
 * validate input fields for email and password
 * @param {*String} input
 *
 */
// function validateInput(input) {
//   let isValid = true;

//   if (input.value.trim() === "") {
//     isValid = false;
//   }

//   if (input.type === "email") {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(input.value)) {
//       isValid = false;
//     }
//   }

//   if (input.type === "password") {
//     if (input.value.length < 6) {
//       isValid = false;
//     }
//   }

//   if (isValid) {
//     errorMsg.classList.add("d-none");
//     input.classList.remove("error");
//   } else {
//     input.classList.add("error");
//   }
//   return isValid;
// }
