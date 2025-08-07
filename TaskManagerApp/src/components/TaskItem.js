import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  TASK_STATUS, 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  TASK_CATEGORIES 
} from '../constants/taskConstants';
import { formatDate, isOverdue, getDaysUntilDue } from '../utils/taskUtils';

const TaskItem = ({ 
  task, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  onPress 
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) }
      ]
    );
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case TASK_STATUS.TODO:
        return 'radio-button-off';
      case TASK_STATUS.IN_PROGRESS:
        return 'ellipse-outline';
      case TASK_STATUS.DONE:
        return 'checkmark-circle';
      default:
        return 'radio-button-off';
    }
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return 'chevron-up';
      case 'medium':
        return 'remove';
      case 'low':
        return 'chevron-down';
      default:
        return 'remove';
    }
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    
    const overdue = isOverdue(task.dueDate);
    const daysUntil = getDaysUntilDue(task.dueDate);
    
    let dueDateText = formatDate(task.dueDate);
    let dueDateStyle = styles.dueDate;
    
    if (overdue) {
      dueDateText = `Overdue - ${dueDateText}`;
      dueDateStyle = [styles.dueDate, styles.overdue];
    } else if (daysUntil === 0) {
      dueDateText = `Due Today - ${dueDateText}`;
      dueDateStyle = [styles.dueDate, styles.dueToday];
    } else if (daysUntil === 1) {
      dueDateText = `Due Tomorrow - ${dueDateText}`;
      dueDateStyle = [styles.dueDate, styles.dueTomorrow];
    }
    
    return { text: dueDateText, style: dueDateStyle };
  };

  const category = TASK_CATEGORIES[task.category.toUpperCase()] || TASK_CATEGORIES.OTHER;
  const dueDateInfo = getDueDateInfo();

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        task.status === TASK_STATUS.DONE && styles.completedTask
      ]}
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => onToggleStatus(task.id)}
        >
          <Ionicons
            name={getStatusIcon()}
            size={24}
            color={STATUS_COLORS[task.status]}
          />
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.title,
              task.status === TASK_STATUS.DONE && styles.completedText
            ]}>
              {task.title}
            </Text>
            
            <View style={styles.priorityContainer}>
              <Ionicons
                name={getPriorityIcon()}
                size={16}
                color={PRIORITY_COLORS[task.priority]}
              />
            </View>
          </View>
          
          {task.description ? (
            <Text style={[
              styles.description,
              task.status === TASK_STATUS.DONE && styles.completedText
            ]}>
              {task.description}
            </Text>
          ) : null}
          
          <View style={styles.metaInfo}>
            <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
            
            {dueDateInfo && (
              <Text style={dueDateInfo.style}>
                {dueDateInfo.text}
              </Text>
            )}
          </View>
          
          {task.tags && task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(task)}
          >
            <Ionicons name="pencil" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedTask: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusButton: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 20,
  },
  priorityContainer: {
    marginLeft: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  overdue: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  dueToday: {
    color: '#f39c12',
    fontWeight: '600',
  },
  dueTomorrow: {
    color: '#3498db',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default TaskItem;