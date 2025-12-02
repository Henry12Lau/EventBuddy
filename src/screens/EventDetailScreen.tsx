import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import { getEventIcon } from '../utils/eventIcons';

export default function EventDetailScreen({ route, navigation }: any) {
  const { event } = route.params;
  const { joinEvent, exitEvent, cancelEvent } = useEvents();
  const { currentUser } = useUser();
  const insets = useSafeAreaInsets();
  const [isJoining, setIsJoining] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const currentUserId = currentUser?.id || '1';
  const isFull = event.participants.length >= event.maxParticipants;
  const hasJoined = event.participants.includes(currentUserId);
  const isCreator = event.creatorId === currentUserId;
  const isCancelled = event.isActive === false;
  
  // Check if event is expired
  const now = new Date();
  const eventEndTime = event.endTime || event.startTime;
  const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
  const eventEndDateTime = new Date(event.date);
  eventEndDateTime.setHours(endHours, endMinutes, 0, 0);
  const isExpired = eventEndDateTime < now;

  const handleJoinEvent = async () => {
    if (isJoining || hasJoined || isFull || isCancelled) return;
    
    setIsJoining(true);
    try {
      await joinEvent(event.id, currentUserId);
      
      if (Platform.OS === 'web') {
        alert('Successfully joined the event!');
      } else {
        Alert.alert('Success', 'Successfully joined the event!');
      }
      
      // Refresh the event data
      navigation.goBack();
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert(error.message || 'Failed to join event. Please try again.');
      } else {
        Alert.alert('Error', error.message || 'Failed to join event. Please try again.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleExitEvent = () => {
    const confirmMessage = `Are you sure you want to exit "${event.title}"?\n\nYou can rejoin later if event are available.`;
    
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        performExitEvent();
      }
    } else {
      Alert.alert(
        'Exit Event',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes, Exit', style: 'destructive', onPress: performExitEvent }
        ]
      );
    }
  };

  const performExitEvent = async () => {
    console.log('performExitEvent called', { eventId: event.id, userId: currentUserId });
    setIsExiting(true);
    try {
      await exitEvent(event.id, currentUserId);
      console.log('Exit event successful');
      
      if (Platform.OS === 'web') {
        alert('You have exited the event');
      } else {
        Alert.alert('Success', 'You have exited the event');
      }
      
      navigation.goBack();
    } catch (error: any) {
      console.error('Exit event error:', error);
      if (Platform.OS === 'web') {
        alert(`Failed to exit event: ${error.message || 'Please try again.'}`);
      } else {
        Alert.alert('Error', `Failed to exit event: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setIsExiting(false);
    }
  };

  const handleCancelEvent = () => {
    const confirmMessage = `Are you sure you want to cancel "${event.title}"?\n\nThis will notify all ${event.participants.length} participant(s).`;
    
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        performCancelEvent();
      }
    } else {
      Alert.alert(
        'Cancel Event',
        confirmMessage,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes, Cancel Event', style: 'destructive', onPress: performCancelEvent }
        ]
      );
    }
  };

  const performCancelEvent = async () => {
    setIsCancelling(true);
    try {
      await cancelEvent(event.id);
      
      if (Platform.OS === 'web') {
        alert('Event cancelled successfully');
      } else {
        Alert.alert('Success', 'Event cancelled successfully');
      }
      
      navigation.goBack();
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert('Failed to cancel event. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to cancel event. Please try again.');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>{getEventIcon(event.title)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{event.title}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + 65 + insets.bottom }]}
        showsVerticalScrollIndicator={true}
      >
        {isCancelled && (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledIcon}>⚠️</Text>
            <Text style={styles.cancelledText}>This event has been cancelled</Text>
          </View>
        )}

        {isExpired && !isCancelled && (
          <View style={styles.expiredBanner}>
            <Text style={styles.expiredIcon}>⏰</Text>
            <Text style={styles.expiredText}>This event has ended</Text>
          </View>
        )}

        {isFull && !hasJoined && !isCancelled && !isExpired && (
          <View style={styles.fullBanner}>
            <Text style={styles.fullIcon}>🚫</Text>
            <Text style={styles.fullText}>This event is full</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <View style={styles.infoText}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>{event.date} at {event.startTime} - {event.endTime || 'TBD'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📍</Text>
            <View style={styles.infoText}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>👥</Text>
            <View style={styles.infoText}>
              <Text style={styles.label}>Participants</Text>
              <Text style={styles.value}>{event.participants.length}/{event.maxParticipants} joined</Text>
            </View>
          </View>

          {isCreator && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.icon}>👑</Text>
                <View style={styles.infoText}>
                  <Text style={styles.label}>Your Role</Text>
                  <Text style={styles.value}>Event Creator</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        paddingBottom: 20 + insets.bottom,
        bottom: 65,
      }]}>
        <TouchableOpacity 
          style={[styles.chatButton, (!hasJoined && !isCreator) && styles.chatButtonDisabled]}
          onPress={() => navigation.navigate('EventChat', { event })}
          disabled={isCancelled || isExpired || (!hasJoined && !isCreator)}
        >
          <Text style={[styles.chatButtonText, (!hasJoined && !isCreator) && styles.chatButtonTextDisabled]}>💬 Chat</Text>
        </TouchableOpacity>
        
        {isCreator && !isCancelled && !isExpired ? (
          <TouchableOpacity 
            style={[styles.cancelButton, isCancelling && styles.cancelButtonDisabled]}
            disabled={isCancelling}
            onPress={handleCancelEvent}
          >
            <Text style={styles.cancelButtonText}>
              {isCancelling ? 'Cancelling...' : '🗑️ Cancel Event'}
            </Text>
          </TouchableOpacity>
        ) : hasJoined && !isCancelled && !isExpired ? (
          <TouchableOpacity 
            style={[styles.exitButton, isExiting && styles.exitButtonDisabled]}
            disabled={isExiting}
            onPress={handleExitEvent}
          >
            <Text style={styles.exitButtonText}>
              {isExiting ? 'Exiting...' : '🚪 Exit Event'}
            </Text>
          </TouchableOpacity>
        ) : isExpired ? (
          <TouchableOpacity 
            style={[styles.joinButton, styles.joinButtonDisabled]}
            disabled={true}
          >
            <Text style={styles.joinButtonText}>Event Ended</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.joinButton, (isFull || isJoining || isCancelled) && styles.joinButtonDisabled]}
            disabled={isFull || isJoining || isCancelled}
            onPress={handleJoinEvent}
          >
            <Text style={styles.joinButtonText}>
              {isCancelled ? 'Event Cancelled' : isJoining ? 'Joining...' : isFull ? 'Event Full' : 'Join Event'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2C3B4D' },
  container: { flex: 1, backgroundColor: '#F2F1ED' },

  header: { 
    flexDirection: 'row', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2C3B4D', 
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2C3B4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  avatar: { 
    width: 44, 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12
  },
  avatarIcon: { fontSize: 36 },
  headerInfo: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { 
    flex: 1,
  },
  scrollContent: { 
    paddingBottom: 180,
  },
  cancelledBanner: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  cancelledIcon: {
    fontSize: 24,
    marginRight: 12
  },
  cancelledText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  fullBanner: {
    backgroundColor: '#FFA502',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FFA502',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  fullIcon: {
    fontSize: 24,
    marginRight: 12
  },
  fullText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  expiredBanner: {
    backgroundColor: '#95A5A6',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#95A5A6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  expiredIcon: {
    fontSize: 24,
    marginRight: 12
  },
  expiredText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  infoCard: { 
    backgroundColor: '#fff', 
    margin: 20, 
    borderRadius: 24, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8 
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14 },
  icon: { fontSize: 28, marginRight: 18, width: 36, marginTop: 2 },
  infoText: { flex: 1 },
  label: { fontSize: 13, color: '#636E72', marginBottom: 6, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
  value: { fontSize: 17, color: '#2D3436', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E9EDEF', marginVertical: 6 },
  footer: { 
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row', 
    padding: 20,
    backgroundColor: 'transparent',
  },
  chatButton: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginRight: 10, 
    borderWidth: 2, 
    borderColor: '#2C3B4D',
    elevation: 2
  },
  chatButtonDisabled: {
    backgroundColor: '#E9EDEF',
    borderColor: '#C9C1B1',
    opacity: 0.6
  },
  chatButtonText: { color: '#2C3B4D', fontSize: 16, fontWeight: '700' },
  chatButtonTextDisabled: { color: '#636E72' },
  joinButton: { 
    flex: 1, 
    backgroundColor: '#FFB162', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FFB162',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  joinButtonDisabled: {
    backgroundColor: '#C9C1B1',
    shadowColor: '#C9C1B1',
    opacity: 0.6
  },
  joinButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  cancelButtonDisabled: {
    backgroundColor: '#C9C1B1',
    opacity: 0.6
  },
  cancelButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  exitButton: {
    flex: 1,
    backgroundColor: '#FF9F43',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF9F43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  exitButtonDisabled: {
    backgroundColor: '#C9C1B1',
    opacity: 0.6
  },
  exitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
