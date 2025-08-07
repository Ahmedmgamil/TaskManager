import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { TASK_CATEGORIES, STATUS_COLORS } from '../constants/taskConstants';
import { formatDate } from '../utils/taskUtils';

const CalendarScreen = () => {
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDayTasks, setShowDayTasks] = useState(false);

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate === date;
    });
  };

  const getMarkedDates = () => {
    const marked = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = task.dueDate;
        if (!marked[date]) {
          marked[date] = {
            dots: [],
            selected: date === selectedDate,
            selectedColor: date === selectedDate ? '#3498db' : undefined,
          };
        }
        
        const category = TASK_CATEGORIES[task.category.toUpperCase()] || TASK_CATEGORIES.OTHER;
        const statusColor = STATUS_COLORS[task.status];
        
        marked[date].dots.push({
          color: task.status === 'done' ? '#2ecc71' : category.color,
        });
      }
    });

    // Ensure selected date is marked even if no tasks
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#3498db',
        dots: [],
      };
    }

    return marked;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const dayTasks = getTasksForDate(day.dateString);
    if (dayTasks.length > 0) {
      setShowDayTasks(true);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const taskWithDate = {
        ...taskData,
        dueDate: selectedDate,
      };
      await addTask(taskData.title, taskData.description, taskWithDate);
      setShowTaskForm(false);
      Alert.alert('Success', 'Task created successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
      Alert.alert('Success', 'Task updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      Alert.alert('Success', 'Task deleted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const markedDates = getMarkedDates();

  const getTaskCountsByStatus = () => {
    const counts = { todo: 0, in_progress: 0, done: 0 };
    selectedDateTasks.forEach(task => {
      counts[task.status]++;
    });
    return counts;
  };

  const statusCounts = getTaskCountsByStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
          }}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType={'multi-dot'}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2c3e50',
            selectedDayBackgroundColor: '#3498db',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#3498db',
            dayTextColor: '#2c3e50',
            textDisabledColor: '#bdc3c7',
            dotColor: '#3498db',
            selectedDotColor: '#ffffff',
            arrowColor: '#3498db',
            monthTextColor: '#2c3e50',
            indicatorColor: '#3498db',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Selected Date Info */}
      <View style={styles.selectedDateContainer}>
        <View style={styles.selectedDateHeader}>
          <Text style={styles.selectedDateText}>
            {formatDate(selectedDate)}
          </Text>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => setShowTaskForm(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Task Summary */}
        {selectedDateTasks.length > 0 && (
          <View style={styles.taskSummary}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.summaryText}>{statusCounts.todo} To Do</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#f39c12' }]} />
              <Text style={styles.summaryText}>{statusCounts.in_progress} In Progress</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#2ecc71' }]} />
              <Text style={styles.summaryText}>{statusCounts.done} Done</Text>
            </View>
          </View>
        )}
      </View>

      {/* Tasks for Selected Date */}
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        {selectedDateTasks.length > 0 ? (
          selectedDateTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No tasks for this date</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Add Task" to create a task for {formatDate(selectedDate)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Task Form Modal */}
      <Modal
        isVisible={showTaskForm}
        style={styles.modal}
        onBackdropPress={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSwipeComplete={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        swipeDirection={['down']}
        propagateSwipe={true}
      >
        <View style={styles.modalContent}>
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        </View>
      </Modal>

      {/* Day Tasks Modal */}
      <Modal
        isVisible={showDayTasks}
        style={styles.modal}
        onBackdropPress={() => setShowDayTasks(false)}
        onSwipeComplete={() => setShowDayTasks(false)}
        swipeDirection={['down']}
      >
        <View style={styles.dayTasksModal}>
          <View style={styles.dayTasksHeader}>
            <Text style={styles.dayTasksTitle}>
              Tasks for {formatDate(selectedDate)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDayTasks(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.dayTasksList}>
            {selectedDateTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  todayButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addTaskButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  taskSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  tasksContainer: {
    flex: 1,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  dayTasksModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  dayTasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  dayTasksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  dayTasksList: {
    flex: 1,
    paddingTop: 16,
  },
});

export default CalendarScreen;