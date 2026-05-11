// ============================================
// 📦 GET HTML ELEMENTS
// ============================================

var taskInput      = document.getElementById('taskInput');
var dueDateInput   = document.getElementById('dueDateInput');
var categoryInput  = document.getElementById('categoryInput');
var priorityInput  = document.getElementById('priorityInput');
var addTaskBtn     = document.getElementById('addTaskBtn');
var taskList       = document.getElementById('taskList');
var errorMsg       = document.getElementById('errorMsg');
var darkModeBtn    = document.getElementById('darkModeBtn');
var totalCount     = document.getElementById('totalCount');
var completedCount = document.getElementById('completedCount');
var pendingCount   = document.getElementById('pendingCount');
var filterBtns     = document.querySelectorAll('.filter-btn');
var searchInput    = document.getElementById('searchInput');


// ============================================
// 💾 LOAD SAVED DATA
// ============================================

var tasks         = JSON.parse(localStorage.getItem('myTasks')) || [];
var currentFilter = 'all';
var searchText    = '';
var isDarkMode    = localStorage.getItem('darkMode') === 'true';

// Apply dark mode on load
if (isDarkMode) {
  document.body.classList.add('dark');
  darkModeBtn.textContent = '☀️ Light Mode';
}


// ============================================
// 💾 SAVE TASKS
// ============================================

function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}


// ============================================
// 🔢 UPDATE COUNTERS
// ============================================

function updateCounters() {
  var total     = tasks.length;
  var completed = tasks.filter(function(t) { return t.completed; }).length;
  var pending   = total - completed;

  totalCount.textContent     = total;
  completedCount.textContent = completed;
  pendingCount.textContent   = pending;
}


// ============================================
// 🏷️ CATEGORY EMOJI
// ============================================

function getCategoryEmoji(category) {
  var map = {
    'Study'    : '📚',
    'Work'     : '💼',
    'Health'   : '💪',
    'Shopping' : '🛒',
    'Personal' : '🏠'
  };
  return map[category] || '🏠';
}


// ============================================
// 🚨 PRIORITY EMOJI
// ============================================

function getPriorityEmoji(priority) {
  var map = {
    'High'   : '🔴',
    'Medium' : '🟡',
    'Low'    : '🟢'
  };
  return map[priority] || '🟢';
}


// ============================================
// 🖨️ RENDER TASKS
// ============================================

function renderTasks() {

  var filteredTasks = tasks.slice(); // copy array

  // Filter by status
  if (currentFilter === 'completed') {
    filteredTasks = filteredTasks.filter(function(t) { return t.completed; });
  } else if (currentFilter === 'pending') {
    filteredTasks = filteredTasks.filter(function(t) { return !t.completed; });
  }

  // Filter by search text
  if (searchText !== '') {
    filteredTasks = filteredTasks.filter(function(t) {
      return t.text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    });
  }

  // Sort by priority
  var priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
  filteredTasks.sort(function(a, b) {
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  // Clear list
  taskList.innerHTML = '';

  // Empty state
  if (filteredTasks.length === 0) {
    var emptyLi = document.createElement('li');
    emptyLi.className = 'empty-message';
    emptyLi.textContent = '🎉 No matching tasks found!';
    taskList.appendChild(emptyLi);
    updateCounters();
    return;
  }

  // Draw each task
  var today = new Date().toISOString().split('T')[0];

  filteredTasks.forEach(function(task) {

    var isOverdue = task.dueDate && task.dueDate < today && !task.completed;

    // Build due date HTML
    var dueDateHTML = '';
    if (task.dueDate) {
      var overdueClass = isOverdue ? ' overdue' : '';
      var overdueText  = isOverdue ? '⚠️ Overdue! ' : '';
      dueDateHTML =
        '<span class="task-due-date' + overdueClass + '">' +
          '📅 ' + overdueText + 'Due: ' + task.dueDate +
        '</span>';
    }

    // Build priority HTML
    var priorityClass = 'priority-' + (task.priority || 'low').toLowerCase();
    var priorityHTML =
      '<span class="task-priority ' + priorityClass + '">' +
        getPriorityEmoji(task.priority) + ' ' + (task.priority || 'Low') + ' Priority' +
      '</span>';

    // Build category HTML
    var categoryHTML =
      '<span class="task-category">' +
        getCategoryEmoji(task.category) + ' ' + (task.category || 'Personal') +
      '</span>';

    // Build task card
    var li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    li.innerHTML =
      '<input type="checkbox" class="task-checkbox" ' + (task.completed ? 'checked' : '') + ' />' +

      '<div class="task-text-area">' +
        '<span class="task-text">' + task.text + '</span>' +
        '<input class="task-edit-input" style="display:none;" value="' + task.text.replace(/"/g, '&quot;') + '" />' +
        categoryHTML +
        priorityHTML +
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
// ➕ ADD TASK
// ============================================

function addTask() {

  var text     = taskInput.value.trim();
  var dueDate  = dueDateInput.value;
  var category = categoryInput.value  || 'Personal';
  var priority = priorityInput.value  || 'Low';

  // Validation
  if (text === '') {
    errorMsg.textContent = '⚠️ Please write a task!';
    taskInput.focus();
    return;
  }

  errorMsg.textContent = '';

  // Create task
  var newTask = {
    id        : Date.now(),
    text      : text,
    dueDate   : dueDate,
    category  : category,
    priority  : priority,
    completed : false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Reset inputs
  taskInput.value     = '';
  dueDateInput.value  = '';
  categoryInput.value = 'Personal';
  priorityInput.value = 'Low';
  taskInput.focus();
}


// ============================================
// 🗑️ DELETE TASK
// ============================================

function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}


// ============================================
// ✅ TOGGLE COMPLETE
// ============================================

function toggleComplete(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}


// ============================================
// ✏️ EDIT TASK
// ============================================

function editTask(id, li) {

  var taskText  = li.querySelector('.task-text');
  var editInput = li.querySelector('.task-edit-input');
  var editBtn   = li.querySelector('.edit-btn');
  var isEditing = editInput.style.display === 'block';

  if (!isEditing) {
    // Enter edit mode
    taskText.style.display  = 'none';
    editInput.style.display = 'block';
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
    if (task) { task.text = newText; }
    saveTasks();
    renderTasks();
  }
}


// ============================================
// 🌙 DARK MODE
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
// 🔍 SEARCH
// ============================================

searchInput.addEventListener('input', function(e) {
  searchText = e.target.value;
  renderTasks();
});


// ============================================
// 🖱️ TASK CLICK EVENTS
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
// ⌨️ ENTER KEY
// ============================================

taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') { addTask(); }
});


// ============================================
// 🖱️ ADD BUTTON
// ============================================

addTaskBtn.addEventListener('click', addTask);


// ============================================
// 🚀 START APP
// ============================================

renderTasks();