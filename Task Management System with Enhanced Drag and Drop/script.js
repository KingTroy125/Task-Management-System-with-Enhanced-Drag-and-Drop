const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');
const taskInput = document.getElementById('taskInput');
const btnClearCompleted = document.getElementById('btnClearCompleted');

let tasks = [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <div>
                <span class="task-name">${task.name}</span>
                ${task.notes ? `<p class="task-notes">${task.notes}</p>` : ''}
            </div>
            <div class="task-actions">
                <button class="btnToggleComplete" data-index="${index}">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="btnDeleteTask" data-index="${index}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    // Initialize Sortable after rendering tasks
    const sortable = new Sortable(taskList, {
        animation: 150,
        handle: '.task-item',
        ghostClass: 'sortable-ghost',
        onEnd: function (event) {
            // Reorder tasks array based on new list order
            const newIndex = event.newIndex;
            const movedTask = tasks.splice(event.oldIndex, 1)[0];
            tasks.splice(newIndex, 0, movedTask);
            saveTasksToLocalStorage();
        }
    });
}

function addTask(name, notes = '') {
    tasks.push({ name, notes, completed: false });
    renderTasks();
    taskInput.value = '';
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks();
}

addTaskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        addTask(taskName);
    }
});

taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('btnToggleComplete')) {
        const index = event.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
        saveTasksToLocalStorage();
    }
    if (event.target.classList.contains('btnDeleteTask')) {
        const index = event.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
        saveTasksToLocalStorage();
    }
});

btnClearCompleted.addEventListener('click', function() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    saveTasksToLocalStorage();
});

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
});