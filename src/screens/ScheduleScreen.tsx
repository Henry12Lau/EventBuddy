import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Event } from '../types';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import { getEventIcon } from '../utils/eventIcons';

export default function ScheduleScreen({ navigation }: any) {
  const { getMyEvents } = useEvents();
  const { currentUser } = useUser();
  const myEvents = getMyEvents(currentUser?.id || '1');
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');

  const now = new Date();

  const activeEvents = myEvents
    .filter(event => {
      // Check if event has ended based on end time
      const eventEndTime = event.endTime || event.time;
      const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
      const eventEndDateTime = new Date(event.date);
      eventEndDateTime.setHours(endHours, endMinutes, 0, 0);
      
      return eventEndDateTime >= now;
    })
    .sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  
  const archivedEvents = myEvents
    .filter(event => {
      // Check if event has ended based on end time
      const eventEndTime = event.endTime || event.time;
      const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
      const eventEndDateTime = new Date(event.date);
      eventEndDateTime.setHours(endHours, endMinutes, 0, 0);
      
      return eventEndDateTime < now;
    })
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

  const displayEvents = activeTab === 'active' ? activeEvents : archivedEvents;
  
  const renderEvent = ({ item }: { item: Event }) => {
    const isCancelled = item.isActive === false;
    
    return (
      <TouchableOpacity 
        style={[styles.card, isCancelled && styles.cardCancelled]}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      >
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>{getEventIcon(item.title)}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDetail}>⏰ {item.time} - {item.endTime || 'TBD'}</Text>
          <Text style={styles.eventLocation}>📍 {item.location}</Text>
          <Text style={styles.eventParticipants}>👥 {item.participants.length}/{item.maxParticipants} joined</Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{new Date(item.date).toLocaleString('en-US', { month: 'short' })}</Text>
          <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
          <Text style={styles.dateYear}>{new Date(item.date).getFullYear()}</Text>
        </View>
        
        {isCancelled && (
          <View style={styles.cancelledOverlay}>
            <View style={styles.cancelledBadge}>
              <Text style={styles.cancelledBadgeText}>CANCELLED</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeEvents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'archive' && styles.activeTab]}
          onPress={() => setActiveTab('archive')}
        >
          <Text style={[styles.tabText, activeTab === 'archive' && styles.activeTabText]}>
            Archive ({archivedEvents.length})
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'active' ? 'No active events' : 'No archived events'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F1ED' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10
  },
  activeTab: {
    backgroundColor: '#2C3B4D',
    elevation: 2,
    shadowColor: '#2C3B4D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636E72'
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700'
  },
  card: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginVertical: 8, 
    borderRadius: 16, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2C3B4D',
    position: 'relative',
    overflow: 'hidden'
  },
  cardCancelled: {
    opacity: 0.7,
    borderLeftColor: '#FF6B6B'
  },
  dateBox: { 
    width: 70, 
    height: 70,
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#2C3B4D', 
    borderRadius: 12, 
    marginLeft: 16,
    elevation: 2,
    shadowColor: '#2C3B4D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  dateMonth: { fontSize: 11, color: '#fff', textTransform: 'uppercase', fontWeight: '700', textAlign: 'center' },
  dateDay: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginVertical: 2 },
  dateYear: { fontSize: 11, color: '#fff', fontWeight: '600', textAlign: 'center' },
  iconBox: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  iconText: { fontSize: 48 },
  eventInfo: { flex: 1, justifyContent: 'center' },
  eventTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6, color: '#2D3436' },
  eventDetail: { fontSize: 14, color: '#2D3436', marginBottom: 4, fontWeight: '600' },
  eventLocation: { fontSize: 14, color: '#636E72', marginBottom: 4 },
  eventParticipants: { fontSize: 13, color: '#2C3B4D', fontWeight: '600', marginTop: 2 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  emptyText: { textAlign: 'center', color: '#636E72', fontSize: 16, fontStyle: 'italic' },
  cancelledOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none'
  },
  cancelledBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4
  },
  cancelledBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2
  }
});
