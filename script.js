// ============================================
// 🚀 TASKFLOW PRO — ADVANCED JAVASCRIPT
// ============================================


// ============================================
// 📦 ELEMENTS
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

const darkModeBtn =
  document.getElementById('darkModeBtn');

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

const toast =
  document.getElementById('toast');

const sortSelect =
  document.getElementById('sortSelect');

const taskCountLabel =
  document.getElementById('taskCountLabel');


// ============================================
// 💾 STORAGE
// ============================================

let tasks =
  JSON.parse(
    localStorage.getItem('tasks')
  ) || [];

let currentFilter = 'all';

let currentSearch = '';

let currentSort = 'newest';

let isDarkMode =
  localStorage.getItem('darkMode') === 'true';


// ============================================
// 🌙 DARK MODE
// ============================================

if (isDarkMode) {

  document.body.classList.add('dark');

  darkModeBtn.textContent = '☀️';
}

darkModeBtn.addEventListener(
  'click',
  () => {

    isDarkMode = !isDarkMode;

    document.body.classList.toggle(
      'dark'
    );

    darkModeBtn.textContent =
      isDarkMode ? '☀️' : '🌙';

    localStorage.setItem(
      'darkMode',
      isDarkMode
    );
  }
);


// ============================================
// 💾 SAVE TASKS
// ============================================

function saveTasks() {

  localStorage.setItem(
    'tasks',
    JSON.stringify(tasks)
  );
}


// ============================================
// 🔔 TOAST
// ============================================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {

    toast.classList.remove('show');

  }, 2500);
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
// 🚨 PRIORITY COLOR
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

  // ❌ Validation
  if (text === '') {

    errorMsg.textContent =
      '⚠️ Please enter a task!';

    taskInput.focus();

    return;
  }

  errorMsg.textContent = '';

  // 🆕 New Task Object
  const newTask = {

    id: Date.now(),

    text,

    dueDate,

    category,

    priority,

    completed: false,

    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  saveTasks();

  renderTasks();

  updateCounters();

  updateProgress();

  updateMotivation();

  resetInputs();

  showToast(
    '✅ Task added successfully!'
  );
}


// ============================================
// 🧹 RESET INPUTS
// ============================================

function resetInputs() {

  taskInput.value = '';

  dueDateInput.value = '';

  categoryInput.value = 'Personal';

  priorityInput.value = 'Low';

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

  updateCounters();

  updateProgress();

  updateMotivation();

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

  updateCounters();

  updateProgress();

  updateMotivation();

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
      'Edit your task:',
      task.text
    );

  if (
    newText === null ||
    newText.trim() === ''
  ) {
    return;
  }

  task.text = newText.trim();

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

  taskCountLabel.textContent =
    `${total} Tasks`;
}


// ============================================
// 📈 PROGRESS
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
}


// ============================================
// 🏆 MOTIVATION
// ============================================

function updateMotivation() {

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  if (completed === 0) {

    motivationBox.textContent =
      '🚀 Start your productive day!';

  } else if (completed < 3) {

    motivationBox.textContent =
      '🔥 Nice start! Keep going!';

  } else if (completed < 6) {

    motivationBox.textContent =
      '💪 You are crushing today!';

  } else {

    motivationBox.textContent =
      '🏆 Productivity master!';
  }
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
// ⏰ LIVE CLOCK
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

updateClock();


// ============================================
// 🔍 FILTER + SEARCH + SORT
// ============================================

function getFilteredTasks() {

  let filtered = [...tasks];

  // 🔍 Search
  filtered = filtered.filter(task =>
    task.text
      .toLowerCase()
      .includes(
        currentSearch.toLowerCase()
      )
  );

  // 🔽 Filter
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

  // ↕️ Sort
  if (currentSort === 'oldest') {

    filtered.reverse();

  } else if (
    currentSort === 'priority'
  ) {

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

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `

      <li class="empty-state">

        🎉 No tasks found

      </li>

    `;

    return;
  }

  filteredTasks.forEach(task => {

    const li =
      document.createElement('li');

    li.className = `
      task-item
      ${task.completed ? 'completed' : ''}
      ${getPriorityClass(task.priority)}
    `;

    const overdue =
      task.dueDate &&
      task.dueDate <
      new Date()
        .toISOString()
        .split('T')[0] &&
      !task.completed;

    li.innerHTML = `

      <!-- ✅ Checkbox -->
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
      >

      <!-- 📝 Content -->
      <div class="task-content">

        <div class="task-top-row">

          <span class="task-text">

            ${task.text}

          </span>

          <span class="priority-badge">

            ${task.priority}

          </span>

        </div>

        <div class="task-meta">

          <span>

            ${getCategoryEmoji(task.category)}
            ${task.category}

          </span>

          ${
            task.dueDate
            ? `
              <span class="
                due-date
                ${overdue ? 'overdue' : ''}
              ">
                📅 ${task.dueDate}
              </span>
            `
            : ''
          }

        </div>

      </div>

      <!-- ⚙️ Actions -->
      <div class="task-actions">

        <button
          class="edit-btn"
        >
          ✏️
        </button>

        <button
          class="delete-btn"
        >
          🗑️
        </button>

      </div>
    `;

    // ✅ Checkbox
    li.querySelector(
      '.task-checkbox'
    ).addEventListener(
      'change',
      () => toggleComplete(task.id)
    );

    // ✏️ Edit
    li.querySelector(
      '.edit-btn'
    ).addEventListener(
      'click',
      () => editTask(task.id)
    );

    // 🗑️ Delete
    li.querySelector(
      '.delete-btn'
    ).addEventListener(
      'click',
      () => deleteTask(task.id)
    );

    taskList.appendChild(li);
  });
}


// ============================================
// 🔍 SEARCH INPUT
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

sortSelect.addEventListener(
  'change',
  e => {

    currentSort =
      e.target.value;

    renderTasks();
  }
);


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

    updateCounters();

    updateProgress();

    updateMotivation();

    updateStreak();

    showToast(
      '🗑️ All tasks cleared'
    );
  }
);


// ============================================
// 📤 EXPORT TASKS
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
      '📤 Tasks exported'
    );
  }
);


// ============================================
// ⌨️ ENTER KEY
// ============================================

taskInput.addEventListener(
  'keypress',
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

updateCounters();

updateProgress();

updateMotivation();

updateStreak();