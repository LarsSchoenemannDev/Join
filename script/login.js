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
 * validate input fields for email and password
 * @param {*String} input
 *
 */
function validateInput(input) {
  let isValid = true;

  if (input.value.trim() === "") {
    isValid = false;
  }

  if (input.type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      isValid = false;
    }
  }

  if (input.type === "password") {
    if (input.value.length < 6) {
      isValid = false;
    }
  }

  if (isValid) {
    errorMsg.classList.add("d-none");
    input.classList.remove("error");
  } else {
    input.classList.add("error");
  }
  return isValid;
}

/**
 *  function to show the logo animation on page load
 */
async function loadImageSequence() {
  const container = document.getElementById("image-sequence");
  container.innerHTML = '<img src="assets/img/Capa 2.svg" alt="Logo Intro">';
  container.style.display = "block";

  container.classList.add("animate-logo");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // container.style.display = 'none';
  // document.querySelector('.logo').classList.remove('hidden');
}

window.addEventListener("load", loadImageSequence);

// sign Up Button Function

function goToSignUp() {
  window.location.href = "html/sign-up.html";
}

/**
 * Function to check screen size and start login animation in mobile view max-width 991px
 * Called on page load in index.html
 */

function animateLoginMobile() {
  const checkqueries = window.matchMedia("(max-width: 991px)");
  if (checkqueries.matches) {
    startAnimateLoginMobile();
  }
}

function startAnimateLoginMobile() {
  const animateImage = document.getElementById("animate-image");
  const animationBackground = document.querySelector(".bgAnimationMobile");
  const bodyDiv = document.getElementById("login-page-div");

  bodyDiv.style.display = "none";
  animationBackground.classList.add("animate-bg-mobile");
  animationBackground.style.display = "block";
  animateImage.classList.add("animate-logo-mobile");

  setTimeout(() => {
    animationBackground.classList.remove("animate-bg-mobile");
    animationBackground.style.display = "none";
    bodyDiv.style.display = "block";
  }, 1000);
}
