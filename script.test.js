import { describe, it, expect } from 'vitest';
import {
    generateId,
    createTask,
    filterTasks,
    escapeHtml,
    escapeAttr,
    escapeRegex,
    highlightSearch,
    formatDueDate,
    isOverdue,
} from './taskUtils.js';

describe('generateId', () => {
    it('returns a non-empty string', () => {
        expect(typeof generateId()).toBe('string');
        expect(generateId().length).toBeGreaterThan(0);
    });

    it('returns unique values on repeated calls', () => {
        const ids = new Set(Array.from({ length: 100 }, generateId));
        expect(ids.size).toBe(100);
    });
});

describe('createTask', () => {
    it('creates a task with all required fields', () => {
        const task = createTask('Buy groceries');
        expect(task.text).toBe('Buy groceries');
        expect(task.completed).toBe(false);
        expect(task.priority).toBe('medium');
        expect(task.dueDate).toBeNull();
        expect(typeof task.id).toBe('string');
        expect(typeof task.createdAt).toBe('string');
    });

    it('trims whitespace from text', () => {
        expect(createTask('  Buy groceries  ').text).toBe('Buy groceries');
    });

    it('accepts a custom priority', () => {
        expect(createTask('Urgent', 'high').priority).toBe('high');
    });

    it('accepts a due date', () => {
        expect(createTask('Task', 'low', '2025-12-31').dueDate).toBe('2025-12-31');
    });

    it('generates a unique id for each task', () => {
        const a = createTask('Task A');
        const b = createTask('Task B');
        expect(a.id).not.toBe(b.id);
    });
});

describe('filterTasks', () => {
    const tasks = [
        { id: '1', text: 'Buy milk', completed: false },
        { id: '2', text: 'Write tests', completed: true },
        { id: '3', text: 'Buy bread', completed: false },
    ];

    it('returns all tasks for filter "all"', () => {
        expect(filterTasks(tasks, 'all', '')).toHaveLength(3);
    });

    it('returns only incomplete tasks for filter "active"', () => {
        const result = filterTasks(tasks, 'active', '');
        expect(result).toHaveLength(2);
        expect(result.every((t) => !t.completed)).toBe(true);
    });

    it('returns only completed tasks for filter "completed"', () => {
        const result = filterTasks(tasks, 'completed', '');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('filters by search query', () => {
        expect(filterTasks(tasks, 'all', 'buy')).toHaveLength(2);
    });

    it('search is case-insensitive', () => {
        expect(filterTasks(tasks, 'all', 'BUY')).toHaveLength(2);
        expect(filterTasks(tasks, 'all', 'Buy')).toHaveLength(2);
    });

    it('returns empty array when nothing matches the query', () => {
        expect(filterTasks(tasks, 'all', 'xyz')).toHaveLength(0);
    });

    it('combines filter and search query', () => {
        const result = filterTasks(tasks, 'active', 'buy');
        expect(result).toHaveLength(2);
        expect(result.every((t) => !t.completed)).toBe(true);
    });

    it('does not mutate the original array', () => {
        filterTasks(tasks, 'active', '');
        expect(tasks).toHaveLength(3);
    });
});

describe('escapeHtml', () => {
    it('escapes angle brackets', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    it('escapes ampersands', () => {
        expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('escapes double quotes', () => {
        expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
    });

    it('escapes single quotes', () => {
        expect(escapeHtml("it's")).toBe('it&#39;s');
    });

    it('leaves plain text unchanged', () => {
        expect(escapeHtml('hello world')).toBe('hello world');
    });
});

describe('escapeAttr', () => {
    it('escapes characters unsafe in attribute values', () => {
        expect(escapeAttr('"value"')).toBe('&quot;value&quot;');
        expect(escapeAttr("it's")).toBe('it&#39;s');
        expect(escapeAttr('<tag>')).toBe('&lt;tag&gt;');
    });
});

describe('escapeRegex', () => {
    it('escapes regex special characters', () => {
        expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
        expect(escapeRegex('(hello)')).toBe('\\(hello\\)');
    });

    it('leaves plain text unchanged', () => {
        expect(escapeRegex('hello')).toBe('hello');
    });
});

describe('highlightSearch', () => {
    it('wraps matching text in a mark element', () => {
        const result = highlightSearch('hello world', 'world');
        expect(result).toContain('<mark class="search-highlight">world</mark>');
    });

    it('is case-insensitive', () => {
        const result = highlightSearch('Hello World', 'hello');
        expect(result).toContain('<mark class="search-highlight">Hello</mark>');
    });

    it('returns original text when query is empty', () => {
        expect(highlightSearch('hello', '')).toBe('hello');
    });

    it('handles multiple matches', () => {
        const result = highlightSearch('buy milk and buy bread', 'buy');
        const matches = result.match(/<mark class="search-highlight">/g);
        expect(matches).toHaveLength(2);
    });
});

describe('formatDueDate', () => {
    it('returns null for null input', () => {
        expect(formatDueDate(null)).toBeNull();
    });

    it('formats an ISO date string to month and day', () => {
        expect(formatDueDate('2025-12-31')).toBe('Dec 31');
    });

    it('formats single-digit days correctly', () => {
        expect(formatDueDate('2025-01-05')).toBe('Jan 5');
    });
});

describe('isOverdue', () => {
    it('returns false for null input', () => {
        expect(isOverdue(null)).toBe(false);
    });

    it('returns true for a date in the past', () => {
        expect(isOverdue('2020-01-01')).toBe(true);
    });

    it('returns false for a date in the future', () => {
        expect(isOverdue('2099-12-31')).toBe(false);
    });
});
