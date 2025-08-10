import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimplePicker from './SimplePicker';
import SimpleDateInput from './SimpleDateInput';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORIES,
  RECURRING_TYPES,
} from '../constants/taskConstants';

const TaskForm = ({ 
  task = null, 
  onSave, 
  onCancel,
  visible = true 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    category: 'other',
    dueDate: null,
    tags: [],
    recurring: RECURRING_TYPES.NONE,
    estimatedTime: '',
  });

  // showDatePicker removed for mobile compatibility
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        category: task.category || 'other',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        tags: task.tags || [],
        recurring: task.recurring || RECURRING_TYPES.NONE,
        estimatedTime: task.estimatedTime ? task.estimatedTime.toString() : '',
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.estimatedTime && isNaN(formData.estimatedTime)) {
      newErrors.estimatedTime = 'Estimated time must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    // Format date as YYYY-MM-DD in local timezone to avoid timezone conversion issues
    const formatDateForStorage = (date) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const taskData = {
      ...formData,
      dueDate: formatDateForStorage(formData.dueDate),
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
    };
    
    onSave(taskData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // onDateChange removed - using SimpleDateInput now

  if (!visible) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {task ? 'Edit Task' : 'Create New Task'}
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="Enter task title"
          multiline={false}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Description Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Enter task description"
          multiline={true}
          numberOfLines={3}
        />
      </View>

      {/* Status Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Status</Text>
        <SimplePicker
          selectedValue={formData.status}
          onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          items={[
            { label: 'To Do', value: TASK_STATUS.TODO },
            { label: 'In Progress', value: TASK_STATUS.IN_PROGRESS },
            { label: 'Done', value: TASK_STATUS.DONE },
          ]}
          placeholder="Select status"
        />
      </View>

      {/* Priority Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priority</Text>
        <SimplePicker
          selectedValue={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
          items={[
            { label: 'Low', value: TASK_PRIORITY.LOW },
            { label: 'Medium', value: TASK_PRIORITY.MEDIUM },
            { label: 'High', value: TASK_PRIORITY.HIGH },
          ]}
          placeholder="Select priority"
        />
      </View>

      {/* Category Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <SimplePicker
          selectedValue={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          items={Object.values(TASK_CATEGORIES).map(category => ({
            label: category.name,
            value: category.id
          }))}
          placeholder="Select category"
        />
      </View>

      {/* Due Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Due Date</Text>
        <SimpleDateInput
          value={formData.dueDate}
          onDateChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
          placeholder="Select due date"
        />
        
        {formData.dueDate && (
          <TouchableOpacity
            style={styles.clearDateButton}
            onPress={() => setFormData(prev => ({ ...prev, dueDate: null }))}
          >
            <Text style={styles.clearDateText}>Clear date</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recurring Tasks */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recurring</Text>
        <SimplePicker
          selectedValue={formData.recurring}
          onValueChange={(value) => setFormData(prev => ({ ...prev, recurring: value }))}
          items={[
            { label: 'None', value: RECURRING_TYPES.NONE },
            { label: 'Daily', value: RECURRING_TYPES.DAILY },
            { label: 'Weekly', value: RECURRING_TYPES.WEEKLY },
            { label: 'Monthly', value: RECURRING_TYPES.MONTHLY },
          ]}
          placeholder="Select recurring type"
        />
      </View>

      {/* Estimated Time */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estimated Time (minutes)</Text>
        <TextInput
          style={[styles.input, errors.estimatedTime && styles.inputError]}
          value={formData.estimatedTime}
          onChangeText={(text) => setFormData(prev => ({ ...prev, estimatedTime: text }))}
          placeholder="e.g., 60"
          keyboardType="numeric"
        />
        {errors.estimatedTime && (
          <Text style={styles.errorText}>{errors.estimatedTime}</Text>
        )}
      </View>

      {/* Tags */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag"
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {formData.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {task ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  // Removed unused picker and date button styles
  clearDateButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearDateText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskForm;