export interface User {
  id: string;
  name: string;
  email: string;
  pushToken?: string;
  role?: number;  // 0 = admin, 1 = normal user (default)
}

export interface Event {
  id: string;
  title: string;
  icon?: string;
  date: string;
  startTime: string;
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
