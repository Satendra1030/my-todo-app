// ============================================
// 🚀 ADVANCED TODO APP
// ============================================


// ============================================
// 📦 GET HTML ELEMENTS
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


// ============================================
// 💾 LOAD DATA
// ============================================

let tasks =
  JSON.parse(
    localStorage.getItem('myTasks')
  ) || [];

let currentFilter = 'all';

let searchText = '';

let isDarkMode =
  localStorage.getItem('darkMode')
  === 'true';


// ============================================
// 🌙 APPLY DARK MODE
// ============================================

if (isDarkMode) {

  document.body.classList.add('dark');

  darkModeBtn.textContent = '☀️';
}


// ============================================
// 💾 SAVE TASKS
// ============================================

function saveTasks() {

  localStorage.setItem(
    'myTasks',
    JSON.stringify(tasks)
  );
}


// ============================================
// 🔢 UPDATE COUNTERS
// ============================================

function updateCounters() {

  const total = tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  totalCount.textContent = total;

  completedCount.textContent =
    completed;

  pendingCount.textContent =
    pending;
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

  switch(priority) {

    case 'High':
      return 'priority-high';

    case 'Medium':
      return 'priority-medium';

    default:
      return 'priority-low';
  }
}


// ============================================
// 🖨️ RENDER TASKS
// ============================================

function renderTasks() {

  let filteredTasks = [...tasks];

  // 🔍 SEARCH FILTER
  filteredTasks =
    filteredTasks.filter(task =>
      task.text
        .toLowerCase()
        .includes(
          searchText.toLowerCase()
        )
    );

  // 🔽 STATUS FILTER
  if (currentFilter === 'completed') {

    filteredTasks =
      filteredTasks.filter(
        task => task.completed
      );
  }

  else if (
    currentFilter === 'pending'
  ) {

    filteredTasks =
      filteredTasks.filter(
        task => !task.completed
      );
  }

  // 🚨 SORT PRIORITY
  filteredTasks.sort((a, b) => {

    const order = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    return (
      order[a.priority]
      -
      order[b.priority]
    );
  });

  // 🧹 CLEAR LIST
  taskList.innerHTML = '';

  // 😴 EMPTY STATE
  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <li class="empty-message">
        😴 No tasks found
      </li>
    `;

    updateCounters();

    return;
  }

  // 🔁 LOOP TASKS
  filteredTasks.forEach(task => {

    const today =
      new Date()
      .toISOString()
      .split('T')[0];

    const isOverdue =
      task.dueDate &&
      task.dueDate < today &&
      !task.completed;

    const li =
      document.createElement('li');

    li.classList.add('task-item');

    if (task.completed) {

      li.classList.add('completed');
    }

    li.setAttribute(
      'data-id',
      task.id
    );

    li.innerHTML = `

      <!-- ✅ CHECKBOX -->
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
      />

      <!-- 📝 CONTENT -->
      <div class="task-text-area">

        <!-- 📝 TEXT -->
        <span class="task-text">
          ${task.text}
        </span>

        <!-- ✏️ EDIT INPUT -->
        <input
          class="task-edit-input"
          style="display:none;"
          value="${task.text}"
        />

        <!-- 🏷️ CATEGORY -->
        <span class="task-category">

          ${getCategoryEmoji(task.category)}

          ${task.category}

        </span>

        <!-- 🚨 PRIORITY -->
        <span class="
          task-priority
          ${getPriorityClass(task.priority)}
        ">

          ${task.priority} Priority

        </span>

        <!-- 📅 DATE -->
        ${
          task.dueDate
          ?
          `
          <span class="
            task-due-date
            ${isOverdue ? 'overdue' : ''}
          ">

            📅

            ${
              isOverdue
              ?
              '⚠️ Overdue!'
              :
              'Due'
            }

            :
            ${task.dueDate}

          </span>
          `
          :
          ''
        }

      </div>

      <!-- 🎮 ACTIONS -->
      <div class="task-actions">

        <!-- ✏️ EDIT -->
        <button
          class="edit-btn"
        >
          ✏️
        </button>

        <!-- 🗑️ DELETE -->
        <button
          class="delete-btn"
        >
          🗑️
        </button>

      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounters();
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
  if (text === '') {

    errorMsg.textContent =
      '⚠️ Please enter a task';

    taskInput.focus();

    return;
  }

  // ✅ CLEAR ERROR
  errorMsg.textContent = '';

  // 🆕 NEW TASK
  const newTask = {

    id: Date.now(),

    text,

    dueDate,

    category,

    priority,

    completed: false
  };

  // ➕ PUSH
  tasks.push(newTask);

  saveTasks();

  renderTasks();

  // 🧹 RESET
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
}


// ============================================
// ✏️ EDIT TASK
// ============================================

function editTask(id, li) {

  const taskText =
    li.querySelector('.task-text');

  const editInput =
    li.querySelector(
      '.task-edit-input'
    );

  const editBtn =
    li.querySelector('.edit-btn');

  const isEditing =
    editInput.style.display
    === 'block';

  // ✏️ ENTER EDIT
  if (!isEditing) {

    taskText.style.display =
      'none';

    editInput.style.display =
      'block';

    editInput.focus();

    editBtn.textContent = '💾';
  }

  // 💾 SAVE EDIT
  else {

    const newText =
      editInput.value.trim();

    if (newText === '') {

      alert(
        'Task cannot be empty'
      );

      return;
    }

    const task =
      tasks.find(
        task => task.id === id
      );

    if (task) {

      task.text = newText;
    }

    saveTasks();

    renderTasks();
  }
}


// ============================================
// 🌙 DARK MODE
// ============================================

darkModeBtn.addEventListener(
  'click',
  () => {

    isDarkMode = !isDarkMode;

    document.body.classList.toggle(
      'dark'
    );

    darkModeBtn.textContent =
      isDarkMode
      ? '☀️'
      : '🌙';

    localStorage.setItem(
      'darkMode',
      isDarkMode
    );
  }
);


// ============================================
// 🔽 FILTERS
// ============================================

filterBtns.forEach(btn => {

  btn.addEventListener(
    'click',
    () => {

      // REMOVE ACTIVE
      filterBtns.forEach(button => {

        button.classList.remove(
          'active'
        );
      });

      // ADD ACTIVE
      btn.classList.add('active');

      // SAVE FILTER
      currentFilter =
        btn.getAttribute(
          'data-filter'
        );

      renderTasks();
    }
  );
});


// ============================================
// 🔍 SEARCH
// ============================================

searchInput.addEventListener(
  'input',
  e => {

    searchText = e.target.value;

    renderTasks();
  }
);


// ============================================
// 🖱️ TASK ACTIONS
// ============================================

taskList.addEventListener(
  'click',
  e => {

    const li =
      e.target.closest('.task-item');

    if (!li) return;

    const id =
      Number(
        li.getAttribute('data-id')
      );

    // ✅ CHECKBOX
    if (
      e.target.classList.contains(
        'task-checkbox'
      )
    ) {

      toggleComplete(id);
    }

    // 🗑️ DELETE
    else if (
      e.target.classList.contains(
        'delete-btn'
      )
    ) {

      deleteTask(id);
    }

    // ✏️ EDIT
    else if (
      e.target.classList.contains(
        'edit-btn'
      )
    ) {

      editTask(id, li);
    }
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
// ➕ BUTTON CLICK
// ============================================

addTaskBtn.addEventListener(
  'click',
  addTask
);


// ============================================
// 🚀 START APP
// ============================================

renderTasks();