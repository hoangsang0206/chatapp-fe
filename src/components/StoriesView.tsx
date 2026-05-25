import React, { useState, useEffect, useRef } from 'react';
import { Story, UserProfile, ChatThread } from '../types';

interface StoriesViewProps {
  stories: Story[];
  onAddStory: (newStory: Story) => void;
  profile: UserProfile;
  selectedStoryId: string | null;
  setSelectedStoryId: (storyId: string | null) => void;
  onSendMessage: (threadId: string, text: string) => void;
  threads: ChatThread[];
  onReactStory?: (storyId: string) => void;
}

export default function StoriesView({
  stories,
  onAddStory,
  profile,
  selectedStoryId,
  setSelectedStoryId,
  onSendMessage,
  threads,
  onReactStory
}: StoriesViewProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);
  
  // Custom uploaded image/video media state before posting
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [previewMediaType, setPreviewMediaType] = useState<'image' | 'video'>('image');
  
  // Immersive player auto-advance timer ref
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger brief alert toasts 
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state when selectedStoryId prop changes
  useEffect(() => {
    if (selectedStoryId) {
      const match = stories.find(s => s.id === selectedStoryId);
      if (match) {
        setActiveStory(match);
        setPlayerProgress(0);
      }
    } else if (stories.length > 0 && !activeStory) {
      setActiveStory(stories[0]);
      setPlayerProgress(0);
    }
  }, [selectedStoryId, stories]);

  // Handle active story timer progress (auto play feature)
  useEffect(() => {
    if (!activeStory) return;

    // Reset progress bar on change
    setPlayerProgress(0);

    // Dynamic tick rate
    const intervalTime = 80; // Total 5000ms divided by 100 is 50ms (or 80ms for 8 seconds)
    
    let ticks = 0;
    const timer = setInterval(() => {
      ticks += 1;
      if (ticks >= 100) {
        ticks = 100;
        handleNextStory();
      } else {
        setPlayerProgress(ticks);
      }
    }, intervalTime);

    progressTimerRef.current = timer;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeStory?.id]);

  const handleNextStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex(s => s.id === activeStory.id);
    if (currentIndex !== -1 && currentIndex < stories.length - 1) {
      const next = stories[currentIndex + 1];
      setActiveStory(next);
      setSelectedStoryId(next.id);
    } else {
      // Loop back to start or release
      setActiveStory(stories[0]);
      setSelectedStoryId(stories[0].id);
      showToast('KẾT THÚC DANH SÁCH // QUAY LẠI ĐẦU');
    }
  };

  const handlePrevStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex(s => s.id === activeStory.id);
    if (currentIndex !== -1 && currentIndex > 0) {
      const prevStory = stories[currentIndex - 1];
      setActiveStory(prevStory);
      setSelectedStoryId(prevStory.id);
    } else {
      const lastStory = stories[stories.length - 1];
      setActiveStory(lastStory);
      setSelectedStoryId(lastStory.id);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      showToast("VUI LÒNG CHỌN TỆP HÌNH ẢNH HOẶC VIDEO");
      return;
    }
    
    const sizeLimit = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > sizeLimit) {
      showToast(`KÍCH THƯỚC TRÊN ${isVideo ? '100MB' : '15MB'} // HỆ THỐNG TỪ CHỐI`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewMedia(e.target.result as string);
        setPreviewMediaType(isImage ? 'image' : 'video');
        showToast(isImage ? "ẢNH ĐÃ ĐƯỢC LOAD VÀO CACHE" : "VIDEO ĐÃ ĐƯỢC LOAD VÀO CACHE");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Simulated uploading logic matching user prompt guidelines
  const handlePublishStory = () => {
    if (!previewMedia) {
      showToast("VUI LÒNG TẢI LÊN FILE SỨ MỆNH TRƯỚC");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          const randomId = `story-mine-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const newStoryObj: Story = {
            id: randomId,
            sender: profile.name,
            seed: `user-${Date.now()}`,
            isMine: true,
            avatarUrl: profile.avatar,
            caption: caption.trim() || undefined,
            timestamp: `${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} // CH_MINE`,
            mediaType: previewMediaType,
            reactionCount: 0
          };

          if (previewMediaType === 'video') {
            newStoryObj.videoUrl = previewMedia;
          } else {
            newStoryObj.imageUrl = previewMedia;
          }

          onAddStory(newStoryObj);
          setActiveStory(newStoryObj);
          setSelectedStoryId(randomId);
          setCaption('');
          setPreviewMedia(null);
          setIsUploading(false);
          showToast("ĐĂNG STORY THÀNH CÔNG!");
        }, 400);
      }
      setUploadProgress(progress);
    }, 150);
  };

  // Quick Emoji Feedback which writes message to target chat thread if it exists
  const handleQuickReact = (emoji: string) => {
    if (!activeStory) return;
    
    // Update local react count immediately
    setActiveStory(prev => prev ? {
      ...prev,
      reactionCount: (prev.reactionCount || 0) + 1
    } : null);

    if (onReactStory) {
      onReactStory(activeStory.id);
    }
    
    // Find matching thread to send message Or alert 
    const isMine = activeStory.isMine;
    if (isMine) {
      showToast("BẠN KHÔNG THỂ PHẢN HỒI CHÍNH MÌNH");
      return;
    }

    // Try finding matching thread
    const matchThread = threads.find(t => t.name.toLowerCase() === activeStory.sender.toLowerCase());
    if (matchThread) {
      onSendMessage(matchThread.id, `[Tin nhắn từ Story] Phản hồi bằng biểu tượng cảm xúc: ${emoji}`);
      showToast(`Đã gửi phản hồi ${emoji} tới @${activeStory.sender}`);
    } else {
      showToast(`Đã phản hồi ${emoji} tới @${activeStory.sender} (Đã mô phỏng)`);
    }
  };

  // Quick Chat input inside active Story
  const [replyText, setReplyText] = useState<string>('');
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeStory) return;

    if (activeStory.isMine) {
      showToast("BẠN KHÔNG THỂ BÌNH LUẬN CHÍNH MÌNH");
      return;
    }

    const matchThread = threads.find(t => t.name.toLowerCase() === activeStory.sender.toLowerCase());
    if (matchThread) {
      onSendMessage(matchThread.id, `[Story Reply]: "${replyText.trim()}"`);
      showToast(`Đã trả lời story tới @${activeStory.sender}`);
    } else {
      showToast(`Gửi câu trả lời: "${replyText.trim()}" tới @${activeStory.sender}`);
    }
    setReplyText('');
  };

  return (
    <div id="stories-viewport-wrapper" className="grid grid-cols-12 gap-6 animate-fade-in pb-12">
      
      {/* LEFT SECTION: LIST OF STORIES & UPLOAD FORM */}
      <div id="stories-sidebar-left" className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Story List Sidebar */}
        <div className="bg-surface-card border border-border-default p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border-default/40">
            <span className="text-[12px] font-bold text-neon-cyan font-mono uppercase tracking-widest">
              LƯU TRỮ STORIES (LIVE)
            </span>
            <span className="text-[9px] bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan px-1.5 py-0.5 font-bold font-mono">
              SECURE_GRID
            </span>
          </div>

          {/* Senders grid list */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-56 lg:max-h-80 overflow-y-auto custom-scrollbar p-1">
            {stories.map((story) => {
              const isActive = activeStory?.id === story.id;
              return (
                <button
                  key={story.id}
                  onClick={() => {
                    setActiveStory(story);
                    setSelectedStoryId(story.id);
                    setPlayerProgress(0);
                  }}
                  className={`flex flex-col items-center p-1 cursor-pointer transition-all border outline-none group ${
                    isActive 
                      ? 'border-neon-green bg-neon-green/5 shadow-[0_0_10px_rgba(0,255,136,0.15)]' 
                      : 'border-transparent hover:border-neon-cyan/40 hover:bg-white/5'
                  }`}
                >
                  <div className={`relative w-11 h-11 p-0.5 border ${
                    isActive 
                      ? 'border-neon-green' 
                      : 'border-border-default/85 group-hover:border-neon-cyan'
                  }`}>
                    <img 
                      src={story.avatarUrl} 
                      alt={story.sender} 
                      className="w-full h-full object-cover bg-black"
                      referrerPolicy="no-referrer"
                    />
                    {story.isMine && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-cyan border border-black rounded-none shadow-[0_0_4px_rgba(0,212,255,0.7)]"></span>
                    )}
                  </div>
                  <span className="text-[8px] font-bold mt-1 text-on-surface truncate w-full text-center uppercase tracking-wider group-hover:text-neon-cyan">
                    {story.sender}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Upload Portal Dashboard */}
        <div className="bg-surface-card border border-border-default p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-default/40">
              <span className="text-[12px] font-bold text-neon-green tracking-widest uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-neon-green">cloud_upload</span>
                UPLOAD STORY MỚI
              </span>
              <span className="text-[7.5px] opacity-45 font-mono">SYSTEM_UPLOADER v2.1</span>
            </div>

            {/* Drag and Drop Zone Container */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all relative ${
                dragActive 
                  ? 'border-neon-green bg-neon-green/5' 
                  : previewMedia 
                  ? 'border-neon-cyan/50 bg-black/40' 
                  : 'border-border-default hover:border-neon-cyan hover:bg-neon-cyan/5'
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                className="hidden"
              />

              {previewMedia ? (
                <div className="space-y-2.5">
                  <div className="w-full h-24 mx-auto border border-neon-cyan overflow-hidden relative group">
                    {previewMediaType === 'video' ? (
                      <video 
                        src={previewMedia} 
                        className="w-full h-full object-cover" 
                        muted 
                        loop 
                        autoPlay 
                        playsInline
                      />
                    ) : (
                      <img src={previewMedia} alt="Story upload preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMedia(null);
                      }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-hot-pink text-[10px] font-bold font-mono tracking-widest cursor-pointer"
                    >
                      HỦY VÀ CHỌN LẠI
                    </button>
                  </div>
                  <p className="text-[8px] text-[#00ff88] font-mono tracking-wide">
                    {previewMediaType === 'video' ? 'VIDEO SLOP' : 'MÔ PHỎNG ẢNH'} SẴN SÀNG TRUYỀN PHÁT
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2.5">
                  <span className={`material-symbols-outlined text-3xl mb-1.5 transition-colors ${dragActive ? 'text-neon-green' : 'text-on-surface-variant'}`}>
                    video_camera_back
                  </span>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                    {dragActive ? "THẢ FILE VÀO ĐÂY" : "KÉO THẢ HOẶC CLICK VÀO ĐÂY"}
                  </p>
                  <p className="text-[8px] text-on-surface-variant/70 font-mono uppercase tracking-tighter mt-1">
                    HỖ TRỢ ẢNH (15MB), VIDEO (100MB)
                  </p>
                </div>
              )}
            </div>

            {/* Caption Input */}
            <div className="mt-4 space-y-1.5">
              <label className="block text-[8px] text-on-surface-variant uppercase font-bold tracking-widest font-mono">CHÚ THÍCH CỦA STORY</label>
              <input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="NHẬP DÒNG SUY NGHĨ / TRẠNG THÁI..."
                className="w-full h-10 px-3 bg-black border border-border-default text-xs text-white placeholder-white/30 outline-none focus:border-neon-cyan font-mono"
              />
            </div>
          </div>

          <div className="mt-6">
            {isUploading ? (
              <div className="space-y-1.5 bg-black/55 p-3.5 border border-border-default font-mono">
                <div className="flex justify-between text-[8px]">
                  <span className="text-neon-cyan animate-pulse">UPLOADING DATA PACKET...</span>
                  <span className="text-neon-cyan">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-[#1A1A26]">
                  <div 
                    className="h-full bg-neon-cyan shadow-[0_0_8px_rgba(0,212,255,0.7)] transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-[7px] text-on-surface-variant/60 uppercase">SECURE PROTOCOL ENGAGED // UPLOADING CHANNELS</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePublishStory}
                disabled={!previewMedia}
                className={`w-full py-2.5 border uppercase font-mono text-[9px] font-bold tracking-widest transition-all cursor-pointer ${
                  previewMedia 
                    ? 'border-neon-green text-neon-green hover:bg-neon-green hover:text-black hover:shadow-[0_0_12px_rgba(0,255,136,0.4)]' 
                    : 'border-border-default/40 text-on-surface-variant/40 cursor-not-allowed bg-transparent'
                }`}
              >
                XUẤT BẢN TRUYỀN PHÁT STORY
              </button>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT SECTION: IMMERSIVE ACTIVE STORY PLAYER VIEW */}
      <div id="stories-player-right" className="col-span-12 lg:col-span-8">
        {activeStory ? (
          <div className="bg-[#050508] border-2 border-[#1A1A2A] relative flex flex-col justify-between overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8)] aspect-[16/10] sm:aspect-[16/11] lg:h-[calc(100vh-140px)] lg:aspect-auto">
            
            {/* Ambient retro details */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-neon-green/5 pointer-events-none blur-3xl rounded-full"></div>
            <div className="absolute top-2 right-2 flex gap-1 z-20">
              <span className="w-1.5 h-1.5 bg-[#00ff88]/20 border border-[#00ff88]/45"></span>
              <span className="w-1.5 h-1.5 bg-neon-cyan/25 border border-neon-cyan/45 animate-pulse"></span>
            </div>

            {/* Immersive segment progress bars at top */}
            <div className="p-4 pb-0 flex gap-1.5 w-full z-20 absolute top-0 left-0">
              {stories.map((story, idx) => {
                const currentIndex = stories.findIndex(s => s.id === activeStory.id);
                let progress = 0;
                if (idx < currentIndex) progress = 100;
                else if (idx === currentIndex) progress = playerProgress;

                return (
                  <div key={story.id} className="h-1 flex-1 bg-white/10 overflow-hidden rounded-none border border-black/30">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00ff88] to-neon-cyan shadow-[0_0_5px_#00ff88]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Active Story Custom Header bar inside Player */}
            <div className="p-4 pt-8 flex items-center justify-between z-20 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/85 via-black/45 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#00ff88]/70 overflow-hidden scale-95 p-0.5 bg-black">
                  <img src={activeStory.avatarUrl} alt={activeStory.sender} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-[12px] font-black text-white hover:text-neon-cyan transition-colors uppercase tracking-widest font-mono">
                    @{activeStory.sender}
                  </h3>
                  <p className="text-[8.5px] text-[#00ff88] font-mono tracking-tight font-bold uppercase mt-0.5">
                    {activeStory.timestamp || 'NODE_LIVE // SECURE'}
                  </p>
                </div>
              </div>

              {/* Navigation Actions controls inside player */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevStory}
                  className="w-8 h-8 flex items-center justify-center border border-[#1a1a2a] bg-black/60 hover:border-neon-cyan text-white hover:text-neon-cyan font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  title="Trước Đóng"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button 
                  onClick={handleNextStory}
                  className="w-8 h-8 flex items-center justify-center border border-[#1a1a2a] bg-black/60 hover:border-neon-green text-white hover:text-neon-green font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  title="Kế Tiếp"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* STAGE AREA: IMMERSIVE VISUAL PATTERN OR THE UPLOADED PICTURE/VIDEO */}
            <div className="flex-1 flex items-center justify-center select-none relative bg-[#020203]">
              {activeStory.videoUrl || activeStory.mediaType === 'video' ? (
                <div className="w-full h-full flex items-center justify-center relative bg-black">
                  <video 
                    key={activeStory.id}
                    src={activeStory.videoUrl} 
                    className="max-h-full max-w-full object-contain filter brightness-[1.05] contrast-[0.98] outline-none z-10" 
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : activeStory.imageUrl ? (
                <div className="w-full h-full flex items-center justify-center relative bg-black">
                  <img 
                    src={activeStory.imageUrl} 
                    alt={activeStory.sender} 
                    className="max-h-full max-w-full object-contain filter brightness-[1.05] contrast-[0.98]" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                /* Falling back to a majestic generated cyber grid if no picture uploaded */
                <div 
                  className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-neutral-900 to-[#0A0012]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30,30,50,0.4), rgba(4,4,12,0.95))`
                  }}
                >
                  {/* Glowing decorative cyber grid */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1E2B3E_1px,_transparent_1.5px)] bg-[size:16px_16px]"></div>
                  
                  {/* Seed generated procedural vector visual graphic container */}
                  <div className="w-32 h-32 border-4 border-dashed border-[#ff0099]/30 rounded-full flex items-center justify-center p-4 relative animate-spin [animation-duration:50s]">
                    <div className="w-24 h-24 border-2 border-neon-cyan/40 rounded-full flex items-center justify-center animate-pulse">
                      <span className="material-symbols-outlined text-4xl text-neon-green animate-bounce">database</span>
                    </div>
                  </div>

                  {/* Absolute subtle background lettering decoration */}
                  <div className="absolute text-white/5 font-mono text-[110px] font-black uppercase tracking-widest leading-none pointer-events-none select-none select-all-none">
                    {activeStory.seed.substring(0, 5).toUpperCase()}
                  </div>
                </div>
              )}

              {/* Story CAPTION Text Overlay */}
              {activeStory.caption && (
                <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 z-20">
                  <div className="bg-black/85 border border-[#1A1A2A] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                    <p className="text-[12px] text-white leading-relaxed font-mono uppercase text-center tracking-wider max-w-2xl mx-auto">
                      "{activeStory.caption}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE FOOTER BAR: QUICK Cyber reaction symbols & direct text chat entry thread integration */}
            <div className="p-4 bg-black/95 border-t border-[#1A1A2F]/80 z-20 flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Quick Emojis Grid panel */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 custom-scrollbar justify-center md:justify-start">
                <span className="text-[8px] text-on-surface-variant font-mono font-bold uppercase tracking-wider hidden sm:inline">
                  PHẢN HỒI ({activeStory.reactionCount || 0}):
                </span>
                {['⚡', '🧬', '🛡', '🔥', '💀', '👽', '🖤'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleQuickReact(emoji)}
                    className="w-8 h-8 rounded-none border border-border-default/40 bg-white/5 text-xs flex items-center justify-center hover:bg-[#00ff88]/15 hover:border-neon-green active:scale-90 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Form Message Reply Entry */}
              <form onSubmit={handleSendReply} className="flex gap-2 w-full md:w-72">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Gửi câu hỏi tới @${activeStory.sender}...`}
                  className="w-full h-8 px-3 select-none bg-[#050508] border border-border-default hover:border-border-default/80 text-xs text-white placeholder-white/35 outline-none focus:border-neon-green font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 h-8 border border-neon-cyan hover:bg-neon-cyan hover:text-black font-mono text-[9px] text-neon-cyan font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                >
                  GỬI
                </button>
              </form>

            </div>

          </div>
        ) : (
          <div className="bg-[#050508] border-2 border-dashed border-border-default p-12 text-center h-[calc(100vh-140px)] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-neon-cyan mb-3 animate-pulse">auto_stories</span>
            <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              CHỌN MỘT STORY LIVE ĐỂ BẮT ĐẦU TRUYỀN PHÁT
            </p>
            <p className="text-[10px] font-mono text-on-surface-variant opacity-60 uppercase mt-1">
              hoặc tự tạo story của bạn để hiện tại
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
