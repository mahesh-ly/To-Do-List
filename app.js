const container = document.querySelector(".container");

const headingContainer = document.createElement("div");
headingContainer.classList.add("heading-container");

const heading = document.createElement("h1");
heading.innerText = "To-Do List";

headingContainer.appendChild(heading);
container.appendChild(headingContainer);

/* Search bar*/
const searchBar = document.createElement("input");
searchBar.placeholder = "Search Task";
headingContainer.appendChild(searchBar);

let totalTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
searchBar.addEventListener("keyup", ()=>{
    const textToCompare = searchBar.value.toLowerCase();

    const taskFound = totalTasks.filter(task=>{
        return (task.Description.toLowerCase().indexOf(textToCompare) > -1)
    });
    
    const taskContainer = document.querySelector(".task-container");
    taskContainer.innerHTML = "";
    loadTodos(taskFound, taskContainer);
});

//Container for the Add new Task
const addNewTaskForm = document.createElement("form");
addNewTaskForm.classList.add("add-new-task");

container.appendChild(addNewTaskForm);

//Input field for Task Description
const inputForTask = document.createElement("input");
inputForTask.type = "text";
inputForTask.name = "description";
inputForTask.placeholder = "Add your task here";
inputForTask.required = true;
addNewTaskForm.appendChild(inputForTask);

//Input field for Task due date here i used variable name date instead of dueDate.
const date = document.createElement("input");
date.type = "date";
inputForTask.name = "date";
date.required = true;
addNewTaskForm.appendChild(date);

//Input field for Task due time here i used time as variable name instead of dueTime.
const time = document.createElement("input");
time.required = true;
time.type = "time";
inputForTask.name = "time";
addNewTaskForm.appendChild(time);

//Add Task Button to Add the Todo.
const addTaskBtn = document.createElement("button");
addTaskBtn.innerText = "Add Task";
addTaskBtn.type = "submit";

addNewTaskForm.appendChild(addTaskBtn);

//Add new Todo
addNewTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = addNewTaskForm.children;
  const description = formData[0].value;
  const date = formData[1].value;
  const time = formData[2].value;
  const allTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
  let id = allTasks.length == 0 ? 0 : allTasks[allTasks.length - 1].Id + 1;
  const newTask = {
    Id: id,
    Description: description,
    Date: date,
    Time: time,
  };

  allTasks.push(newTask);

  localStorage.setItem("Tasks", JSON.stringify(allTasks));
  addNewTaskForm.reset();
  loadPage();
});

const taskContainer = document.createElement("div");
taskContainer.classList.add("task-container");
container.appendChild(taskContainer);

//Function for deleting the Todo, using id which i assigned to each task.
const deleteTask = (IdToDelete) => {
  let allTasks = JSON.parse(localStorage.getItem("Tasks"));
  allTasks = allTasks.filter((task) => task.Id !== IdToDelete);
  localStorage.setItem("Tasks", JSON.stringify(allTasks));
  loadPage();
};

//Edit the Todo.
const editTask = (IdToEdit) => {
  console.log(IdToEdit);
  let allTasks = JSON.parse(localStorage.getItem("Tasks"));
  let Task = allTasks.find((task) => task.Id === IdToEdit);
  allTasks = allTasks.filter((task) => task.Id !== IdToEdit);

  const editTaskWindow = document.createElement("div");
  editTaskWindow.classList.add("edit-task-window");
  taskContainer.appendChild(editTaskWindow);

  const inputForTask = document.createElement("input");
  inputForTask.type = "text";
  inputForTask.name = "description";
  inputForTask.placeholder = "Add your task here";
  inputForTask.required = true;
  inputForTask.value = Task.Description;
  editTaskWindow.appendChild(inputForTask);

  const updateBtn = document.createElement("button");
  updateBtn.innerText = "Update";
  updateBtn.type = "submit"
  editTaskWindow.appendChild(updateBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.innerText = "Cancel";
  cancelBtn.type = "cancel";
  editTaskWindow.appendChild(cancelBtn);

  updateBtn.addEventListener("click", ()=>{
    if(inputForTask.value  !== Task.Description.length){
        Task.Description = inputForTask.value;
        allTasks.push(Task);
        localStorage.setItem("Tasks", JSON.stringify(allTasks));
    }
    loadPage();
  });

  cancelBtn.addEventListener("click", ()=>{
    editTaskWindow.style.display = "none"
    loadPage();
  });
};

//Function for Rendering The Tasks
const renderTasks = (allTasks, TasksContainer) => {
  allTasks.forEach((task) => {
    const Description = task.Description;
    const Time = task.Time;
    const timeArray = Time.split(":");
    let TimeString =
      String(Number(timeArray[0]) % 12 === 0 ? 12 : Number(timeArray[0]) % 12) +
      ":" +
      timeArray[1];

    if (Number(timeArray[0]) < 12) {
      TimeString = TimeString + " AM";
    } else {
      TimeString = TimeString + " PM";
    }

    const todo = document.createElement("div");
    todo.classList.add("todo");
    TasksContainer.appendChild(todo);

    const timeAndDescriptionContainer = document.createElement("div");
    timeAndDescriptionContainer.classList.add("time-description-container");

    todo.appendChild(timeAndDescriptionContainer);

    const todoDescription = document.createElement("p");
    todoDescription.classList.add("todo-description");
    todoDescription.innerHTML = `${Description} at <span style='font-weight:bold'>${TimeString}</span>`;
    timeAndDescriptionContainer.appendChild(todoDescription);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add('edit-delete-container')
    const editToDo = document.createElement("button");
    editToDo.innerText = "Edit";
    buttonsContainer.appendChild(editToDo);

    const deleteToDo = document.createElement("button");
    deleteToDo.innerText = "Delete";
    buttonsContainer.appendChild(deleteToDo);

    //To Delete Task
    deleteToDo.addEventListener("click", () => deleteTask(task.Id));

    //To Edit Task
    editToDo.addEventListener("click", () => editTask(task.Id));

    todo.appendChild(buttonsContainer);
  });
};

//Function for Sorting Todo's based on Dates, in this function i was created objects with dates as key and todos of that date as value;
const SortByDate = (allTasks, TasksContainer) => {
  const tasksByDates = {};

  allTasks.forEach((task) => {
    if (Object.keys(tasksByDates).includes(task.Date)) {
      tasksByDates[task.Date].push(task);
    } else {
      tasksByDates[task.Date] = [task];
    }
  });

  for (let date in tasksByDates) {
    const dateContainer = document.createElement("div");
    dateContainer.classList.add("date-container");
    TasksContainer.appendChild(dateContainer);

    const dateHeading = document.createElement("h3");
    dateHeading.innerText = date;
    dateContainer.appendChild(dateHeading);
    renderTasks(tasksByDates[date], dateContainer);
  }
};

const loadTodos = (allTasks, taskContainer) => {
    if (allTasks.length === 0) {
        const emptyContainer = document.createElement("h1");
        emptyContainer.classList.add("empty-container");
        emptyContainer.innerText = "No Tasks";
        taskContainer.appendChild(emptyContainer);
      } else {
        const DueTasks = [],
          TodaysTasks = [],
          upComingTasks = [];
    
        const date = new Date();
        const Today = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
    
        allTasks.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
        allTasks.forEach((task) => {
          if (task.Date === Today) {
            TodaysTasks.push(task);
          } else if (task.Date > Today) {
            upComingTasks.push(task);
          } else {
            DueTasks.push(task);
          }
        });
    
        if (DueTasks.length > 0) {
          const dueTasksContainer = document.createElement("div");
          dueTasksContainer.classList.add("due-tasks");
    
          taskContainer.appendChild(dueTasksContainer);
          const heading = document.createElement("h2");
          heading.innerText = "Due Tasks";
    
          dueTasksContainer.appendChild(heading);
          SortByDate(DueTasks, dueTasksContainer);
        }
    
        if (TodaysTasks.length > 0) {
          const todaysTasksContainer = document.createElement("div");
          todaysTasksContainer.classList.add("todays-tasks");
    
          taskContainer.appendChild(todaysTasksContainer);
          const heading = document.createElement("h2");
          heading.innerText = "Today";
    
          todaysTasksContainer.appendChild(heading);
          renderTasks(TodaysTasks, todaysTasksContainer);
        }
    
        if (upComingTasks.length > 0) {
          const todaysTasksContainer = document.createElement("div");
          todaysTasksContainer.classList.add("upcoming-tasks");
          taskContainer.appendChild(todaysTasksContainer);
          const heading = document.createElement("h2");
          heading.innerText = "Upcoming Tasks";
          todaysTasksContainer.appendChild(heading);
          SortByDate(upComingTasks, todaysTasksContainer);
        }
      }
}
//This Function will called on loading the page, after the header is created, its simply load the todos.
const loadPage = () => {
  taskContainer.innerHTML = "";
  const allTasks = JSON.parse(localStorage.getItem("Tasks")) || [];

  loadTodos(allTasks, taskContainer);
};

loadPage();
