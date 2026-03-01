/**
 * TaskFlow — Smart Task Manager
 * Main Application Logic
 *
 * Features:
 * - Add, complete, delete, and edit tasks
 * - Search tasks by text
 * - Filter tasks by status (All, Active, Completed)
 * - Persistent storage using localStorage
 * - Toast notifications for user feedback
 * - Keyboard shortcuts for quick actions
 * - Smooth animations and transitions
 */

// ============================================
// Constants & Configuration
// ============================================
const STORAGE_KEY = 'taskflow_tasks';
const TOAST_DURATION = 2500;

// ============================================
// State Management
// ============================================
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let editingTaskId = null;

// Animated Placeholder State
const placeholderTexts = [
    "What needs to be done?",
    "Design project proposal...",
    "Review code from team...",
    "Push to feature branch...",
    "Press Enter to add task"
];
let placeholderTextIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

// ============================================
// DOM Elements
// ============================================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCounter = document.getElementById('task-counter');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const toastContainer = document.getElementById('toast-container');
const prioritySelect = document.getElementById('priority-select');

// Filter count elements
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');

// Footer Actions
const exportBtn = document.getElementById('export-btn');
const importInput = document.getElementById('import-input');

// ============================================
// Initializations
// ============================================

/**
 * Show a toast notification
 * @param {string} message - The notification message
 * @param {string} type - Type of toast ('success', 'danger', 'info', 'warning')
 */
function showToast(message, type = 'success') {
    const icons = {
        success: '✅',
        danger: '🗑️',
        info: 'ℹ️',
        warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '📌'}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto-remove toast after duration
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, TOAST_DURATION);
}

// ============================================
// Task Operations
// ============================================

/**
 * Generate a unique ID for each task
 * @returns {string} Unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Create a new task object
 * @param {string} text - The task description
 * @param {string} priority - The task priority ('low', 'medium', 'high')
 * @returns {object} Task object with id, text, completed status, priority, and timestamp
 */
function createTask(text, priority = 'medium') {
    return {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString()
    };
}

/**
 * Add a new task to the list
 * @param {string} text - The task description
 * @param {string} priority - The task priority
 */
function addTask(text, priority) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Check for duplicate task
    const isDuplicate = tasks.some(
        t => t.text.toLowerCase() === trimmedText.toLowerCase()
    );

    if (isDuplicate) {
        showToast('Task already exists!', 'warning');
        return;
    }

    const task = createTask(trimmedText, priority);
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    prioritySelect.value = 'medium'; // Reset priority
    taskInput.focus();
    showToast(`Task added: "${trimmedText}"`, 'success');
}

/**
 * Toggle the completion status of a task
 * @param {string} id - The task ID
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();

        const statusText = task.completed ? 'completed' : 'reactivated';
        showToast(`Task ${statusText}: "${task.text}"`, 'info');
    }
}

/**
 * Delete a task from the list with animation
 * @param {string} id - The task ID
 */
function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const task = tasks.find(t => t.id === id);

    if (taskElement) {
        taskElement.classList.add('removing');

        taskElement.addEventListener('animationend', () => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();

            if (task) {
                showToast(`Task deleted: "${task.text}"`, 'danger');
            }
        });
    }
}

/**
 * Start editing a task (inline editing)
 * @param {string} id - The task ID
 */
function startEditTask(id) {
    editingTaskId = id;
    renderTasks();

    // Focus the edit input after rendering
    const editInput = document.querySelector('.task-edit-input');
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

/**
 * Save the edited task text
 * @param {string} id - The task ID
 * @param {string} newText - The updated task text
 */
function saveEditTask(id, newText) {
    const trimmedText = newText.trim();

    if (!trimmedText) {
        cancelEditTask();
        return;
    }

    const task = tasks.find(t => t.id === id);
    if (task && task.text !== trimmedText) {
        task.text = trimmedText;
        saveTasks();
        showToast('Task updated successfully', 'info');
    }

    editingTaskId = null;
    renderTasks();
}

/**
 * Cancel editing a task
 */
function cancelEditTask() {
    editingTaskId = null;
    renderTasks();
}

/**
 * Clear all completed tasks
 */
function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showToast(`Cleared ${completedCount} completed task(s)`, 'danger');
}

// ============================================
// Search
// ============================================

/**
 * Handle search input changes
 * @param {string} query - The search query
 */
function handleSearch(query) {
    searchQuery = query.toLowerCase().trim();
    searchClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
    renderTasks();
}

/**
 * Clear the search input
 */
function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderTasks();
    searchInput.focus();
}

// ============================================
// Filtering
// ============================================

/**
 * Get tasks based on the current filter and search query
 * @returns {Array} Filtered and searched tasks
 */
function getFilteredTasks() {
    let filtered;

    switch (currentFilter) {
        case 'active':
            filtered = tasks.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = tasks.filter(t => t.completed);
            break;
        default:
            filtered = [...tasks];
    }

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.text.toLowerCase().includes(searchQuery)
        );
    }

    return filtered;
}

/**
 * Set the active filter
 * @param {string} filter - Filter type ('all', 'active', 'completed')
 */
function setFilter(filter) {
    currentFilter = filter;

    // Update active button styling
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderTasks();
}

// ============================================
// Local Storage
// ============================================

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks:', error);
        showToast('Failed to save tasks', 'warning');
    }
}

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            tasks = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load tasks:', error);
        tasks = [];
    }
}

// ============================================
// Drag and Drop
// ============================================

function handleDragStart(e) {
    draggedTaskId = e.target.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedTaskId);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    const targetElement = e.target.closest('.task-item');
    if (targetElement && targetElement.dataset.id !== draggedTaskId) {
        const bounding = targetElement.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        if (e.clientY - offset > 0) {
            targetElement.classList.remove('drag-above');
            targetElement.classList.add('drag-below');
        } else {
            targetElement.classList.remove('drag-below');
            targetElement.classList.add('drag-above');
        }
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    const targetElement = e.target.closest('.task-item');
    if (targetElement && targetElement.dataset.id !== draggedTaskId) {
        targetElement.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const targetElement = e.target.closest('.task-item');
    if (targetElement) {
        targetElement.classList.remove('drag-over', 'drag-above', 'drag-below');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropTargetId = e.target.closest('.task-item')?.dataset.id;

    // Remove drag-over classes from all elements
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over', 'drag-above', 'drag-below');
    });

    if (draggedTaskId === dropTargetId || !draggedTaskId || !dropTargetId) {
        return;
    }

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const dropIndex = tasks.findIndex(t => t.id === dropTargetId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    const [draggedTask] = tasks.splice(draggedIndex, 1);

    // Determine if dropping above or below
    const targetElement = e.target.closest('.task-item');
    const bounding = targetElement.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2);
    const insertBefore = e.clientY - offset <= 0;

    if (insertBefore) {
        tasks.splice(dropIndex, 0, draggedTask);
    } else {
        tasks.splice(dropIndex + 1, 0, draggedTask);
    }

    saveTasks();
    renderTasks();
    showToast('Task reordered', 'info');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over', 'drag-above', 'drag-below');
    });
    draggedTaskId = null;
}

// ============================================
// Rendering
// ============================================

/**
 * Create the HTML element for a single task
 * @param {object} task - Task object
 * @returns {HTMLElement} Task list item element
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;
    li.setAttribute('draggable', 'true');

    const isEditing = editingTaskId === task.id;

    if (isEditing) {
        // Edit mode
        li.innerHTML = `
            <input type="text" class="task-edit-input" value="${escapeAttr(task.text)}" maxlength="100" aria-label="Edit task">
            <div class="shortcuts-hint" style="margin:0;"><span><kbd>Enter</kbd> save</span> <span><kbd>Esc</kbd> cancel</span></div>
        `;

        // Event: Save on Enter, Cancel on Escape
        const editInput = li.querySelector('.task-edit-input');
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEditTask(task.id, editInput.value);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEditTask();
            }
        });

        // Event: Save on blur
        editInput.addEventListener('blur', () => {
            saveEditTask(task.id, editInput.value);
        });
    } else {
        // Normal mode
        li.innerHTML = `
            <div class="drag-handle" style="cursor: grab; color: var(--text-muted); opacity: 0.5;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
            </div>
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
                <span class="checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </span>
            </label>
            <span class="task-text" title="Double-click to edit">
                ${task.priority ? `<span class="task-priority priority-${task.priority}">${task.priority}</span>` : ''}
                ${highlightSearch(escapeHtml(task.text))}
            </span>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task" title="Edit task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="delete-btn" aria-label="Delete task" title="Delete task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;

        // Event: Toggle completion
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Event: Edit on double-click
        const taskText = li.querySelector('.task-text');
        taskText.addEventListener('dblclick', () => startEditTask(task.id));

        // Event: Edit button click
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => startEditTask(task.id));

        // Event: Delete task
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    }

    return li;
}

/**
 * Highlight search query in task text
 * @param {string} text - The escaped task text
 * @returns {string} Text with highlighted search matches
 */
function highlightSearch(text) {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(102, 126, 234, 0.3); color: inherit; border-radius: 2px; padding: 0 2px;">$1</mark>');
}

/**
 * Escape special regex characters
 * @param {string} str - Raw string
 * @returns {string} Escaped regex string
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Raw text
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Escape attribute value for safe HTML insertion
 * @param {string} text - Raw text
 * @returns {string} Escaped attribute value
 */
function escapeAttr(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Render the task list and update UI state
 */
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Clear the list
    taskList.innerHTML = '';

    // Render each task
    filteredTasks.forEach(task => {
        const element = createTaskElement(task);
        taskList.appendChild(element);
    });

    // Update empty state visibility
    updateEmptyState(filteredTasks.length);

    // Update task counter
    updateCounter();

    // Update filter counts
    updateFilterCounts();

    // Update clear completed button
    updateClearButton();
}

/**
 * Show or hide the empty state
 * @param {number} taskCount - Number of visible tasks
 */
function updateEmptyState(taskCount) {
    if (taskCount === 0) {
        emptyState.classList.remove('hidden');

        // Customize empty state message based on context
        const title = emptyState.querySelector('.empty-title');
        const subtitle = emptyState.querySelector('.empty-subtitle');

        if (searchQuery) {
            title.textContent = 'No matching tasks';
            subtitle.textContent = 'Try a different search term';
        } else if (currentFilter === 'completed') {
            title.textContent = 'No completed tasks';
            subtitle.textContent = 'Complete a task to see it here!';
        } else if (currentFilter === 'active') {
            title.textContent = 'All tasks completed! 🎉';
            subtitle.textContent = 'Great job! Add more tasks to stay productive';
        } else {
            title.textContent = 'No tasks yet';
            subtitle.textContent = 'Add a task above to get started!';
        }
    } else {
        emptyState.classList.add('hidden');
    }
}

/**
 * Update the task counter text
 */
function updateCounter() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    const text = activeTasks === 1
        ? '1 task remaining'
        : `${activeTasks} tasks remaining`;
    taskCounter.textContent = text;
}

/**
 * Update filter button counts
 */
function updateFilterCounts() {
    countAll.textContent = tasks.length;
    countActive.textContent = tasks.filter(t => !t.completed).length;
    countCompleted.textContent = tasks.filter(t => t.completed).length;
}

/**
 * Show or hide the 'Clear completed' button
 */
function updateClearButton() {
    const completedCount = tasks.filter(t => t.completed).length;
    clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
}

// ============================================
// Animated Placeholder Text
// ============================================

/**
 * Type and delete placeholder text for the task input
 */
function typePlaceholder() {
    const currentText = placeholderTexts[placeholderTextIndex];

    if (isDeleting) {
        taskInput.setAttribute('placeholder', currentText.substring(0, charIndex - 1));
        charIndex--;
    } else {
        taskInput.setAttribute('placeholder', currentText.substring(0, charIndex + 1));
        charIndex++;
    }

    let typeSpeed = isDeleting ? 15 : 35;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 800; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        placeholderTextIndex = (placeholderTextIndex + 1) % placeholderTexts.length;
        typeSpeed = 100; // Pause before typing new word
    }

    typingTimer = setTimeout(typePlaceholder, typeSpeed);
}

/**
 * Start the animated placeholder text sequence
 */
function startPlaceholderAnimation() {
    if (typingTimer) clearTimeout(typingTimer);
    setTimeout(typePlaceholder, 500);
}

/**
 * Stop the animated placeholder text and reset to default
 */
function stopPlaceholderAnimation() {
    clearTimeout(typingTimer);
    taskInput.setAttribute('placeholder', 'Type a task... (Press Enter)');
    isDeleting = false;
    charIndex = 0;
    placeholderTextIndex = 0;
}

// ============================================
// Drag and Drop Logic
// ============================================

let draggedItem = null;

function handleDragStart(e) {
    // Only allow drag if we are clicking on the drag handle
    if (!e.target.closest('.drag-handle') && e.target.tagName !== 'LI') {
        e.preventDefault();
        return;
    }

    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    // Set a slight delay for the visual dragged class to allow the browser image capture
    setTimeout(() => {
        this.style.opacity = '0.4';
    }, 0);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.style.borderTop = '2px solid var(--accent-primary)';
}

function handleDragLeave(e) {
    this.style.borderTop = '1px solid transparent';
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    this.style.borderTop = '1px solid transparent';

    // Don't do anything if dropping the same column we're dragging.
    if (draggedItem !== this && draggedItem !== null) {
        const items = Array.from(taskList.children);
        const draggedIndex = items.indexOf(draggedItem);
        const droppedIndex = items.indexOf(this);

        // Update the tasks array logic
        const draggedTaskId = draggedItem.dataset.id;
        const droppedTaskId = this.dataset.id;

        let draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
        let droppedTaskIndex = tasks.findIndex(t => t.id === droppedTaskId);

        // Remove item from array and insert at new position
        const [removed] = tasks.splice(draggedTaskIndex, 1);
        tasks.splice(droppedTaskIndex, 0, removed);

        saveTasks();
        renderTasks();
    }
    return false;
}

document.addEventListener('dragend', (e) => {
    if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem = null;
    }
    const items = document.querySelectorAll('.task-item');
    items.forEach(item => {
        item.style.borderTop = '1px solid transparent';
    });
});

// ============================================
// Event Listeners
// ============================================

// Handle form submission (add task)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value, prioritySelect.value);
});

// Handle filter button clicks
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Handle clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

// Handle search input
searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
});

// Handle search clear button
searchClearBtn.addEventListener('click', clearSearch);

// Handle Export Data
exportBtn.addEventListener('click', exportTasksToJSON);

// Handle Import Data
importInput.addEventListener('change', importTasksFromJSON);

// Handle task input focus/blur for placeholder animation
taskInput.addEventListener('focus', stopPlaceholderAnimation);
taskInput.addEventListener('blur', () => {
    if (!taskInput.value) startPlaceholderAnimation();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key: cancel editing or clear search
    if (e.key === 'Escape') {
        if (editingTaskId) {
            cancelEditTask();
        } else if (searchQuery) {
            clearSearch();
        }
    }

    // Ctrl+K or Cmd+K: focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ============================================
// Export & Import Data
// ============================================

/**
 * Export tasks array to a downloadable JSON file
 */
function exportTasksToJSON() {
    if (tasks.length === 0) {
        showToast('No tasks to export.', 'warning');
        return;
    }

    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Tasks exported successfully!', 'success');
}

/**
 * Import tasks from a JSON file
 */
function importTasksFromJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const importedData = JSON.parse(event.target.result);

            if (!Array.isArray(importedData)) {
                throw new Error("Invalid format: Not an array");
            }
            if (importedData.length > 0 && (!importedData[0].hasOwnProperty('id') || !importedData[0].hasOwnProperty('text'))) {
                throw new Error("Invalid task structure");
            }

            if (tasks.length > 0) {
                if (!confirm('Importing will replace your current tasks. Are you sure?')) {
                    importInput.value = '';
                    return;
                }
            }

            tasks = importedData;
            saveTasks();
            renderTasks();
            updateFilterCounts();
            showToast(`${tasks.length} tasks imported successfully!`, 'success');

        } catch (error) {
            console.error('Import error:', error);
            showToast('Failed to import file. Invalid JSON format.', 'danger');
        }
        importInput.value = '';
    };

    reader.onerror = function () {
        showToast('Error reading the file.', 'danger');
        importInput.value = '';
    };

    reader.readAsText(file);
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize the application
 */
function init() {
    loadTasks();
    renderTasks();
    taskInput.focus();
    startPlaceholderAnimation();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Task rendering and form handling - v1.1

// Task counter and clear completed - v1.2
