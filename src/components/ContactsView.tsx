import React, { useState } from 'react';
import { FriendRequest, ChatThread } from '../types';

interface Contact {
  id: string;
  name: string;
  status: string;
  online: boolean;
  avatarUrl: string;
  isCustom?: boolean;
}

interface ContactsViewProps {
  contacts: Contact[];
  friendRequests: FriendRequest[];
  onAcceptRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onAddContact: (name: string, status: string, online: boolean) => void;
  onStartChat: (contactName: string) => void;
  groupThreads: ChatThread[];
  onCreateGroupChat: (name: string, membersName: string[]) => void;
}

export default function ContactsView({
  contacts,
  friendRequests,
  onAcceptRequest,
  onRejectRequest,
  onAddContact,
  onStartChat,
  groupThreads,
  onCreateGroupChat
}: ContactsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newFriendName, setNewFriendName] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  const handleToggleGroupMember = (contactName: string) => {
    if (selectedGroupMembers.includes(contactName)) {
      setSelectedGroupMembers(prev => prev.filter(name => name !== contactName));
    } else {
      setSelectedGroupMembers(prev => [...prev, contactName]);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroupChat(newGroupName.trim(), selectedGroupMembers);
    setNewGroupName('');
    setSelectedGroupMembers([]);
    setShowAddGroupForm(false);
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    
    // Auto status and random avatar key
    const seed = newFriendName.trim().replace(/\s+/g, '_');
    onAddContact(newFriendName.trim(), 'Online // Kênh liên lạc mới', true);
    setNewFriendName('');
    setShowAddForm(false);
  };

  return (
    <div id="contacts-view-wrapper" className="flex flex-col lg:flex-row h-[calc(100vh-140px)] border border-border-default bg-surface-dim overflow-hidden animate-fade-in">
      {/* Center Section: Contacts, Groups, Search */}
      <section id="contacts-center" className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar border-r border-border-default">
        {/* Global Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-neon-green text-sm">search</span>
          </div>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-border-default text-on-surface text-xs py-3 pl-10 pr-20 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all placeholder:text-on-surface-variant/40 outline-none"
            placeholder="TÌM KIẾM TRONG DANH BẠ..."
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-neon-green/60 font-bold font-mono">
            TÌM KIẾM THEO TÊN
          </div>
        </div>

        {/* Dynamic add form overlay / box */}
        {showAddForm && (
          <form id="add-friend-form" onSubmit={handleAddNewFriend} className="bg-surface-container-lowest border border-neon-cyan p-4 space-y-3 shadow-[0_0_15px_rgba(0,212,255,0.15)]">
            <h3 className="text-xs font-bold text-neon-cyan uppercase tracking-wider">ĐĂNG KÝ THÔNG TIN LIÊN HỆ MỚI</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                required
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="NHẬP USERNAME HOẶC BIỆT DANH..."
                className="flex-1 bg-black border border-border-default px-3 py-2 text-xs font-mono text-neon-cyan outline-none focus:border-neon-cyan transition-all"
              />
              <button 
                type="submit"
                className="bg-neon-cyan text-black px-4 py-2 text-[10px] font-bold uppercase transition-all hover:bg-white"
              >
                LƯU LIÊN HỆ
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-border-default text-on-surface-variant px-3 py-2 text-[10px] uppercase hover:text-white"
              >
                HỦY
              </button>
            </div>
            <p className="text-[8px] opacity-40 font-mono">LIÊN HỆ MỚI SẼ TỰ ĐỘNG KHỞI TẠO AVATAR CHỮ SỐ TRÊN LƯỚI KHU VỰC.</p>
          </form>
        )}

        {/* Friends List Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default/80 pb-2.5">
            <h2 className="text-neon-cyan font-bold text-xs tracking-widest uppercase">
              BẠN BÈ ({filteredContacts.length})
            </h2>
            <div className="flex items-center gap-3">
              <button 
                id="toggle-add-friend-btn"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 text-[10px] text-neon-green border border-neon-green/30 px-2.5 py-1 font-bold hover:bg-neon-green hover:text-black hover:border-transparent transition-all uppercase cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span> THÊM BẠN BÈ
              </button>
              <span className="text-[9px] text-on-surface-variant/50 font-mono hidden md:inline">SYSTEM: SYNCHRONIZED</span>
            </div>
          </div>

          <div id="contacts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredContacts.length === 0 ? (
              <div className="col-span-2 text-center py-8 border border-dashed border-border-default text-on-surface-variant/60 font-mono text-xs">
                KHÔNG TÌM THẤY LIÊN HỆ PHÙ HỢP VỚI YÊU CẦU TRÊN MẠNG
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  id={`friend-card-${contact.id}`}
                  className="flex items-center p-3.5 bg-surface-container-lowest border border-border-default hover:border-neon-green hover:shadow-[0_0_10px_rgba(0,255,136,0.1)] transition-all group"
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={contact.avatarUrl} 
                      alt={contact.name} 
                      className={`w-12 h-12 border border-border-default bg-black transition-all ${
                        contact.online ? 'grayscale-0' : 'grayscale opacity-60'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green border-2 border-[#0A0A0F] rounded-none"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface group-hover:text-neon-green transition-colors truncate">
                      {contact.name.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-mono truncate tracking-tight opacity-75">
                      {contact.status}
                    </p>
                  </div>
                  <div className="ml-2 flex gap-1.5 flex-shrink-0">
                    <button 
                      onClick={() => onStartChat(contact.name)}
                      title="Gửi tin nhắn bảo mật"
                      className="material-symbols-outlined p-1.5 text-xs text-on-surface-variant hover:text-neon-cyan hover:bg-surface-container/60 transition-colors cursor-pointer"
                    >
                      chat
                    </button>
                    <button 
                      title="Gửi mật mã log"
                      className="material-symbols-outlined p-1.5 text-xs text-on-surface-variant hover:text-neon-green hover:bg-surface-container/60 transition-colors cursor-pointer"
                    >
                      mail
                    </button>
                    {contact.online && (
                      <button 
                        title="Kết nối thoại VoIP"
                        className="material-symbols-outlined p-1.5 text-xs text-on-surface-variant hover:text-hot-pink hover:bg-surface-container/60 transition-colors cursor-pointer"
                      >
                        call
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Group Chats section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-border-default/80 pb-2.5">
            <h2 className="text-neon-cyan font-bold text-xs tracking-widest uppercase">
              DANH SÁCH NHÓM CỘNG ĐỒNG ({groupThreads.length})
            </h2>
            <div className="flex items-center gap-3">
              <button 
                id="toggle-add-group-btn"
                onClick={() => {
                  setShowAddGroupForm(!showAddGroupForm);
                  setShowAddForm(false);
                }}
                className="flex items-center gap-1.5 text-[10px] text-neon-green border border-neon-green/30 px-2.5 py-1 font-bold hover:bg-neon-green hover:text-black hover:border-transparent transition-all uppercase cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">group_add</span> + TẠO NHÓM MỚI
              </button>
              <span className="text-[9px] text-on-surface-variant/40 font-mono hidden md:inline font-bold font-mono">NODE ACTIVE // SECURE</span>
            </div>
          </div>

          {/* Create Group Chat Form */}
          {showAddGroupForm && (
            <form id="add-group-form" onSubmit={handleCreateGroup} className="bg-surface-container-lowest border border-neon-green p-4 space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.15)] animate-fade-in">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-wider">THIẾT LẬP KÊNH TRUYỀN NHÓM MỚI</h3>
              
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant block font-mono">TÊN NHÓM CHAT (TỰ ĐỘNG THÊM #)</label>
                <input 
                  type="text" 
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ví dụ: BIET_DOI_CYBER, ANH_EM_VIP..."
                  className="w-full bg-black border border-border-default px-3 py-2 text-xs font-mono text-neon-green outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant block font-mono">CHỌN THÀNH VIÊN BAN ĐẦU ({selectedGroupMembers.length})</label>
                {contacts.length === 0 ? (
                  <div className="text-[9px] text-on-surface-variant/50 italic p-3 text-center border border-dashed border-border-default">
                    Không tìm thấy liên hệ nào để thêm vào nhóm
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar border border-border-default/50 p-2 bg-black/40">
                    {contacts.map((contact) => {
                      const isChecked = selectedGroupMembers.includes(contact.name);
                      return (
                        <div 
                          key={contact.id}
                          onClick={() => handleToggleGroupMember(contact.name)}
                          className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-colors ${
                            isChecked 
                              ? 'bg-neon-green/10 border-neon-green text-neon-green' 
                              : 'bg-transparent border-border-default/40 hover:bg-white/5 text-white/70 hover:text-white'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {}} // handled by click
                            className="rounded border-border-default text-neon-green focus:ring-0 accent-neon-green cursor-pointer"
                          />
                          <span className="text-[10px] font-mono truncate uppercase">{contact.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="bg-neon-green text-black px-4 py-2 text-[10px] font-bold uppercase transition-all hover:bg-white cursor-pointer"
                >
                  KHỞI TẠO NHÓM
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddGroupForm(false);
                    setNewGroupName('');
                    setSelectedGroupMembers([]);
                  }}
                  className="border border-border-default text-on-surface-variant px-3 py-2 text-[10px] uppercase hover:text-white cursor-pointer"
                >
                  HỦY BỎ
                </button>
              </div>
              <p className="text-[8px] opacity-40 font-mono">CODE-BASE CHỦ SẼ TỰ ĐỘNG CẤP QUYỀN ADMIN CHO BẠN VÀ KHỞI TẠO NODE KÊNH.</p>
            </form>
          )}

          <div id="groups-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {groupThreads.map((group) => {
              // Custom displays for fallback metrics
              const memberCount = group.id === 'g1' ? 12 : group.id === 'g2' ? 5 : group.id === 'g3' ? 82 : (group.initialMembers?.length || 0) + 1;
              const onlineCount = group.id === 'g1' ? 3 : group.id === 'g2' ? 5 : group.id === 'g3' ? 14 : 1;
              const isDefaultAndFull = group.id === 'g2';
              
              return (
                <div 
                  key={group.id}
                  onClick={() => onStartChat(group.name)}
                  className="p-4 bg-surface-container-lowest border border-border-default hover:border-terminal-magenta hover:shadow-[0_0_10px_rgba(255,0,255,0.15)] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[110px]"
                >
                  <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-terminal-magenta/10 text-terminal-magenta text-[9px] font-bold font-mono">
                    {group.nodeValue || '#GRP'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white mb-1 group-hover:text-terminal-magenta uppercase tracking-wider truncate" title={group.name}>
                      {group.name.replace('#', '')}
                    </h3>
                    <p className="text-[9px] text-on-surface-variant mb-3">
                      {memberCount} MEMBERS // {onlineCount} ONLINE
                    </p>
                  </div>
                  <div className="flex -space-x-1.5 mt-auto">
                    <img 
                      src={group.avatar} 
                      alt="Avatar" 
                      className="w-5 h-5 border border-[#0A0A0F] bg-zinc-800 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {group.initialMembers && group.initialMembers.slice(0, 3).map((m, idx) => (
                      <div 
                        key={idx} 
                        className="w-5 h-5 border border-[#0A0A0F] flex items-center justify-center bg-surface-container-high text-[7px] font-bold text-neon-green font-mono uppercase"
                        title={m}
                      >
                        {m.substring(0, 2)}
                      </div>
                    ))}
                    {group.initialMembers && group.initialMembers.length > 3 && (
                      <div className="w-5 h-5 border border-[#0A0A0F] flex items-center justify-center bg-surface-container-high text-[7px] font-bold text-neon-cyan font-mono">
                        +{group.initialMembers.length - 3}
                      </div>
                    )}
                    {!group.initialMembers && (
                      <>
                        <div className="w-5 h-5 border border-[#0A0A0F] bg-zinc-700"></div>
                        <div className="w-5 h-5 border border-[#0A0A0F] bg-zinc-600"></div>
                        <div className="w-5 h-5 border border-[#0A0A0F] flex items-center justify-center bg-surface-container-high text-[7px] font-bold text-neon-green font-mono">
                          {isDefaultAndFull ? 'FULL' : '+9'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right Column/Sidebar: Friend Requests & Specs */}
      <aside id="contacts-aside" className="w-full lg:w-80 bg-surface-container-lowest/60 p-6 space-y-6 flex flex-col justify-between">
        {/* Friend Requests panel */}
        <div id="requests-panel" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default/85 pb-2.5">
            <h2 className="text-neon-cyan font-bold text-xs tracking-widest uppercase">
              YÊU CẦU KẾT BẠN
            </h2>
            <span className="text-[9px] text-neon-green bg-neon-green/10 px-1.5 py-0.5 border border-neon-green/30 font-bold font-mono text-center">
              {friendRequests.length}
            </span>
          </div>

          <div id="requests-list" className="space-y-3">
            {friendRequests.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border-default/60 text-on-surface-variant/60 font-mono text-[11px]">
                KHÔNG CÓ YÊU CẦU CHỜ DUYỆT
              </div>
            ) : (
              friendRequests.map((req) => (
                <div 
                  key={req.id} 
                  id={`request-item-${req.id}`}
                  className="bg-[#121216] border border-border-default p-3.5 space-y-3.5"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 border border-hot-pink bg-zinc-900 flex-shrink-0 overflow-hidden">
                      <img 
                        src={req.avatar} 
                        alt={req.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-xs font-bold text-white truncate font-mono uppercase">{req.name}</p>
                      <p className="text-[9px] text-hot-pink uppercase tracking-wider font-mono font-semibold">{req.subText}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-center">
                    <button 
                      onClick={() => onAcceptRequest(req.id)}
                      className="flex-1 bg-neon-green/10 border border-neon-green text-neon-green text-[9px] py-1.5 font-bold hover:bg-neon-green hover:text-black transition-all uppercase tracking-wider cursor-pointer"
                    >
                      CHẤP NHẬN
                    </button>
                    <button 
                      onClick={() => onRejectRequest(req.id)}
                      className="flex-1 bg-error-container/10 border border-hot-pink text-hot-pink text-[9px] py-1.5 font-bold hover:bg-hot-pink hover:text-black transition-all uppercase tracking-wider cursor-pointer"
                    >
                      TỪ CHỐI
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Sync Stats */}
        <div id="quick-logs-specs" className="pt-6 border-t border-border-default/30 font-mono space-y-1.5 opacity-60">
          <div className="flex justify-between text-[9px]">
            <span>UPSTREAM:</span>
            <span className="text-neon-cyan font-bold">42.4 KB/S</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span>DOWNSTREAM:</span>
            <span className="text-neon-green font-bold">12.8 MB/S</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span>MẠNG TRUYỀN:</span>
            <span className="text-terminal-magenta font-bold">14 MS</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span>MÃ HÓA KÊNH:</span>
            <span className="text-white font-bold">TUNNEL_TLS_1.3</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
