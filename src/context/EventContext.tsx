import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../types';
import { fetchEvents, createEvent, joinEventInFirestore, deleteEvent, exitEvent as exitEventInFirestore, subscribeToEvents } from '../services/eventService';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  joinEvent: (eventId: string, userId: string) => Promise<void>;
  exitEvent: (eventId: string, userId: string) => Promise<void>;
  cancelEvent: (eventId: string) => Promise<void>;
  getMyEvents: (userId: string) => Event[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const mockEvents: Event[] = [
  // Nov 25 - Past events
  { id: '19', title: 'Football Match', sport: 'Football', date: '2025-11-25', time: '15:00', endTime: '17:00', location: 'City Stadium', maxParticipants: 22, participants: ['1', '26', '27'], creatorId: '19' },
  
  // Dec 1 - Multiple events same day
  { id: '1', title: 'Morning Basketball', sport: 'Basketball', date: '2025-12-01', time: '09:00', endTime: '11:00', location: 'Central Park', maxParticipants: 10, participants: ['1', '2'], creatorId: '1' },
  { id: '29', title: 'Full Event - Yoga Class', sport: 'Yoga', date: '2025-12-01', time: '10:00', endTime: '11:00', location: 'Yoga Studio', maxParticipants: 5, participants: ['2', '3', '4', '5', '6'], creatorId: '2' },
  { id: '21', title: 'Lunch Yoga', sport: 'Yoga', date: '2025-12-01', time: '12:30', endTime: '13:30', location: 'Wellness Center', maxParticipants: 15, participants: ['1', '3'], creatorId: '21' },
  { id: '22', title: 'Evening Tennis', sport: 'Tennis', date: '2025-12-01', time: '18:00', endTime: '20:00', location: 'City Courts', maxParticipants: 4, participants: ['1'], creatorId: '22' },
  
  // Dec 2
  { id: '23', title: 'Morning Run', sport: 'Running', date: '2025-12-02', time: '07:00', endTime: '08:00', location: 'Park Trail', maxParticipants: 20, participants: ['1', '4'], creatorId: '23' },
  { id: '2', title: 'Evening Soccer Match', sport: 'Soccer', date: '2025-12-02', time: '18:00', endTime: '20:00', location: 'Sports Complex', maxParticipants: 22, participants: ['1'], creatorId: '2' },
  
  // Dec 3
  { id: '3', title: 'Tennis Practice', sport: 'Tennis', date: '2025-12-03', time: '14:00', endTime: '16:00', location: 'City Tennis Courts', maxParticipants: 4, participants: ['1', '3'], creatorId: '3' },
  { id: '24', title: 'Boxing Training', sport: 'Boxing', date: '2025-12-03', time: '19:00', endTime: '20:30', location: 'Fight Club', maxParticipants: 8, participants: ['1', '5'], creatorId: '24' },
  
  // Dec 4
  { id: '4', title: 'Yoga Sunrise Session', sport: 'Yoga', date: '2025-12-04', time: '06:30', endTime: '07:30', location: 'Beach Park', maxParticipants: 15, participants: ['1', '4', '5'], creatorId: '4' },
  { id: '25', title: 'Swimming Lessons', sport: 'Swimming', date: '2025-12-04', time: '15:00', endTime: '16:30', location: 'Olympic Pool', maxParticipants: 12, participants: ['1', '6'], creatorId: '25' },
  
  // Dec 5
  { id: '26', title: 'Gym Session', sport: 'Gym', date: '2025-12-05', time: '06:00', endTime: '07:30', location: 'Fitness First', maxParticipants: 20, participants: ['1', '7'], creatorId: '26' },
  { id: '5', title: 'Volleyball Tournament', sport: 'Volleyball', date: '2025-12-05', time: '16:00', endTime: '19:00', location: 'Sandy Beach', maxParticipants: 12, participants: ['1', '2', '6'], creatorId: '5' },
  
  // Dec 6
  { id: '6', title: 'Morning Run Club', sport: 'Running', date: '2025-12-06', time: '07:00', endTime: '08:00', location: 'Riverside Trail', maxParticipants: 20, participants: ['1', '7'], creatorId: '6' },
  { id: '27', title: 'Badminton Doubles', sport: 'Badminton', date: '2025-12-06', time: '19:00', endTime: '21:00', location: 'Sports Hall', maxParticipants: 8, participants: ['1', '8'], creatorId: '27' },
  
  // Dec 7
  { id: '8', title: 'Cycling Adventure', sport: 'Cycling', date: '2025-12-07', time: '08:00', endTime: '12:00', location: 'Mountain Trail', maxParticipants: 15, participants: ['1', '10'], creatorId: '8' },
  { id: '28', title: 'Dance Class', sport: 'Dance', date: '2025-12-07', time: '19:30', endTime: '21:00', location: 'Dance Studio', maxParticipants: 15, participants: ['1', '9'], creatorId: '28' },
  
  // Dec 8
  { id: '11', title: 'Hiking Weekend', sport: 'Hiking', date: '2025-12-08', time: '09:00', endTime: '15:00', location: 'Mountain Peak Trail', maxParticipants: 25, participants: ['1', '14', '15'], creatorId: '11' },
  
  // Dec 9
  { id: '12', title: 'Table Tennis Championship', sport: 'Table Tennis', date: '2025-12-09', time: '13:00', endTime: '17:00', location: 'Community Center', maxParticipants: 16, participants: ['1', '16'], creatorId: '12' },
  
  // Dec 10
  { id: '14', title: 'Baseball Practice', sport: 'Baseball', date: '2025-12-10', time: '16:00', endTime: '18:00', location: 'Stadium Field', maxParticipants: 18, participants: ['1', '19'], creatorId: '14' },
  
  // Dec 11
  { id: '16', title: 'Golf Tournament', sport: 'Golf', date: '2025-12-11', time: '10:00', endTime: '14:00', location: 'Green Valley Golf Club', maxParticipants: 12, participants: ['1', '22'], creatorId: '16' }
];

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time events updates on mount
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToEvents(
      (fetchedEvents) => {
        setEvents(fetchedEvents);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to subscribe to events:', error);
        // Fallback to mock data if Firestore fails
        setEvents(mockEvents);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback to mock data if Firestore fails
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    await loadEvents();
  };

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const eventWithParticipants = {
        ...eventData,
        participants: [eventData.creatorId],
      };
      
      await createEvent(eventWithParticipants);
      // Real-time listener will update the state automatically
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  };

  const joinEvent = async (eventId: string, userId: string) => {
    try {
      // Check if user can join
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      if (event.participants.includes(userId)) throw new Error('Already joined');
      if (event.participants.length >= event.maxParticipants) throw new Error('Event is full');

      await joinEventInFirestore(eventId, userId);
      // Real-time listener will update the state automatically
    } catch (error) {
      console.error('Failed to join event:', error);
      throw error;
    }
  };

  const exitEvent = async (eventId: string, userId: string) => {
    console.log('EventContext.exitEvent called', { eventId, userId });
    try {
      const event = events.find(e => e.id === eventId);
      console.log('Found event:', event);
      
      if (!event) throw new Error('Event not found');
      if (!event.participants.includes(userId)) throw new Error('Not a participant');

      console.log('Calling exitEventInFirestore...');
      await exitEventInFirestore(eventId, userId);
      console.log('exitEventInFirestore completed');
      // Real-time listener will update the state automatically
    } catch (error) {
      console.error('Failed to exit event:', error);
      throw error;
    }
  };

  const cancelEvent = async (eventId: string) => {
    try {
      console.log('=== cancelEvent called ===');
      console.log('Event ID:', eventId);
      
      // Get event details before cancelling
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      
      console.log('Event found:', event.title);
      console.log('Participants:', event.participants);
      console.log('Creator ID:', event.creatorId);
      
      // Cancel the event in Firestore
      console.log('Cancelling event in Firestore...');
      await deleteEvent(eventId);
      console.log('Event cancelled in Firestore');
      
      // Real-time listener will update the state automatically
    } catch (error) {
      console.error('Failed to cancel event:', error);
      throw error;
    }
  };

  const getMyEvents = (userId: string) => {
    return events.filter(event => event.participants.includes(userId));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, joinEvent, exitEvent, cancelEvent, getMyEvents, loading, refreshEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
}
