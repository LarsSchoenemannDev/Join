
function openAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "flex";
  loadAddTaskFormIntoOverlay();
  setTimeout(() => {    
    addTaskinit(); 
  }, 0);
  document.body.style.overflow = "hidden";
}


async function addTaskinit(){
  await getData(); 
  eventsAddTask();
}


function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

// // function resetAddTaskForm() {
// //     const formContainer = document.getElementById("addTaskFormContainer");
// //     if (formContainer) {
// //     }
// // }

// // closeAddTaskOverlay() 