function greetingGuest() {
  const checkQueries = window.matchMedia("(max-width: 991px)");
  if (checkQueries.matches) {
    startWelcomeAnimation();
  }
}

function startWelcomeAnimation() {
  const summaryDiv = document.querySelector(".summary-div");
  const welcomePage = document.querySelector(".welcome-page");
  const welcomeMsg = document.querySelector(".welcomeMsg");
  const signedUser = document.getElementById("signedUser");
  // Hide summary overview initially
  summaryDiv.style.display = "none";
  welcomePage.classList.add("welcome-animation");
  welcomeMsg.textContent = `Good morning!`;
  signedUser.textContent = userName ? `${userName}` : "";
  welcomePage.style.display = "flex";
  setTimeout(() => {
    welcomePage.classList.remove("welcome-animation");
    welcomePage.style.display = "none";
    summaryDiv.style.display = "block";
    // summaryDiv.classList.add('fade-in');
  }, 3000);
}

const boxItems = document.querySelectorAll(".overview-box-items");
boxItems.forEach((box) => {
  box.addEventListener("click", () => {
    window.location.href = "../html/board.html";
  });
});
