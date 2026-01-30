
async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
}

function initDragAndDrop() {
  document.querySelectorAll(".in-progress[data-status]").forEach(col => {
    col.addEventListener("dragover", onDragOver);
    col.addEventListener("dragenter", onDragEnter);
    col.addEventListener("dragleave", onDragLeave);
    col.addEventListener("drop", onDrop);
  });
}

function stateAdd() {
  if (!fetchData) {
    return
  };
  Object.values(fetchData["tasks"]).forEach(task => {
    if (task.state === undefined) {
      task.state = "todu";
    }
  })
}

function taskByState(state) {
  let entries = Object.entries(fetchData.tasks);
  let result = [];
  for (const [id, task] of entries) {
    if (task.state === state) result.push({ id, task });
  }
  return result
}

function renderBoard() {
  let todo = taskByState("todu");
  let inProgress = taskByState("inProgress");
  let feedBack = taskByState("feedBack");
  let done = taskByState("done");

  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

function headRenderHTML(headId, title, count) {
  const contentHead = document.getElementById(headId);
  contentHead.innerHTML = "";
  contentHead.innerHTML = headcardHTML(title, count);
}

function maincardHTML(contentId, tasks) {
  let contentRef = document.getElementById(contentId);
  contentRef.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    contentRef.innerHTML += renderTasksHTML(task.task, task.id)
  }
}

function renderContact(contacts = []) {
  let html = "";

  contacts.forEach(contact => {
    if (contact.checked) {
      html += renderContactHTML(contact);
    }
  });
  return html;
}

function filterPriority(priority) {
  const prioArray = Array.isArray(priority) ? priority : [priority];
  let priorityState = "";
  prioArray.forEach(prio => {
    if (prio === "urgent") {
      priorityState = "urgent";
    } else if (prio === "medium") {
      priorityState = "medium";
    } else if (prio === "low") {
      priorityState = "low";
    }
  });
  return priorityState;
}

function filterCategory(category){
  const categoryArray = Array.isArray(category) ? category : [category];
  let categoryState = "";
  categoryArray.forEach(category =>{
    if (category === "Technical Task"){
      categoryState = "technical-task";
    }else if (category === "User Story"){
      categoryState = "user-story"
    }
  })
  return categoryState;
}

function renderTasksHTML(task, id) {
  return `
              <section class="in-progress">              
                <div class="Cards blue" data-id="${id}" draggable="true" ondragstart="onDragStart(event)" 
                    ondragend="onDragEnd(event)">                 
                  <p class="tag ${filterCategory(task.category)}">${task.category}</p>   
                  <h4>${task.title}</h4>
                  <span>${task.description}</span>
                  <div class="progress">${task.subtasks.length} Subtasks</div>
                  <div class ="nav">
                  <div class="avatars">${renderContact(task.contacts)}</div>
                  <div class="${filterPriority(task.priority)} prio-wrapper"></div>            
                  </div>
                  </div>
                </div>
              </section>
  `;
}

function renderContactHTML(contact) {
  return `
              <div class="avatar" style="background-color:${contact.color}">
                ${contact.initials}
              </div>
  `;
}

async function postState() {
  try {
    const response = await fetch(BASE_URL + ".json", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(fetchData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("update erfolgreich:", responseData);
    return responseData;
  } catch (error) {
    console.error("ehler beim update:", error);
  }
}

function bindDragEvents(card) {
  e.dataTransfer.setData("text", id);
  e.dataTransfer.effectAllowed = "move";

}

function onDragStart(e) {
  const card = e.currentTarget;
  const id = card.getAttribute('data-id');
  e.dataTransfer.setData('text/plain', id);
  card.classList.add('dragging');
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}

function onDragOver(e) {
  e.preventDefault();
}

function onDragEnter(e) {
  e.currentTarget.classList.add('drop-target');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drop-target');
}

async function onDrop(e) {
  e.preventDefault();
  const col = e.currentTarget;
  const newState = col.getAttribute("data-status");
  const cardId = e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = newState;
  }
  col.classList.remove("drop-target");
  renderBoard();
  await postState()
}

function noTasksMessage() {
  const messageElement = document.getElementById('toggleMessage');
  const todoColumn = document.querySelector('.column[data-status="todo"]');
  if (!messageElement || !todoColumn) return;
  const hasTasks = todoColumn.querySelectorAll('.Cards').length > 0;
  if (hasTasks) {
    messageElement.style.display = 'none';
  } else {
    messageElement.style.display = 'block';
  }
}
noTasksMessage();

function searchBar() {
  const inputElement = document.getElementById("searchInput");
  if (!inputElement) return console.error("Suchfeld mit ID 'searchInput' nicht gefunden!");

  const searchInput = inputElement.value.trim().toLowerCase();
  if (searchInput.length >= 3 && fetchData?.tasks) {
    const filteredTasks = Object.values(fetchData.tasks).filter(task =>
      task?.title &&
      typeof task.title === 'string' &&
      task.title.toLowerCase().includes(searchInput)
    );
    console.log("Gefundene Aufgaben:", filteredTasks);
  }
}

