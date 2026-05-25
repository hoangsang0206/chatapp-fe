export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isRead?: boolean;
  sticker?: string;
  file?: {
    name: string;
    url?: string;
    type: 'file' | 'image';
    size?: string;
  };
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
  initialMembers?: string[];
}

export interface Story {
  id: string;
  sender: string;
  seed: string;
  isMine: boolean;
  avatarUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  caption?: string;
  timestamp?: string;
  reactionCount?: number;
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
  email?: string;
}

export interface FriendRequest {
  id: string;
  name: string;
  subText: string;
  avatar: string;
}

export interface TodoAttachment {
  name: string;
  url: string;
  type: 'file' | 'image';
  size?: string;
}

export interface CalendarTodo {
  id: string;
  title: string;
  completed: boolean;
  dateStr: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  time?: string; // e.g. "14:00"
  description?: string;
  category?: string;
  tags?: string[];
  attachments?: TodoAttachment[];
}
