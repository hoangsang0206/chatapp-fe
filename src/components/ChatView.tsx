import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, Message } from '../types';

interface ChatViewProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string, isIncoming?: boolean) => void;
  userName: string;
  onLeaveThread?: (threadId: string) => void;
}

export default function ChatView({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  userName,
  onLeaveThread
}: ChatViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<string>('TIMESTAMP: 2077.08.12 // 04:32:01');
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // States required by the user
  const [isMuted, setIsMuted] = useState<{ [threadId: string]: boolean }>({});
  const [soundProfile, setSoundProfile] = useState<{ [threadId: string]: 'loud' | 'soft' | 'off' }>({});
  const [isConfirmingLeave, setIsConfirmingLeave] = useState<boolean>(false);
  const [showAddMemberDropdown, setShowAddMemberDropdown] = useState<boolean>(false);

  // Hardcoded initial list of files/images sent, that can be added to
  const [customFileState, setCustomFileState] = useState<{ [threadId: string]: Array<{ id: string; name: string; type: 'image' | 'file'; url?: string; size: string; date: string }> }>({
    t1: [
      { id: 'f1', name: 'arasaka_mainframe_blueprint.png', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF6FSeNtVpByLVGV-8MkWt4GAjctSl2pkTRKRmygfhsk8ztLK_lRnE9bGT2gnW82R9elOri9_yn3-QZ_Si4yTfTO2M8uX7FKYYX7UHrpp5NvfeNQyRZcL_qh8yAXVCvn9_OIVh1EQUQXCYIPrqKF6DMzkEaUcsV4xsAZwaWJKqOgyDN7NqPKktq7aIrSLyIujG_-MGbcwdjCHdo36Ej1XpHPQUfJisF9xNV-_R3ezAJbih5i3q88D2GiDuPZYsDwKK4B4Ym-axO20', size: '1.4 MB', date: '24/05/2026' },
      { id: 'f2', name: 'decryption_keys_aes256.pem', type: 'file', size: '24 KB', date: '24/05/2026' },
      { id: 'f3', name: 'proxy_config_delta.json', type: 'file', size: '4.8 KB', date: '23/05/2026' }
    ],
    t2: [
      { id: 'f4', name: 'node4_vulnerability_scan.log', type: 'file', size: '112 KB', date: '24/05/2026' },
      { id: 'f5', name: 'submask_routing_map.jpg', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_j7BVdsDqKKDCPFVZ2Gn9UPrHK0YE5hnWALyfRcGSqLzWsd7J4NcahoDs56OIghwrjOiTLiI1XRMCR7Zgvp07wz2plsiuq_nnkEO_Ojy6LUXJ6jJMeRSgPvFY0KDs0g1UgcBoLLdyKK1zhS4hu-LB-LyQz-Zj4CNQDHIUwbt57mbIAubHWxM_4lnKaQOZNB457Up7ZVE3y1PfhVXTE5_zzKKTKN3oGNHDEnW9xvInnGESXuUrDdsEj76KoHidaLBIJidFvtPggLfR', size: '480 KB', date: '24/05/2026' }
    ],
    g1: [
      { id: 'f6', name: 'police_patrol_radar.png', type: 'image', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=g1', size: '320 KB', date: '23/05/2026' },
      { id: 'f7', name: 'sector7_evacuation_routes.pdf', type: 'file', size: '2.1 MB', date: '22/05/2026' }
    ],
    g2: [
      { id: 'f8', name: 'encryption_channels_init.conf', type: 'file', size: '12 KB', date: '21/05/2026' }
    ],
    g3: [
      { id: 'f9', name: 'trade_orders_prices.csv', type: 'file', size: '84 KB', date: '24/05/2026' }
    ]
  });

  // Hardcoded initial list of members in groups, that the admin (Bùi Hữu Vũ) can manage
  const [groupMembersState, setGroupMembersState] = useState<{ [threadId: string]: Array<{ id: string; name: string; avatar: string; role: 'admin' | 'member'; status: string }> }>({
    g1: [
      { id: 'm1', name: 'Bùi Hữu Vũ', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM', role: 'admin', status: 'Online' },
      { id: 'm2', name: 'ZeroCool', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8oYsHlEJVlNd0JPmkanne2ENjxWNHqeF8XRBEorrUbqG2rzZzFxClg772yjh0I2H2psJ_E3N2YzDZrteMEbzw0CqvZPqhRmA7kDysUhzzRQujYPdDSEkwW6dME4db4TafGuDlB4U262UdYVsnoApRayASPbhzUzYmyuaJRZtIWejghwYOz1x_Af9tT8wYAvAEIrlrUYWf1neUyTNTPXoi7_eUx5GXCjyOzjJ6DPouqV0CP5Gn42NHyk-XU1ekMlZGoh-vzQo_1E', role: 'member', status: 'Online' },
      { id: 'm3', name: 'Acid Burn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSta69hUqiI_HfA1YHvnkyRjlKzhgjuGpJYfNV4BY6xUMnQ6XtTguV_E-cqlrtAXqRk0NbQfX1bnT0sYTITLzpd3zbfKkihMW79jEmgtgFi3xy1HqxhKNoqjJod810LFOMs_ZD-FXbUJSluwzKy-y92vxGaoqICUKXiZ62m_sKS8lrHkdG7l_ajZdu5youfJx2pA_I1PBeksEj0tQNxoTYxDcq1vs110wCkOaTwoAQDOU6ma_hxblFL0vj3yABSuILetyAVsHUJNw', role: 'member', status: 'Offline' },
      { id: 'm4', name: 'Crash Override', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIGcMjlJVWJfzhNFiNG33lewd8C01uV8UCq1kKf9RVD46_ojbbTwzY0_Uv9Mj9EyjaZnqsAvz-i4JDwK3fTaeeqMj9pt7nJUrVw2ugpXdQyzFKpROuzKIXrjzlEZVGs1nd4rZxNx8vmW-Ht7Mx67TYD_aO3zH6FeJU0I9soC47Bua7VmyWJee_eZfa4niQ0ynh1yyAEA_AbIv-8Nq82oTbDwbpSGGyqJpLGqdM9XkkRSzVm-YFl0-pWQewo6k8DExXPZG5C3BrHzo', role: 'member', status: 'Online' },
    ],
    g2: [
      { id: 'm1_g2', name: 'Bùi Hữu Vũ', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM', role: 'admin', status: 'Online' },
      { id: 'm2_g2', name: 'CipherMaster', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CipherMaster', role: 'member', status: 'Online' },
    ],
    g3: [
      { id: 'm1_g3', name: 'Bùi Hữu Vũ', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM', role: 'admin', status: 'Online' },
      { id: 'm2_g3', name: 'Lord Nikon', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhxh_JALFVHGhYwXr_nlv1d0FXT8EWqab8vdk4I1CowuvBEU0iStoebQLaRyr0LblXjlkbolX1VJ3l7O0z72cy2CT0JQ8wMYXs8mekJ0DVyAwavbPkXqeAQuqdjH7am_I7Vkeuli2LVCV3IpcG6kQ6Evoo18bD8890yDafHIE475zUUmdXZYDq3tmDwLmUxuDTC4wxXZEwWQf7ZEXTlIGLcFLjJIIjoLomHzmT8Cmgbw2riPH947CqVylveMpwzuviId9H2aLOQz8', role: 'member', status: 'Online' },
    ]
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isTyping]);

  useEffect(() => {
    // Hide panel automatically when switching chats to prevent viewing mismatched info
    setShowInfoPanel(false);
  }, [activeThreadId]);

  useEffect(() => {
    // Dynamic system clock simulator
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `TIMESTAMP: 2077.08.12 // ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setTimestamp(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePingTest = () => {
    setPingStatus('PINGING...');
    setTimeout(() => {
      const randomPing = Math.floor(Math.random() * 15) + 5;
      setPingStatus(`STABLE // ${randomPing}ms`);
    }, 1000);
  };

  // Handle auto-replies for cyberpunk immersion
  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText('');
    
    // Call parent handler
    onSendMessage(activeThread.id, textToSend);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Trigger typing action and mock reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
         "Bản tin đã được định vị. Hệ thống quét IP của Arasaka đang phản hồi. Hãy giữ kết nối kín.",
         "Dữ liệu mạng lưới đã tải về một nửa. Cậu có quét qua lớp thứ ba chưa? ICY bảo mật rất dày.",
         "Xác nhận tín hiệu. Tôi đang định dạng cầu chuyển tiếp Proxy. Gửi lệnh kế tiếp đi.",
         "Hệ thống định vị mục tiêu. Tín hiệu đầu ra sạch 100%. Sẵn sàng kích hoạt lệnh giải mã.",
         "Cảnh báo! Có xung đột dữ liệu nhẹ ở phân khu 7. Hãy bật tản nhiệt cổng kết nối."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        sender: activeThread.name,
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMine: false
      };
      
      // We can insert this message directly through our callback
      onSendMessage(activeThread.id, randomResponse, true); // True flag indicates incoming reply
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const activeFiles = customFileState[activeThread.id] || [];
  const activeMembers = groupMembersState[activeThread.id] || (
    activeThread.type === 'group'
      ? [
          { id: 'm-admin', name: userName || 'Bùi Hữu Vũ', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM', role: 'admin' as const, status: 'Online' },
          ...(activeThread.initialMembers || []).map((name, idx) => ({
            id: `m-init-${idx}-${name}`,
            name: name,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name.replace(/\s+/g, '_'))}`,
            role: 'member' as const,
            status: 'Online'
          }))
        ]
      : []
  );
  const allContacts = ['ZERO_COOL', 'VOID_WALKER', 'CRASH_OVERRIDE', 'ACID_BURN', 'LORD_NIKON', 'X-STATIC'];
  const availableToAdd = allContacts.filter(contact => !activeMembers.some(m => m.name.toUpperCase() === contact.toUpperCase()));

  const handleAddMockFile = () => {
    const extension = Math.random() > 0.5 ? 'png' : 'zip';
    const newFile = {
      id: `mock-f-${Date.now()}`,
      name: extension === 'png' ? `scanned_node_record_${Math.floor(Math.random() * 900 + 100)}.png` : `core_system_dump_${Math.floor(Math.random() * 900 + 100)}.zip`,
      type: (extension === 'png' ? 'image' : 'file') as 'image' | 'file',
      url: extension === 'png' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF6FSeNtVpByLVGV-8MkWt4GAjctSl2pkTRKRmygfhsk8ztLK_lRnE9bGT2gnW82R9elOri9_yn3-QZ_Si4yTfTO2M8uX7FKYYX7UHrpp5NvfeNQyRZcL_qh8yAXVCvn9_OIVh1EQUQXCYIPrqKF6DMzkEaUcsV4xsAZwaWJKqOgyDN7NqPKktq7aIrSLyIujG_-MGbcwdjCHdo36Ej1XpHPQUfJisF9xNV-_R3ezAJbih5i3q88D2GiDuPZYsDwKK4B4Ym-axO20' : undefined,
      size: `${(Math.random() * 3 + 0.1).toFixed(1)} MB`,
      date: 'Hôm nay'
    };
    
    setCustomFileState(prev => {
      const threadFiles = prev[activeThread.id] || [];
      return {
        ...prev,
        [activeThread.id]: [newFile, ...threadFiles]
      };
    });
  };

  const handleKickMember = (threadId: string, memberId: string) => {
    setGroupMembersState(prev => {
      const threadMembers = prev[threadId] || [];
      const updated = threadMembers.filter(m => m.id !== memberId);
      return {
        ...prev,
        [threadId]: updated
      };
    });
  };

  const handleAddMember = (threadId: string, name: string) => {
    const isExist = (groupMembersState[threadId] || []).some(m => m.name.toLowerCase() === name.toLowerCase());
    if (isExist) return;

    const newMemberObj = {
      id: `mem-${Date.now()}`,
      name,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name.replace(/\s+/g, '_')}`,
      role: 'member' as 'admin' | 'member',
      status: 'Online'
    };

    setGroupMembersState(prev => {
      const list = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: [...list, newMemberObj]
      };
    });
    setShowAddMemberDropdown(false);
  };

  const handleConfirmExit = () => {
    setIsConfirmingLeave(true);
  };

  const handleCancelExit = () => {
    setIsConfirmingLeave(false);
  };

  const handleExecuteExit = () => {
    if (onLeaveThread) {
      onLeaveThread(activeThread.id);
    }
    setIsConfirmingLeave(false);
    setShowInfoPanel(false);
  };

  return (
    <div id="chat-view-container" className="flex h-[calc(100vh-140px)] border border-border-default bg-surface-dim overflow-hidden animate-fade-in">
      {/* List Sidebar of Direct & Group chats */}
      <section id="chat-sidebar" className="w-64 md:w-72 border-r border-border-default flex flex-col bg-surface-container-lowest/80">
        <div className="p-4 border-b border-border-default flex items-center justify-between bg-surface-container-low/60">
          <span className="font-mono text-[9px] text-neon-cyan tracking-widest uppercase font-bold truncate">
            {timestamp}
          </span>
          <span className="material-symbols-outlined text-neon-green text-[16px] animate-pulse">wifi_tethering</span>
        </div>

        <div id="sidebar-threads-list" className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.map((thread) => {
            const isActive = thread.id === activeThreadId;
            const lastMsg = thread.messages[thread.messages.length - 1];
            
            return (
              <div 
                key={thread.id} 
                id={`sidebar-row-${thread.id}`}
                onClick={() => onSelectThread(thread.id)}
                className={`p-4 border-b border-border-default/30 hover:bg-surface-container-high/60 transition-all cursor-pointer group relative ${
                  isActive 
                    ? 'bg-surface-container-high border-l-2 border-neon-cyan shadow-[inset_4px_0_0_rgba(0,212,255,0.2)]' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 border border-border-default">
                    <img 
                      src={thread.avatar} 
                      alt={thread.name} 
                      className={`w-full h-full object-cover grayscale transition-all ${
                        isActive ? 'grayscale-0 scale-105' : 'group-hover:grayscale-0'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {thread.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-neon-green shadow-[0_0_5px_#00FF88]"></div>
                    )}
                    {thread.status === 'busy' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-neon-cyan shadow-[0_0_5px_#00D4FF]"></div>
                    )}
                    {thread.status === 'away' && (
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-hot-pink shadow-[0_0_5px_#FF79C6]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`font-mono text-[11px] font-bold truncate uppercase ${
                        isActive ? 'text-neon-cyan' : 'text-[#E0E0E0]'
                      }`}>
                        {thread.name}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/75 font-mono">
                        {lastMsg ? lastMsg.timestamp : '00:00'}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate opacity-70">
                      {lastMsg ? lastMsg.text : 'Kênh liên lạc bảo mật.'}
                    </p>
                  </div>
                </div>
                {thread.unreadCount > 0 && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-neon-green/90 text-black font-extrabold text-[8px] uppercase tracking-tighter">
                     NEW
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Conversation Window */}
      <section id="conversation-window" className="flex-1 flex flex-col bg-background relative">
        {/* Active Header bar of conversation */}
        <header className="flex items-center justify-between px-6 h-16 border-b border-border-default bg-surface-dim/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-neon-cyan overflow-hidden">
              <img 
                src={activeThread?.avatar} 
                alt={activeThread?.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-mono text-xs font-black text-terminal-magenta uppercase tracking-tight">
                {activeThread?.name} {activeThread?.type === 'group' ? '[[NETWORK_GROUP]]' : '// OPERATOR'}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                <span className="text-[9px] text-neon-green font-mono uppercase tracking-wider">
                  {activeThread?.type === 'group' ? 'GROUP_PORTABLE_PEERS_SECURE' : 'ENCRYPTED_LINE_ACTIVE'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-on-surface-variant">
            <button className="material-symbols-outlined p-1.5 text-sm hover:text-neon-cyan cursor-pointer transition-colors">videocam</button>
            <button className="material-symbols-outlined p-1.5 text-sm hover:text-neon-cyan cursor-pointer transition-colors">call</button>
            <button 
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={`material-symbols-outlined p-1.5 text-sm cursor-pointer transition-colors ${
                showInfoPanel ? 'text-neon-cyan shadow-[0_0_8px_rgba(0,212,255,0.4)]' : 'hover:text-neon-cyan text-on-surface-variant'
              }`}
              title="Thông tin cuộc trò chuyện"
            >
              more_vert
            </button>
          </div>
        </header>

        {/* Message Scroller */}
        <div id="messages-scroller" className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
          <div className="flex items-center gap-3 justify-center py-2">
            <div className="h-px flex-1 bg-border-default/60"></div>
            <span className="text-[9px] font-mono text-on-surface-variant/60 tracking-widest uppercase">
               MÃ HÓA ĐẦU CUỐI : TRẠNG THÁI KHỎE MẠNH
            </span>
            <div className="h-px flex-1 bg-border-default/60"></div>
          </div>

          {activeThread?.messages.map((msg) => (
            <div 
              key={msg.id} 
              id={`msg-${msg.id}`}
              className={`flex items-start gap-3 max-w-2xl ${msg.isMine ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Sender Avatar */}
              <div className={`w-8 h-8 border flex-shrink-0 mt-1 overflow-hidden ${
                msg.isMine ? 'border-neon-cyan' : 'border-neon-magenta'
              }`}>
                <img 
                  src={msg.isMine ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM' : activeThread.avatar} 
                  alt={msg.sender} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Balloon */}
              <div className={msg.isMine ? 'text-right' : 'text-left'}>
                <div className={`p-4 font-mono text-xs leading-relaxed border whitespace-pre-wrap ${
                  msg.isMine 
                    ? 'bg-surface-container-high/80 border-neon-cyan/40 text-[#E0E0E0] rounded-none' 
                    : 'bg-surface-container-low border-neon-magenta/40 text-[#E0E0E0] rounded-none'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[9px] mt-1.5 block font-mono ${
                  msg.isMine ? 'text-neon-cyan' : 'text-terminal-magenta'
                }`}>
                  {msg.isMine ? 'BẠN' : msg.sender.toUpperCase()} @ {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Autoreply Typing block */}
          {isTyping && (
            <div id="typing-indicator" className="flex items-start gap-3 max-w-2xl">
              <div className="w-8 h-8 border border-neon-magenta flex-shrink-0 mt-1 overflow-hidden">
                <img 
                  src={activeThread.avatar} 
                  alt="Operator avatar typing" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-1.5 p-3 bg-surface-container-low border border-neon-magenta/20 px-5">
                <div className="w-1.5 h-1.5 bg-terminal-magenta animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-terminal-magenta animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-terminal-magenta animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Message Input bottom drawer */}
        <footer id="chat-input-bar" className="p-4 md:p-5 bg-surface-dim border-t border-border-default">
          <div className="flex items-center gap-4 border border-neon-green/60 p-1.5 bg-surface-container-lowest focus-within:border-neon-green transition-all">
            <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-neon-green cursor-pointer transition-colors">
              add_circle
            </button>
            <textarea 
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none focus:outline-none text-neon-green placeholder-neon-green/30 font-mono text-xs resize-none py-2 outline-none border-0"
              placeholder="NHẬP TIN NHẮN HOẶC MÃ LỆNH TẠI ĐÂY..."
            />
            <div className="flex items-center gap-2 px-2 flex-shrink-0">
              <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-neon-green cursor-pointer transition-colors">
                sentiment_satisfied
              </button>
              <button 
                id="send-msg-btn"
                onClick={handleSend}
                className="px-5 py-2 bg-neon-green/10 border border-neon-green text-neon-green font-mono text-[10px] font-bold hover:bg-neon-green hover:text-black hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all flex items-center gap-1.5 group cursor-pointer"
              >
                GỬI<span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">send</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2.5 px-1 text-[9px] text-on-surface-variant/50 font-mono tracking-tight">
            <span>MÃ HÓA: GIAO THỨC AES-256-GCM // TRẠNG THÁI: BẢO MẬT TUYỆT ĐỐI</span>
            <span className="text-right">DỮ LIỆU ĐÃ GỬI: {threads.reduce((acc, t) => acc + t.messages.length, 0) * 1.4} KB // HAO HỤT GÓI: 0.00%</span>
          </div>
        </footer>
      </section>

      {/* Info Metadata panel */}
      {showInfoPanel && (
        <aside id="chat-info-panel" className="w-72 md:w-80 border-l border-border-default bg-surface-container-lowest/95 flex flex-col p-5 font-mono text-xs overflow-y-auto custom-scrollbar animate-fade-in relative z-20">
          <div className="flex items-center justify-between border-b border-border-default pb-3.5 mb-4">
            <h3 className="text-neon-cyan font-bold uppercase tracking-wider text-[11px]">THÔNG TIN CUỘC TRÒ CHUYỆN</h3>
            <button 
              onClick={() => setShowInfoPanel(false)}
              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-hot-pink cursor-pointer transition-colors"
              title="Đóng bảng tin"
            >
              close
            </button>
          </div>

          {/* 1 & 2: Ảnh đại diện & Tên chat */}
          <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-border-default/50">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-neon-cyan p-0.5 overflow-hidden">
                <img 
                  src={activeThread.avatar} 
                  alt={activeThread.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-surface-container-lowest rounded-none ${
                activeThread.status === 'online' ? 'bg-neon-green shadow-[0_0_5px_#00FF88]' : activeThread.status === 'busy' ? 'bg-neon-cyan shadow-[0_0_5px_#00D4FF]' : 'bg-hot-pink shadow-[0_0_5px_#FF79C6]'
              }`}></div>
            </div>

            <div>
              <h4 className="text-white font-extrabold text-[12px] uppercase tracking-wider">{activeThread.name}</h4>
              <p className="text-[9px] text-neon-green font-semibold uppercase tracking-tight mt-0.5">
                {activeThread.type === 'group' ? 'KÊNH NHÓM ĐA ĐIỂM' : `TRUYỀN DẪN TRỰC TIẾP`}
              </p>
            </div>
          </div>

          {/* 3: Danh sách file/ảnh đã gửi */}
          <div className="py-4 border-b border-border-default/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">folder_open</span> DỮ LIỆU ĐÃ GỬI ({activeFiles.length})
              </h5>
              
              <button 
                onClick={handleAddMockFile}
                className="text-[8px] text-neon-cyan hover:text-white transition-colors flex items-center gap-0.5 uppercase font-bold border border-neon-cyan/20 px-1.5 py-0.5 bg-neon-cyan/5 hover:bg-neon-cyan/15"
                title="Gửi file giả lập vào hội thoại"
              >
                + GỬI FILE
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {activeFiles.length === 0 ? (
                <div className="text-[9px] text-on-surface-variant/40 italic py-3 text-center border border-dashed border-border-default/30">
                  Không tìm thấy tài liệu hay hình ảnh đã gửi
                </div>
              ) : (
                activeFiles.map(file => (
                  <div key={file.id} className="flex items-center gap-2 p-1.5 bg-black/25 hover:bg-black/40 border border-border-default/40 rounded transition-colors group">
                    {file.type === 'image' ? (
                      <div className="w-8 h-8 flex-shrink-0 border border-neon-magenta/30 overflow-hidden bg-black/40">
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-115 transition-transform" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0 border border-neon-cyan/30 flex items-center justify-center bg-neon-cyan/5 text-neon-cyan">
                        <span className="material-symbols-outlined text-sm">draft</span>
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-grow text-left">
                      <p className="text-[10px] text-white font-semibold truncate uppercase" title={file.name}>{file.name}</p>
                      <p className="text-[8px] text-on-surface-variant/60 font-mono">{file.size} • {file.date}</p>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        alert(`Đang giải nén tập tin bảo mật: ${file.name}`);
                      }}
                      className="material-symbols-outlined text-xs p-1 text-neon-cyan hover:text-white transition-all cursor-pointer border border-border-default bg-transparent hover:bg-neon-cyan/10"
                      title="Giải mã / Tải xuống"
                    >
                      download
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4 & 7: Danh sách user (đối với group chat) & Quản lý thành viên (cho admin) */}
          {activeThread.type === 'group' && (
            <div className="py-4 border-b border-border-default/50 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">group</span> DANH SÁCH USER ({activeMembers.length})
                </h5>
                
                {/* Admin user register command */}
                <div className="relative">
                  <button 
                    onClick={() => setShowAddMemberDropdown(!showAddMemberDropdown)}
                    className="text-[8px] text-neon-green hover:text-white transition-colors flex items-center gap-0.5 uppercase font-bold border border-neon-green/20 px-1.5 py-0.5 bg-neon-green/5 hover:bg-neon-green/15"
                    title="Mời đồng sự gia nhập kênh truyền"
                  >
                    + THÊM USER
                  </button>

                  {showAddMemberDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#0A0A0F] border border-border-default p-1 shadow-[0_4px_15px_rgba(0,0,0,0.85)] z-50 animate-fade-in font-mono">
                      <div className="text-[8px] text-on-surface-variant uppercase font-bold px-2 py-1.5 border-b border-border-default/30">Mời kết nối</div>
                      <div className="max-h-32 overflow-y-auto custom-scrollbar">
                        {availableToAdd.length === 0 ? (
                          <div className="text-[8px] text-on-surface-variant/50 p-2 italic text-center">Tất cả liên hệ đã ở trong kênh</div>
                        ) : (
                          availableToAdd.map(contactName => (
                            <button
                              type="button"
                              key={contactName}
                              onClick={() => handleAddMember(activeThread.id, contactName)}
                              className="w-full text-left text-[9px] px-2 py-1.5 hover:bg-neon-green/10 text-white hover:text-neon-green uppercase font-semibold transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span>{contactName}</span>
                              <span className="material-symbols-outlined text-[10px]">add</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Members Scroll area */}
              <div className="space-y-2.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                {activeMembers.map(member => {
                  const isSelf = member.name === 'Bùi Hữu Vũ' || member.name === userName;
                  return (
                    <div key={member.id} className="flex items-center justify-between p-1 hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-6.5 h-6.5 border border-[#2B2B3A]" referrerPolicy="no-referrer" />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-black ${
                            member.status === 'Online' ? 'bg-neon-green' : 'bg-on-surface-variant/40'
                          }`}></span>
                        </div>
                        <div className="text-left min-w-0">
                          <p className={`text-[10px] font-bold truncate uppercase ${isSelf ? 'text-neon-cyan' : 'text-white'}`}>
                            {member.name} {isSelf && '(ADMIN)'}
                          </p>
                          <p className="text-[8px] text-on-surface-variant/60 font-bold uppercase tracking-tight">
                            {member.role === 'admin' ? 'KEYHOLDER' : 'OPERATOR'}
                          </p>
                        </div>
                      </div>

                      {/* Admin kick control */}
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleKickMember(activeThread.id, member.id)}
                          className="text-[8px] text-hot-pink opacity-50 group-hover:opacity-100 hover:text-white hover:bg-hot-pink/20 px-1 py-0.5 border border-hot-pink/30 hover:border-hot-pink transition-all font-bold uppercase cursor-pointer"
                          title="Trục xuất thành viên khỏi nhóm"
                        >
                          Kích
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5: Nút out nhóm chat / Xóa đàm thoại */}
          <div className="pt-4 border-t border-border-default/40 mt-auto">
            {isConfirmingLeave ? (
              <div className="bg-hot-pink/10 border border-hot-pink/60 p-3 space-y-2.5 text-center animate-pulse">
                <p className="text-[10px] text-hot-pink font-extrabold uppercase tracking-wider">Xác nhận rời khỏi?</p>
                <p className="text-[8px] text-white/90 font-sans">Kênh dữ liệu và toàn bộ lịch sử trò chuyện sẽ biến mất khỏi terminal.</p>
                <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono">
                  <button 
                    type="button"
                    onClick={handleCancelExit}
                    className="text-[9px] py-1 bg-transparent border border-border-default text-white hover:bg-white/5 uppercase font-bold cursor-pointer"
                  >
                    HỦY BỎ
                  </button>
                  <button 
                    type="button"
                    onClick={handleExecuteExit}
                    className="text-[9px] py-1 bg-hot-pink text-black font-extrabold uppercase hover:bg-hot-pink/90 cursor-pointer"
                  >
                    ĐỒNG Ý RỜI
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleConfirmExit}
                className="w-full py-2 bg-hot-pink/10 border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-black font-extrabold uppercase tracking-widest text-[9px] text-center font-mono cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(255,121,198,0.25)] flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">logout</span>
                {activeThread.type === 'group' ? 'OUT KHỎI NHÓM CHAT' : 'XÓA CUỘC ĐÀM THOẠI'}
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
