var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
// array for task objects for localStorage
let tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // checks if element -"formEl" has attribute -"data-type-id"
    var isEdit = formEl.hasAttribute("data-task-id");

    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to-do",
    }
    
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset the form
    formEl.reset();

    // has data attritube so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask( taskNameInput, taskTypeInput, taskId)
    } 
    // no data attribute, so create object as normal and pass to the createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
        };
    createTaskEl(taskDataObj);
    }
}

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    // adds id with value to taskDataObject
    taskDataObj.id = taskIdCounter;
    // push new prop/value to taskDataObj
    tasks.push(taskDataObj);

    saveTasks();

    taskIdCounter++;
}  

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (event.target.matches(".delete-btn")) {

        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesnt match the value of taskId, lets keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(task[i]);

        }
    }
    //reassign task array to be the sane as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
}

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    formEl.setAttribute("data-task-id", taskId);
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    document.querySelector("#save-task").textContent = "Save Task";      
}

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    // loop through tasks array and task object with new content
    for ( var i = 0; i < tasks.lengths; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    // runs save task function to save tasks to localStorage
    saveTasks()
    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var taskStatusChangeHandler = function(event) {
    // get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    // get the current selected option's value and covert to lowercase
    var statusValue = event.target.value.toLowerCase();
    
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // checks value of event.target and checks status value
    if (statusValue === "to do") {
        taskToDoEl.appendChild(taskSelected);
    } 
    // if changed to "in-progress", move selected task to In Progress <ul> container 
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    // if value = complete, move task to Completed <ul> container
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

// function to save to localStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    //Gets task items from localStorage.
    tasks = localStorage.getItem("tasks");
    console.log(tasks);
    //Converts tasks from the string format back into an array of objects.
    tasks = JSON.parse(tasks);
    console.log(tasks);
    //Iterates through a tasks array and creates task elements on the page from it.
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;
        // create li 
        let listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        // create <div> taskInfoEl
        let taskInfoEl = document.createElement("div");
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class ='task-type'>" + tasks[i].type + "</span>";
        // append taskinfoel to listItemEL
        listItemEl.appendChild(taskInfoEl);

        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            taskToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name'status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl)
        }
        
        taskIdCounter++;
        console.log(listItemEl);
    
    }
}
loadTasks();
formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);