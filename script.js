/* script.js */
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

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Find the original index of a task before filtering
    function findTaskIndex(taskToFind) {
      return tasks.findIndex(task => 
        task.text === taskToFind.text && 
        task.dueDate === taskToFind.dueDate && 
        task.priority === taskToFind.priority &&
        task.completed === taskToFind.completed
      );
    }

    function renderTasks() {
      taskList.innerHTML = '';
      let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
      });
      
      filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        const originalIndex = findTaskIndex(task);

        li.innerHTML = `
          <div class="task-info">
            <strong>${task.text}</strong>
            <div class="task-meta">
              Due: ${task.dueDate || 'No date'} | Priority: ${task.priority || 'None'}
            </div>
          </div>
          <div class="task-actions">
            <input type="checkbox" aria-label="Mark task as completed" ${task.completed ? 'checked' : ''} data-index="${originalIndex}" />
            <button aria-label="Delete task" class="deleteBtn" data-index="${originalIndex}">✖</button>
          </div>
        `;
        
        taskList.appendChild(li);
      });
    }
    
    taskList.addEventListener('click', (e) => {
        // Handle checkbox change
        if (e.target.type === 'checkbox') {
            const index = e.target.dataset.index;
            if (index !== -1) {
                tasks[index].completed = e.target.checked;
                saveTasks();
                renderTasks();
            }
        }
        
        // Handle delete button click
        if (e.target.classList.contains('deleteBtn')) {
            const index = e.target.dataset.index;
             if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        }
    });

    addBtn.addEventListener('click', () => {
      if (taskInput.value.trim() === '') {
        // In a real app, you'd show a prettier message, not an alert.
        // For this environment, we avoid alerts. Let's just return.
        console.error('Task description cannot be empty.');
        return;
      }
      tasks.push({
        text: taskInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false
      });
      taskInput.value = '';
      dueDateInput.value = '';
      priorityInput.value = '';
      saveTasks();
      renderTasks();
    });

    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevents form submission if it were in a form
        addBtn.click();
      }
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
      });
    });

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.removeItem('theme');
      }
    });

    clearCompletedBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed);
      saveTasks();
      renderTasks();
    });

    function loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark');
      }
    }

    // Initial load
    document.addEventListener('DOMContentLoaded', () => {
        loadTheme();
        renderTasks();
    });