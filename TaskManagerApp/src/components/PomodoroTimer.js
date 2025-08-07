import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PomodoroTimer = ({ 
  task = null, 
  onTimeLogged = null,
  onClose = null 
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  
  const intervalRef = useRef(null);
  
  const PHASES = {
    work: { duration: 25 * 60, label: 'Work Time', color: '#e74c3c' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: '#2ecc71' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: '#3498db' },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    Vibration.vibrate([500, 200, 500]);
    
    if (currentPhase === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      setTotalTimeSpent(prev => prev + PHASES.work.duration);
      
      // Log time to task if provided
      if (task && onTimeLogged) {
        onTimeLogged(task.id, PHASES.work.duration / 60); // Convert to minutes
      }
      
      // Determine next phase
      const nextPhase = newCompletedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCurrentPhase(nextPhase);
      setTimeLeft(PHASES[nextPhase].duration);
      
      Alert.alert(
        'Pomodoro Complete!',
        `Great work! You've completed ${newCompletedPomodoros} pomodoro${newCompletedPomodoros !== 1 ? 's' : ''}. Time for a ${nextPhase === 'longBreak' ? 'long' : 'short'} break.`,
        [
          { text: 'Start Break', onPress: () => setIsRunning(true) },
          { text: 'Skip Break', onPress: () => startWorkPhase() }
        ]
      );
    } else {
      // Break complete
      Alert.alert(
        'Break Complete!',
        'Break time is over. Ready to get back to work?',
        [
          { text: 'Start Work', onPress: () => startWorkPhase() },
          { text: 'Extend Break', onPress: () => setTimeLeft(5 * 60) }
        ]
      );
    }
  };

  const startWorkPhase = () => {
    setCurrentPhase('work');
    setTimeLeft(PHASES.work.duration);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset the current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setCurrentPhase('work');
            setTimeLeft(PHASES.work.duration);
          }
        }
      ]
    );
  };

  const resetSession = () => {
    Alert.alert(
      'Reset Session',
      'This will reset your entire pomodoro session. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setCurrentPhase('work');
            setTimeLeft(PHASES.work.duration);
            setCompletedPomodoros(0);
            setTotalTimeSpent(0);
          }
        }
      ]
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressPercentage = () => {
    const totalDuration = PHASES[currentPhase].duration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const currentPhaseData = PHASES[currentPhase];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pomodoro Timer</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Task Info */}
      {task && (
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
      )}

      {/* Phase Indicator */}
      <View style={[styles.phaseIndicator, { backgroundColor: currentPhaseData.color }]}>
        <Text style={styles.phaseLabel}>{currentPhaseData.label}</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, { borderColor: currentPhaseData.color }]}>
          <Text style={[styles.timerText, { color: currentPhaseData.color }]}>
            {formatTime(timeLeft)}
          </Text>
          <View style={styles.progressRing}>
            <View 
              style={[
                styles.progressFill,
                {
                  backgroundColor: currentPhaseData.color,
                  transform: [{ rotate: `${(getProgressPercentage() * 3.6)}deg` }]
                }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={resetTimer}
        >
          <Ionicons name="refresh" size={24} color="#95a5a6" />
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.primaryButton,
            { backgroundColor: isRunning ? '#e74c3c' : currentPhaseData.color }
          ]}
          onPress={toggleTimer}
        >
          <Ionicons 
            name={isRunning ? "pause" : "play"} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={resetSession}
        >
          <Ionicons name="stop" size={24} color="#95a5a6" />
          <Text style={styles.secondaryButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedPomodoros}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatTotalTime(totalTimeSpent)}</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {completedPomodoros > 0 ? Math.round(totalTimeSpent / completedPomodoros / 60) : 0}m
          </Text>
          <Text style={styles.statLabel}>Avg Session</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Pomodoro Tips:</Text>
        <Text style={styles.tipText}>• Focus on one task during work sessions</Text>
        <Text style={styles.tipText}>• Take breaks seriously - step away from work</Text>
        <Text style={styles.tipText}>• After 4 pomodoros, take a longer break</Text>
      </View>
    </View>
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
  taskInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  phaseIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 30,
  },
  phaseLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    top: 0,
    right: '50%',
    transformOrigin: 'right bottom',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryButtonText: {
    color: '#95a5a6',
    fontSize: 12,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  tipsContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 4,
  },
});

export default PomodoroTimer;