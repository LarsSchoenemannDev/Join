// const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";

// let fetchBoardData = {};


async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
  // filterBoardTask()
  // await stateAdd();
  // await postState()
  // await taskDataBoard()
  // stateAdd()
  // console.log(fetchBoardData)
}



// Abfrage ob daten da wenn nicht return
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
  let tasksArr = Object.values(fetchData.tasks);
  let result = [];
  for (const task of tasksArr) {
    if (task.state === state) result.push(task)
  }
  return result
}

function renderBoard() {
  let todo = taskByState("todu");
  let inProgress = taskByState("inProgress");
  let feedBack = taskByState("feedBack");
  let done = taskByState("done");

  console.log("to du", todo.length);
  console.log("inProgress", inProgress.length);
  console.log("feedBack", feedBack.length);
  console.log("done", done.length);
  renderDropSection("toduContainer", todo)
  renderDropSection("inProgressContainer", inProgress)
  renderDropSection("feedBackContainer", feedBack)
  renderDropSection("doneContainer", done)
}

function renderDropSection(contentId, tasks) {
  let contentRef = document.getElementById("contentId");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    contentRef.innerHTML += renderTasksHTML(task)
  }
}

function getEnties() {
  if (!fetchData) return;
  return Object.entries(fetchData.tasks);
}



// wenn keins tasks statse haben setzten auf to du #
// über eine for die tasks sortiern nach category #
// dann rendern 

// function für status update auf der api seite


// drag and drop 
// index  html daten push 
// data-status="in-progress"
// data-id="c1" draggable="true"

// drag and drop state changen auf der api seite 


function renderTasksHTML(task) {
  console.dir(task);

  return ` <section class="in-progress" data-status="in-progress">
                <h3 class="header-category">In progress <img src="..//assets/img/add board.svg"
                    alt="plus symbol"></h3>
                <div id="toDo-box"></div>
                <div class="Cards blue" data-id="c1" draggable="true">
                  <span class="tag">User Story</span>
                  <h4>${task.title}</h4>
                  <span>${task.description}</span>
                  <div class="progress">${task.subtasks.length}</div>
                  <div class="avatars">
                    <div class="avatar" style="background:${task.contacts?.[0].color}">${task.contacts?.[0]?.initials}</div>
                    <div class="avatar green">EN</div>
                    <div class="avatar purple">ME</div>
                    <div class="menu-button"> =</div>
                  </div>
                </div>
              </section>`;
}
// async function postState() {
//   try {
//     const response = await fetch(BASE_URL + ".json", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json", },
//       body: JSON.stringify(fetchData),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const responseData = await response.json();
//     renderBoardCategory(responseData);
//     console.log("update erfolgreich:", responseData);
//     return responseData;
//   } catch (error) {
//     console.error("ehler beim update:", error);
//   }
// }






// function bindDragEvents(card) {
//   card.addEventListener('dragstart', onDragStart);
//   card.addEventListener('dragend', onDragEnd);
// }

// function onDragStart(e) {
//   const card = e.currentTarget;
//   const id = card.getAttribute('data-id');
//   e.dataTransfer.setData('text/plain', id);
//   card.classList.add('dragging');
// }

// function onDragEnd(e) {
//   e.currentTarget.classList.remove('dragging');
// }

// function onDragOver(e) {
//   e.preventDefault();
// }

// function onDragEnter(e) {
//   e.currentTarget.classList.add('drop-target');
// }

// function onDragLeave(e) {
//   e.currentTarget.classList.remove('drop-target');
// }

// function onDrop(e) {
//   e.preventDefault();
//   const col = e.currentTarget;
//   const cardId = e.dataTransfer.getData('text/plain');
//   const card = document.querySelector(`[data-id="${cardId}"]`);
//   if (card && col) {
//     col.appendChild(card);
//   }
//   col.classList.remove('drop-target');
//   noTasksMessage();
// }


// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.Cards').forEach(card => {
//     bindDragEvents(card);
//   });
//   document.querySelectorAll('.column[data-status]').forEach(col => {
//     col.addEventListener('dragover', onDragOver);
//     col.addEventListener('dragenter', onDragEnter);
//     col.addEventListener('dragleave', onDragLeave);
//     col.addEventListener('drop', onDrop);
//   });
// });


// function noTasksMessage() {
//   const messageElement = document.getElementById('toggleMessage');
//   const todoColumn = document.querySelector('.column[data-status="todo"]');
//   if (!messageElement || !todoColumn) return;
//   const hasTasks = todoColumn.querySelectorAll('.Cards').length > 0;
//   if (hasTasks) {
//     messageElement.style.display = 'none';
//   } else {
//     messageElement.style.display = 'block';
//   }
// }
// noTasksMessage();



