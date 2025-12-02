import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const mockEvents = [
  // Nov 25 - Past events
  { title: 'Football Match', icon: '⚽', date: '2025-11-25', startTime: '15:00', endTime: '17:00', location: 'City Stadium', maxParticipants: 22, participants: ['1', '26', '27'], creatorId: '19' },
  
  // Dec 1 - Multiple events same day
  { title: 'Morning Basketball', icon: '🏀', date: '2025-12-01', startTime: '09:00', endTime: '11:00', location: 'Central Park', maxParticipants: 10, participants: ['1', '2'], creatorId: '1' },
  { title: 'Full Event - Yoga Class', icon: '🧘', date: '2025-12-01', startTime: '10:00', endTime: '11:00', location: 'Yoga Studio', maxParticipants: 5, participants: ['2', '3', '4', '5', '6'], creatorId: '2' },
  { title: 'Lunch Yoga', icon: '🧘', date: '2025-12-01', startTime: '12:30', endTime: '13:30', location: 'Wellness Center', maxParticipants: 15, participants: ['1', '3'], creatorId: '21' },
  { title: 'Evening Tennis', icon: '🎾', date: '2025-12-01', startTime: '18:00', endTime: '20:00', location: 'City Courts', maxParticipants: 4, participants: ['1'], creatorId: '22' },
  
  // Dec 2
  { title: 'Morning Run', icon: '🏃', date: '2025-12-02', startTime: '07:00', endTime: '08:00', location: 'Park Trail', maxParticipants: 20, participants: ['1', '4'], creatorId: '23' },
  { title: 'Evening Soccer Match', icon: '⚽', date: '2025-12-02', startTime: '18:00', endTime: '20:00', location: 'Sports Complex', maxParticipants: 22, participants: ['1'], creatorId: '2' },
  
  // Dec 3
  { title: 'Tennis Practice', icon: '🎾', date: '2025-12-03', startTime: '14:00', endTime: '16:00', location: 'City Tennis Courts', maxParticipants: 4, participants: ['1', '3'], creatorId: '3' },
  { title: 'Boxing Training', icon: '🥊', date: '2025-12-03', startTime: '19:00', endTime: '20:30', location: 'Fight Club', maxParticipants: 8, participants: ['1', '5'], creatorId: '24' },
];

// Sample user data
const sampleUser = {
  name: 'Demo User',
  email: 'demo@eventbuddy.com',
  role: 0  // 0 = admin, 1 = normal user
};

export const seedDatabase = async () => {
  return await seedFirestoreData();
};

export const seedFirestoreData = async () => {
  try {
    console.log('Starting to seed Firestore data...');
    
    // Seed sample user
    console.log('Creating sample user...');
    await setDoc(doc(db, 'users', '1'), sampleUser);
    console.log('Sample user created: Demo User');
    
    // Seed events
    const eventsCollection = collection(db, 'events');
    for (const event of mockEvents) {
      await addDoc(eventsCollection, event);
      console.log(`Added event: ${event.title}`);
    }
    
    console.log('Successfully seeded all data to Firestore!');
    return { success: true, count: mockEvents.length + 1 };
  } catch (error) {
    console.error('Error seeding Firestore data:', error);
    throw error;
  }
};
