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

// Weather API for Irvine, CA (units in Fahrenheit)
const APIKey = 'f571bd7cda6a13a4ffb92ac78efd2b10';
const city = 'Irvine'; // Fixed city

// Fetch weather data for Irvine, CA
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
  .then(response => response.json())
  .then(json => {
    if (json.cod === '404') {
      alert('City not found. Please try again.');
      return;
    }

    // Extract the relevant data
    const temp = json.main.temp; // Temperature in Fahrenheit
    const description = json.weather[0].description; // Weather description
    const humidity = json.main.humidity; // Humidity
    const windSpeed = json.wind.speed; // Wind speed

    // Display the weather data
    document.getElementById('weather-temp').textContent = `${temp}°F`;
    document.getElementById('weather-description').textContent = capitalizeFirstLetter(description);
    document.getElementById('weather-humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('weather-wind').textContent = `Wind Speed: ${windSpeed} m/s`;

    // Make the weather box visible
    document.getElementById('weather-box').style.display = 'block';
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
    alert('Failed to retrieve weather data. Please try again later.');
  });

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load tasks and notes from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadNotes();
});

// Add task event
taskForm.addEventListener('submit', addTask);

// Add note event
notesForm.addEventListener('submit', addNote);

/* ======================
      Task Functions
====================== */
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const taskDescription = descriptionInput.value.trim();

  if (!taskText) return;

  const task = createListElement(taskText, taskDescription, false, 'task');
  taskList.appendChild(task);

  saveItem('tasks', { text: taskText, description: taskDescription, done: false });

  // Clear inputs after adding
  taskInput.value = '';
  descriptionInput.value = '';
}

function loadTasks() {
  const tasks = getItems('tasks');
  tasks.forEach(({ text, description, done }) => {
    const task = createListElement(text, description, done, 'task');
    taskList.appendChild(task);
  });
}

/* ======================
      Notes Functions
====================== */
function addNote(e) {
  e.preventDefault();

  const noteText = notesInput.value.trim();
  const noteDescription = notesDescriptionInput.value.trim();

  if (!noteText) return;

  const note = createListElement(noteText, noteDescription, false, 'note');
  notesList.appendChild(note);

  saveItem('notes', { text: noteText, description: noteDescription, done: false });

  // Clear inputs after adding
  notesInput.value = '';
  notesDescriptionInput.value = '';
}

function loadNotes() {
  const notes = getItems('notes');
  notes.forEach(({ text, description, done }) => {
    const note = createListElement(text, description, done, 'note');
    notesList.appendChild(note);
  });
}

/* ======================
  Shared List Functions
====================== */
function createListElement(text, description, isDone, type) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-start';

  const itemContainer = document.createElement('div');
  itemContainer.innerHTML = `<strong>${text}</strong><br>${description}`;
  if (isDone) itemContainer.style.textDecoration = 'line-through';

  const buttonsDiv = document.createElement('div');

  const doneBtn = document.createElement('button');
  doneBtn.textContent = 'Done';
  doneBtn.className = 'btn btn-success btn-sm me-2';
  doneBtn.addEventListener('click', () => toggleDone(itemContainer, text, type));

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn btn-warning btn-sm me-2';
  editBtn.addEventListener('click', () => editItem(li, itemContainer, type));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.addEventListener('click', () => deleteItem(li, text, type));

  buttonsDiv.append(doneBtn, editBtn, deleteBtn);
  li.append(itemContainer, buttonsDiv);

  return li;
}

function toggleDone(itemContainer, text, type) {
  itemContainer.style.textDecoration = itemContainer.style.textDecoration === 'line-through' ? '' : 'line-through';
  const items = getItems(type);
  const item = items.find(item => item.text === text);
  item.done = !item.done;
  saveItems(type, items);
}

function deleteItem(li, text, type) {
  li.remove();
  const items = getItems(type);
  const filteredItems = items.filter(item => item.text !== text);
  saveItems(type, filteredItems);
}

function editItem(li, itemContainer, type) {
  const newText = prompt('Edit Task or Note:', itemContainer.textContent.split('\n')[0]);
  if (newText && newText.trim() !== '') {
    const items = getItems(type);
    const item = items.find(item => item.text === itemContainer.textContent.split('\n')[0]);
    item.text = newText.trim();
    saveItems(type, items);
    itemContainer.innerHTML = `<strong>${newText}</strong><br>${item.description}`;
  }
}

function saveItem(type, { text, description, done }) {
  const items = getItems(type);
  items.push({ text, description, done });
  saveItems(type, items);
}

function getItems(type) {
  return JSON.parse(localStorage.getItem(type)) || [];
}

function saveItems(type, items) {
  localStorage.setItem(type, JSON.stringify(items));
}
