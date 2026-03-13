# Implementation Plan: Productivity Dashboard

## Overview

This plan implements a client-side productivity dashboard using vanilla HTML, CSS, and JavaScript. The dashboard includes a personalized greeting widget, 25-minute focus timer, task manager with urgency levels and sorting, quick links manager, and theme toggle. All data persists locally using the Browser Local Storage API.

## Tasks

- [x] 1. Set up project structure and core files
  - Create directory structure: `css/` and `js/` folders
  - Create `index.html` with semantic HTML structure and all widget sections
  - Create `css/styles.css` with CSS custom properties for theming
  - Create `js/app.js` with module structure and AppState object
  - _Requirements: 13.1, 13.2, 13.3, 14.3_

- [x] 2. Implement Storage Manager module
  - [x] 2.1 Create StorageManager with save, load, and remove methods
    - Implement JSON serialization/deserialization with error handling
    - Add try-catch blocks for quota exceeded and parse errors
    - Implement loadAll method to restore all persisted data
    - _Requirements: 9.1, 9.6_
  
  - [x]* 2.2 Write property test for Storage Manager
    - **Property 21: User name persistence round-trip**
    - **Property 22: Tasks persistence round-trip**
    - **Property 23: Quick links persistence round-trip**
    - **Property 24: Theme persistence round-trip**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**
  
  - [x]* 2.3 Write unit tests for Storage Manager edge cases
    - Test loading non-existent keys returns null
    - Test handling of malformed JSON data
    - Test quota exceeded error handling
    - _Requirements: 9.1_

- [x] 3. Implement Greeting Widget
  - [x] 3.1 Create time and date display functions
    - Implement updateTime with HH:MM format and setInterval for updates
    - Implement updateDate with formatted date string
    - _Requirements: 1.1, 1.2_
  
  - [x] 3.2 Create greeting message logic
    - Implement getGreeting function with time-based logic (morning/afternoon/evening/night)
    - Implement updateGreeting to display message with optional user name
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  
  - [x] 3.3 Implement name input handling
    - Add input event listener to save user name to Local Storage
    - Load saved name on initialization and populate input field
    - Update greeting immediately when name changes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x]* 3.4 Write property tests for Greeting Widget
    - **Property 1: Greeting message matches time of day**
    - **Property 2: Time display format is valid**
    - **Property 3: Date display format is valid**
    - **Property 4: Name appears in greeting after save**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.5**
  

- [ ] 4. Checkpoint - Ensure greeting widget works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Focus Timer Widget
  - [x] 5.1 Create timer state and display logic
    - Initialize timer at 1500 seconds (25 minutes)
    - Implement updateTimerDisplay with MM:SS format
    - _Requirements: 3.1_
  
  - [x] 5.2 Implement timer controls
    - Implement startTimer with setInterval and countdown logic
    - Implement stopTimer to pause countdown
    - Implement resetTimer to return to 25 minutes
    - Add event listeners for start, stop, and reset buttons
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [-] 5.3 Write property tests for Focus Timer
    - **Property 5: Timer countdown decreases over time**
    - **Property 6: Timer updates display every second**
    - **Property 7: Stopped timer does not continue counting**
    - **Property 8: Reset returns timer to initial state**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**
  
  - [-] 5.4 Write unit tests for Focus Timer
    - Test timer at zero stops counting
    - Test multiple start clicks don't create multiple intervals
    - Test start, wait, verify countdown
    - Test stop, wait, verify no change
    - _Requirements: 3.2, 3.4, 3.6_

- [ ] 6. Implement Task Manager core operations
  - [x] 6.1 Create task data model and CRUD operations
    - Implement addTask with id generation, validation, and storage save
    - Implement editTask to update text and urgency
    - Implement deleteTask to remove from array and storage
    - Implement toggleComplete to change completion status
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.1, 5.2, 5.3_
  
  - [x] 6.2 Implement task rendering
    - Create renderTasks function to generate task list HTML
    - Add visual distinction for completed tasks
    - Add urgency badges with color indicators
    - Implement HTML escaping for XSS prevention
    - _Requirements: 4.3, 5.4_
  
  - [ ] 6.3 Write property tests for Task Manager operations
    - **Property 9: Tasks require urgency level**
    - **Property 10: Adding task increases list length**
    - **Property 11: Editing task updates storage**
    - **Property 12: Deleting task removes from storage**
    - **Property 13: Toggling completion changes status**
    - **Property 14: Completion status persists to storage**
    - **Validates: Requirements 4.2, 4.3, 4.6, 4.8, 5.2, 5.3**
  
  - [ ] 6.4 Write unit tests for Task Manager
    - Test empty task text is rejected
    - Test whitespace-only task text is rejected
    - Test add task with "high" urgency appears in list
    - Test delete task removes it from list
    - Test toggle completion changes visual state
    - _Requirements: 4.1, 4.3, 4.7, 5.1, 5.2_

- [ ] 7. Implement task sorting functionality
  - [x] 7.1 Create sort functions and controls
    - Implement sortTasks with alphabetical and urgency methods
    - Add event listeners for sort buttons
    - Update active button state on sort selection
    - Apply urgency color indicators (red/orange/green)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 7.2 Write property tests for task sorting
    - **Property 15: Alphabetical sort orders tasks A-Z**
    - **Property 16: Urgency sort orders by priority**
    - **Validates: Requirements 6.2, 6.3**
  
  - [ ]* 7.3 Write unit tests for task sorting
    - Test alphabetical sort with mixed case
    - Test urgency sort with all three levels
    - Test sort persists after adding new task
    - _Requirements: 6.2, 6.3_

- [ ] 8. Implement task input form and integration
  - [x] 8.1 Wire task input form to task operations
    - Add event listener for add task button
    - Validate input before creating task
    - Clear input fields after successful add
    - Load tasks from storage on initialization
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.9_

- [ ] 9. Checkpoint - Ensure task manager works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Quick Links Manager
  - [x] 10.1 Create quick link operations
    - Implement addLink with URL validation and auto-prepend https://
    - Implement deleteLink to remove from array and storage
    - Implement openLink to open URL in new tab with security attributes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 10.2 Implement quick links rendering
    - Create renderLinks function to generate link buttons
    - Display hostname as button text
    - Add delete button for each link
    - Load links from storage on initialization
    - _Requirements: 7.3, 7.4, 7.6_
  
  - [ ]* 10.3 Write property tests for Quick Links Manager
    - **Property 17: Deleting quick link removes from storage**
    - **Property 18: Quick link opens correct URL**
    - **Validates: Requirements 7.3, 7.5**
  
  - [ ]* 10.4 Write unit tests for Quick Links Manager
    - Test URL without protocol gets "https://" prepended
    - Test invalid URL displays error message
    - Test delete link removes button
    - Test click link calls window.open with correct URL
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 11. Implement Theme Manager
  - [x] 11.1 Create theme toggle functionality
    - Implement applyTheme to set data-theme attribute
    - Implement toggleTheme to switch between light and dark
    - Add event listener for theme toggle button
    - Load saved theme from storage on initialization
    - Save theme preference to storage on change
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ]* 11.2 Write property tests for Theme Manager
    - **Property 19: Theme values are valid**
    - **Property 20: Applied theme matches loaded theme**
    - **Validates: Requirements 8.2, 8.7**
  
  - [ ]* 11.3 Write unit tests for Theme Manager
    - Test toggle from light to dark applies dark theme
    - Test saved theme loads on initialization
    - Test invalid theme value defaults to "light"
    - _Requirements: 8.2, 8.3, 8.4, 8.7_

- [ ] 12. Implement CSS styling and theming
  - [x] 12.1 Create base styles and layout
    - Define CSS custom properties for colors, spacing, typography
    - Implement responsive grid layout for widgets
    - Add base styles for typography and form elements
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [x] 12.2 Create theme-specific styles
    - Define light theme color values
    - Define dark theme color values with [data-theme="dark"] selector
    - Ensure sufficient contrast for both themes
    - Add smooth transitions for theme changes (200ms)
    - _Requirements: 8.3, 8.4, 12.4_
  
  - [x] 12.3 Style individual widgets
    - Style greeting widget with time, date, and name input
    - Style timer widget with large display and control buttons
    - Style task widget with input form, sort controls, and task list
    - Style quick links widget with link buttons
    - Style theme toggle button
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [x] 12.4 Add responsive design and mobile styles
    - Create media queries for tablet and mobile breakpoints
    - Adjust layout to single column on mobile
    - Ensure touch-friendly button sizes
    - _Requirements: 12.1, 12.5_

- [ ] 13. Implement Application initialization
  - [x] 13.1 Create App.init function
    - Call StorageManager.loadAll to restore persisted data
    - Initialize all widget modules (Greeting, Timer, Task, QuickLinks, Theme)
    - Add DOMContentLoaded event listener to trigger initialization
    - _Requirements: 9.6, 14.1_
  
  - [ ]* 13.2 Write property tests for architecture constraints
    - **Property 25: Storage API is used for all persistence**
    - **Property 26: No network requests are made**
    - **Validates: Requirements 9.1, 14.1**

- [ ] 14. Add error handling and validation
  - [x] 14.1 Implement input validation
    - Validate task text is not empty or whitespace-only
    - Validate URL format for quick links
    - Validate user name length (max 50 characters)
    - Display inline error messages for validation failures
    - _Requirements: 4.1, 7.1, 2.1_
  
  - [x] 14.2 Implement storage error handling
    - Add try-catch for quota exceeded errors
    - Add try-catch for JSON parse errors
    - Display user-friendly error messages
    - Detect storage availability on initialization
    - _Requirements: 9.1_
  
  - [x] 14.3 Add utility functions
    - Implement escapeHtml for XSS prevention
    - Implement isValidUrl for URL validation
    - Implement checkBrowserSupport for feature detection
    - _Requirements: 10.5, 14.1_

- [ ] 15. Checkpoint - Ensure all features work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 16. Add accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure proper heading hierarchy
  - Add focus indicators for keyboard navigation
  - Test keyboard navigation (Tab, Enter, Space)
  - _Requirements: 12.1, 12.2_

- [ ]* 17. Browser compatibility testing
  - Test in Chrome browser
  - Test in Firefox browser
  - Test in Edge browser
  - Test in Safari browser
  - Verify all features work across browsers
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 18. Performance testing and optimization
  - Verify dashboard loads within 1 second
  - Verify interactions respond within 100ms
  - Test with 100 tasks to ensure responsive performance
  - Optimize DOM updates and event handlers if needed
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 19. Final integration and wiring
  - [ ] 19.1 Verify all components are integrated
    - Ensure all widgets load data from storage on initialization
    - Ensure all user actions persist to storage
    - Ensure theme applies correctly on load
    - Test complete user workflows end-to-end
    - _Requirements: 9.6, 14.1, 14.2_
  
  - [ ]* 19.2 Run full test suite
    - Run all unit tests
    - Run all property-based tests
    - Verify 90% line coverage, 85% branch coverage
    - Fix any failing tests

- [ ] 20. Final checkpoint - Complete implementation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- All data persistence uses Local Storage API exclusively
- Application runs entirely client-side with no backend dependencies
- Focus on minimal, clean code following the design document specifications
