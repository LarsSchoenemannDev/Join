/**
 * global variables
 */

const toDoNumber = document.getElementById("toDoNumbers");
const doneNumber = document.getElementById("doneNumbers");
const urgentNumber = document.getElementById("urgentNumbers");
const dueDate = document.getElementById("dueDate");
const totalTasksNumber = document.getElementById("totalTasksNumbers");
const inProgressNumber = document.getElementById("inProgressNumber");
const awaitingFeedbackNumber = document.getElementById(
  "awaitingFeedbackNumber",
);

/**
 * functions to load task data from Firebase and provide utility functions for summary page.
 */

const tasks_URL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let tasksFetchedData = {};

// ========================================
async function initializeTasks() {
  await getTasksArray();
  urgentNumberCountWithDueDate();
  buildSummaryItemNumbers1();
  buildSummaryItemNumbers2();
}

// ========================================

async function loadTaskDataFromFirebase() {
  try {
    const response = await fetch(tasks_URL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseToJson = await response.json();

    if (responseToJson && typeof responseToJson === "object") {
      tasksFetchedData = {};
      for (const [id, tasksState] of Object.entries(responseToJson)) {
        tasksFetchedData[id] = { id, ...tasksState };
      }
    } else {
      tasksFetchedData = {};
    }

    console.log("Loaded tasks from Firebase:", tasksFetchedData);
    return tasksFetchedData;
  } catch (error) {
    console.error("Error loading database:", error);
    tasksFetchedData = {};
    return {};
  }
}

async function getTasksArray() {
  await loadTaskDataFromFirebase();
  if (!tasksFetchedData || !Object.keys(tasksFetchedData).length) {
    return [];
  }
  const tasks = [];
  Object.entries(tasksFetchedData).forEach(([id, data]) => {
    if (data.state) {
      tasks.push({ id, ...data });
    }
  });
  console.log("tasks Array:", tasks);
  return tasks;
}

function buildSummaryItemNumbers1() {
  let toDoCount = 0;
  let doneCount = 0;

  Object.values(tasksFetchedData).forEach((task) => {
    if (task.state === "toDo") {
      toDoCount++;
    } else if (task.state === "done") {
      doneCount++;
    }
  });

  toDoNumber.textContent = toDoCount;
  doneNumber.textContent = doneCount;
}

function buildSummaryItemNumbers2() {
  let totalTasksCount = 0;
  let inProgressCount = 0;
  let awaitingFeedbackCount = 0;

  Object.values(tasksFetchedData).forEach((task) => {
    if (task.state === "inProgress") {
      inProgressCount++;
    } else if (task.state === "feedBack") {
      awaitingFeedbackCount++;
    }
  });

  totalTasksCount = Object.keys(tasksFetchedData).length;
  totalTasksNumber.textContent = totalTasksCount;
  inProgressNumber.textContent = inProgressCount;
  awaitingFeedbackNumber.textContent = awaitingFeedbackCount;
}

function urgentNumberCountWithDueDate() {
  let urgentCount = 0;
  let dueDates = [];
  Object.values(tasksFetchedData).forEach((task) => {
    if (task.priority === "urgent") {
      urgentCount++;
      if (task.duedate) dueDates.push(task.duedate);
    }
  });
  urgentNumber.textContent = urgentCount;
  // Set the earliest due date if there are any
  if (dueDates.length > 0) {
    dueDates.sort();
    dueDate.textContent = dueDates[0];
  } else {
    dueDate.textContent = "";
  }
}

/**
 * Function to greet signed Users or guests with welcome animation
 */

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

/**
 * Function to make overview boxes clickable and redirect to board.html
 */

const boxItems = document.querySelectorAll(".overview-box-items");
boxItems.forEach((box) => {
  box.addEventListener("click", () => {
    window.location.href = "../html/board.html";
  });
});
