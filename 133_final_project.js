// Select elements for Tasks
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const taskList = document.getElementById('task-list');

// Select elements for Notes
const notesForm = document.getElementById('notes-form');
const notesInput = document.getElementById('notes-input');
const notesDescriptionInput = document.getElementById('notes-description-input');
const notesList = document.getElementById('notes-list');

// Load tasks and notes from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadNotes();
});

// Add task event
taskForm.addEventListener('submit', addTask);

// Add note event
notesForm.addEventListener('submit', addNote);

// Task functions
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const taskDescription = descriptionInput.value.trim();

  if (!taskText) return;

  const task = createTaskElement(taskText, taskDescription, false);
  taskList.appendChild(task);

  saveItem({ text: taskText, description: taskDescription, done: false }, 'tasks');

  taskInput.value = '';
  descriptionInput.value = '';
}

function createTaskElement(taskText, taskDescription, isDone) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-start';

  const taskContainer = document.createElement('div');
  taskContainer.innerHTML = `<strong>${taskText}</strong><br>${taskDescription}`;
  if (isDone) taskContainer.style.textDecoration = 'line-through';

  const buttonsDiv = document.createElement('div');

  const doneBtn = document.createElement('button');
  doneBtn.textContent = 'Done';
  doneBtn.className = 'btn btn-success btn-sm me-2';
  doneBtn.addEventListener('click', () => toggleDone(taskContainer, taskText, 'tasks'));

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn btn-warning btn-sm me-2';
  editBtn.addEventListener('click', () => editTask(li, taskContainer, 'tasks'));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.addEventListener('click', () => deleteItem(li, taskText, 'tasks'));

  buttonsDiv.appendChild(doneBtn);
  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(taskContainer);
  li.appendChild(buttonsDiv);

  return li;
}

function toggleDone(taskContainer, taskText, type) {
  const items = getItems(type);
  const item = items.find((t) => t.text === taskText);
  if (item) {
    item.done = !item.done;
    taskContainer.style.textDecoration = item.done ? 'line-through' : 'none';
    localStorage.setItem(type, JSON.stringify(items));
  }
}

function editTask(li, taskContainer, type) {
  const items = getItems(type);
  const oldText = taskContainer.firstChild.textContent;
  const item = items.find((t) => t.text === oldText);

  if (item) {
    const newText = prompt('Edit your task title:', item.text);
    const newDescription = prompt('Edit your task description:', item.description);

    if (newText !== null && newText.trim() !== '') {
      item.text = newText.trim();
      item.description = newDescription || '';
      taskContainer.innerHTML = `<strong>${item.text}</strong><br>${item.description}`;
      localStorage.setItem(type, JSON.stringify(items));
    }
  }
}

function loadTasks() {
  const tasks = getItems('tasks');
  tasks.forEach(({ text, description, done }) => {
    const task = createTaskElement(text, description, done);
    taskList.appendChild(task);
  });
}

// Note functions
function addNote(e) {
  e.preventDefault();

  const noteText = notesInput.value.trim();
  const noteDescription = notesDescriptionInput.value.trim();

  if (!noteText) return;

  const note = createNoteElement(noteText, noteDescription, false);
  notesList.appendChild(note);

  saveItem({ text: noteText, description: noteDescription, done: false }, 'notes');

  notesInput.value = '';
  notesDescriptionInput.value = '';
}

function createNoteElement(noteText, noteDescription, isDone) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-start';

  const noteContainer = document.createElement('div');
  noteContainer.innerHTML = `<strong>${noteText}</strong><br>${noteDescription}`;
  if (isDone) noteContainer.style.textDecoration = 'line-through';

  const buttonsDiv = document.createElement('div');

  const doneBtn = document.createElement('button');
  doneBtn.textContent = 'Done';
  doneBtn.className = 'btn btn-success btn-sm me-2';
  doneBtn.addEventListener('click', () => toggleDone(noteContainer, noteText, 'notes'));

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn btn-warning btn-sm me-2';
  editBtn.addEventListener('click', () => editTask(li, noteContainer, 'notes'));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.addEventListener('click', () => deleteItem(li, noteText, 'notes'));

  buttonsDiv.appendChild(doneBtn);
  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(noteContainer);
  li.appendChild(buttonsDiv);

  return li;
}

function loadNotes() {
  const notes = getItems('notes');
  notes.forEach(({ text, description, done }) => {
    const note = createNoteElement(text, description, done);
    notesList.appendChild(note);
  });
}

// Shared functions for tasks and notes
function deleteItem(li, text, type) {
  li.remove();
  const items = getItems(type);
  const filteredItems = items.filter((item) => item.text !== text);
  localStorage.setItem(type, JSON.stringify(filteredItems));
}

function saveItem(item, type) {
  const items = getItems(type);
  items.push(item);
  localStorage.setItem(type, JSON.stringify(items));
}

function getItems(type) {
  return JSON.parse(localStorage.getItem(type)) || [];
}