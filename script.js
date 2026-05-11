// ============================================
// 🚀 TASKFLOW PRO X — ULTRA MODERN APP LOGIC
// ============================================


// ============================================
// 📦 DOM ELEMENTS
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
// 💾 LOCAL STORAGE
// ============================================

const STORAGE_KEY =
  'taskflow_ultra_tasks';

let tasks =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];

let currentFilter = 'all';

let currentSearch = '';

let currentSort = 'newest';


// ============================================
// 💾 SAVE TASKS
// ============================================

function saveTasks() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );
}


// ============================================
// 🔔 TOAST SYSTEM
// ============================================

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(window.toastTimeout);

  window.toastTimeout =
    setTimeout(() => {

      toast.classList.remove('show');

    }, 2600);
}


// ============================================
// 🏷️ CATEGORY EMOJI
// ============================================

function getCategoryEmoji(category) {

  switch (category) {

    case 'Study':
      return '📚';

    case 'Work':
      return '💼';

    case 'Health':
      return '💪';

    case 'Shopping':
      return '🛒';

    default:
      return '🏠';
  }
}


// ============================================
// 🚨 PRIORITY CLASS
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
// 💬 MOTIVATION MESSAGES
// ============================================

const motivationMessages = [

  '🚀 Stay focused and productive!',

  '🔥 Keep building momentum!',

  '⚡ Small progress is still progress!',

  '🏆 You are doing amazing today!',

  '💎 Discipline creates success!',

  '🌟 Finish strong today!'
];


// ============================================
// 📅 FORMAT DATE
// ============================================

function formatDate(date) {

  if (!date) return '';

  const options = {

    month: 'short',

    day: 'numeric',

    year: 'numeric'
  };

  return new Date(date)
    .toLocaleDateString(
      'en-US',
      options
    );
}


// ============================================
// ➕ ADD TASK
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

  // ❌ VALIDATION

  if (!text) {

    errorMsg.textContent =
      '⚠️ Please enter a task';

    taskInput.focus();

    return;
  }

  errorMsg.textContent = '';

  // 🆕 TASK OBJECT

  const newTask = {

    id: Date.now(),

    text,

    dueDate,

    category,

    priority,

    completed: false,

    createdAt:
      new Date().toISOString()
  };

  // ➕ ADD NEW TASK

  tasks.unshift(newTask);

  saveTasks();

  renderTasks();

  updateUI();

  resetInputs();

  showToast(
    '✅ Task added'
  );
}


// ============================================
// 🧹 RESET INPUTS
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
// 🗑️ DELETE TASK
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
    '🗑️ Task deleted'
  );
}


// ============================================
// ✅ TOGGLE COMPLETE
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

  showToast(
    task.completed
      ? '🎉 Task completed!'
      : '↩️ Task marked pending'
  );
}


// ============================================
// ✏️ EDIT TASK
// ============================================

function editTask(id) {

  const task =
    tasks.find(
      task => task.id === id
    );

  if (!task) return;

  const newText =
    prompt(
      '✏️ Edit task',
      task.text
    );

  if (
    newText === null ||
    newText.trim() === ''
  ) {
    return;
  }

  task.text =
    newText.trim();

  saveTasks();

  renderTasks();

  showToast(
    '✏️ Task updated'
  );
}


// ============================================
// 📊 COUNTERS
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

  if (taskCountLabel) {

    taskCountLabel.textContent =
      `${total} Tasks`;
  }
}


// ============================================
// 📈 PROGRESS BAR
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
          (
            completed / total
          ) * 100
        );

  progressFill.style.width =
    `${percent}%`;

  progressText.textContent =
    `${percent}%`;
}


// ============================================
// 🔥 STREAK
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
// 💬 MOTIVATION
// ============================================

function updateMotivation() {

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  if (completed === 0) {

    motivationBox.textContent =
      '🚀 Start your productive day!';

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
// ⏰ LIVE CLOCK
// ============================================

function updateClock() {

  const now =
    new Date();

  liveClock.textContent =
    now.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
}

setInterval(
  updateClock,
  1000
);


// ============================================
// 🔍 FILTER + SEARCH + SORT
// ============================================

function getFilteredTasks() {

  let filtered =
    [...tasks];

  // 🔍 SEARCH

  filtered =
    filtered.filter(task =>
      task.text
        .toLowerCase()
        .includes(
          currentSearch
            .toLowerCase()
        )
    );

  // 🔽 FILTER

  if (
    currentFilter ===
    'completed'
  ) {

    filtered =
      filtered.filter(
        task => task.completed
      );

  } else if (
    currentFilter ===
    'pending'
  ) {

    filtered =
      filtered.filter(
        task => !task.completed
      );
  }

  // ↕️ SORT

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
          priorityOrder[
            a.priority
          ] -
          priorityOrder[
            b.priority
          ]
      );

      break;

    case 'alphabetical':

      filtered.sort(
        (a, b) =>
          a.text.localeCompare(
            b.text
          )
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
// 🖨️ RENDER TASKS
// ============================================

function renderTasks() {

  taskList.innerHTML = '';

  const filteredTasks =
    getFilteredTasks();

  // 📭 EMPTY STATE

  if (
    filteredTasks.length === 0
  ) {

    taskList.innerHTML = `

      <li class="empty-state">

        <div class="empty-icon">
          📝
        </div>

        <h3>
          No tasks found
        </h3>

        <p>
          Add tasks and start being productive.
        </p>

      </li>

    `;

    return;
  }

  // 📋 LOOP TASKS

  filteredTasks.forEach(task => {

    const li =
      document.createElement('li');

    li.className = `
      task-item
      ${
        task.completed
          ? 'completed'
          : ''
      }
    `;

    // 📅 OVERDUE CHECK

    const isOverdue =

      task.dueDate &&

      task.dueDate <

      new Date()
        .toISOString()
        .split('T')[0] &&

      !task.completed;

    li.innerHTML = `

      <!-- ✅ CHECKBOX -->

      <label class="checkbox-wrapper">

        <input
          type="checkbox"
          class="task-checkbox"
          ${
            task.completed
              ? 'checked'
              : ''
          }
        >

        <span class="custom-checkbox"></span>

      </label>


      <!-- 📝 CONTENT -->

      <div class="task-content">

        <div class="task-top-row">

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

          <span class="task-category">

            ${getCategoryEmoji(task.category)}
            ${task.category}

          </span>

          ${
            task.dueDate
              ? `
                <span class="
                  task-due-date
                  ${
                    isOverdue
                      ? 'overdue'
                      : ''
                  }
                ">

                  📅 ${formatDate(task.dueDate)}

                </span>
              `
              : ''
          }

        </div>

      </div>


      <!-- ⚙️ ACTIONS -->

      <div class="task-actions">

        <button
          class="edit-btn"
          title="Edit"
        >
          ✏️
        </button>

        <button
          class="delete-btn"
          title="Delete"
        >
          🗑️
        </button>

      </div>
    `;

    // ✅ COMPLETE

    li.querySelector(
      '.task-checkbox'
    ).addEventListener(
      'change',
      () =>
        toggleComplete(
          task.id
        )
    );

    // ✏️ EDIT

    li.querySelector(
      '.edit-btn'
    ).addEventListener(
      'click',
      () =>
        editTask(
          task.id
        )
    );

    // 🗑️ DELETE

    li.querySelector(
      '.delete-btn'
    ).addEventListener(
      'click',
      () =>
        deleteTask(
          task.id
        )
    );

    taskList.appendChild(li);
  });
}


// ============================================
// 🔄 UPDATE UI
// ============================================

function updateUI() {

  updateCounters();

  updateProgress();

  updateStreak();

  updateMotivation();
}


// ============================================
// 🔍 SEARCH
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
// 🔽 FILTER BUTTONS
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
// ↕️ SORT SELECT
// ============================================

if (sortSelect) {

  sortSelect.addEventListener(
    'change',
    e => {

      currentSort =
        e.target.value;

      renderTasks();
    }
  );
}


// ============================================
// 🗑️ CLEAR ALL
// ============================================

clearAllBtn.addEventListener(
  'click',
  () => {

    const confirmed =
      confirm(
        'Delete all tasks?'
      );

    if (!confirmed) return;

    tasks = [];

    saveTasks();

    renderTasks();

    updateUI();

    showToast(
      '🗑️ All tasks cleared'
    );
  }
);


// ============================================
// 📤 EXPORT TASKS
// ============================================

if (exportBtn) {

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
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement('a');

      a.href = url;

      a.download =
        'taskflow-tasks.json';

      a.click();

      URL.revokeObjectURL(
        url
      );

      showToast(
        '📤 Tasks exported'
      );
    }
  );
}


// ============================================
// ⌨️ ENTER KEY
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
// ➕ ADD BUTTON
// ============================================

addTaskBtn.addEventListener(
  'click',
  addTask
);


// ============================================
// 🚀 INITIALIZE APP
// ============================================

renderTasks();

updateUI();

updateClock();