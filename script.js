// ============================================
// 📦 STEP 1 — GRAB ALL THE HTML PIECES
// Like picking up your LEGO pieces before building
// ============================================

const taskInput     = document.getElementById('taskInput');      // the text box
const dueDateInput  = document.getElementById('dueDateInput');   // the date picker
const addTaskBtn    = document.getElementById('addTaskBtn');     // the Add button
const taskList      = document.getElementById('taskList');       // the list container
const errorMsg      = document.getElementById('errorMsg');       // error message
const darkModeBtn   = document.getElementById('darkModeBtn');    // dark mode button
const totalCount    = document.getElementById('totalCount');     // total counter
const completedCount = document.getElementById('completedCount');// completed counter
const pendingCount  = document.getElementById('pendingCount');   // pending counter
const filterBtns    = document.querySelectorAll('.filter-btn'); // all 3 filter buttons


// ============================================
// 💾 STEP 2 — LOAD SAVED TASKS
// Like opening your notebook where you saved tasks last time
// ============================================

// Load tasks from localStorage (saved in browser) OR start with empty list
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// Remember which filter is active (all / completed / pending)
let currentFilter = 'all';

// Remember if dark mode was on
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if it was saved
if (isDarkMode) {
  document.body.classList.add('dark');
  darkModeBtn.textContent = '☀️ Light Mode';
}


// ============================================
// 💡 STEP 3 — HELPER: SAVE TASKS TO BROWSER
// Like saving your notebook so you don't forget tasks
// ============================================

function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}


// ============================================
// 🔢 STEP 4 — UPDATE THE COUNTERS
// Counts Total / Completed / Pending automatically
// ============================================

function updateCounters() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  totalCount.textContent     = total;
  completedCount.textContent = completed;
  pendingCount.textContent   = pending;
}


// ============================================
// 🖨️ STEP 5 — SHOW TASKS ON SCREEN
// Like printing your task list on paper
// ============================================

function renderTasks() {

  // Decide which tasks to show based on filter
  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  // Clear the list first (so we don't print doubles)
  taskList.innerHTML = '';

  // If no tasks, show a friendly message
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <li style="text-align:center; color:#aaa; padding:30px; font-size:15px;">
        🎉 No tasks here! Add one above.
      </li>`;
    return;
  }

  // Loop through each task and build its HTML card
  filteredTasks.forEach(task => {

    // Check if task is overdue (past due date and not completed)
    const today = new Date().toISOString().split('T')[0]; // today's date
    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;

    // Build the task card HTML
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    li.setAttribute('data-id', task.id); // remember which task this is

    li.innerHTML = `
      <!-- ✅ Checkbox to mark done -->
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        title="Mark as complete"
      />

      <!-- 📝 Task text and due date -->
      <div class="task-text-area">
        <span class="task-text">${task.text}</span>
        <input class="task-edit-input" style="display:none;" value="${task.text}" />
        ${task.dueDate
          ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}">
               📅 ${isOverdue ? '⚠️ Overdue! ' : ''}Due: ${task.dueDate}
             </span>`
          : ''}
      </div>

      <!-- ✏️🗑️ Edit and Delete buttons -->
      <div class="task-actions">
        <button class="edit-btn" title="Edit task">✏️</button>
        <button class="delete-btn" title="Delete task">🗑️</button>
      </div>
    `;

    taskList.appendChild(li); // add the card to the list
  });

  updateCounters(); // update the numbers after rendering
}


// ============================================
// ➕ STEP 6 — ADD A NEW TASK
// Runs when user clicks the "Add Task" button
// ============================================

function addTask() {
  const text    = taskInput.value.trim();    // get typed text (remove extra spaces)
  const dueDate = dueDateInput.value;        // get chosen date

  // ❌ Validation: don't allow empty tasks
  if (text === '') {
    errorMsg.textContent = '⚠️ Please write a task before adding!';
    taskInput.focus(); // put cursor back in the box
    return;
  }

  // ✅ Clear error if everything is fine
  errorMsg.textContent = '';

  // Build the new task object (like filling out a form)
  const newTask = {
    id:        Date.now(),   // unique ID using current time
    text:      text,
    dueDate:   dueDate,
    completed: false
  };

  // Add to our tasks list
  tasks.push(newTask);

  // Save and re-draw the list
  saveTasks();
  renderTasks();

  // Clear the input boxes so they're ready for next task
  taskInput.value   = '';
  dueDateInput.value = '';
  taskInput.focus();
}


// ============================================
// 🗑️ STEP 7 — DELETE A TASK
// Removes task from the list forever
// ============================================

function deleteTask(id) {
  // Keep all tasks EXCEPT the one we want to delete
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}


// ============================================
// ✅ STEP 8 — TOGGLE COMPLETE / INCOMPLETE
// Marks a task as done or undone
// ============================================

function toggleComplete(id) {
  // Find the task and flip its completed value
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// ============================================
// ✏️ STEP 9 — EDIT A TASK
// Lets user change the task text
// ============================================

function editTask(id, li) {
  const taskTextSpan = li.querySelector('.task-text');
  const editInput    = li.querySelector('.task-edit-input');
  const editBtn      = li.querySelector('.edit-btn');

  // Are we already in "editing mode"?
  const isEditing = editInput.style.display === 'block';

  if (!isEditing) {
    // 🖊️ ENTER edit mode — show the input box, hide the text
    taskTextSpan.style.display = 'none';
    editInput.style.display    = 'block';
    editInput.focus();
    editBtn.textContent = '💾'; // change button to "Save"

  } else {
    // 💾 SAVE — hide the input box, show updated text
    const newText = editInput.value.trim();

    if (newText === '') {
      alert('Task cannot be empty!');
      return;
    }

    // Update the task in our list
    const task = tasks.find(t => t.id === id);
    if (task) task.text = newText;

    saveTasks();
    renderTasks(); // re-draw with the new text
  }
}


// ============================================
// 🌙 STEP 10 — DARK MODE TOGGLE
// Switches between light and dark
// ============================================

darkModeBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark');
  darkModeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDarkMode); // remember choice
});


// ============================================
// 🔽 STEP 11 — FILTER BUTTONS
// Shows All / Completed / Pending tasks
// ============================================

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // Remove "active" from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));

    // Add "active" to the clicked button
    btn.classList.add('active');

    // Remember which filter is selected
    currentFilter = btn.getAttribute('data-filter');

    // Re-draw the list with the new filter
    renderTasks();
  });
});


// ============================================
// 🖱️ STEP 12 — LISTEN FOR CLICKS ON THE TASK LIST
// One listener handles ALL tasks (even future ones!)
// ============================================

taskList.addEventListener('click', (e) => {

  // Find the parent task card
  const li = e.target.closest('.task-item');
  if (!li) return;

  // Get the task ID from the card
  const id = Number(li.getAttribute('data-id'));

  // Which element was clicked?
  if (e.target.classList.contains('task-checkbox')) {
    toggleComplete(id);                // ✅ checkbox clicked
  } else if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);                    // 🗑️ delete button clicked
  } else if (e.target.classList.contains('edit-btn')) {
    editTask(id, li);                  // ✏️ edit button clicked
  }
});


// ============================================
// ⌨️ STEP 13 — PRESS ENTER TO ADD TASK
// So you don't have to click the button every time
// ============================================

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});


// ============================================
// 🖱️ STEP 14 — ADD BUTTON CLICK
// ============================================

addTaskBtn.addEventListener('click', addTask);


// ============================================
// 🚀 STEP 15 — START THE APP!
// Runs everything when the page first loads
// ============================================

renderTasks();