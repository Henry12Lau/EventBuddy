import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Event } from '../types';
import { useEvents } from '../context/EventContext';
import { getEventIcon } from '../utils/eventIcons';

export default function EventsScreen({ navigation }: any) {
  const { events, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  // Filter events using original EventsScreen logic
  const filteredEvents = events
    .filter(event => {
      // Filter out cancelled events
      if (event.isActive === false) {
        return false;
      }
      
      // Filter out expired events based on end time
      const eventEndTime = event.endTime || event.time;
      const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
      const eventEndDateTime = new Date(event.date);
      eventEndDateTime.setHours(endHours, endMinutes, 0, 0);
      
      if (eventEndDateTime < now) {
        return false; // Hide expired events
      }
      
      // Apply search filter
      return (
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  
  const renderEvent = ({ item }: { item: Event }) => {
    const isCancelled = item.isActive === false;
    const isFull = item.participants.length >= item.maxParticipants;
    
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
        
        {isFull && !isCancelled && (
          <View style={styles.fullOverlay}>
            <View style={styles.fullBadge}>
              <Text style={styles.fullBadgeText}>FULL</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C3B4D" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events by title or location..."
          placeholderTextColor="#636E72"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming events</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Create a new event to get started!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F1ED' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#636E72', fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#E9EDEF'
  },
  searchIcon: { fontSize: 20, marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3436'
  },
  clearButton: {
    padding: 8,
    marginLeft: 8
  },
  clearButtonText: {
    fontSize: 18,
    color: '#636E72',
    fontWeight: '600'
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
  emptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#636E72', 
    marginBottom: 8 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#636E72' 
  },
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
  },
  fullOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 165, 2, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none'
  },
  fullBadge: {
    backgroundColor: '#FFA502',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    elevation: 4,
    shadowColor: '#FFA502',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2
  }
});
