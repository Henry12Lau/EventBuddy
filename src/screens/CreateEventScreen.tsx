import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/UserContext';

const TIME_OPTIONS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

export default function CreateEventScreen({ navigation }: any) {
  const { addEvent } = useEvents();
  const { currentUser } = useUser();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDateString(formatDate(selectedDate));
      if (errors.date) setErrors({...errors, date: ''});
    }
  };

  const handleCreate = async () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!dateString) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!endTime) {
      newErrors.endTime = 'End time is required';
    } else if (dateString && endTime) {
      // Check if end time has already passed
      const now = new Date();
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const eventEndDateTime = new Date(dateString);
      eventEndDateTime.setHours(endHours, endMinutes, 0, 0);
      
      if (eventEndDateTime < now) {
        newErrors.endTime = 'End time cannot be in the past';
      }
    }
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!maxParticipants || parseInt(maxParticipants) < 1) {
      newErrors.maxParticipants = 'Max participants is required (minimum 1)';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await addEvent({
        title: title.trim(),
        date: dateString,
        startTime: startTime,
        endTime: endTime,
        location: location.trim(),
        maxParticipants: parseInt(maxParticipants),
        participants: [],
        creatorId: currentUser?.id || '1',
      });
      
      if (Platform.OS === 'web') {
        alert('Event created successfully!');
      } else {
        Alert.alert('Success', 'Event created successfully!');
      }
      
      navigation.goBack();
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Failed to create event. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to create event. Please try again.');
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 24, paddingTop: 20 }}
    >
      {/* <Text style={styles.title}>Create Event</Text> */}

      <Text style={styles.label}>Event Title <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors({...errors, title: ''});
        }}
        placeholder="e.g., Weekend Basketball Game"
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={dateString}
          onChange={(e: any) => {
            setDateString(e.target.value);
            if (errors.date) setErrors({...errors, date: ''});
          }}
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: errors.date ? '#FF6B6B' : '#DFE6E9',
            borderRadius: 12,
            padding: 14,
            fontSize: 16,
            color: '#2D3436',
            border: errors.date ? '1px solid #FF6B6B' : '1px solid #DFE6E9',
            borderRadius: '12px',
            fontFamily: 'system-ui'
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.input, errors.date && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {dateString || 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
              accentColor="#2C3B4D"
              textColor="#2C3B4D"
              themeVariant="light"
            />
          )}
        </>
      )}
      {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

      <Text style={styles.label}>Start Time <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity 
        style={[styles.input, errors.startTime && styles.inputError]}
        onPress={() => {
          setShowStartTimePicker(!showStartTimePicker);
          setShowEndTimePicker(false);
          if (errors.startTime) setErrors({...errors, startTime: ''});
        }}
      >
        <Text style={styles.inputText}>{startTime}</Text>
      </TouchableOpacity>
      {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
      <Modal
        visible={showStartTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStartTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Start Time</Text>
              <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timePickerScroll}>
              {TIME_OPTIONS.map((timeOption) => (
                <TouchableOpacity
                  key={timeOption}
                  style={[styles.timeOption, startTime === timeOption && styles.timeOptionSelected]}
                  onPress={() => {
                    setStartTime(timeOption);
                    setShowStartTimePicker(false);
                  }}
                >
                  <Text style={[styles.timeOptionText, startTime === timeOption && styles.timeOptionTextSelected]}>
                    {timeOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>End Time <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity 
        style={[styles.input, errors.endTime && styles.inputError]}
        onPress={() => {
          setShowEndTimePicker(!showEndTimePicker);
          setShowStartTimePicker(false);
          if (errors.endTime) setErrors({...errors, endTime: ''});
        }}
      >
        <Text style={styles.inputText}>{endTime}</Text>
      </TouchableOpacity>
      {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
      <Modal
        visible={showEndTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEndTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select End Time</Text>
              <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timePickerScroll}>
              {TIME_OPTIONS.map((timeOption) => (
                <TouchableOpacity
                  key={timeOption}
                  style={[styles.timeOption, endTime === timeOption && styles.timeOptionSelected]}
                  onPress={() => {
                    setEndTime(timeOption);
                    setShowEndTimePicker(false);
                  }}
                >
                  <Text style={[styles.timeOptionText, endTime === timeOption && styles.timeOptionTextSelected]}>
                    {timeOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.location && styles.inputError]}
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          if (errors.location) setErrors({...errors, location: ''});
        }}
        placeholder="Enter location"
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <Text style={styles.label}>Max Participants <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.maxParticipants && styles.inputError]}
        value={maxParticipants}
        onChangeText={(text) => {
          setMaxParticipants(text);
          if (errors.maxParticipants) setErrors({...errors, maxParticipants: ''});
        }}
        placeholder="e.g., 10"
        keyboardType="numeric"
      />
      {errors.maxParticipants && <Text style={styles.errorText}>{errors.maxParticipants}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F1ED' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 28, color: '#2D3436', letterSpacing: 0.5 },
  label: { fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 10, color: '#2D3436', textTransform: 'uppercase', letterSpacing: 0.5 },
  required: { color: '#FF6B6B', fontSize: 15 },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#E9EDEF', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 16, 
    color: '#2D3436', 
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  inputError: { borderColor: '#FF6B6B', borderWidth: 2 },
  inputText: { fontSize: 16, color: '#2D3436', fontWeight: '500' },
  errorText: { color: '#FF6B6B', fontSize: 13, marginTop: 6, marginLeft: 6, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EDEF'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436'
  },
  modalClose: {
    fontSize: 24,
    color: '#636E72',
    fontWeight: '600'
  },
  timePickerScroll: {
    padding: 16
  },
  timeOption: { padding: 16, borderRadius: 12, marginVertical: 3 },
  timeOptionSelected: { backgroundColor: '#2C3B4D', elevation: 2 },
  timeOptionText: { fontSize: 16, color: '#2D3436', textAlign: 'center', fontWeight: '500' },
  timeOptionTextSelected: { color: '#fff', fontWeight: '700' },
  button: { 
    backgroundColor: '#FFB162', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 36, 
    marginBottom: 30, 
    alignItems: 'center', 
    elevation: 6, 
    shadowColor: '#FFB162', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 8 
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 }
});
