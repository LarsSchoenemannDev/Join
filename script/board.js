
async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
  updateAllEmptyMessages();
  subTasksStateAdd();
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

function renderTaskContact(contacts = []) {
  let html = "";
  contacts.forEach(contact => {
    if (contact.checked) {
      html += renderContactAvatarHTML(contact);
    }
  });
  return html;
}

function filterPriority(priority) {
  let prioArray = Array.isArray(priority) ? priority : [priority];
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

function filterCategory(category) {
  const categoryArray = Array.isArray(category) ? category : [category];
  let categoryState = "";
  categoryArray.forEach(category => {
    if (category === "Technical Task") {
      categoryState = "technical-task";
    } else if (category === "User Story") {
      categoryState = "user-story"
    }
  })
  return categoryState;
}

function renderTasksHTML(task, id) {
  return `<div class="cards" data-id="${id}" draggable="true" ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" onclick="openTaskDetailsOverlay(this)">                 
                  <p class="tag ${filterCategory(task.category)}">${task.category}</p>   
                  <h4>${task.title}</h4>
                  <span>${task.description}</span>
                  <div class="progress">${task.subtasks.length} Subtasks</div>
                  <div class ="nav">
                  <div class="avatars">${renderTaskContact(task.contacts)}</div>
                  <div class="${filterPriority(task.priority)} prio-wrapper"></div>            
                  </div>
                  </div>
                </div>     
  `;
}

function renderContactAvatarHTML(contact) {
  return `<div class="avatar" style="background-color:${contact.color}">
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
    return responseData;
  } catch (error) {
    console.error("Fehler beim update:", error);
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
  updateAllEmptyMessages()

}

function onDragEnter(e) {
  e.currentTarget.classList.add('drop-target');
  updateAllEmptyMessages()
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drop-target');
  updateAllEmptyMessages()
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
  updateAllEmptyMessages()
  await postState()
}

function updateAllEmptyMessages() {
  const columns = document.querySelectorAll(".in-progress[data-status]");
  columns.forEach(column => {
    const cardContainer = column.querySelector(".cardsContainer");
    const emptyMessage = column.querySelector(".empty");
    if (cardContainer && emptyMessage) {
      if (cardContainer.children.length === 0) {
        emptyMessage.classList.remove("emptyDisplay");
      } else {
        emptyMessage.classList.add("emptyDisplay");
      }
    }
  });
}

function searchBar() {
  const inputElement = document.getElementById("searchInput");
  if (!inputElement) return console.error("Suchfeld mit ID 'searchInput' nicht gefunden!");
  const searchInput = inputElement.value.trim().toLowerCase();
  if (searchInput.length >= 3 && fetchData?.tasks) {
    const filteredTasks = Object.values(fetchData.tasks).filter(task =>
      task?.title && typeof task.title === 'string' &&
      task.title.toLowerCase().includes(searchInput)
    );
    console.log("Gefundene Aufgaben:", filteredTasks);
  }
}


function openTaskDetailsOverlay(id) {
  const taskID = id.getAttribute("data-id").trim();
  console.dir(fetchData.tasks[taskID]);
  const task = fetchData.tasks[taskID];
  let wrapper = document.getElementById("taskDetailsOverlay");
  let contentRef = document.getElementById("contentRefTaskCard")
  contentRef.innerHTML = taskPopup(task, taskID)
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden"
}

function closetaskDetailsOverlay() {
  document.getElementById("taskDetailsOverlay").style.display = "none"
  document.body.style.overflow = "auto";
}

function dateStringChange(taskduedate) {
  const [y, m, d] = taskduedate.split("-");
  return `${d}/${m}/${y}`;
}

function capitalizeLetters(taskpriority) {
  return taskpriority[0].toUpperCase() + taskpriority.slice(1);
}

function capitalizeLettersFullName(taskFullName) {
  let html = "";
  taskFullName.forEach(contact => {
    if (contact.checked) {

      html += renderContactAvatarHTML(contact);
    }
  });
  return html;
}

function renderTaskContactDetails(contacts = []) {
  let html = "";
  contacts.forEach(contact => {
    if (contact.checked) {
      html += renderTaskContactDetailsHTML(contact);
    }
  });
  return html;
}

function renderTaskContactDetailsHTML(contact) {
  return `<div class="assignee-item">
          <section class="contact-section">
          <div class="initials-circle" style="background-color: ${(contact.color)}">${(contact.initials)}</div>          
          <p>${(contact.name)}</p>
          </section>
        </div>
  `;
}

function renderTaskSubTaskDetails(taskId) {
  const task = fetchData.tasks[taskId];
  let html = "";
  task.subtasks.forEach((subtask, i) => {
    html += renderTaskSubTaskDetailsHTML(subtask, i, taskId);
  });
  return html;
}

function renderTaskSubTaskDetailsHTML(subtask, i, taskId) {
  const isChecked = subtask.state === "check" ? "checked" : "";
  return ` 
      <div class="subtask-item">
        <input class="checkbox-input-subtask" type="checkbox" id="subtask-${taskId}-${i}" onchange="toggleSubtask('${taskId}', ${i})"${isChecked}>
        <label for="subtask-${taskId}-${i}">${subtask.title}</label>
      </div>
    `;
}

async function toggleSubtask(taskId, subtaskIndex) {
  const subtask = fetchData.tasks[taskId].subtasks[subtaskIndex];
  if (subtask.state === "uncheck") {
    subtask.state = "check";
  } else {
    subtask.state = "uncheck";
  }
  console.log(`Status geändert: ${subtask.title} ist jetzt ${subtask.state}`);
  await postState()
}

async function subTasksStateAdd() {
  if (!fetchData) return;
  Object.values(fetchData.tasks).forEach(task => {
    if (task.subtasks && Array.isArray(task.subtasks)) {
      task.subtasks = task.subtasks.map((subtask, index) => {
        if (typeof subtask === "string") {
          return {
            title: subtask,
            state: "uncheck"
          };
        }
        if (subtask.state === undefined) {
          subtask.state = "uncheck";
        }
        return subtask;
      });
    }
  });
  await postState()
}