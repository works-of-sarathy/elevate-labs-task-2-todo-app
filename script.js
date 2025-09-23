// Get DOM elements
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filterBtn');
const themeToggle = document.getElementById('themeToggle');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Utilities
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return !task.completed;
        return task.completed;
    });
    filteredTasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-idx="${idx}" class="complete-chk" />
                <span class="task-text">${escapeHtml(task.text)}</span>
                <span class="badge badge-priority badge-${task.priority}">${capitalize(task.priority)}</span>
                <span class="due-date">${task.dueDate ? 'Due: ' + task.dueDate : ''}</span>
            </div>
            <div class="task-controls">
                <button class="edit-btn" data-idx="${idx}">Edit</button>
                <button class="remove-btn" data-idx="${idx}">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}
// Escape HTML function for safe output
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Add new task
function addTask() {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (!text) return;
    tasks.push({
        text, dueDate, priority,
        completed: false
    });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    dueDateInput.value = '';
}
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
// Task interaction: complete, edit, remove
taskList.addEventListener('click', e => {
    const idx = e.target.dataset.idx;
    if (e.target.classList.contains('complete-chk')) {
        tasks[idx].completed = e.target.checked;
        saveTasks();
        renderTasks();
    }
    if (e.target.classList.contains('remove-btn')) {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
    }
    if (e.target.classList.contains('edit-btn')) {
        editTask(idx);
    }
});
function editTask(idx) {
    const li = taskList.children[idx];
    const task = tasks[idx];
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}
// Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});
// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // Optionally, save preference here
});
// Bulk clear
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});
// Initial render
document.addEventListener('DOMContentLoaded', renderTasks);
