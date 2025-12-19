function greetingGuest() {
    const checkQueries = window.matchMedia('(max-width: 767px)');
    if (checkQueries.matches) {
        startWelcomeAnimation();
    }
}

function startWelcomeAnimation() {
    const summaryDiv = document.querySelector('.summary-div');
    const welcomePage = document.querySelector('.welcome-page');
    const welcomeMsg = document.querySelector('.welcomeMsg');

    // Hide summary overview initially
    summaryDiv.style.display = 'none';
    welcomePage.style.display = 'flex';
    welcomePage.classList.add('welcome-animation');
    welcomeMsg.textContent = `Good morning!`;
    setTimeout(()=>{
        welcomePage.classList.remove('welcome-animation');
        welcomePage.style.display = 'none';
        summaryDiv.style.display = 'block';
        // summaryDiv.classList.add('fade-in');
    }, 3000);
}

const boxItems = document.querySelectorAll('.overview-box-items');
boxItems.forEach(box => {
    box.addEventListener('click', () => {
        window.location.href = "../html/board.html";
    });
});