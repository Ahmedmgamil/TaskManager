export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const TASK_CATEGORIES = {
  WORK: { id: 'work', name: 'Work', color: '#3498db' },
  PERSONAL: { id: 'personal', name: 'Personal', color: '#e74c3c' },
  HEALTH: { id: 'health', name: 'Health', color: '#2ecc71' },
  EDUCATION: { id: 'education', name: 'Education', color: '#f39c12' },
  SHOPPING: { id: 'shopping', name: 'Shopping', color: '#9b59b6' },
  OTHER: { id: 'other', name: 'Other', color: '#95a5a6' }
};

export const RECURRING_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: '#e74c3c',
  [TASK_STATUS.IN_PROGRESS]: '#f39c12',
  [TASK_STATUS.DONE]: '#2ecc71'
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: '#95a5a6',
  [TASK_PRIORITY.MEDIUM]: '#f39c12',
  [TASK_PRIORITY.HIGH]: '#e74c3c'
};