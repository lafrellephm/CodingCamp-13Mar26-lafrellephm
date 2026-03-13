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
  isAvailable: true,

  // Check if localStorage is available and working
  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      const testValue = 'test';
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== testValue) {
        throw new Error('Storage test failed');
      }

      this.isAvailable = true;
      return true;
    } catch (error) {
      console.error('Local Storage is not available:', error);
      this.isAvailable = false;
      this.showStorageUnavailableMessage();
      return false;
    }
  },

  showStorageUnavailableMessage() {
    // Create a non-intrusive notification
    const notification = document.createElement('div');
    notification.id = 'storage-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
      <strong>Storage Unavailable</strong><br>
      Your data will not be saved between sessions. Please check your browser settings.
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 8px;">×</button>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  },

  showQuotaExceededMessage() {
    // Create a user-friendly quota exceeded notification
    const notification = document.createElement('div');
    notification.id = 'quota-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff9800;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      max-width: 320px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
      <strong>Storage Full</strong><br>
      Unable to save data. Please clear some browser storage or delete old tasks/links.
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 8px;">×</button>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);
  },

  showDataCorruptionMessage(key) {
    // Create a user-friendly data corruption notification
    const notification = document.createElement('div');
    notification.id = 'corruption-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2196f3;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    const dataType = key.replace('dashboard_', '').replace(/([A-Z])/g, ' $1').toLowerCase();
    notification.innerHTML = `
      <strong>Data Restored</strong><br>
      Corrupted ${dataType} data was automatically fixed. Your dashboard is ready to use.
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 8px;">×</button>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  },

  save(key, value) {
    if (!this.isAvailable) {
      console.warn('Storage not available, data will not persist');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error('Storage quota exceeded. Unable to save data:', error);
        this.showQuotaExceededMessage();
      } else {
        console.error('Storage save error:', error);
        // Show generic error for other storage issues
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #f44336;
          color: white;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
          max-width: 300px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        notification.innerHTML = `
          <strong>Save Error</strong><br>
          Unable to save your changes. Please try again.
          <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 8px;">×</button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
      }
      return false;
    }
  },

  load(key) {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) {
        return null;
      }

      // Attempt to parse JSON with error handling
      try {
        return JSON.parse(serialized);
      } catch (parseError) {
        console.error(`JSON parse error for key "${key}":`, parseError);
        console.warn(`Removing corrupted data for key "${key}"`);
        // Remove corrupted data
        this.remove(key);
        // Show user-friendly message about data restoration
        this.showDataCorruptionMessage(key);
        return null;
      }
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },

  remove(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  loadAll() {
    try {
      AppState.userName = this.load('dashboard_userName') || '';
      AppState.tasks = this.load('dashboard_tasks') || [];
      AppState.quickLinks = this.load('dashboard_quickLinks') || [];
      AppState.theme = this.load('dashboard_theme') || 'light';
    } catch (error) {
      console.error('Error loading persisted data:', error);
      // Initialize with defaults if loading fails
      AppState.userName = '';
      AppState.tasks = [];
      AppState.quickLinks = [];
      AppState.theme = 'light';
    }
  }
}

// Greeting Module
const GreetingWidget = {
  init() {
    this.updateTime();
    this.updateDate();
    this.updateGreeting();
    
    // Update time every second
    setInterval(() => this.updateTime(), 1000);
    
    // Update date every minute
    setInterval(() => this.updateDate(), 60000);
    
    // Update greeting every minute
    setInterval(() => this.updateGreeting(), 60000);
    
    // Handle name input
    const nameInput = document.getElementById('name-input');
    nameInput.value = AppState.userName;
    nameInput.addEventListener('input', (e) => this.handleNameInput(e));
  },
  
  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('time-display').textContent = `${hours}:${minutes}`;
  },
  
  updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('date-display').textContent = dateString;
  },
  
  getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  },
  
  updateGreeting() {
    const greeting = this.getGreeting();
    const userName = AppState.userName;
    const message = userName ? `${greeting}, ${userName}!` : `${greeting}!`;
    document.getElementById('greeting-message').textContent = message;
  },
  
  handleNameInput(e) {
    const name = e.target.value.trim();
    
    // Validate user name length
    const validationError = validateUserName(name);
    if (validationError) {
      showError('name-error', validationError);
      // Don't save invalid name, but allow user to continue typing
      return;
    } else {
      hideError('name-error');
    }
    
    AppState.userName = name;
    StorageManager.save('dashboard_userName', name);
    this.updateGreeting();
  }
};

// Timer Module
const TimerWidget = {
  init() {
    this.updateDisplay();
    
    document.getElementById('timer-start').addEventListener('click', () => this.start());
    document.getElementById('timer-stop').addEventListener('click', () => this.stop());
    document.getElementById('timer-reset').addEventListener('click', () => this.reset());
  },
  
  start() {
    if (AppState.timerRunning) return;
    
    AppState.timerRunning = true;
    AppState.timerInterval = setInterval(() => this.tick(), 1000);
  },
  
  stop() {
    AppState.timerRunning = false;
    if (AppState.timerInterval) {
      clearInterval(AppState.timerInterval);
      AppState.timerInterval = null;
    }
  },
  
  reset() {
    this.stop();
    AppState.timerSeconds = 1500;
    this.updateDisplay();
  },
  
  tick() {
    if (AppState.timerSeconds > 0) {
      AppState.timerSeconds--;
      this.updateDisplay();
    } else {
      this.stop();
    }
  },
  
  updateDisplay() {
    const minutes = Math.floor(AppState.timerSeconds / 60);
    const seconds = AppState.timerSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
  }
};

// Task Module
const TaskManager = {
  init() {
    this.renderTasks();
    
    // Apply initial sort state (default is alphabetical)
    this.sortTasks(AppState.currentSort);
    
    // Add event listeners for task input form
    document.getElementById('task-add-btn').addEventListener('click', () => this.handleAddTask());
    
    // Add Enter key support for task input
    const taskInput = document.getElementById('task-input');
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTask();
      }
    });
    
    // Add sort control event listeners
    document.getElementById('sort-alpha').addEventListener('click', () => this.sortTasks('alpha'));
    document.getElementById('sort-urgency').addEventListener('click', () => this.sortTasks('urgency'));
  },
  
  handleAddTask() {
    const input = document.getElementById('task-input');
    const urgencySelect = document.getElementById('task-urgency');
    const text = input.value.trim();
    const urgency = urgencySelect.value;
    
    // Clear any previous error messages
    hideError('task-error');
    
    // Validate task text
    const textValidationError = validateTaskText(text);
    if (textValidationError) {
      showError('task-error', textValidationError);
      input.focus();
      return;
    }
    
    // Validate urgency level
    if (!['high', 'medium', 'low'].includes(urgency)) {
      showError('task-error', 'Please select a valid urgency level.');
      urgencySelect.focus();
      return;
    }
    
    // Add task and clear input fields after successful add
    this.addTask(text, urgency);
    input.value = '';
    urgencySelect.value = 'low'; // Reset to default
  },
  
  addTask(text, urgency) {
    const task = {
      id: `task_${Date.now()}`,
      text: text,
      urgency: urgency,
      completed: false,
      createdAt: Date.now()
    };
    
    AppState.tasks.push(task);
    StorageManager.save('dashboard_tasks', AppState.tasks);
    this.renderTasks();
  },
  
  editTask(id, newText, newUrgency) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      task.urgency = newUrgency;
      StorageManager.save('dashboard_tasks', AppState.tasks);
      this.renderTasks();
    }
  },
  
  deleteTask(id) {
    AppState.tasks = AppState.tasks.filter(t => t.id !== id);
    StorageManager.save('dashboard_tasks', AppState.tasks);
    this.renderTasks();
  },
  
  toggleComplete(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      StorageManager.save('dashboard_tasks', AppState.tasks);
      this.renderTasks();
    }
  },
  
  sortTasks(method) {
    AppState.currentSort = method;
    const taskList = document.getElementById('task-list');
    
    if (method === 'alpha') {
      AppState.tasks.sort((a, b) => a.text.localeCompare(b.text));
      document.getElementById('sort-alpha').classList.add('active');
      document.getElementById('sort-urgency').classList.remove('active');
      // Remove urgency color indicators for alphabetical sort
      taskList.classList.remove('urgency-sort');
    } else if (method === 'urgency') {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      AppState.tasks.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
      document.getElementById('sort-urgency').classList.add('active');
      document.getElementById('sort-alpha').classList.remove('active');
      // Add urgency color indicators for urgency sort
      taskList.classList.add('urgency-sort');
    }
    
    this.renderTasks();
  },
  
  renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    AppState.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''} urgency-${task.urgency}`;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task as complete');
      checkbox.addEventListener('change', () => this.toggleComplete(task.id));
      
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.innerHTML = escapeHtml(task.text);
      
      const urgencyBadge = document.createElement('span');
      urgencyBadge.className = 'urgency-badge';
      urgencyBadge.textContent = task.urgency;
      
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.addEventListener('click', () => this.editTaskPrompt(task.id));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      
      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(urgencyBadge);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      
      taskList.appendChild(li);
    });
  },
  
  editTaskPrompt(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
      const newText = prompt('Edit task:', task.text);
      if (newText !== null && newText.trim()) {
        const newUrgency = prompt('Edit urgency (high/medium/low):', task.urgency);
        if (newUrgency && ['high', 'medium', 'low'].includes(newUrgency.toLowerCase())) {
          this.editTask(id, newText.trim(), newUrgency.toLowerCase());
        }
      }
    }
  }
};

// Quick Links Module
const QuickLinksManager = {
  init() {
    this.renderLinks();
    
    document.getElementById('link-add-btn').addEventListener('click', () => this.handleAddLink());
    
    // Add Enter key support for link input
    const linkInput = document.getElementById('link-input');
    linkInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddLink();
      }
    });
  },
  
  handleAddLink() {
      const input = document.getElementById('link-input');
      let url = input.value.trim();

      // Clear any previous error messages
      hideError('link-error');

      // Validate URL
      const validationError = validateUrl(url);
      if (validationError) {
        showError('link-error', validationError);
        input.focus();
        return;
      }

      this.addLink(url);
      input.value = '';
    }
,
  
  addLink(url, icon = null) {
    // Validate URL format and auto-prepend https:// if needed
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Create the link object (validation already done in handleAddLink)
    const link = {
      id: `link_${Date.now()}`,
      url: url,
      icon: icon,
      createdAt: Date.now()
    };
    
    AppState.quickLinks.push(link);
    StorageManager.save('dashboard_quickLinks', AppState.quickLinks);
    this.renderLinks();
  },
  
  deleteLink(id) {
    AppState.quickLinks = AppState.quickLinks.filter(l => l.id !== id);
    StorageManager.save('dashboard_quickLinks', AppState.quickLinks);
    this.renderLinks();
  },
  
  openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  
  renderLinks() {
    const linksList = document.getElementById('links-list');
    linksList.innerHTML = '';
    
    AppState.quickLinks.forEach(link => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      
      let displayUrl;
      try {
        displayUrl = new URL(link.url).hostname;
      } catch (e) {
        displayUrl = link.url;
      }
      
      const linkButton = document.createElement('button');
      linkButton.className = 'link-button';
      
      // Add icon if available
      if (link.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'link-icon';
        iconSpan.innerHTML = link.icon;
        linkButton.appendChild(iconSpan);
      }
      
      const textSpan = document.createElement('span');
      textSpan.textContent = displayUrl;
      linkButton.appendChild(textSpan);
      
      linkButton.setAttribute('aria-label', `Open ${escapeHtml(displayUrl)}`);
      linkButton.addEventListener('click', () => this.openLink(link.url));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-link-btn';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', 'Delete link');
      deleteBtn.addEventListener('click', () => this.deleteLink(link.id));
      
      linkItem.appendChild(linkButton);
      linkItem.appendChild(deleteBtn);
      
      linksList.appendChild(linkItem);
    });
  }
};

// Theme Module
const ThemeManager = {
  init() {
    this.applyTheme(AppState.theme);
    
    document.getElementById('theme-toggle-btn').addEventListener('click', () => this.toggle());
  },
  
  toggle() {
    const currentTheme = AppState.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    AppState.theme = newTheme;
    StorageManager.save('dashboard_theme', newTheme);
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.theme = theme;
  }
};

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Validation utility functions
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

function validateTaskText(text) {
  if (!text || text.trim() === '') {
    return 'Task text cannot be empty.';
  }
  if (text.length > 200) {
    return 'Task text cannot exceed 200 characters.';
  }
  return null;
}

function validateUserName(name) {
  if (name.length > 50) {
    return 'Name cannot exceed 50 characters.';
  }
  return null;
}

function validateUrl(url) {
  if (!url || url.trim() === '') {
    return 'URL cannot be empty.';
  }
  
  // Basic URL pattern validation
  const urlPattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
  if (!urlPattern.test(url)) {
    return 'Please enter a valid URL with only allowed characters.';
  }
  
  // Try to create URL object to validate format
  let testUrl = url;
  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
    testUrl = 'https://' + testUrl;
  }
  
  try {
    new URL(testUrl);
    return null;
  } catch (e) {
    return 'Please enter a valid URL format.';
  }
}
// Additional utility functions for requirements 10.5 and 14.1
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

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

// Application Initialization
const App = {
  init() {
    // Check storage availability before attempting to load data
    StorageManager.checkAvailability();
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
