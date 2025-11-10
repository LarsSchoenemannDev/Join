const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let addTaskTemp = []


async function pushAddTask() {
    try {
        const response = await fetch(BASE_URL + ".json");
        if (!response.ok) {
            throw new Error("HTTP error: ${response.status}")
        }
        const json = await response.json();        
        console.log(json);        
    } catch (error) {
        console.log("HTTP error: ${response.status}");
    }
}


pushAddTask()

function addtoTask(){
    const TITLE = document.getElementById("title");
    const DESCRIPTIOIN = document.getElementById("description");
    const DUEDATE = document.getElementById("due-date");
    const PRIORITY = document.getElementById("urgent");
    const ASSIGEND = document.getElementById("assigned");
    const CATEGORY = document.getElementById("category");
    const SUBTASKS = document.getElementById("subtasks");
}