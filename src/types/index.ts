export interface User {
  id: string;
  name: string;
  email: string;
  pushToken?: string;
}

export interface Event {
  id: string;
  title: string;
  sport?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  maxParticipants: number;
  participants: string[];
  creatorId: string;
  description?: string;
  isActive?: boolean;
}

export interface Message {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}
