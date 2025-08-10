import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskListScreen from '../screens/TaskListScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('tasks');

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

      </View>
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

});

export default Navigation;