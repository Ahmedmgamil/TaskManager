import { createTask } from './taskUtils';
import { TASK_STATUS, TASK_PRIORITY, RECURRING_TYPES } from '../constants/taskConstants';

export const generateSampleTasks = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const sampleTasks = [
    createTask(
      'Review project proposal',
      'Go through the Q4 project proposal and provide feedback on the technical requirements and timeline.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.HIGH,
        category: 'work',
        dueDate: today.toISOString().split('T')[0],
        tags: ['urgent', 'review'],
        estimatedTime: 60,
      }
    ),
    
    createTask(
      'Weekly grocery shopping',
      'Buy groceries for the week including fresh vegetables, fruits, and pantry essentials.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        category: 'personal',
        dueDate: tomorrow.toISOString().split('T')[0],
        tags: ['shopping', 'weekly'],
        recurring: RECURRING_TYPES.WEEKLY,
        estimatedTime: 45,
      }
    ),
    
    createTask(
      'Complete React Native course',
      'Finish the advanced React Native course modules 8-12 and complete the final project.',
      {
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.HIGH,
        category: 'education',
        dueDate: nextWeek.toISOString().split('T')[0],
        tags: ['learning', 'programming'],
        estimatedTime: 180,
        actualTime: 90,
      }
    ),
    
    createTask(
      'Morning workout',
      '30-minute cardio session followed by strength training focusing on upper body.',
      {
        status: TASK_STATUS.DONE,
        priority: TASK_PRIORITY.MEDIUM,
        category: 'health',
        dueDate: lastWeek.toISOString().split('T')[0],
        tags: ['fitness', 'morning'],
        recurring: RECURRING_TYPES.DAILY,
        estimatedTime: 45,
        actualTime: 40,
        completedAt: new Date(lastWeek.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM
      }
    ),
    
    createTask(
      'Plan weekend trip',
      'Research and book accommodations for the weekend getaway. Check weather forecast and plan activities.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.LOW,
        category: 'personal',
        tags: ['travel', 'planning'],
        estimatedTime: 30,
      }
    ),
    
    createTask(
      'Team meeting preparation',
      'Prepare slides for the quarterly team meeting. Include progress reports and next quarter goals.',
      {
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.HIGH,
        category: 'work',
        dueDate: tomorrow.toISOString().split('T')[0],
        tags: ['meeting', 'presentation'],
        estimatedTime: 90,
        actualTime: 30,
      }
    ),
    
    createTask(
      'Read "Atomic Habits"',
      'Continue reading the book and take notes on key concepts for personal development.',
      {
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.LOW,
        category: 'education',
        tags: ['reading', 'self-improvement'],
        estimatedTime: 120,
        actualTime: 45,
      }
    ),
    
    createTask(
      'Update portfolio website',
      'Add recent projects to the portfolio and update the skills section. Optimize for mobile devices.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        category: 'work',
        tags: ['portfolio', 'web-development'],
        estimatedTime: 120,
      }
    ),
    
    createTask(
      'Call dentist for appointment',
      'Schedule routine dental cleaning and checkup for next month.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        category: 'health',
        tags: ['appointment', 'health'],
        estimatedTime: 10,
      }
    ),
    
    createTask(
      'Organize digital photos',
      'Sort through phone photos from the last 6 months and organize them into albums.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.LOW,
        category: 'personal',
        tags: ['organization', 'photos'],
        estimatedTime: 60,
      }
    ),
    
    createTask(
      'Submit expense report',
      'Compile receipts from business trip and submit monthly expense report to HR.',
      {
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.HIGH,
        category: 'work',
        dueDate: tomorrow.toISOString().split('T')[0],
        tags: ['expenses', 'deadline'],
        estimatedTime: 30,
      }
    ),
    
    createTask(
      'Meal prep for the week',
      'Prepare healthy meals for the upcoming week. Focus on high-protein options.',
      {
        status: TASK_STATUS.DONE,
        priority: TASK_PRIORITY.MEDIUM,
        category: 'health',
        tags: ['meal-prep', 'healthy'],
        recurring: RECURRING_TYPES.WEEKLY,
        estimatedTime: 90,
        actualTime: 85,
        completedAt: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ),
  ];

  return sampleTasks;
};