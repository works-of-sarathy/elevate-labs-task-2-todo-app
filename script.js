// Select elements
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add new task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText, false);
  saveTask(taskText, false);

  taskInput.value = "";
}

// Create Task Element
function createTaskElement(taskText, completed) {
  const li = document.createElement("li");
  li.textContent = taskText;

  if (completed) li.classList.add("completed");

  // Toggle complete
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskStatus(taskText, li.classList.contains("completed"));
  });

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "X";
  removeBtn.classList.add("remove-btn");
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent toggle
    li.remove();
    removeTask(taskText);
  });

  li.appendChild(removeBtn);
  taskList.appendChild(li);
}

// Save task to localStorage
function saveTask(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.completed));
}

// Update task status in localStorage
function updateTaskStatus(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === taskText ? { ...task, completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
