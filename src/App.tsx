import React, { useState } from 'react';
import { 
  INITIAL_PROFILE, 
  INITIAL_STORIES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHATS, 
  INITIAL_FRIEND_REQUESTS, 
  INITIAL_CONTACTS,
  INITIAL_TODOS
} from './initialData';
import { ChatThread, Story, Notification, UserProfile, Message, CalendarTodo } from './types';

// Importing views
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import ContactsView from './components/ContactsView';
import SettingsView from './components/SettingsView';
import StoriesView from './components/StoriesView';
import CalendarTodoView from './components/CalendarTodoView';
import GeminiChatView from './components/GeminiChatView';
import AuthView from './components/AuthView';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  
  // App States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cyber_auth_token') === 'true';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cyber_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure email exists from INITIAL_PROFILE if absent in saved state
        if (!parsed.email) {
          parsed.email = INITIAL_PROFILE.email;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  React.useEffect(() => {
    localStorage.setItem('cyber_user_profile', JSON.stringify(profile));
  }, [profile]);

  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHATS);
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [todos, setTodos] = useState<CalendarTodo[]>(() => {
    const saved = localStorage.getItem('cyber_calendar_todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TODOS;
      }
    }
    return INITIAL_TODOS;
  });

  React.useEffect(() => {
    localStorage.setItem('cyber_calendar_todos', JSON.stringify(todos));
  }, [todos]);
  
  const [activeThreadId, setActiveThreadId] = useState<string>('t1');
  
  // UI Dialog/Popup states
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);

  // Actions
  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    // Mark as read
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, unreadCount: 0 };
      }
      return t;
    }));
    setActiveTab('chat');
  };

  const handleSendMessage = (threadId: string, text: string, isIncoming = false, sticker?: string, file?: Message['file']) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: isIncoming ? threads.find(t => t.id === threadId)?.name || 'Operator' : profile.name,
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMine: !isIncoming,
      isRead: true,
      sticker: sticker,
      file: file
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updatedMessages = [...t.messages, newMessage];
        return {
          ...t,
          messages: updatedMessages,
          lastMessage: sticker ? `[Nhãn dán / Sticker]` : (file ? `[Tệp tin / ${file.name}]` : text),
          unreadCount: isIncoming ? t.unreadCount + 1 : 0
        };
      }
      return t;
    }));
  };

  const handleAddTodo = (newTodo: CalendarTodo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const handleToggleTodo = (todoId: string) => {
    setTodos(prev => prev.map(t => {
      if (t.id === todoId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos(prev => prev.filter(t => t.id !== todoId));
  };

  const handleAddStory = () => {
    const promptName = window.prompt("Nhập tiêu đề hoặc tên nhân vật cho Story mới của bạn:");
    if (!promptName || !promptName.trim()) return;
    
    // Choose a random seed from Dicebear for avatar selection
    const randomSeed = Math.floor(Math.random() * 1000);
    const newStory: Story = {
      id: `story-${Date.now()}`,
      sender: promptName.trim().toUpperCase(),
      seed: String(randomSeed),
      isMine: true,
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randomSeed}`,
      reactionCount: 0
    };

    setStories(prev => [newStory, ...prev]);
  };

  const handleReactStory = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, reactionCount: (story.reactionCount || 0) + 1 }
        : story
    ));
  };

  const handleAcceptRequest = (requestId: string) => {
    const acceptedReq = friendRequests.find(r => r.id === requestId);
    if (!acceptedReq) return;

    // Add to Contacts database
    const newContact = {
      id: `contact-${Date.now()}`,
      name: acceptedReq.name,
      status: 'Online // Đã kết nối mã hóa',
      online: true,
      avatarUrl: acceptedReq.avatar
    };

    // Instantiate a new Chat thread for the accepted friend
    const newThread: ChatThread = {
      id: `t-new-${Date.now()}`,
      name: acceptedReq.name,
      type: 'direct',
      avatar: acceptedReq.avatar,
      status: 'online',
      nodeValue: '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase(),
      unreadCount: 0,
      messages: [
        {
          id: `msg-first-${Date.now()}`,
          sender: acceptedReq.name,
          text: 'Kênh kết nối an toàn đã được kích hoạt. Hãy gõ lời chào.',
          timestamp: 'Vừa xong',
          isMine: false
        }
      ]
    };

    setContacts(prev => [newContact, ...prev]);
    setThreads(prev => [newThread, ...prev]);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleAddContact = (name: string, status: string, online: boolean) => {
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name.replace(/\s+/g, '_')}`;
    const newContact = {
      id: `contact-${Date.now()}`,
      name: name,
      status: status,
      online: online,
      avatarUrl: avatarUrl
    };

    // Instantiate a new Chat Thread
    const newThread: ChatThread = {
      id: `t-new-${Date.now()}`,
      name: name,
      type: 'direct',
      avatar: avatarUrl,
      status: 'online',
      nodeValue: '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase(),
      unreadCount: 0,
      messages: []
    };

    setContacts(prev => [newContact, ...prev]);
    setThreads(prev => [newThread, ...prev]);
  };

  const handleStartChatFromContact = (contactName: string) => {
    // Check if thread already exists
    const existingThread = threads.find(t => t.name.toLowerCase() === contactName.toLowerCase());
    if (existingThread) {
      setActiveThreadId(existingThread.id);
      setActiveTab('chat');
    } else {
      // Create new thread
      const matchContact = contacts.find(c => c.name.toLowerCase() === contactName.toLowerCase());
      const avatarUrl = matchContact?.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${contactName}`;
      
      const newThread: ChatThread = {
        id: `t-new-${Date.now()}`,
        name: contactName,
        type: 'direct',
        avatar: avatarUrl,
        status: 'online',
        nodeValue: '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase(),
        unreadCount: 0,
        messages: []
      };

      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      setActiveTab('chat');
    }
  };

  const handleLeaveThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    const remaining = threads.filter(t => t.id !== threadId);
    if (remaining.length > 0) {
      setActiveThreadId(remaining[0].id);
    }
  };

  const handleCreateGroupChat = (name: string, members: string[]) => {
    const formattedName = name.trim().startsWith('#') ? name.trim() : `#${name.trim().toUpperCase().replace(/\s+/g, '_')}`;
    const newThreadId = `g-new-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      name: formattedName,
      type: 'group',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
      unreadCount: 0,
      nodeValue: '#' + Math.floor(Math.random() * 900 + 100),
      messages: [
        {
          id: `msg-g-first-${Date.now()}`,
          sender: 'SYSTEM',
          text: `Nhóm bảo mật ${formattedName} đã được thiết lập bởi Bùi Hữu Vũ.`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isMine: false
        }
      ],
      initialMembers: members
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setActiveTab('chat');
  };

  const handleLogin = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
    localStorage.setItem('cyber_auth_token', 'true');
  };

  const handleRegister = (name: string, email: string) => {
    setProfile(prev => ({ ...prev, name, email }));
    setIsAuthenticated(true);
    localStorage.setItem('cyber_auth_token', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cyber_auth_token');
    setShowProfileCard(false);
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div id="app-root-container" className="selection:bg-neon-green selection:text-black grid-bg min-h-screen relative overflow-hidden">
      {/* Sidebar Navigation */}
      <aside id="main-navigation-sidebar" className="fixed left-0 top-0 h-full flex flex-col items-center py-4 bg-surface-container-lowest border-r border-[#2A2A3A] w-16 md:w-20 z-50">
        <div className="mb-8" id="sidebar-logo-container">
          <img 
            alt="CYBER_HUB Logo" 
            className="w-12 h-12 object-contain mx-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM"
          />
        </div>
        
        <nav className="flex flex-col gap-2 w-full" id="sidebar-navigation">
          {/* Home Active Tab */}
          <button 
            id="tab-btn-home"
            onClick={() => { setActiveTab('home'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'home' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">terminal</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider">Home</span>
          </button>

          {/* Chat Inactive Tab */}
          <button 
            id="tab-btn-chat"
            onClick={() => { setActiveTab('chat'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'chat' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">chat_bubble</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider">Chat</span>
          </button>

          {/* Contacts Inactive Tab */}
          <button 
            id="tab-btn-contacts"
            onClick={() => { setActiveTab('contacts'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'contacts' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">group</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider">Contacts</span>
          </button>

          {/* Stories Tab */}
          <button 
            id="tab-btn-stories"
            onClick={() => { setActiveTab('stories'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'stories' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">auto_stories</span>
            <span className="text-[8px] mt-1.5 uppercase font-bold tracking-wider">Stories</span>
          </button>

          {/* Calendar Tab */}
          <button 
            id="tab-btn-calendar"
            onClick={() => { setActiveTab('calendar'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'calendar' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">calendar_month</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider">Calendar</span>
          </button>

          {/* Gemini AI / Assistant Tab */}
          <button 
            id="tab-btn-gemini"
            onClick={() => { setActiveTab('gemini'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'gemini' 
                ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,212,255,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold text-neon-cyan">smart_toy</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider text-neon-cyan">Assistant</span>
          </button>

          {/* Settings Tab */}
          <button 
            id="tab-btn-settings"
            onClick={() => { setActiveTab('settings'); setShowNotifications(false); }}
            className={`flex flex-col items-center py-4 transition-all duration-300 border-l-4 cursor-pointer outline-none ${
              activeTab === 'settings' 
                ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-on-surface-variant/70 border-transparent hover:text-neon-cyan hover:bg-surface-container-high/40'
            }`}
          >
            <span className="material-symbols-outlined font-semibold">settings</span>
            <span className="text-[8px] mt-1 uppercase font-bold tracking-wider">Settings</span>
          </button>
        </nav>

        {/* User Profile avatar trigger card at bottom-left */}
        <div className="mt-auto" id="sidebar-profile-zone">
          <button 
            id="sidebar-profile-btn"
            onClick={() => { setShowProfileCard(!showProfileCard); setShowNotifications(false); }}
            className="text-on-surface-variant/75 flex flex-col items-center py-4 hover:text-hot-pink transition-all cursor-pointer outline-none group"
          >
            <div className="w-8 h-8 border border-on-surface-variant/40 group-hover:border-hot-pink overflow-hidden bg-black/40 transition-all duration-300">
              <img 
                src={profile.avatar} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[8px] mt-1.5 uppercase font-bold">Profile</span>
          </button>
        </div>
      </aside>

      {/* Top Application Bar */}
      <header id="main-application-header" className="fixed top-0 left-16 md:left-20 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-[#2A2A3A] flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4" id="header-brand-box">
          <h1 className="text-lg font-black text-terminal-magenta uppercase tracking-tighter cursor-pointer" onClick={() => setActiveTab('home')}>
             CYBER CHAT
          </h1>
          <div className="h-4 w-px bg-[#2A2A3A]"></div>
          <nav className="hidden md:flex gap-6 font-mono text-xs font-semibold" id="header-direct-nav">
            <button 
              onClick={() => { setActiveTab('home'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'home' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              HOME
            </button>
            <button 
              onClick={() => { setActiveTab('chat'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'chat' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              DIRECT
            </button>
            <button 
              onClick={() => { setActiveTab('contacts'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'contacts' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              CONTACTS
            </button>
            <button 
              onClick={() => { setActiveTab('stories'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'stories' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              STORIES
            </button>
            <button 
              onClick={() => { setActiveTab('calendar'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'calendar' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              CALENDAR
            </button>
            <button 
              onClick={() => { setActiveTab('gemini'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'gemini' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              ASSISTANT
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setShowNotifications(false); }} 
              className={`pb-1 transition-all ${activeTab === 'settings' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-on-surface-variant hover:text-hot-pink'}`}
            >
              SETTINGS
            </button>
          </nav>
        </div>

        {/* Notifications Alert Center Icon */}
        <div className="flex items-center gap-6" id="header-actions-box">
          <div className="relative">
            <button 
              id="notifications-dropdown-btn"
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileCard(false); }}
              className="p-2 text-on-surface-variant hover:text-neon-cyan transition-all flex items-center justify-center cursor-pointer outline-none"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            {notifications.length > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-terminal-magenta rounded-full shadow-[0_0_8px_#FF00FF] animate-pulse"></div>
            )}

            {/* Notifications Popup Dropdown Card */}
            {showNotifications && (
              <div 
                id="notification-popup"
                className="absolute top-12 right-0 w-80 bg-surface-container-lowest border border-[#2A2A3A] shadow-[0_0_30px_rgba(0,0,0,0.85)] z-[100] animate-in fade-in slide-in-from-top-4 duration-200"
              >
                <div className="p-4 border-b border-[#2A2A3A] bg-surface-container">
                  <h3 className="text-[12px] font-bold text-neon-cyan uppercase tracking-widest font-mono">SYSTEM_NOTIFICATIONS</h3>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-4 border-b border-[#2A2A3A]/60 hover:bg-surface-container transition-colors cursor-pointer"
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="flex justify-between items-start mb-1 font-mono">
                        <span className={`text-[10px] font-bold ${
                          notif.color === 'green' ? 'text-neon-green' : notif.color === 'magenta' ? 'text-hot-pink' : 'text-neon-cyan'
                        }`}>
                          {notif.sender}
                        </span>
                        <span className="text-[8px] opacity-40">{notif.time}</span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed font-mono">
                        {notif.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center bg-surface-container-lowest/80 border-t border-[#2A2A3A]/40">
                  <button 
                    onClick={() => { setNotifications([]); triggerToastAlert('Clear all notifications log'); }}
                    className="text-[9px] text-neon-cyan hover:underline uppercase font-bold tracking-widest cursor-pointer"
                  >
                     XÓA TẤT CẢ LOGS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>



      {/* Profile Overlay Card dialog */}
      {showProfileCard && (
        <div 
          id="profile-overlay-card"
          className="fixed bottom-4 left-24 w-72 bg-[#121212] border border-[#2A2A3A] shadow-[0_0_30px_rgba(0,0,0,0.85)] z-[100] animate-in fade-in slide-in-from-left-4 duration-200"
        >
          <div className="h-20 bg-neon-green/20 relative">
            <div className="absolute -bottom-8 left-4 w-20 h-20 bg-[#0A0A0F] p-1 border border-[#2A2A3A]">
              <img 
                alt="Account User avatar" 
                className="w-full h-full object-cover" 
                src={profile.avatar}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="pt-10 p-5 bg-surface-container-lowest font-mono">
            <div className="mb-4">
              <h3 id="overlay-profile-name" className="text-md font-black text-white">{profile.name}</h3>
              <div className="flex flex-col gap-0.5 mt-0.5">
                <p id="overlay-profile-id" className="text-[9px] text-neon-green font-bold tracking-tight uppercase">{profile.userId}</p>
                {profile.email && (
                  <p id="overlay-profile-email" className="text-[8px] text-neon-cyan/85 font-bold tracking-normal lowercase truncate">{profile.email}</p>
                )}
              </div>
              <p id="overlay-profile-bio" className="text-[10px] text-on-surface-variant/80 leading-relaxed mt-2.5 italic">
                "{profile.bio}"
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-border-default/45">
              <button 
                id="edit-profile-short"
                onClick={() => { setActiveTab('settings'); setShowProfileCard(false); }}
                className="w-full py-1.5 border border-neon-green text-neon-green text-[9px] font-bold hover:bg-neon-green hover:text-black transition-all uppercase tracking-wider cursor-pointer font-mono"
              >
                Cài Đặt Chi Tiết
              </button>
              <button 
                id="logout-profile-short"
                onClick={handleLogout}
                className="w-full py-1.5 border border-hot-pink text-hot-pink text-[9px] font-bold hover:bg-hot-pink hover:text-black transition-all uppercase tracking-wider cursor-pointer font-mono"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_8px_#00FF88]"></div>
          </div>
        </div>
      )}

      {/* Main Content Render Layout Router */}
      <main id="router-content-viewport" className="ml-16 md:ml-20 mt-16 p-6 min-h-[calc(100vh-64px)] relative block">
        {activeTab === 'home' && (
          <HomeView 
            stories={stories}
            threads={threads}
            notifications={notifications}
            profile={profile}
            onSelectThread={handleSelectThread}
            onAddStory={handleAddStory}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectStory={(storyId) => setSelectedStoryId(storyId)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView 
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={(id) => setActiveThreadId(id)}
            onSendMessage={handleSendMessage}
            userName={profile.name}
            userAvatar={profile.avatar}
            onLeaveThread={handleLeaveThread}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesView 
            stories={stories}
            onAddStory={(newStory) => setStories(prev => [newStory, ...prev])}
            profile={profile}
            selectedStoryId={selectedStoryId}
            setSelectedStoryId={setSelectedStoryId}
            onSendMessage={handleSendMessage}
            threads={threads}
            onReactStory={handleReactStory}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsView 
            contacts={contacts}
            friendRequests={friendRequests}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onAddContact={handleAddContact}
            onStartChat={handleStartChatFromContact}
            groupThreads={threads.filter(t => t.type === 'group')}
            onCreateGroupChat={handleCreateGroupChat}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            profile={profile}
            onUpdateProfile={(newProfile) => setProfile(newProfile)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTodoView 
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {activeTab === 'gemini' && (
          <GeminiChatView />
        )}
      </main>
    </div>
  );
}

// Global short alert simulation helper for system
function triggerToastAlert(msg: string) {
  console.log(`[SYS ALERT] ${msg}`);
}
