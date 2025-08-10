import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SimplePicker = ({ selectedValue, onValueChange, items, placeholder = 'Select an option' }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Close dropdown when component unmounts or when another picker opens
  React.useEffect(() => {
    return () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
  }, []);
  
  // More robust value matching - handle string/type mismatches
  const selectedItem = items.find(item => {
    // Try exact match first
    if (item.value === selectedValue) return true;
    // Try string comparison as fallback
    if (String(item.value) === String(selectedValue)) return true;
    return false;
  });
  
  // Debug logging
  console.log('SimplePicker Debug:');
  console.log('- selectedValue:', selectedValue, typeof selectedValue);
  console.log('- items:', items.map(item => ({ label: item.label, value: item.value, type: typeof item.value })));
  console.log('- selectedItem:', selectedItem);
  
  // Additional validation
  if (selectedValue && !selectedItem) {
    console.warn('SimplePicker: No matching item found for selectedValue:', selectedValue);
    console.warn('Available values:', items.map(item => item.value));
  }

  const handlePress = () => {
    console.log('SimplePicker: Button pressed, Platform:', Platform.OS);
    console.log('SimplePicker: Items:', items);
    console.log('SimplePicker: Selected value:', selectedValue, typeof selectedValue);
    console.log('SimplePicker: Selected item found:', selectedItem);
    
    // Use modal for all platforms to ensure proper layering
    setShowModal(true);
  };
  
  const openDropdown = () => {
    setShowDropdown(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const closeDropdown = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setShowDropdown(false);
    });
  };

  const handleOptionPress = (value) => {
    console.log('SimplePicker: Option selected:', value);
    console.log('SimplePicker: Calling onValueChange with:', value);
    onValueChange(value);
    setShowModal(false);
  };
  
  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerText, !selectedItem && styles.placeholder]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons 
          name={showDropdown ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {/* Modal for all platforms */}
      <Modal
        visible={showModal}
        transparent={Platform.OS !== 'android'}
        animationType={Platform.OS === 'android' ? 'none' : 'slide'}
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={Platform.OS === 'android'}
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : undefined}
      >
        <View style={[styles.modalOverlay, Platform.OS === 'android' && styles.androidModalOverlay]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          <View style={[styles.modalContent, Platform.OS === 'android' && styles.androidModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.option,
                    (selectedValue === item.value || String(selectedValue) === String(item.value)) && styles.selectedOption
                  ]}
                  onPress={() => handleOptionPress(item.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    (selectedValue === item.value || String(selectedValue) === String(item.value)) && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {(selectedValue === item.value || String(selectedValue) === String(item.value)) && (
                    <Ionicons name="checkmark" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    minHeight: 48,
  },
  pickerText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  placeholder: {
    color: '#999',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 999999,
    elevation: 50,
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999999,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: 'white',
    zIndex: 999999,
    elevation: 100,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  selectedDropdownOption: {
    backgroundColor: '#e3f2fd',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedDropdownOptionText: {
    color: '#3498db',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    elevation: 5,
  },
  androidModalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    elevation: 10,
  },
  androidModalContent: {
    borderRadius: 12,
    maxHeight: '50%',
    minWidth: '80%',
    maxWidth: '90%',
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
  },
  optionsList: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedOptionText: {
    color: '#3498db',
    fontWeight: '600',
  },
});

export default SimplePicker;