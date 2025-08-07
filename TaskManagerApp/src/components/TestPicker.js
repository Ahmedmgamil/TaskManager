import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimplePicker from './SimplePicker';

const TestPicker = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const testItems = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Picker Test</Text>
      <Text style={styles.subtitle}>Selected: {selectedValue || 'None'}</Text>
      
      <SimplePicker
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
        items={testItems}
        placeholder="Select an option"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});

export default TestPicker;