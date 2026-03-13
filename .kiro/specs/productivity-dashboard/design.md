# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla HTML, CSS, and JavaScript that provides essential productivity tools in a single, clean interface. The application operates entirely in the browser without any backend dependencies, using the Browser Local Storage API for data persistence.

### Core Features

- **Personalized Greeting**: Dynamic time-based greeting with custom user name
- **Focus Timer**: 25-minute countdown timer with start/stop/reset controls
- **Task Manager**: Create, edit, delete, and complete tasks with urgency levels
- **Quick Links**: Save and access favorite websites
- **Theme Customization**: Toggle between light and dark modes

### Design Principles

1. **Simplicity**: Clean, minimal interface with clear visual hierarchy
2. **Performance**: Instant feedback (<100ms) for all user interactions
3. **Persistence**: All data saved locally and restored on page load
4. **Compatibility**: Works across Chrome, Firefox, Edge, and Safari
5. **Standalone**: No server dependencies, runs entirely client-side

## Architecture

### System Architecture

The application follows a simple client-side architecture with three layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (HTML Structure + CSS Styling)         │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (JavaScript Modules + Event Handlers)  │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  (Local Storage API)                    │
└─────────────────────────────────────────┘
```

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with CSS custom properties for theming
- **Vanilla JavaScript (ES6+)**: Application logic and DOM manipulation
- **Local Storage API**: Client-side data persistence

### File Structure

```
productivity-dashboard/
├── index.html           # Main HTML entry point
├── css/
│   └── styles.css      # Single CSS file with all styles
└── js/
    └── app.js          # Single JavaScript file with all logic
```

### Deployment Model

The application can be deployed in multiple ways:
- **Direct file access**: Open index.html in any browser
- **Static web hosting**: Deploy to GitHub Pages, Netlify, etc.
- **Browser extension**: Package as a new tab replacement extension
- **Local web server**: Serve via any HTTP server for development

## Components and Interfaces

### Component Hierarchy

The dashboard consists of five main widget components:

```
Dashboard (Root Container)
├── Greeting Widget
├── Focus Timer Widget
├── Task Manager Widget
├── Quick Links Widget
└── Theme Toggle Control
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productivity Dashboard</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Theme Toggle -->
  <div class="theme-toggle">
    <button id="theme-toggle-btn" aria-label="Toggle theme">
      <span class="theme-icon"></span>
    </button>
  </div>

  <!-- Main Dashboard Container -->
  <main class="dashboard">
    
    <!-- Greeting Widget -->
    <section class="widget greeting-widget">
      <div class="time-display" id="time-display"></div>
      <div class="date-display" id="date-display"></div>
      <div class="greeting-message" id="greeting-message"></div>
      <input type="text" id="name-input" placeholder="Enter your name" 
             aria-label="Your name">
    </section>

    <!-- Focus Timer Widget -->
    <section class="widget timer-widget">
      <h2>Focus Timer</h2>
      <div class="timer-display" id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="timer-start" aria-label="Start timer">Start</button>
        <button id="timer-stop" aria-label="Stop timer">Stop</button>
        <button id="timer-reset" aria-label="Reset timer">Reset</button>
      </div>
    </section>

    <!-- Task Manager Widget -->
    <section class="widget task-widget">
      <h2>Tasks</h2>
      
      <!-- Task Input Form -->
      <div class="task-input-form">
        <input type="text" id="task-input" placeholder="Add a new task" 
               aria-label="New task">
        <select id="task-urgency" aria-label="Task urgency">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button id="task-add-btn" aria-label="Add task">Add</button>
      </div>

      <!-- Task Sort Controls -->
      <div class="task-sort-controls">
        <label>Sort by:</label>
        <button id="sort-alpha" class="sort-btn active" 
                aria-label="Sort alphabetically">A-Z</button>
        <button id="sort-urgency" class="sort-btn" 
                aria-label="Sort by urgency">Urgency</button>
      </div>

      <!-- Task List -->
      <ul class="task-list" id="task-list"></ul>
    </section>

    <!-- Quick Links Widget -->
    <section class="widget links-widget">
      <h2>Quick Links</h2>
      
      <!-- Link Input Form -->
      <div class="link-input-form">
        <input type="url" id="link-input" placeholder="Enter URL" 
               aria-label="Website URL">
        <button id="link-add-btn" aria-label="Add link">Add</button>
      </div>

      <!-- Links List -->
      <div class="links-list" id="links-list"></div>
    </section>

  </main>

  <script src="js/app.js"></script>
</body>
</html>
```

### CSS Organization

The CSS file is organized into logical sections:

1. **CSS Custom Properties**: Theme variables for colors, spacing, typography
2. **Reset & Base Styles**: Normalize browser defaults
3. **Layout**: Dashboard grid and widget positioning
4. **Typography**: Font styles and hierarchy
5. **Widget Styles**: Individual component styling
6. **Theme Styles**: Light and dark mode variations
7. **Responsive Design**: Media queries for different screen sizes

```css
/* CSS Custom Properties for Theming */
:root {
  /* Light Theme Colors */
  --bg-primary: #cff1fc;
  --bg-secondary: #79d8f7;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent-color: #2069bbff;
  --border-color: #e0e0e0;
  
  /* Urgency Colors */
  --urgency-high: #e74c3c;
  --urgency-medium: #f39c12;
  --urgency-low: #27ae60;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 1.25rem;
  --font-size-xl: 2rem;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #eaeaea;
  --text-secondary: #a0a0a0;
  --accent-color: #5dade2;
  --border-color: #2c3e50;
}
```

### JavaScript Module Structure

The JavaScript file is organized into functional modules using the revealing module pattern:

```javascript
// Application State
const AppState = {
  userName: '',
  tasks: [],
  quickLinks: [],
  theme: 'light',
  timerSeconds: 1500,
  timerInterval: null,
  timerRunning: false,
  currentSort: 'alpha'
};

// Storage Module
const StorageManager = {
  save(key, value) { /* ... */ },
  load(key) { /* ... */ },
  remove(key) { /* ... */ }
};

// Greeting Module
const GreetingWidget = {
  init() { /* ... */ },
  updateTime() { /* ... */ },
  updateGreeting() { /* ... */ },
  handleNameInput() { /* ... */ }
};

// Timer Module
const TimerWidget = {
  init() { /* ... */ },
  start() { /* ... */ },
  stop() { /* ... */ },
  reset() { /* ... */ },
  tick() { /* ... */ },
  updateDisplay() { /* ... */ }
};

// Task Module
const TaskManager = {
  init() { /* ... */ },
  addTask(text, urgency) { /* ... */ },
  editTask(id, text, urgency) { /* ... */ },
  deleteTask(id) { /* ... */ },
  toggleComplete(id) { /* ... */ },
  sortTasks(method) { /* ... */ },
  renderTasks() { /* ... */ }
};

// Quick Links Module
const QuickLinksManager = {
  init() { /* ... */ },
  addLink(url) { /* ... */ },
  deleteLink(id) { /* ... */ },
  openLink(url) { /* ... */ },
  renderLinks() { /* ... */ }
};

// Theme Module
const ThemeManager = {
  init() { /* ... */ },
  toggle() { /* ... */ },
  apply(theme) { /* ... */ }
};

// Application Initialization
const App = {
  init() {
    StorageManager.loadAll();
    GreetingWidget.init();
    TimerWidget.init();
    TaskManager.init();
    QuickLinksManager.init();
    ThemeManager.init();
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
```

## Data Models

### Local Storage Schema

All data is stored in Local Storage using JSON serialization. Each data type has a dedicated key:

#### User Name

```javascript
// Key: 'dashboard_userName'
// Type: String
// Example:
"John Doe"
```

#### Tasks

```javascript
// Key: 'dashboard_tasks'
// Type: Array of Task objects
// Example:
[
  {
    id: "task_1234567890",
    text: "Complete project proposal",
    urgency: "high",
    completed: false,
    createdAt: 1234567890000
  },
  {
    id: "task_1234567891",
    text: "Review code changes",
    urgency: "medium",
    completed: true,
    createdAt: 1234567891000
  }
]
```

**Task Object Schema:**
- `id` (string): Unique identifier (timestamp-based)
- `text` (string): Task description
- `urgency` (string): One of "high", "medium", "low"
- `completed` (boolean): Completion status
- `createdAt` (number): Unix timestamp of creation

#### Quick Links

```javascript
// Key: 'dashboard_quickLinks'
// Type: Array of Link objects
// Example:
[
  {
    id: "link_1234567890",
    url: "https://github.com",
    createdAt: 1234567890000
  },
  {
    id: "link_1234567891",
    url: "https://stackoverflow.com",
    createdAt: 1234567891000
  }
]
```

**Link Object Schema:**
- `id` (string): Unique identifier (timestamp-based)
- `url` (string): Full URL including protocol
- `createdAt` (number): Unix timestamp of creation

#### Theme Preference

```javascript
// Key: 'dashboard_theme'
// Type: String
// Example:
"dark"  // or "light"
```

### Data Validation Rules

1. **User Name**: Any non-empty string, max 50 characters
2. **Task Text**: Required, non-empty string, max 200 characters
3. **Task Urgency**: Must be one of: "high", "medium", "low"
4. **Quick Link URL**: Must be valid URL format with protocol (http:// or https://)
5. **Theme**: Must be either "light" or "dark"

### Storage Size Considerations

Local Storage has a typical limit of 5-10MB per origin. Our data usage:
- User Name: ~50 bytes
- Task (average): ~150 bytes
- Quick Link (average): ~100 bytes
- Theme: ~10 bytes

With 100 tasks and 20 quick links, total storage: ~17KB (well within limits)

## UI/UX Design Approach

### Layout Design

The dashboard uses a responsive grid layout that adapts to different screen sizes:

**Desktop (>1024px):**
```
┌─────────────────────────────────────┐
│  [Theme Toggle]                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Greeting Widget           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │  Timer   │  │   Tasks      │   │
│  │  Widget  │  │   Widget     │   │
│  └──────────┘  └──────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Quick Links Widget        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────┐
│ [Theme]     │
│             │
│ ┌─────────┐ │
│ │Greeting │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │ Timer   │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │ Tasks   │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │ Links   │ │
│ └─────────┘ │
└─────────────┘
```

### Visual Design System

**Typography:**
- Primary font: System font stack for optimal performance
- Heading sizes: 2rem (h1), 1.5rem (h2)
- Body text: 1rem (16px base)
- Line height: 1.6 for readability

**Color Palette:**

*Light Theme:*
- Background: White (#ffffff)
- Secondary background: Light gray (#f5f5f5)
- Text: Dark gray (#333333)
- Accent: Blue (#4a90e2)

*Dark Theme:*
- Background: Dark blue (#1a1a2e)
- Secondary background: Navy (#16213e)
- Text: Light gray (#eaeaea)
- Accent: Light blue (#5dade2)

*Urgency Indicators:*
- High: Red (#e74c3c)
- Medium: Orange (#f39c12)
- Low: Green (#27ae60)

**Spacing System:**
- XS: 0.5rem (8px)
- SM: 1rem (16px)
- MD: 1.5rem (24px)
- LG: 2rem (32px)

### Interaction Design

**Button States:**
- Default: Subtle background, clear text
- Hover: Slightly darker background, cursor pointer
- Active: Pressed appearance with transform
- Disabled: Reduced opacity, no pointer events

**Form Inputs:**
- Clear placeholder text
- Focus state with accent color border
- Validation feedback (red border for errors)
- Smooth transitions (100ms)

**Animations:**
- Theme transitions: 200ms ease
- Task additions: Fade in 150ms
- Button interactions: 100ms
- Timer updates: No animation (instant)

### Accessibility Considerations

1. **Semantic HTML**: Proper heading hierarchy, landmarks
2. **ARIA Labels**: All interactive elements labeled
3. **Keyboard Navigation**: Tab order, Enter/Space activation
4. **Color Contrast**: WCAG AA compliance (4.5:1 minimum)
5. **Focus Indicators**: Visible focus rings on all controls

## Implementation Approach

### 1. Greeting Widget Implementation

**Time Display:**
```javascript
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('time-display').textContent = `${hours}:${minutes}`;
}

// Update every second
setInterval(updateTime, 1000);
```

**Date Display:**
```javascript
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options);
  document.getElementById('date-display').textContent = dateString;
}
```

**Greeting Logic:**
```javascript
function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

function updateGreeting() {
  const greeting = getGreeting();
  const userName = StorageManager.load('dashboard_userName') || '';
  const message = userName ? `${greeting}, ${userName}!` : `${greeting}!`;
  document.getElementById('greeting-message').textContent = message;
}
```

**Name Input Handling:**
```javascript
const nameInput = document.getElementById('name-input');

nameInput.addEventListener('input', (e) => {
  const name = e.target.value.trim();
  StorageManager.save('dashboard_userName', name);
  updateGreeting();
});

// Load saved name on init
nameInput.value = StorageManager.load('dashboard_userName') || '';
```

### 2. Focus Timer Implementation

**Timer State:**
```javascript
let timerSeconds = 1500; // 25 minutes
let timerInterval = null;
let isRunning = false;
```

**Timer Controls:**
```javascript
function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  isRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  timerSeconds = 1500;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = display;
}
```

### 3. Task Manager Implementation

**Task Operations:**
```javascript
function addTask(text, urgency) {
  const task = {
    id: `task_${Date.now()}`,
    text: text.trim(),
    urgency: urgency,
    completed: false,
    createdAt: Date.now()
  };
  
  AppState.tasks.push(task);
  StorageManager.save('dashboard_tasks', AppState.tasks);
  renderTasks();
}

function editTask(id, newText, newUrgency) {
  const task = AppState.tasks.find(t => t.id === id);
  if (task) {
    task.text = newText.trim();
    task.urgency = newUrgency;
    StorageManager.save('dashboard_tasks', AppState.tasks);
    renderTasks();
  }
}

function deleteTask(id) {
  AppState.tasks = AppState.tasks.filter(t => t.id !== id);
  StorageManager.save('dashboard_tasks', AppState.tasks);
  renderTasks();
}

function toggleComplete(id) {
  const task = AppState.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    StorageManager.save('dashboard_tasks', AppState.tasks);
    renderTasks();
  }
}
```

**Task Sorting:**
```javascript
function sortTasks(method) {
  if (method === 'alpha') {
    AppState.tasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (method === 'urgency') {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    AppState.tasks.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }
  renderTasks();
}
```

**Task Rendering:**
```javascript
function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  
  AppState.tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} urgency-${task.urgency}`;
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} 
             onchange="toggleComplete('${task.id}')" 
             aria-label="Mark task as complete">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <span class="urgency-badge">${task.urgency}</span>
      <button onclick="editTaskPrompt('${task.id}')" aria-label="Edit task">Edit</button>
      <button onclick="deleteTask('${task.id}')" aria-label="Delete task">Delete</button>
    `;
    taskList.appendChild(li);
  });
}
```

### 4. Quick Links Implementation

**Link Operations:**
```javascript
function addLink(url) {
  // Validate URL format
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  const link = {
    id: `link_${Date.now()}`,
    url: url,
    createdAt: Date.now()
  };
  
  AppState.quickLinks.push(link);
  StorageManager.save('dashboard_quickLinks', AppState.quickLinks);
  renderLinks();
}

function deleteLink(id) {
  AppState.quickLinks = AppState.quickLinks.filter(l => l.id !== id);
  StorageManager.save('dashboard_quickLinks', AppState.quickLinks);
  renderLinks();
}

function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
```

**Link Rendering:**
```javascript
function renderLinks() {
  const linksList = document.getElementById('links-list');
  linksList.innerHTML = '';
  
  AppState.quickLinks.forEach(link => {
    const linkButton = document.createElement('div');
    linkButton.className = 'link-item';
    
    const displayUrl = new URL(link.url).hostname;
    linkButton.innerHTML = `
      <button onclick="openLink('${link.url}')" class="link-button" 
              aria-label="Open ${displayUrl}">
        ${escapeHtml(displayUrl)}
      </button>
      <button onclick="deleteLink('${link.id}')" class="delete-link-btn" 
              aria-label="Delete link">×</button>
    `;
    linksList.appendChild(linkButton);
  });
}
```

### 5. Theme Manager Implementation

**Theme Toggle:**
```javascript
function initTheme() {
  const savedTheme = StorageManager.load('dashboard_theme') || 'light';
  applyTheme(savedTheme);
  
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  StorageManager.save('dashboard_theme', newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  AppState.theme = theme;
}
```

### 6. Storage Manager Implementation

**Local Storage Wrapper:**
```javascript
const StorageManager = {
  save(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },
  
  load(key) {
    try {
      const serialized = localStorage.getItem(key);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  loadAll() {
    AppState.userName = this.load('dashboard_userName') || '';
    AppState.tasks = this.load('dashboard_tasks') || [];
    AppState.quickLinks = this.load('dashboard_quickLinks') || [];
    AppState.theme = this.load('dashboard_theme') || 'light';
  }
};
```

### 7. Utility Functions

**HTML Escaping for XSS Prevention:**
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

**URL Validation:**
```javascript
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
```

### Performance Optimizations

1. **Debouncing**: Name input uses debouncing to reduce storage writes
2. **Event Delegation**: Task list uses event delegation for better performance
3. **Minimal Reflows**: Batch DOM updates where possible
4. **CSS Transitions**: Use GPU-accelerated properties (transform, opacity)
5. **Lazy Updates**: Only re-render components when data changes

### Browser Compatibility Strategy

**Feature Detection:**
```javascript
function checkBrowserSupport() {
  const features = {
    localStorage: typeof(Storage) !== "undefined",
    es6: typeof Symbol !== "undefined",
    customProperties: CSS.supports('--test', '0')
  };
  
  if (!features.localStorage) {
    alert('Your browser does not support Local Storage. Data will not persist.');
  }
  
  return features;
}
```

**Polyfills Not Required:**
- Target modern browsers (last 2 versions)
- Use only widely supported ES6+ features
- CSS custom properties supported in all target browsers
- No transpilation needed


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Greeting message matches time of day

*For any* hour of the day (0-23), the greeting function should return "Good morning" for hours 5-11, "Good afternoon" for hours 12-16, "Good evening" for hours 17-20, and "Good night" for hours 21-4.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 2: Time display format is valid

*For any* point in time, the time display should show a valid HH:MM format with two-digit hours and minutes.

**Validates: Requirements 1.1**

### Property 3: Date display format is valid

*For any* date, the date display should show a valid formatted date string containing weekday, month, day, and year.

**Validates: Requirements 1.2**

### Property 4: Name appears in greeting after save

*For any* non-empty user name, after saving the name to storage and updating the greeting, the greeting message should contain that user name.

**Validates: Requirements 1.7, 2.5**

### Property 5: Timer countdown decreases over time

*For any* timer state with seconds > 0, after starting the timer and waiting, the timer seconds should decrease.

**Validates: Requirements 3.2**

### Property 6: Timer updates display every second

*For any* running timer, the display should update at approximately 1-second intervals.

**Validates: Requirements 3.3**

### Property 7: Stopped timer does not continue counting

*For any* running timer, after stopping it and waiting, the timer value should remain unchanged.

**Validates: Requirements 3.4**

### Property 8: Reset returns timer to initial state

*For any* timer state, after resetting, the timer should return to 1500 seconds (25 minutes).

**Validates: Requirements 3.5**

### Property 9: Tasks require urgency level

*For any* task creation attempt, the task must have an urgency level of "high", "medium", or "low" to be valid.

**Validates: Requirements 4.2**

### Property 10: Adding task increases list length

*For any* task list and valid task, after adding the task, the list length should increase by one.

**Validates: Requirements 4.3**

### Property 11: Editing task updates storage

*For any* existing task, after editing its text or urgency and saving, retrieving the task from storage should return the updated values.

**Validates: Requirements 4.6**

### Property 12: Deleting task removes from storage

*For any* existing task, after deleting it, attempting to retrieve it from storage should return null or an empty result.

**Validates: Requirements 4.8**

### Property 13: Toggling completion changes status

*For any* task, after toggling its completion status, the task's completed property should be the opposite of its previous value.

**Validates: Requirements 5.2**

### Property 14: Completion status persists to storage

*For any* task, after toggling its completion status, retrieving the task from storage should reflect the new completion status.

**Validates: Requirements 5.3**

### Property 15: Alphabetical sort orders tasks A-Z

*For any* list of tasks, after applying alphabetical sort, each task's text should be lexicographically less than or equal to the next task's text.

**Validates: Requirements 6.2**

### Property 16: Urgency sort orders by priority

*For any* list of tasks, after applying urgency sort, all "high" urgency tasks should appear before "medium" urgency tasks, which should appear before "low" urgency tasks.

**Validates: Requirements 6.3**

### Property 17: Deleting quick link removes from storage

*For any* existing quick link, after deleting it, attempting to retrieve it from storage should return null or an empty result.

**Validates: Requirements 7.5**

### Property 18: Quick link opens correct URL

*For any* quick link with a valid URL, clicking the link should trigger opening that exact URL in a new tab.

**Validates: Requirements 7.3**

### Property 19: Theme values are valid

*For any* theme setting, the theme value should be either "light" or "dark" and no other value.

**Validates: Requirements 8.2**

### Property 20: Applied theme matches loaded theme

*For any* theme saved to storage, after loading the dashboard, the applied theme should match the saved theme.

**Validates: Requirements 8.7**

### Property 21: User name persistence round-trip

*For any* user name string, after saving it to storage and then loading it back, the loaded value should equal the original value.

**Validates: Requirements 9.2**

### Property 22: Tasks persistence round-trip

*For any* array of tasks, after saving them to storage and then loading them back, the loaded tasks should equal the original tasks (same count, same properties).

**Validates: Requirements 9.3**

### Property 23: Quick links persistence round-trip

*For any* array of quick links, after saving them to storage and then loading them back, the loaded links should equal the original links (same count, same URLs).

**Validates: Requirements 9.4**

### Property 24: Theme persistence round-trip

*For any* theme value ("light" or "dark"), after saving it to storage and then loading it back, the loaded theme should equal the original theme.

**Validates: Requirements 9.5**

### Property 25: Storage API is used for all persistence

*For any* data save operation, the system should call localStorage.setItem, and for any load operation, the system should call localStorage.getItem.

**Validates: Requirements 9.1**

### Property 26: No network requests are made

*For any* user interaction or dashboard operation, the system should not make any HTTP/HTTPS network requests.

**Validates: Requirements 14.1**

## Error Handling

### Local Storage Errors

**Quota Exceeded:**
- **Scenario**: User exceeds browser's Local Storage limit (typically 5-10MB)
- **Handling**: 
  - Catch `QuotaExceededError` in storage save operations
  - Display user-friendly error message: "Storage limit reached. Please delete some tasks or links."
  - Prevent data loss by keeping existing data intact
  - Log error to console for debugging

**Storage Unavailable:**
- **Scenario**: Browser has Local Storage disabled or in private browsing mode
- **Handling**:
  - Detect storage availability on app initialization
  - Display warning banner: "Local Storage is unavailable. Your data will not be saved."
  - Allow app to function with in-memory state only
  - Gracefully degrade persistence features

**Serialization Errors:**
- **Scenario**: Data cannot be serialized to JSON
- **Handling**:
  - Wrap JSON.stringify in try-catch blocks
  - Log specific error details to console
  - Preserve previous valid state
  - Notify user: "Failed to save data. Please try again."

### Input Validation Errors

**Invalid Task Text:**
- **Scenario**: User attempts to add empty or whitespace-only task
- **Handling**:
  - Validate input before processing
  - Display inline error message: "Task description cannot be empty"
  - Keep focus on input field
  - Clear error on valid input

**Invalid URL:**
- **Scenario**: User enters malformed URL for quick link
- **Handling**:
  - Validate URL format using URL constructor
  - Auto-prepend "https://" if protocol missing
  - Display error for truly invalid URLs: "Please enter a valid URL"
  - Provide example format: "https://example.com"

**Invalid User Name:**
- **Scenario**: User enters excessively long name (>50 characters)
- **Handling**:
  - Set maxlength attribute on input field
  - Truncate silently if exceeded
  - No error message needed (preventive measure)

### Timer Edge Cases

**Timer at Zero:**
- **Scenario**: Timer reaches 0:00
- **Handling**:
  - Stop timer automatically
  - Clear interval to prevent negative values
  - Keep display at 0:00
  - Disable start button until reset

**Multiple Start Clicks:**
- **Scenario**: User clicks start button multiple times
- **Handling**:
  - Check if timer is already running
  - Ignore subsequent start clicks
  - Prevent multiple intervals from running
  - Maintain single source of truth for timer state

### Data Corruption

**Malformed Storage Data:**
- **Scenario**: Local Storage contains invalid JSON or corrupted data
- **Handling**:
  - Wrap JSON.parse in try-catch blocks
  - Return default empty values on parse errors
  - Log corruption details to console
  - Allow user to continue with fresh state
  - Consider adding data version field for future migrations

**Missing Required Fields:**
- **Scenario**: Loaded task or link missing required properties
- **Handling**:
  - Validate loaded data structure
  - Filter out invalid items
  - Log validation failures
  - Continue with valid items only

### Browser Compatibility Issues

**Unsupported Features:**
- **Scenario**: Browser lacks required APIs (unlikely in modern browsers)
- **Handling**:
  - Feature detection on initialization
  - Display compatibility warning if critical features missing
  - Provide graceful degradation where possible
  - Suggest upgrading browser

### Race Conditions

**Concurrent Storage Updates:**
- **Scenario**: Multiple tabs open, simultaneous updates
- **Handling**:
  - Use storage event listener to detect external changes
  - Reload data when storage changes from another tab
  - Display notification: "Data updated in another tab"
  - Merge or overwrite based on timestamp (last write wins)

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness guarantees. This ensures both concrete behavior verification and comprehensive input coverage.

### Testing Framework Selection

**Unit Testing:**
- **Framework**: Jest (or Vitest for faster execution)
- **Rationale**: Widely adopted, excellent browser API mocking, built-in assertions
- **Configuration**: Run in jsdom environment to simulate browser APIs

**Property-Based Testing:**
- **Framework**: fast-check (JavaScript property-based testing library)
- **Rationale**: Mature library, excellent TypeScript support, configurable generators
- **Configuration**: Minimum 100 iterations per property test

### Unit Testing Approach

Unit tests focus on specific examples, edge cases, and integration points:

**Greeting Widget Tests:**
- Specific time examples (e.g., 10:30 AM → "Good morning")
- Edge case: Empty user name displays default greeting
- Edge case: Midnight hour (0:00) displays "Good night"
- Integration: Name input updates greeting immediately

**Timer Widget Tests:**
- Initial state: Timer displays "25:00"
- Edge case: Timer at zero stops counting
- Edge case: Multiple start clicks don't create multiple intervals
- Example: Start, wait 2 seconds, verify countdown
- Example: Stop, wait, verify no change
- Example: Reset from any state returns to 25:00

**Task Manager Tests:**
- Example: Add task with "high" urgency appears in list
- Edge case: Empty task text is rejected
- Edge case: Whitespace-only task text is rejected
- Example: Delete task removes it from list
- Example: Toggle completion changes visual state
- Integration: Sort persists after adding new task

**Quick Links Tests:**
- Example: Add "https://example.com" creates link button
- Edge case: URL without protocol gets "https://" prepended
- Example: Delete link removes button
- Integration: Click link calls window.open with correct URL

**Theme Manager Tests:**
- Example: Toggle from light to dark applies dark theme
- Example: Saved theme loads on initialization
- Edge case: Invalid theme value defaults to "light"

**Storage Manager Tests:**
- Example: Save and load string value
- Example: Save and load complex object
- Edge case: Load non-existent key returns null
- Edge case: Storage quota exceeded throws error
- Edge case: Invalid JSON in storage returns null

### Property-Based Testing Approach

Property tests verify universal correctness across randomly generated inputs. Each test runs minimum 100 iterations with varied inputs.

**Property Test Configuration:**
```javascript
import fc from 'fast-check';

// Example property test structure
describe('Property Tests', () => {
  it('Property 1: Greeting message matches time of day', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }), // Generate random hour
        (hour) => {
          const greeting = getGreeting(hour);
          
          if (hour >= 5 && hour < 12) {
            expect(greeting).toBe("Good morning");
          } else if (hour >= 12 && hour < 17) {
            expect(greeting).toBe("Good afternoon");
          } else if (hour >= 17 && hour < 21) {
            expect(greeting).toBe("Good evening");
          } else {
            expect(greeting).toBe("Good night");
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Tags:**

Each property test must include a comment tag referencing the design document:

```javascript
// Feature: productivity-dashboard, Property 1: Greeting message matches time of day
it('Property 1: Greeting message matches time of day', () => { ... });

// Feature: productivity-dashboard, Property 15: Alphabetical sort orders tasks A-Z
it('Property 15: Alphabetical sort orders tasks A-Z', () => { ... });
```

**Custom Generators:**

Define custom generators for domain objects:

```javascript
// Task generator
const taskArbitrary = fc.record({
  id: fc.string(),
  text: fc.string({ minLength: 1, maxLength: 200 }),
  urgency: fc.constantFrom('high', 'medium', 'low'),
  completed: fc.boolean(),
  createdAt: fc.integer({ min: 0 })
});

// Quick link generator
const linkArbitrary = fc.record({
  id: fc.string(),
  url: fc.webUrl(),
  createdAt: fc.integer({ min: 0 })
});

// User name generator
const userNameArbitrary = fc.string({ minLength: 1, maxLength: 50 });
```

**Property Test Coverage:**

All 26 correctness properties from the design document must be implemented as property-based tests:

1. **Greeting Properties (1-4)**: Test with random hours, dates, and user names
2. **Timer Properties (5-8)**: Test with random timer states and time intervals
3. **Task Properties (9-16)**: Test with random task arrays, texts, and urgencies
4. **Quick Link Properties (17-18)**: Test with random URLs and link arrays
5. **Theme Properties (19-20)**: Test with random theme values
6. **Persistence Properties (21-24)**: Test round-trips with random data
7. **Architecture Properties (25-26)**: Test with random operations

### Test Organization

```
tests/
├── unit/
│   ├── greeting.test.js
│   ├── timer.test.js
│   ├── tasks.test.js
│   ├── quicklinks.test.js
│   ├── theme.test.js
│   └── storage.test.js
└── properties/
    ├── greeting.properties.test.js
    ├── timer.properties.test.js
    ├── tasks.properties.test.js
    ├── quicklinks.properties.test.js
    ├── theme.properties.test.js
    └── persistence.properties.test.js
```

### Mocking Strategy

**Local Storage Mock:**
```javascript
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;
```

**Timer Mock:**
```javascript
jest.useFakeTimers();

// In tests
jest.advanceTimersByTime(1000); // Advance 1 second
```

**Window.open Mock:**
```javascript
global.open = jest.fn();

// Verify in tests
expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
```

### Coverage Goals

- **Line Coverage**: Minimum 90%
- **Branch Coverage**: Minimum 85%
- **Function Coverage**: Minimum 95%
- **Property Coverage**: 100% (all 26 properties tested)

### Continuous Testing

- Run unit tests on every file save (watch mode)
- Run full test suite (unit + property) before commits
- Run property tests with increased iterations (1000+) in CI/CD
- Generate coverage reports in CI/CD pipeline

### Manual Testing Checklist

While automated tests cover functional correctness, manual testing verifies:

1. **Visual Design**: Layout, spacing, colors, typography
2. **Responsiveness**: Test on mobile, tablet, desktop sizes
3. **Browser Compatibility**: Test in Chrome, Firefox, Edge, Safari
4. **Accessibility**: Screen reader testing, keyboard navigation
5. **Performance**: Load time, interaction responsiveness
6. **User Experience**: Intuitive workflows, clear feedback

### Test Data Management

- Use fresh storage state for each test (clear localStorage in beforeEach)
- Generate realistic test data (valid URLs, reasonable task texts)
- Test boundary conditions (empty lists, maximum storage, zero timer)
- Test with various data sizes (1 task, 50 tasks, 100 tasks)
