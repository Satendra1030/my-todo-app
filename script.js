// ============================================
// TASKFLOW — PREMIUM BLACK EDITION
// ============================================


// ============================================
// DOM ELEMENTS
// ============================================

const taskInput =
  document.getElementById('taskInput');

const dueDateInput =
  document.getElementById('dueDateInput');

const categoryInput =
  document.getElementById('categoryInput');

const priorityInput =
  document.getElementById('priorityInput');

const addTaskBtn =
  document.getElementById('addTaskBtn');

const taskList =
  document.getElementById('taskList');

const errorMsg =
  document.getElementById('errorMsg');

const totalCount =
  document.getElementById('totalCount');

const completedCount =
  document.getElementById('completedCount');

const pendingCount =
  document.getElementById('pendingCount');

const filterBtns =
  document.querySelectorAll('.filter-btn');

const searchInput =
  document.getElementById('searchInput');

const progressFill =
  document.getElementById('progressFill');

const progressText =
  document.getElementById('progressText');

const progressPercent =
  document.getElementById('progressPercent');

const streakCount =
  document.getElementById('streakCount');

const motivationBox =
  document.getElementById('motivationBox');

const liveClock =
  document.getElementById('liveClock');

const clearAllBtn =
  document.getElementById('clearAllBtn');

const exportBtn =
  document.getElementById('exportBtn');

const sortSelect =
  document.getElementById('sortSelect');

const taskCountLabel =
  document.getElementById('taskCountLabel');

const toast =
  document.getElementById('toast');


// ============================================
// STORAGE
// ============================================

let tasks =
  JSON.parse(
    localStorage.getItem(
      'taskflow_v2_tasks'
    )
  ) || [];

let currentFilter = 'all';

let currentSearch = '';

let currentSort = 'newest';


// ============================================
// MOTIVATION
// ============================================

const motivationMessages = [

  'Stay focused and productive.',

  'Consistency creates results.',

  'Small progress still matters.',

  'Make today count.',

  'Keep moving forward.',

  'One task at a time.',

  'Discipline builds success.',

  'Finish what you started.'
];


// ============================================
// SAVE TASKS
// ============================================

function saveTasks() {

  localStorage.setItem(

    'taskflow_v2_tasks',

    JSON.stringify(tasks)
  );
}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(str) {

  return str.replace(

    /[&<>"']/g,

    tag => ({

      '&': '&amp;',

      '<': '&lt;',

      '>': '&gt;',

      '"': '&quot;',

      "'": '&#039;'

    }[tag])
  );
}


// ============================================
// TOAST
// ============================================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(window.toastTimeout);

  window.toastTimeout =

    setTimeout(() => {

      toast.classList.remove('show');

    }, 2500);
}


// ============================================
// PRIORITY CLASS
// ============================================

function getPriorityClass(priority) {

  switch (priority) {

    case 'High':
      return 'priority-high';

    case 'Medium':
      return 'priority-medium';

    default:
      return 'priority-low';
  }
}


// ============================================
// ADD TASK
// ============================================

function addTask() {

  const text =
    taskInput.value.trim();

  const dueDate =
    dueDateInput.value;

  const category =
    categoryInput.value;

  const priority =
    priorityInput.value;

  if (!text) {

    errorMsg.textContent =
      'Please enter a task';

    taskInput.focus();

    return;
  }

  errorMsg.textContent = '';

  const newTask = {

    id: Date.now(),

    text: escapeHTML(text),

    dueDate,

    category,

    priority,

    completed: false,

    createdAt:
      new Date().toISOString()
  };

  tasks.unshift(newTask);

  saveTasks();

  renderTasks();

  updateUI();

  resetInputs();

  showToast(
    'Task added successfully'
  );
}


// ============================================
// RESET INPUTS
// ============================================

function resetInputs() {

  taskInput.value = '';

  dueDateInput.value = '';

  categoryInput.value =
    'Personal';

  priorityInput.value =
    'Low';

  taskInput.focus();
}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(id) {

  tasks =
    tasks.filter(
      task => task.id !== id
    );

  saveTasks();

  renderTasks();

  updateUI();

  showToast(
    'Task deleted'
  );
}


// ============================================
// TOGGLE COMPLETE
// ============================================

function toggleComplete(id) {

  const task =
    tasks.find(
      task => task.id === id
    );

  if (!task) return;

  task.completed =
    !task.completed;

  saveTasks();

  renderTasks();

  updateUI();

  if (task.completed) {

    document.body.animate(

      [
        {
          transform: 'scale(1)'
        },

        {
          transform: 'scale(1.01)'
        },

        {
          transform: 'scale(1)'
        }
      ],

      {
        duration: 250
      }
    );
  }

  showToast(

    task.completed

      ? 'Task completed'

      : 'Task marked as pending'
  );
}


// ============================================
// EDIT TASK
// ============================================

function editTask(id) {

  const task =
    tasks.find(
      task => task.id === id
    );

  if (!task) return;

  const newText =
    prompt(
      'Edit Task',
      task.text
    );

  if (
    newText === null ||
    newText.trim() === ''
  ) {
    return;
  }

  task.text =
    escapeHTML(
      newText.trim()
    );

  saveTasks();

  renderTasks();

  showToast(
    'Task updated'
  );
}


// ============================================
// COUNTERS
// ============================================

function updateCounters() {

  const total =
    tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  totalCount.textContent =
    total;

  completedCount.textContent =
    completed;

  pendingCount.textContent =
    pending;

  taskCountLabel.textContent =
    `${total} Tasks`;
}


// ============================================
// PROGRESS
// ============================================

function updateProgress() {

  const total =
    tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const percent =

    total === 0

      ? 0

      : Math.round(
        (completed / total) * 100
      );

  progressFill.style.width =
    `${percent}%`;

  progressText.textContent =
    `${percent}%`;

  progressPercent.textContent =
    `${percent}%`;
}


// ============================================
// STREAK
// ============================================

function updateStreak() {

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  streakCount.textContent =
    `${completed} Done`;
}


// ============================================
// MOTIVATION
// ============================================

function updateMotivation() {

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  if (completed === 0) {

    motivationBox.textContent =
      'Start your productive day.';

    return;
  }

  const randomMessage =

    motivationMessages[
    Math.floor(
      Math.random() *
      motivationMessages.length
    )
    ];

  motivationBox.textContent =
    randomMessage;
}


// ============================================
// LIVE CLOCK
// ============================================

function updateClock() {

  const now = new Date();

  liveClock.textContent =

    now.toLocaleTimeString([], {

      hour: '2-digit',

      minute: '2-digit'
    });
}

setInterval(updateClock, 1000);


// ============================================
// FILTER TASKS
// ============================================

function getFilteredTasks() {

  let filtered = [...tasks];

  filtered =

    filtered.filter(task =>

      task.text
        .toLowerCase()
        .includes(
          currentSearch.toLowerCase()
        )
    );

  if (currentFilter === 'completed') {

    filtered =

      filtered.filter(
        task => task.completed
      );

  } else if (
    currentFilter === 'pending'
  ) {

    filtered =

      filtered.filter(
        task => !task.completed
      );
  }

  switch (currentSort) {

    case 'oldest':

      filtered.sort(

        (a, b) =>

          new Date(a.createdAt) -
          new Date(b.createdAt)
      );

      break;

    case 'priority':

      const priorityOrder = {

        High: 1,

        Medium: 2,

        Low: 3
      };

      filtered.sort(

        (a, b) =>

          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );

      break;

    case 'alphabetical':

      filtered.sort(

        (a, b) =>

          a.text.localeCompare(b.text)
      );

      break;

    default:

      filtered.sort(

        (a, b) =>

          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
  }

  return filtered;
}


// ============================================
// RENDER TASKS
// ============================================

function renderTasks() {

  taskList.innerHTML = '';

  const filteredTasks =
    getFilteredTasks();

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `

      <li class="empty-state">

        <div class="empty-icon">

          <i data-lucide="inbox"></i>

        </div>

        <h3>
          No tasks found
        </h3>

        <p>
          Add a task and start being productive.
        </p>

      </li>
    `;

    lucide.createIcons();

    return;
  }

  filteredTasks.forEach(task => {

    const li =
      document.createElement('li');

    li.className = `
      task-item
      ${task.completed ? 'completed' : ''}
    `;

    const isOverdue =

      task.dueDate &&

      task.dueDate <
      new Date()
        .toISOString()
        .split('T')[0] &&

      !task.completed;

    li.innerHTML = `

      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
      >

      <div class="task-content">

        <div class="task-top">

          <span class="task-text">
            ${task.text}
          </span>

          <span class="
            priority-badge
            ${getPriorityClass(task.priority)}
          ">
            ${task.priority}
          </span>

        </div>

        <div class="task-meta">

          <span>
            ${task.category}
          </span>

          ${task.dueDate

        ? `
            <span class="
              task-date
              ${isOverdue ? 'overdue' : ''}
            ">
              ${task.dueDate}
            </span>
          `

        : ''
      }

        </div>

      </div>

      <div class="task-buttons">

        <button
          class="icon-btn edit-btn"
        >

          <i data-lucide="pencil"></i>

        </button>

        <button
          class="icon-btn delete-btn"
        >

          <i data-lucide="trash-2"></i>

        </button>

      </div>
    `;

    li.querySelector(
      '.task-checkbox'
    ).addEventListener(
      'change',
      () => toggleComplete(task.id)
    );

    li.querySelector(
      '.edit-btn'
    ).addEventListener(
      'click',
      () => editTask(task.id)
    );

    li.querySelector(
      '.delete-btn'
    ).addEventListener(
      'click',
      () => deleteTask(task.id)
    );

    taskList.appendChild(li);

    li.animate(

      [
        {
          opacity: 0,
          transform:
            'translateY(10px)'
        },

        {
          opacity: 1,
          transform:
            'translateY(0)'
        }
      ],

      {
        duration: 300,
        easing: 'ease'
      }
    );
  });

  lucide.createIcons();
}


// ============================================
// UPDATE UI
// ============================================

function updateUI() {

  updateCounters();

  updateProgress();

  updateStreak();

  updateMotivation();
}


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
  'input',
  e => {

    currentSearch =
      e.target.value;

    renderTasks();
  }
);


// ============================================
// FILTERS
// ============================================

filterBtns.forEach(btn => {

  btn.addEventListener(
    'click',
    () => {

      filterBtns.forEach(button =>

        button.classList.remove(
          'active'
        )
      );

      btn.classList.add(
        'active'
      );

      currentFilter =
        btn.dataset.filter;

      renderTasks();
    }
  );
});


// ============================================
// SORT
// ============================================

sortSelect.addEventListener(
  'change',
  e => {

    currentSort =
      e.target.value;

    renderTasks();
  }
);


// ============================================
// EXPORT TASKS
// ============================================

exportBtn.addEventListener(
  'click',
  () => {

    const data =

      JSON.stringify(
        tasks,
        null,
        2
      );

    const blob =

      new Blob(
        [data],
        {
          type:
            'application/json'
        }
      );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      'taskflow-tasks.json';

    a.click();

    URL.revokeObjectURL(url);

    showToast(
      'Tasks exported'
    );
  }
);


// ============================================
// CLEAR ALL
// ============================================

clearAllBtn.addEventListener(
  'click',
  () => {

    if (
      !confirm(
        'Delete all tasks?'
      )
    ) {
      return;
    }

    tasks = [];

    saveTasks();

    renderTasks();

    updateUI();

    showToast(
      'All tasks deleted'
    );
  }
);


// ============================================
// ENTER KEY
// ============================================

taskInput.addEventListener(
  'keydown',
  e => {

    if (e.key === 'Enter') {

      addTask();
    }
  }
);


// ============================================
// ADD BUTTON
// ============================================

addTaskBtn.addEventListener(
  'click',
  addTask
);


// ============================================
// AUTO MOTIVATION
// ============================================

setInterval(() => {

  updateMotivation();

}, 8000);


// ============================================
// INITIALIZE APP
// ============================================

window.addEventListener('load', () => {

  renderTasks();

  updateUI();

  updateClock();

  lucide.createIcons();
});