import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTask, filterTasks, sortTasks, getNextRecurrence } from '../utils/taskUtils';
import { generateSampleTasks } from '../utils/sampleData';
import { TASK_STATUS } from '../constants/taskConstants';

const STORAGE_KEY = '@TaskManager:tasks';
const SAMPLE_DATA_KEY = '@TaskManager:sampleDataLoaded';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from storage on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      const sampleDataLoaded = await AsyncStorage.getItem(SAMPLE_DATA_KEY);
      
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else if (!sampleDataLoaded) {
        // Load sample data on first launch
        const sampleTasks = generateSampleTasks();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
        await AsyncStorage.setItem(SAMPLE_DATA_KEY, 'true');
        setTasks(sampleTasks);
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to save tasks');
      console.error('Error saving tasks:', err);
    }
  };

  const addTask = async (title, description, options = {}) => {
    try {
      const newTask = createTask(title, description, options);
      const updatedTasks = [...tasks, newTask];
      await saveTasks(updatedTasks);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      await saveTasks(updatedTasks);
      return updatedTasks.find(task => task.id === taskId);
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      let newStatus;
      let completedAt = null;

      switch (task.status) {
        case TASK_STATUS.TODO:
          newStatus = TASK_STATUS.IN_PROGRESS;
          break;
        case TASK_STATUS.IN_PROGRESS:
          newStatus = TASK_STATUS.DONE;
          completedAt = new Date().toISOString();
          break;
        case TASK_STATUS.DONE:
          newStatus = TASK_STATUS.TODO;
          break;
        default:
          newStatus = TASK_STATUS.TODO;
      }

      const updates = { status: newStatus, completedAt };

      // Handle recurring tasks
      if (newStatus === TASK_STATUS.DONE && task.recurring !== 'none') {
        const nextDueDate = getNextRecurrence(task.dueDate || new Date(), task.recurring);
        if (nextDueDate) {
          // Create a new task for the next occurrence
          const nextTask = createTask(task.title, task.description, {
            ...task,
            dueDate: nextDueDate,
            status: TASK_STATUS.TODO,
            completedAt: null
          });
          const updatedTasks = [
            ...tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
            nextTask
          ];
          await saveTasks(updatedTasks);
          return;
        }
      }

      await updateTask(taskId, updates);
    } catch (err) {
      setError('Failed to toggle task status');
      throw err;
    }
  };

  const getFilteredTasks = (filters = {}, sortBy = 'createdAt') => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getOverdueTasks = () => {
    return tasks.filter(task => {
      if (!task.dueDate || task.status === TASK_STATUS.DONE) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  };

  const getUpcomingTasks = (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.status === TASK_STATUS.DONE) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= futureDate;
    });
  };

  const clearError = () => setError(null);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getFilteredTasks,
    getTasksByStatus,
    getOverdueTasks,
    getUpcomingTasks,
    clearError,
    refreshTasks: loadTasks
  };
};