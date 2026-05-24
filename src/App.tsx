import React, { useState } from 'react';
import { 
  INITIAL_PROFILE, 
  INITIAL_STORIES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHATS, 
  INITIAL_FRIEND_REQUESTS, 
  INITIAL_CONTACTS 
} from './initialData';
import { ChatThread, Story, Notification, UserProfile, Message } from './types';

// Importing views
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import ContactsView from './components/ContactsView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // App States
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHATS);
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  
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

  const handleSendMessage = (threadId: string, text: string, isIncoming = false) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: isIncoming ? threads.find(t => t.id === threadId)?.name || 'Operator' : profile.name,
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMine: !isIncoming,
      isRead: true
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updatedMessages = [...t.messages, newMessage];
        return {
          ...t,
          messages: updatedMessages,
          lastMessage: text,
          unreadCount: isIncoming ? t.unreadCount + 1 : 0
        };
      }
      return t;
    }));
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
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randomSeed}`
    };

    setStories(prev => [newStory, ...prev]);
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
            className="text-on-surface-variant/75 flex flex-col items-center py-4 hover:text-hot-pink transition-all cursor-pointer outline-none"
          >
            <span className="material-symbols-outlined text-2xl font-semibold">account_circle</span>
            <span className="text-[8px] mt-1 uppercase font-bold">Profile</span>
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

      {/* Floating Action Button (FAB) only visible on non-chat screen */}
      {activeTab !== 'chat' && (
        <button 
          id="global-fab-btn"
          onClick={() => { setActiveTab('chat'); }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-neon-green text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.5)] hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
        >
          <span className="material-symbols-outlined font-bold text-3xl">add_comment</span>
        </button>
      )}

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
              <p id="overlay-profile-id" className="text-[9px] text-neon-green font-bold tracking-tight uppercase mt-0.5">{profile.userId}</p>
              <p id="overlay-profile-bio" className="text-[10px] text-on-surface-variant/80 leading-relaxed mt-2 italic">
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
                onClick={() => { setShowProfileCard(false); alert("Session terminated successfully."); }}
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
          />
        )}

        {activeTab === 'chat' && (
          <ChatView 
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={(id) => setActiveThreadId(id)}
            onSendMessage={handleSendMessage}
            userName={profile.name}
            onLeaveThread={handleLeaveThread}
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
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            profile={profile}
            onUpdateProfile={(newProfile) => setProfile(newProfile)}
          />
        )}
      </main>
    </div>
  );
}

// Global short alert simulation helper for system
function triggerToastAlert(msg: string) {
  console.log(`[SYS ALERT] ${msg}`);
}
