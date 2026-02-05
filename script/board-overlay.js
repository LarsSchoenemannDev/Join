
function openAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "flex";
  loadAddTaskFormIntoOverlay(); 
  addTaskinit(); 
  document.body.style.overflow = "hidden";
}

function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

async function addTaskinit() {
  await getData();
  eventsAddTask();
}