// ============================================
// 📦 GET HTML ELEMENTS
// ============================================

const taskInput      = document.getElementById('taskInput');
const dueDateInput   = document.getElementById('dueDateInput');
const categoryInput  = document.getElementById('categoryInput');
const addTaskBtn     = document.getElementById('addTaskBtn');
const taskList       = document.getElementById('taskList');
const errorMsg       = document.getElementById('errorMsg');
const darkModeBtn    = document.getElementById('darkModeBtn');
const totalCount     = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount   = document.getElementById('pendingCount');
const filterBtns     = document.querySelectorAll('.filter-btn');


// ============================================
// 💾 LOAD SAVED DATA
// ============================================

let tasks         = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';
let isDarkMode    = localStorage.getItem('darkMode') === 'true';

// Apply saved dark mode
if (isDarkMode) {
  document.body.classList.add('dark');
  darkModeBtn.textContent = '☀️ Light Mode';
}


// ============================================
// 💾 SAVE TASKS TO BROWSER
// ============================================

function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}


// ============================================
// 🔢 UPDATE COUNTERS
// ============================================

function updateCounters() {
  const total     = tasks.length;
  const completed = tasks.filter(function(t) { return t.completed; }).length;
  const pending   = total - completed;

  totalCount.textContent     = total;
  completedCount.textContent = completed;
  pendingCount.textContent   = pending;
}


// ============================================
// 🏷️ CATEGORY EMOJI HELPER
// ============================================

function getCategoryEmoji(category) {
  var emojis = {
    'Study'    : '📚',
    'Work'     : '💼',
    'Health'   : '💪',
    'Shopping' : '🛒',
    'Personal' : '🏠'
  };
  return emojis[category] || '🏠';
}


// ============================================
// 🖨️ RENDER TASKS ON SCREEN
// ============================================

function renderTasks() {

  // Filter tasks based on current filter
  var filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(function(t) { return t.completed; });
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(function(t) { return !t.completed; });
  }

  // Clear the list
  taskList.innerHTML = '';

  // Show message if no tasks
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center;color:#aaa;padding:30px;">🎉 No tasks here! Add one above.</li>';
    updateCounters();
    return;
  }

  // Draw each task
  var today = new Date().toISOString().split('T')[0];

  filteredTasks.forEach(function(task) {

    var isOverdue = task.dueDate && task.dueDate < today && !task.completed;

    var li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    // Due date HTML
    var dueDateHTML = '';
    if (task.dueDate) {
      var overdueText = isOverdue ? '⚠️ Overdue! ' : '';
      var overdueClass = isOverdue ? 'overdue' : '';
      dueDateHTML = '<span class="task-due-date ' + overdueClass + '">📅 ' + overdueText + 'Due: ' + task.dueDate + '</span>';
    }

    var categoryEmoji = getCategoryEmoji(task.category);
    var categoryName  = task.category || 'Personal';
    var checkedAttr   = task.completed ? 'checked' : '';

    li.innerHTML =
      '<input type="checkbox" class="task-checkbox" ' + checkedAttr + ' />' +
      '<div class="task-text-area">' +
        '<span class="task-text">' + task.text + '</span>' +
        '<input class="task-edit-input" style="display:none;" value="' + task.text.replace(/"/g, '&quot;') + '" />' +
        '<span class="task-category">' + categoryEmoji + ' ' + categoryName + '</span>' +
        dueDateHTML +
      '</div>' +
      '<div class="task-actions">' +
        '<button class="edit-btn">✏️</button>' +
        '<button class="delete-btn">🗑️</button>' +
      '</div>';

    taskList.appendChild(li);
  });

  updateCounters();
}


// ============================================
// ➕ ADD NEW TASK
// ============================================

function addTask() {

  var text     = taskInput.value.trim();
  var dueDate  = dueDateInput.value;
  var category = categoryInput.value || 'Personal';

  // Validation — don't allow empty tasks
  if (text === '') {
    errorMsg.textContent = '⚠️ Please write a task before adding!';
    taskInput.focus();
    return;
  }

  errorMsg.textContent = '';

  // Build new task object
  var newTask = {
    id        : Date.now(),
    text      : text,
    dueDate   : dueDate,
    category  : category,
    completed : false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value     = '';
  dueDateInput.value  = '';
  categoryInput.value = 'Personal';
  taskInput.focus();
}


// ============================================
// 🗑️ DELETE A TASK
// ============================================

function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}


// ============================================
// ✅ MARK TASK COMPLETE / INCOMPLETE
// ============================================

function toggleComplete(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
  }
  saveTasks();
  renderTasks();
}


// ============================================
// ✏️ EDIT A TASK
// ============================================

function editTask(id, li) {

  var taskTextSpan = li.querySelector('.task-text');
  var editInput    = li.querySelector('.task-edit-input');
  var editBtn      = li.querySelector('.edit-btn');
  var isEditing    = editInput.style.display === 'block';

  if (!isEditing) {
    // Enter edit mode
    taskTextSpan.style.display = 'none';
    editInput.style.display    = 'block';
    editInput.focus();
    editBtn.textContent = '💾';

  } else {
    // Save edit
    var newText = editInput.value.trim();

    if (newText === '') {
      alert('Task cannot be empty!');
      return;
    }

    var task = tasks.find(function(t) { return t.id === id; });
    if (task) {
      task.text = newText;
    }

    saveTasks();
    renderTasks();
  }
}


// ============================================
// 🌙 DARK MODE TOGGLE
// ============================================

darkModeBtn.addEventListener('click', function() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark');
  darkModeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDarkMode);
});


// ============================================
// 🔽 FILTER BUTTONS
// ============================================

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});


// ============================================
// 🖱️ CLICK EVENTS ON TASK LIST
// ============================================

taskList.addEventListener('click', function(e) {

  var li = e.target.closest('.task-item');
  if (!li) return;

  var id = Number(li.getAttribute('data-id'));

  if (e.target.classList.contains('task-checkbox')) {
    toggleComplete(id);

  } else if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);

  } else if (e.target.classList.contains('edit-btn')) {
    editTask(id, li);
  }
});


// ============================================
// ⌨️ PRESS ENTER TO ADD TASK
// ============================================

taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTask();
  }
});


// ============================================
// 🖱️ ADD BUTTON CLICK
// ============================================

addTaskBtn.addEventListener('click', addTask);


// ============================================
// 🚀 START THE APP
// ============================================

renderTasks();