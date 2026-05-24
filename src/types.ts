export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isRead?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'group' | 'direct';
  lastMessage?: string;
  avatar: string;
  status?: 'online' | 'offline' | 'busy' | 'away' | 'scanning' | string;
  unreadCount: number;
  messages: Message[];
  nodeValue?: string;
}

export interface Story {
  id: string;
  sender: string;
  seed: string;
  isMine: boolean;
  avatarUrl: string;
}

export interface Notification {
  id: string;
  sender: string;
  text: string;
  time: string;
  color: 'green' | 'magenta' | 'cyan' | 'gray';
}

export interface UserProfile {
  name: string;
  bio: string;
  userId: string;
  avatar: string;
  banner: string;
}

export interface FriendRequest {
  id: string;
  name: string;
  subText: string;
  avatar: string;
}
