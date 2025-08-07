import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Modal replaced with React Native built-in Modal
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/taskConstants';

const TaskListScreen = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getFilteredTasks,
    clearError,
    refreshTasks,
  } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    category: [],
    overdue: false,
  });

  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData.title, taskData.description, taskData);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const getDisplayTasks = () => {
    const searchFilters = {
      ...filters,
      search: searchQuery,
    };
    
    return getFilteredTasks(searchFilters, sortBy);
  };

  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const togglePriorityFilter = (priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      overdue: false,
    });
    setSearchQuery('');
  };

  const displayTasks = getDisplayTasks();
  const hasActiveFilters = filters.status.length > 0 || 
                          filters.priority.length > 0 || 
                          filters.category.length > 0 || 
                          filters.overdue || 
                          searchQuery.length > 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons 
              name="filter" 
              size={24} 
              color={hasActiveFilters ? "#3498db" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowTaskForm(true)}
          >
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'createdAt', label: 'Created' },
                { key: 'dueDate', label: 'Due Date' },
                { key: 'priority', label: 'Priority' },
                { key: 'title', label: 'Title' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortBy === option.key && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {[
                { key: TASK_STATUS.TODO, label: 'To Do' },
                { key: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
                { key: TASK_STATUS.DONE, label: 'Done' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    filters.status.includes(option.key) && styles.filterOptionActive
                  ]}
                  onPress={() => toggleStatusFilter(option.key)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.status.includes(option.key) && styles.filterOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Priority</Text>
            <View style={styles.filterOptions}>
              {[
                { key: TASK_PRIORITY.HIGH, label: 'High' },
                { key: TASK_PRIORITY.MEDIUM, label: 'Medium' },
                { key: TASK_PRIORITY.LOW, label: 'Low' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    filters.priority.includes(option.key) && styles.filterOptionActive
                  ]}
                  onPress={() => togglePriorityFilter(option.key)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.priority.includes(option.key) && styles.filterOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Count */}
      <View style={styles.taskCount}>
        <Text style={styles.taskCountText}>
          {displayTasks.length} task{displayTasks.length !== 1 ? 's' : ''}
          {hasActiveFilters && ` (filtered from ${tasks.length})`}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={displayTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleStatus={toggleTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>
              {hasActiveFilters ? 'No matching tasks' : 'No tasks yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms'
                : 'Tap the + button to create your first task'
              }
            </Text>
          </View>
        )}
      />

      {/* Task Form Modal */}
      <Modal
        visible={showTaskForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
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

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.errorCloseButton}
            onPress={clearError}
          >
            <Ionicons name="close" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearSearchButton: {
    padding: 4,
  },
  filtersPanel: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 4,
  },
  sortOptionActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
  },
  sortOptionTextActive: {
    color: 'white',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 4,
  },
  filterOptionActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#95a5a6',
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  taskCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  taskCountText: {
    fontSize: 14,
    color: '#666',
  },
  taskList: {
    flex: 1,
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
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    borderColor: '#e74c3c',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  errorText: {
    flex: 1,
    color: '#e74c3c',
    fontSize: 14,
  },
  errorCloseButton: {
    padding: 4,
  },
});

export default TaskListScreen;