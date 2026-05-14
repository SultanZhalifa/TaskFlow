// Pure utility and task logic functions.
// No DOM interaction — safe to import in tests.

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function createTask(text, priority = 'medium', dueDate = null) {
    return {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
    };
}

export function filterTasks(tasks, filter, query) {
    let filtered;
    switch (filter) {
        case 'active':
            filtered = tasks.filter((t) => !t.completed);
            break;
        case 'completed':
            filtered = tasks.filter((t) => t.completed);
            break;
        default:
            filtered = [...tasks];
    }
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((t) => t.text.toLowerCase().includes(q));
    }
    return filtered;
}

export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function escapeAttr(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightSearch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

export function formatDueDate(dateString) {
    if (!dateString) return null;
    // Append time to avoid timezone shift when parsing date-only strings
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString + 'T00:00:00');
    return due < today;
}
