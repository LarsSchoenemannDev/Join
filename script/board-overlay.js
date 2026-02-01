
  function openAddTaskOverlay() {
    const overlay = document.getElementById("addTaskOverlay");
    overlay.style.display = "flex";

    const formContainer = document.getElementById("addTaskFormContainer");
    if (formContainer.children.length === 0) {
        loadAddTaskFormIntoOverlay();
    }
     init();
    document.body.style.overflow = "hidden";
}


// function closeAddTaskOverlay() {
//     const overlay = document.getElementById("addTaskOverlay");
//     overlay.style.display = "none";
//     document.body.style.overflow = "auto";

// }

// // function resetAddTaskForm() {
// //     const formContainer = document.getElementById("addTaskFormContainer");
// //     if (formContainer) {
        
// //     }
// // }

// // closeAddTaskOverlay() 