const boxItems = document.querySelectorAll('.overview-box-items');
boxItems.forEach(box => {
    box.addEventListener('click', () => {
        window.location.href = "../html/board.html";
    });
});