import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SimpleCalendar = ({ current, onDayPress, markedDates = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date(current || new Date()));
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
      const markedData = markedDates[dateString] || {};
      const isSelected = markedData.selected;
      const dots = markedData.dots || [];
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay
          ]}
          onPress={() => onDayPress({ dateString })}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText
          ]}>
            {day}
          </Text>
          {dots.length > 0 && (
            <View style={styles.dotsContainer}>
              {dots.slice(0, 3).map((dot, index) => (
                <View
                  key={index}
                  style={[styles.dot, { backgroundColor: dot.color }]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <View style={styles.calendar}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color="#3498db" />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      {/* Week days header */}
      <View style={styles.weekHeader}>
        {weekDays.map(day => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.daysGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 7 days per week
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  selectedDay: {
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default SimpleCalendar;