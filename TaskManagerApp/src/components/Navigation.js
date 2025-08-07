import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import TaskListScreen from '../screens/TaskListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import PomodoroTimer from './PomodoroTimer';
import { useTasks } from '../hooks/useTasks';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const { updateTask } = useTasks();

  const handleTimeLogged = async (taskId, minutes) => {
    try {
      await updateTask(taskId, {
        actualTime: (await updateTask(taskId, {})).actualTime + minutes
      });
    } catch (error) {
      console.error('Failed to log time:', error);
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskListScreen />;
      case 'calendar':
        return <CalendarScreen />;
      default:
        return <TaskListScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <Ionicons
            name={activeTab === 'tasks' ? 'list' : 'list-outline'}
            size={24}
            color={activeTab === 'tasks' ? '#3498db' : '#95a5a6'}
          />
          <Text style={[
            styles.tabLabel,
            activeTab === 'tasks' && styles.activeTabLabel
          ]}>
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Ionicons
            name={activeTab === 'calendar' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'calendar' ? '#3498db' : '#95a5a6'}
          />
          <Text style={[
            styles.tabLabel,
            activeTab === 'calendar' && styles.activeTabLabel
          ]}>
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pomodoroTab}
          onPress={() => setShowPomodoroModal(true)}
        >
          <Ionicons name="timer" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Pomodoro Modal */}
      <Modal
        isVisible={showPomodoroModal}
        style={styles.pomodoroModal}
        onBackdropPress={() => setShowPomodoroModal(false)}
        onSwipeComplete={() => setShowPomodoroModal(false)}
        swipeDirection={['down']}
        propagateSwipe={true}
      >
        <View style={styles.pomodoroModalContent}>
          <PomodoroTimer
            onTimeLogged={handleTimeLogged}
            onClose={() => setShowPomodoroModal(false)}
          />
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
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#3498db',
    fontWeight: '600',
  },
  pomodoroTab: {
    position: 'absolute',
    right: 16,
    top: -20,
    backgroundColor: '#e74c3c',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pomodoroModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  pomodoroModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
  },
});

export default Navigation;