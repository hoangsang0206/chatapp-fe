import React, { useState, useEffect } from 'react';
import { ChatThread, Story, Notification, UserProfile } from '../types';

interface HomeViewProps {
  stories: Story[];
  threads: ChatThread[];
  notifications: Notification[];
  profile: UserProfile;
  onSelectThread: (threadId: string) => void;
  onAddStory: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function HomeView({
  stories,
  threads,
  notifications,
  profile,
  onSelectThread,
  onAddStory,
  onNavigateTab
}: HomeViewProps) {
  const [logTime, setLogTime] = useState<string>('12_NEW_UPDATES');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      setLogTime(`${timestamp} // UPDATING_NODES...`);
      setTimeout(() => {
        setLogTime('12_NEW_UPDATES');
      }, 1200);
    }, 8500);

    return () => clearInterval(timer);
  }, []);

  const groupThreads = threads.filter((t) => t.type === 'group');
  const directThreads = threads.filter((t) => t.type === 'direct').slice(0, 5);

  return (
    <div id="home-view-container" className="space-y-8 animate-fade-in pb-12">
      {/* Stories Section */}
      <section id="stories-section" className="bg-surface-card/30 border border-border-default/40 p-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[12px] font-bold text-neon-green tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-green animate-pulse"></span>STORIES
          </h2>
          <span className="text-[10px] text-on-surface-variant opacity-60 font-mono transition-all duration-300">
            SYS_LOG: {logTime}
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {/* User Add Story */}
          <div 
            id="add-story-btn"
            onClick={onAddStory}
            className="flex-shrink-0 group cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 border-2 border-dashed border-border-default flex items-center justify-center group-hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,212,255,0.4)] transition-all">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-neon-cyan text-2xl transition-colors">add</span>
            </div>
            <p className="text-[9px] text-center mt-2 opacity-70 font-bold uppercase tracking-wider">CỦA TÔI</p>
          </div>

          {/* Dynamic Stories */}
          {stories.map((story) => (
            <div key={story.id} id={`story-${story.id}`} className="flex-shrink-0 group cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 p-0.5 border-2 border-neon-green group-hover:border-neon-cyan group-hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] transition-all duration-300">
                <img 
                  src={story.avatarUrl} 
                  alt={story.sender}
                  className="w-full h-full object-cover bg-surface-container"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] text-center mt-2 font-bold group-hover:text-[#00FF88] transition-colors uppercase tracking-wider">
                {story.sender}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div id="bento-layout" className="grid grid-cols-12 gap-6">
        {/* Column 1: Groups List */}
        <div id="bento-col-groups" className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-card border border-border-default p-5 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 w-12 h-12 bg-neon-green/5 -rotate-45 translate-x-6 -translate-y-6"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-bold text-neon-cyan uppercase tracking-widest">Kênh Trò Chuyện</h3>
              <span className="material-symbols-outlined text-lg opacity-40">hub</span>
            </div>

            <div className="flex flex-col gap-3">
              {groupThreads.map((group) => (
                <div 
                  key={group.id} 
                  id={`group-row-${group.id}`}
                  onClick={() => onSelectThread(group.id)}
                  className="p-3 bg-surface-container border border-border-default hover:border-neon-green hover:shadow-[0_0_12px_rgba(0,255,136,0.2)] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{group.name}</span>
                    <span className="text-[9px] opacity-50 font-mono">
                      {group.id === 'g1' ? '24 MSGS' : group.id === 'g2' ? 'SECURE_CH' : 'ACTIVE'}
                    </span>
                  </div>
                  {group.id === 'g2' ? (
                    <div className="h-1 bg-border-default w-full mt-2">
                      <div className="h-full bg-neon-cyan w-3/4 animate-pulse"></div>
                    </div>
                  ) : (
                    <p className="text-[10px] opacity-60 truncate mt-1">
                      {group.messages[group.messages.length - 1]?.text || 'No messages yet'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button 
              id="create-group-btn"
              onClick={() => onNavigateTab('chat')}
              className="w-full mt-6 py-2 border border-neon-green text-neon-green text-[10px] font-bold hover:bg-neon-green hover:text-black transition-all hover:shadow-[0_0_10px_rgba(0,255,136,0.5)] uppercase tracking-widest"
            >
              MỞ KÊNH CHAT CHÍNH
            </button>
          </div>
        </div>

        {/* Column 2: Recent Direct Contacts & Messages */}
        <div id="bento-col-recent" className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Recent Direct Contacts */}
          <div className="bg-surface-card border border-border-default p-5 creative-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-bold text-on-surface uppercase tracking-widest">LIÊN HỆ GẦN ĐÂY</h3>
              <div className="flex gap-2">
                <span className="w-1.5 h-4 bg-terminal-magenta"></span>
                <span className="w-1.5 h-4 bg-neon-cyan"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {directThreads.slice(0, 4).map((thread) => (
                <div 
                  key={thread.id} 
                  id={`recent-card-${thread.id}`}
                  onClick={() => onSelectThread(thread.id)}
                  className="relative group p-3 border border-border-default bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 border border-neon-green overflow-hidden flex-shrink-0">
                      <img 
                        src={thread.avatar} 
                        alt={thread.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-bold truncate text-white">{thread.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${thread.status === 'online' ? 'bg-neon-green' : thread.status === 'busy' ? 'bg-neon-cyan' : 'bg-hot-pink'} animate-pulse`}></span>
                        <span className="text-[9px] opacity-65 uppercase font-mono">{thread.status || 'offline'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex justify-between items-center text-[8px] opacity-50">
                    <span className="font-mono">NODE_SPEC: {thread.nodeValue || '0x??'}</span>
                    <span className="material-symbols-outlined text-[12px]">chat</span>
                  </div>
                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neon-green group-hover:w-3 group-hover:h-3 transition-all"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages List */}
          <div className="bg-surface-card border border-border-default p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-bold text-neon-green uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-green"></span>TIN NHẮN MỚI NHẤT
              </h3>
              <span className="text-[10px] opacity-50 font-mono">QUEUE: 004</span>
            </div>

            <div className="flex flex-col gap-3">
              {threads.slice(0, 3).map((thread) => {
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <div 
                    key={`msg-row-${thread.id}`}
                    id={`msg-row-${thread.id}`}
                    onClick={() => onSelectThread(thread.id)}
                    className="flex items-center gap-3 group cursor-pointer hover:bg-surface-container/50 p-2 transition-colors border-b border-border-default/40 last:border-b-0 pb-3"
                  >
                    <div className="w-10 h-10 border border-neon-cyan p-0.5 overflow-hidden flex-shrink-0">
                      <img 
                        src={thread.avatar} 
                        alt={thread.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold text-neon-cyan uppercase tracking-wider">{thread.name}</span>
                        <span className="text-[9px] opacity-50 font-mono">{lastMsg?.timestamp || '12:00'}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate opacity-80">
                        {lastMsg ? lastMsg.text : 'Bắt đầu kênh chat bí mật.'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-1">
                      {thread.unreadCount > 0 ? (
                        <>
                          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_5px_#00FF88]"></span>
                          <span className="text-[7px] text-neon-green font-bold uppercase tracking-tighter">NEW</span>
                        </>
                      ) : (
                        <span className="material-symbols-outlined text-[13px] text-neon-cyan transition-all">done_all</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border-default/50 text-center">
              <button 
                id="view-all-chats"
                onClick={() => onNavigateTab('chat')}
                className="text-[10px] text-neon-cyan hover:text-white hover:underline uppercase font-bold tracking-widest cursor-pointer"
              >
                XEM TẤT CẢ CUỘC TRÒ CHUYỆN
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Friends Online & Logs */}
        <div id="bento-col-friends" className="col-span-12 lg:col-span-3 h-full">
          <div className="bg-surface-container-lowest border border-border-default p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] font-bold text-neon-green uppercase tracking-widest">ĐANG HOẠT ĐỘNG</h3>
                <span className="text-[10px] px-2 py-0.5 bg-neon-green/10 text-neon-green border border-neon-green/20 font-bold font-mono">12</span>
              </div>

              <div id="active-list" className="flex flex-col gap-5">
                {threads.filter(t => t.type === 'direct').slice(0, 5).map((friend) => (
                  <div 
                    key={`active-user-${friend.id}`}
                    id={`active-user-${friend.id}`}
                    onClick={() => onSelectThread(friend.id)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-surface-card border border-border-default p-0.5 group-hover:border-neon-cyan transition-colors overflow-hidden">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green border-2 border-[#0A0A0F] rounded-none"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold group-hover:text-neon-cyan transition-colors truncate uppercase">
                        @{friend.name}
                      </div>
                      <div className="text-[8px] opacity-60 font-mono tracking-tighter">NODE_ID: {friend.nodeValue || '0x1C2F3E'}</div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant opacity-30 group-hover:opacity-100 group-hover:text-neon-green transition-all transform group-hover:translate-x-0.5">
                      send
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div id="system-stats-section" className="mt-8 pt-4 border-t border-border-default/40 font-mono space-y-1.5 opacity-60">
              <div className="flex justify-between text-[8px]">
                <span>UPTIME:</span>
                <span className="text-neon-green">99.982%</span>
              </div>
              <div className="flex justify-between text-[8px]">
                <span>LATENCY:</span>
                <span className="text-neon-cyan">12 ms</span>
              </div>
              <div className="flex justify-between text-[8px]">
                <span>MẬT MÃ:</span>
                <span className="text-terminal-magenta">AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
