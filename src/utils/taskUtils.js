import { TASK_STATUS, TASK_PRIORITY, RECURRING_TYPES } from '../constants/taskConstants';

// Generate unique ID for tasks
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check if task is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Get days until due date
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Create new task object
export const createTask = (title, description = '', options = {}) => {
  return {
    id: generateId(),
    title,
    description,
    status: options.status || TASK_STATUS.TODO,
    priority: options.priority || TASK_PRIORITY.MEDIUM,
    category: options.category || 'other',
    dueDate: options.dueDate || null,
    tags: options.tags || [],
    recurring: options.recurring || RECURRING_TYPES.NONE,
    estimatedTime: options.estimatedTime || null,
    actualTime: options.actualTime || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    dependencies: options.dependencies || []
  };
};

// Filter tasks based on criteria
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }
    
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(task.category)) return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descMatch = task.description.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) return false;
    }
    
    // Due date filter
    if (filters.dueDateRange) {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const { start, end } = filters.dueDateRange;
      if (start && taskDate < new Date(start)) return false;
      if (end && taskDate > new Date(end)) return false;
    }
    
    // Overdue filter
    if (filters.overdue) {
      if (!isOverdue(task.dueDate)) return false;
    }
    
    return true;
  });
};

// Sort tasks based on criteria
export const sortTasks = (tasks, sortBy) => {
  const sortedTasks = [...tasks];
  
  switch (sortBy) {
    case 'priority':
      return sortedTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    
    case 'dueDate':
      return sortedTasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    
    case 'createdAt':
      return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    case 'title':
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    
    default:
      return sortedTasks;
  }
};

// Generate next occurrence for recurring tasks
export const getNextRecurrence = (date, recurringType) => {
  if (recurringType === RECURRING_TYPES.NONE) return null;
  
  const nextDate = new Date(date);
  
  switch (recurringType) {
    case RECURRING_TYPES.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case RECURRING_TYPES.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case RECURRING_TYPES.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return null;
  }
  
  return nextDate.toISOString().split('T')[0];
};