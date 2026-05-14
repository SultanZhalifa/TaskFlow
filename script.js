// TaskFlow — Smart Task Manager
// Main Application Logic

// ============================================
// Constants & Configuration
// ============================================
const STORAGE_KEY = 'taskflow_tasks';
const TOAST_DURATION = 2500;
const TYPING_SPEED = 35;
const DELETING_SPEED = 15;
const PAUSE_AT_END = 800;
const PAUSE_AT_START = 100;

// ============================================
// State Management
// ============================================
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let editingTaskId = null;
let draggedTaskId = null;
let searchDebounceTimer = null;

// Animated Placeholder State
const placeholderTexts = [
    'What needs to be done?',
    'Design project proposal...',
    'Review code from team...',
    'Push to feature branch...',
    'Press Enter to add task',
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

const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');

const exportBtn = document.getElementById('export-btn');
const importInput = document.getElementById('import-input');

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, TOAST_DURATION);
}

// ============================================
// Task Operations
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function createTask(text, priority = 'medium') {
    return {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
    };
}

function addTask(text, priority) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const isDuplicate = tasks.some((t) => t.text.toLowerCase() === trimmedText.toLowerCase());

    if (isDuplicate) {
        showToast('A task with that name already exists.', 'warning');
        return;
    }

    const task = createTask(trimmedText, priority);
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    prioritySelect.value = 'medium';
    taskInput.focus();
    showToast(`Added: "${trimmedText}"`, 'success');
}

function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    showToast(task.completed ? 'Task completed.' : 'Task reopened.', 'info');
}

function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const task = tasks.find((t) => t.id === id);

    if (!taskElement) return;

    taskElement.classList.add('removing');
    taskElement.addEventListener(
        'animationend',
        () => {
            tasks = tasks.filter((t) => t.id !== id);
            saveTasks();
            renderTasks();
            if (task) showToast(`Deleted: "${task.text}"`, 'danger');
        },
        { once: true }
    );
}

function startEditTask(id) {
    editingTaskId = id;
    renderTasks();
    const editInput = document.querySelector('.task-edit-input');
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

function saveEditTask(id, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) {
        cancelEditTask();
        return;
    }
    const task = tasks.find((t) => t.id === id);
    if (task && task.text !== trimmedText) {
        task.text = trimmedText;
        saveTasks();
        showToast('Task updated.', 'info');
    }
    editingTaskId = null;
    renderTasks();
}

function cancelEditTask() {
    editingTaskId = null;
    renderTasks();
}

function clearCompleted() {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
    const label = completedCount === 1 ? 'task' : 'tasks';
    showToast(`Cleared ${completedCount} completed ${label}.`, 'danger');
}

// ============================================
// Search
// ============================================

function handleSearch(query) {
    searchQuery = query.toLowerCase().trim();
    searchClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
    renderTasks();
}

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

function getFilteredTasks() {
    let filtered;

    switch (currentFilter) {
        case 'active':
            filtered = tasks.filter((t) => !t.completed);
            break;
        case 'completed':
            filtered = tasks.filter((t) => t.completed);
            break;
        default:
            filtered = [...tasks];
    }

    if (searchQuery) {
        filtered = filtered.filter((t) => t.text.toLowerCase().includes(searchQuery));
    }

    return filtered;
}

function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTasks();
}

// ============================================
// Local Storage
// ============================================

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks:', error);
        showToast('Could not save tasks. Storage may be full.', 'warning');
    }
}

function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) tasks = JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load tasks:', error);
        tasks = [];
    }
}

// ============================================
// Drag and Drop
// ============================================

function handleDragStart(e) {
    const li = e.target.closest('.task-item');
    if (!li) return;
    draggedTaskId = li.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedTaskId);
    li.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest('.task-item');
    if (target && target.dataset.id !== draggedTaskId) {
        const { y, height } = target.getBoundingClientRect();
        if (e.clientY - (y + height / 2) > 0) {
            target.classList.remove('drag-above');
            target.classList.add('drag-below');
        } else {
            target.classList.remove('drag-below');
            target.classList.add('drag-above');
        }
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    const target = e.target.closest('.task-item');
    if (target && target.dataset.id !== draggedTaskId) {
        target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.task-item');
    if (target && !target.contains(e.relatedTarget)) {
        target.classList.remove('drag-over', 'drag-above', 'drag-below');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.task-item');

    document.querySelectorAll('.task-item').forEach((item) => {
        item.classList.remove('drag-over', 'drag-above', 'drag-below');
    });

    if (!dropTarget || !draggedTaskId || dropTarget.dataset.id === draggedTaskId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const dropIndex = tasks.findIndex((t) => t.id === dropTarget.dataset.id);
    if (draggedIndex === -1 || dropIndex === -1) return;

    const [draggedTask] = tasks.splice(draggedIndex, 1);
    const { y, height } = dropTarget.getBoundingClientRect();
    const insertBefore = e.clientY - (y + height / 2) <= 0;
    tasks.splice(insertBefore ? dropIndex : dropIndex + 1, 0, draggedTask);

    saveTasks();
    renderTasks();
    showToast('Task reordered.', 'info');
}

function handleDragEnd(e) {
    const li = e.target.closest('.task-item');
    if (li) li.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach((item) => {
        item.classList.remove('drag-over', 'drag-above', 'drag-below');
    });
    draggedTaskId = null;
}

// ============================================
// Rendering
// ============================================

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;
    li.setAttribute('draggable', 'true');

    const isEditing = editingTaskId === task.id;

    if (isEditing) {
        li.innerHTML = `
            <input
                type="text"
                class="task-edit-input"
                value="${escapeAttr(task.text)}"
                maxlength="100"
                aria-label="Edit task text"
            >
            <div class="edit-hint">
                <span><kbd>Enter</kbd> save</span>
                <span><kbd>Esc</kbd> cancel</span>
            </div>
        `;

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
        editInput.addEventListener('blur', () => saveEditTask(task.id, editInput.value));
    } else {
        li.innerHTML = `
            <div class="drag-handle" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
                </svg>
            </div>
            <label class="task-checkbox">
                <input
                    type="checkbox"
                    ${task.completed ? 'checked' : ''}
                    aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
                >
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

        li.querySelector('input[type="checkbox"]').addEventListener('change', () =>
            toggleTask(task.id)
        );
        li.querySelector('.task-text').addEventListener('dblclick', () => startEditTask(task.id));
        li.querySelector('.edit-btn').addEventListener('click', () => startEditTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    }

    return li;
}

function highlightSearch(text) {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';
    filteredTasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
    updateEmptyState(filteredTasks.length);
    updateCounter();
    updateFilterCounts();
    updateClearButton();
}

function updateEmptyState(taskCount) {
    if (taskCount === 0) {
        emptyState.classList.remove('hidden');
        const title = emptyState.querySelector('.empty-title');
        const subtitle = emptyState.querySelector('.empty-subtitle');

        if (searchQuery) {
            title.textContent = 'No matching tasks';
            subtitle.textContent = 'Try a different search term.';
        } else if (currentFilter === 'completed') {
            title.textContent = 'No completed tasks';
            subtitle.textContent = 'Complete a task to see it here.';
        } else if (currentFilter === 'active') {
            title.textContent = 'All tasks completed';
            subtitle.textContent = 'Great work. Add more tasks to keep going.';
        } else {
            title.textContent = 'No tasks yet';
            subtitle.textContent = 'Add a task above to get started.';
        }
    } else {
        emptyState.classList.add('hidden');
    }
}

function updateCounter() {
    const activeTasks = tasks.filter((t) => !t.completed).length;
    taskCounter.textContent =
        activeTasks === 1 ? '1 task remaining' : `${activeTasks} tasks remaining`;
}

function updateFilterCounts() {
    countAll.textContent = tasks.length;
    countActive.textContent = tasks.filter((t) => !t.completed).length;
    countCompleted.textContent = tasks.filter((t) => t.completed).length;
}

function updateClearButton() {
    const completedCount = tasks.filter((t) => t.completed).length;
    clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
}

// ============================================
// Animated Placeholder Text
// ============================================

function typePlaceholder() {
    const currentText = placeholderTexts[placeholderTextIndex];

    if (isDeleting) {
        taskInput.setAttribute('placeholder', currentText.substring(0, charIndex - 1));
        charIndex--;
    } else {
        taskInput.setAttribute('placeholder', currentText.substring(0, charIndex + 1));
        charIndex++;
    }

    let typeSpeed = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = PAUSE_AT_END;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        placeholderTextIndex = (placeholderTextIndex + 1) % placeholderTexts.length;
        typeSpeed = PAUSE_AT_START;
    }

    typingTimer = setTimeout(typePlaceholder, typeSpeed);
}

function startPlaceholderAnimation() {
    if (typingTimer) clearTimeout(typingTimer);
    setTimeout(typePlaceholder, 500);
}

function stopPlaceholderAnimation() {
    clearTimeout(typingTimer);
    taskInput.setAttribute('placeholder', 'Type a task... (Press Enter)');
    isDeleting = false;
    charIndex = 0;
    placeholderTextIndex = 0;
}

// ============================================
// Export & Import
// ============================================

function exportTasksToJSON() {
    if (tasks.length === 0) {
        showToast('No tasks to export.', 'warning');
        return;
    }

    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Tasks exported.', 'success');
}

function importTasksFromJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const importedData = JSON.parse(event.target.result);

            if (!Array.isArray(importedData)) {
                throw new Error('Expected an array of tasks');
            }

            if (
                importedData.length > 0 &&
                (!Object.prototype.hasOwnProperty.call(importedData[0], 'id') ||
                    !Object.prototype.hasOwnProperty.call(importedData[0], 'text'))
            ) {
                throw new Error('Invalid task structure');
            }

            if (tasks.length > 0) {
                if (!confirm('This will replace your current tasks. Continue?')) {
                    importInput.value = '';
                    return;
                }
            }

            tasks = importedData;
            saveTasks();
            renderTasks();
            const label = tasks.length === 1 ? 'task' : 'tasks';
            showToast(`Imported ${tasks.length} ${label}.`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast('Could not import file. Make sure it is a valid TaskFlow backup.', 'danger');
        }
        importInput.value = '';
    };

    reader.onerror = () => {
        showToast('Error reading file.', 'danger');
        importInput.value = '';
    };

    reader.readAsText(file);
}

// ============================================
// Event Listeners
// ============================================

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value, prioritySelect.value);
});

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener('click', clearCompleted);

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => handleSearch(e.target.value), 150);
});

searchClearBtn.addEventListener('click', clearSearch);

exportBtn.addEventListener('click', exportTasksToJSON);
importInput.addEventListener('change', importTasksFromJSON);

taskInput.addEventListener('focus', stopPlaceholderAnimation);
taskInput.addEventListener('blur', () => {
    if (!taskInput.value) startPlaceholderAnimation();
});

// Drag and drop (event delegation — persists across re-renders)
taskList.addEventListener('dragstart', handleDragStart);
taskList.addEventListener('dragover', handleDragOver);
taskList.addEventListener('dragenter', handleDragEnter);
taskList.addEventListener('dragleave', handleDragLeave);
taskList.addEventListener('drop', handleDrop);
taskList.addEventListener('dragend', handleDragEnd);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (editingTaskId) {
            cancelEditTask();
        } else if (searchQuery) {
            clearSearch();
        }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ============================================
// Initialization
// ============================================

function init() {
    loadTasks();
    renderTasks();
    taskInput.focus();
    startPlaceholderAnimation();
}

document.addEventListener('DOMContentLoaded', init);
