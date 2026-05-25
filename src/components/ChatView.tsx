import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, Message } from '../types';

interface ChatViewProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string, isIncoming?: boolean, sticker?: string, file?: Message['file']) => void;
  userName: string;
  userAvatar: string;
  onLeaveThread?: (threadId: string) => void;
}

export default function ChatView({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  userName,
  userAvatar,
  onLeaveThread
}: ChatViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<string>('TIMESTAMP: 2077.08.12 // 04:32:01');
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'chat'>('list');
  const prevThreadIdRef = useRef<string>(activeThreadId);

  // States and variables for sending file, image and sticker
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);
  const [activeStickerTab, setActiveStickerTab] = useState<'messenger' | 'cyber'>('messenger');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const CYBER_STICKERS = [
    { emoji: '🛡️', label: 'AN TOÀN // SECURE' },
    { emoji: '☣️', label: 'CẢNH BÁO // THREAT' },
    { emoji: '💾', label: 'LƯU CACHE // DISK' },
    { emoji: '🕶️', label: 'HACKER // RUNNER' },
    { emoji: '🧬', label: 'GIẢI MÃ // DECRYPT' },
    { emoji: '🧠', label: 'TRÍ TUỆ // BRAIN' },
    { emoji: '🔥', label: 'QUÁ TẢI // BURNING' },
    { emoji: '🤖', label: 'TRỢ LÝ // GEMINI' },
    { emoji: '🔌', label: 'HỆ THỐNG // PORT' },
    { emoji: '🎯', label: 'MỤC TIÊU // TARGET' },
    { emoji: '👾', label: 'XÂM NHẬP // MATRIX' },
    { emoji: '💎', label: 'HOÀN HẢO // EXCELLENT' }
  ];

  const MESSENGER_STICKERS = [
    { emoji: '👍', label: 'LIKE // THUMBS UP' },
    { emoji: '❤️', label: 'LOVE // THẢ TIM' },
    { emoji: '😂', label: 'HAHA // CƯỜI BỂ BỤNG' },
    { emoji: '😮', label: 'WOW // NGẠC NHIÊN' },
    { emoji: '😢', label: 'SAD // BUỒN BÃ' },
    { emoji: '😡', label: 'ANGRY // PHẪN NỘ' },
    { emoji: '👋', label: 'HELLO // XIN CHÀO' },
    { emoji: '🥳', label: 'PARTY // TIỆC TÙNG' },
    { emoji: '🎉', label: 'CONGRATS // CHÚC MỪNG' },
    { emoji: '😎', label: 'COOL // NGẦU LÒI' },
    { emoji: '🥺', label: 'PLEASE // NẰN NÌ' },
    { emoji: '🤔', label: 'THINK // SUY NGHĨ' },
    { emoji: '🔥', label: 'FIRE // QUÁ CHÁY' },
    { emoji: '💩', label: 'POOP // CỤC PHÂN' },
    { emoji: '🤦', label: 'FACEPALM // BÓ TAY' },
    { emoji: '🤷', label: 'SHRUG // CHỊU CHẾT' },
    { emoji: '💖', label: 'SPARKLE // LUNG LINH' },
    { emoji: '😻', label: 'CAT_LOVE // MÈO YÊU' },
    { emoji: '🙌', label: 'HIGHFIVE // HOAN HÔ' },
    { emoji: '🤩', label: 'STAR // ĐẮC Ý' },
    { emoji: '👻', label: 'GHOST // MA QUÁI' },
    { emoji: '💸', label: 'RICH // TIỀN BAY' },
    { emoji: '😴', label: 'SLEEP // NGỦ GẬT' },
    { emoji: '🎯', label: 'TARGET // BẮN TRÚNG' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;

    const fileType: 'image' | 'file' = file.type.startsWith('image/') ? 'image' : 'file';

    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSendMessage(
        activeThread.id, 
        `Đã tải lên tệp: ${file.name}`, 
        false, 
        undefined, 
        {
          name: file.name,
          url: fileType === 'image' ? dataUrl : undefined,
          type: fileType,
          size: sizeStr
        }
      );
    };

    reader.readAsDataURL(file);
    e.target.value = '';
    setShowAttachmentMenu(false);
  };

  const handleSendSticker = (sticker: { emoji: string; label: string }) => {
    onSendMessage(
      activeThread.id, 
      `Đã gửi nhãn dán: ${sticker.label}`, 
      false, 
      `${sticker.emoji}::${sticker.label}`
    );
    setShowStickerPicker(false);
  };

  useEffect(() => {
    if (activeThreadId !== prevThreadIdRef.current) {
      setMobileActiveView('chat');
      prevThreadIdRef.current = activeThreadId;
    }
  }, [activeThreadId]);

  // States required by the user
  const [isMuted, setIsMuted] = useState<{ [threadId: string]: boolean }>({});
  const [soundProfile, setSoundProfile] = useState<{ [threadId: string]: 'loud' | 'soft' | 'off' }>({});
  const [isConfirmingLeave, setIsConfirmingLeave] = useState<boolean>(false);
  const [showAddMemberDropdown, setShowAddMemberDropdown] = useState<boolean>(false);
  const [memberUidSearch, setMemberUidSearch] = useState<string>('');

  // States for Voice and Video Call
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCamOff, setIsCamOff] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [permissionErrorDetail, setPermissionErrorDetail] = useState<string>('');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync Timer for active voice/video call session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  // Track stream changes and wire the video element
  useEffect(() => {
    if (callType === 'video' && callState === 'connected' && streamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [callType, callState, isCamOff]);

  // Cleanup media stream tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTimeInCall = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async (type: 'voice' | 'video') => {
    setCallType(type);
    setCallState('calling');
    setPermissionState('checking');
    setPermissionErrorDetail('');
    setIsMicMuted(false);
    setIsCamOff(false);

    let permissionsResult = 'unknown';
    try {
      if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
        // Query permissions if browser supports querying these names
        const checkMic = await navigator.permissions.query({ name: 'microphone' as PermissionName }).catch(() => null);
        const checkCam = type === 'video' 
          ? await navigator.permissions.query({ name: 'camera' as PermissionName }).catch(() => null)
          : null;
        
        if ((checkMic && checkMic.state === 'denied') || (checkCam && checkCam.state === 'denied')) {
          permissionsResult = 'denied';
        } else if (checkMic && checkMic.state === 'granted' && (!checkCam || checkCam.state === 'granted')) {
          permissionsResult = 'granted';
        } else {
          permissionsResult = 'prompt';
        }
      }
    } catch (e) {
      console.warn("Soft checking permissions via API is not supported in this frame, fetching media directly.", e);
    }

    if (permissionsResult === 'denied') {
      setPermissionState('denied');
      setPermissionErrorDetail('QUYỀN TRUY CẬP ĐÃ BỊ CHẶN: VUI LÒNG CẤP QUYỀN CAMERA & MICROPHONE TRONG PHẦN CÀI ĐẶT TRÌNH DUYỆT ĐỂ TIẾP TỤC.');
      return;
    }

    // Attempt direct hardware verification and request permission from user
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: type === 'video'
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setPermissionState('granted');
      
      // Auto simulate secure lines encryption handover after permissions are verified
      setTimeout(() => {
        setCallState('connected');
      }, 1500);

    } catch (err: any) {
      console.error('Lỗi khi truy cập webcam/micro của bạn:', err);
      setPermissionState('denied');
      
      let detail = 'NGƯỜI DÙNG TỪ CHỐI HOẶC KHÔNG TÌM THẤY THIẾT BỊ HOẠT ĐỘNG.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        detail = 'QUYỀN TRUY CẬP TRÌNH DUYỆT ĐÃ BỊ TỪ CHỐI. VUI LÒNG CLICK VÀO BIỂU TƯỢNG CAMERA PHÍA TRÊN THANH ĐỊA CHỈ ĐỂ CHO PHÉP.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        detail = 'KHÔNG TÌM THẤY THIẾT BỊ PHẦN CỨNG. VUI LÒNG KIỂM TRA LẠI JACK CẮM CAMERA/MICRO HOẶC CÁC PHẦN MỀM ĐANG CHIẾM DỤNG KHÁC.';
      }
      setPermissionErrorDetail(detail);
    }
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    const callDurationFormatted = formatTimeInCall(callSeconds);
    const textLog = callType === 'video'
      ? `🎥 [Cuộc gọi Video] Đã kết thúc. Thời lượng: ${callDurationFormatted}`
      : `📞 [Cuộc gọi Thoại] Đã kết thúc. Thời lượng: ${callDurationFormatted}`;
      
    // Send standard log message to record in history
    onSendMessage(activeThread.id, textLog);
    
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      setCallType(null);
    }, 1500);
  };

  const toggleCam = () => {
    const nextState = !isCamOff;
    setIsCamOff(nextState);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !nextState;
      });
    }
  };

  const toggleMic = () => {
    const nextState = !isMicMuted;
    setIsMicMuted(nextState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !nextState;
      });
    }
  };

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
      { id: 'm1', name: userName || 'Bùi Hữu Vũ', avatar: userAvatar, role: 'admin', status: 'Online' },
      { id: 'm2', name: 'ZeroCool', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8oYsHlEJVlNd0JPmkanne2ENjxWNHqeF8XRBEorrUbqG2rzZzFxClg772yjh0I2H2psJ_E3N2YzDZrteMEbzw0CqvZPqhRmA7kDysUhzzRQujYPdDSEkwW6dME4db4TafGuDlB4U262UdYVsnoApRayASPbhzUzYmyuaJRZtIWejghwYOz1x_Af9tT8wYAvAEIrlrUYWf1neUyTNTPXoi7_eUx5GXCjyOzjJ6DPouqV0CP5Gn42NHyk-XU1ekMlZGoh-vzQo_1E', role: 'member', status: 'Online' },
      { id: 'm3', name: 'Acid Burn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSta69hUqiI_HfA1YHvnkyRjlKzhgjuGpJYfNV4BY6xUMnQ6XtTguV_E-cqlrtAXqRk0NbQfX1bnT0sYTITLzpd3zbfKkihMW79jEmgtgFi3xy1HqxhKNoqjJod810LFOMs_ZD-FXbUJSluwzKy-y92vxGaoqICUKXiZ62m_sKS8lrHkdG7l_ajZdu5youfJx2pA_I1PBeksEj0tQNxoTYxDcq1vs110wCkOaTwoAQDOU6ma_hxblFL0vj3yABSuILetyAVsHUJNw', role: 'member', status: 'Offline' },
      { id: 'm4', name: 'Crash Override', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIGcMjlJVWJfzhNFiNG33lewd8C01uV8UCq1kKf9RVD46_ojbbTwzY0_Uv9Mj9EyjaZnqsAvz-i4JDwK3fTaeeqMj9pt7nJUrVw2ugpXdQyzFKpROuzKIXrjzlEZVGs1nd4rZxNx8vmW-Ht7Mx67TYD_aO3zH6FeJU0I9soC47Bua7VmyWJee_eZfa4niQ0ynh1yyAEA_AbIv-8Nq82oTbDwbpSGGyqJpLGqdM9XkkRSzVm-YFl0-pWQewo6k8DExXPZG5C3BrHzo', role: 'member', status: 'Online' },
    ],
    g2: [
      { id: 'm1_g2', name: userName || 'Bùi Hữu Vũ', avatar: userAvatar, role: 'admin', status: 'Online' },
      { id: 'm2_g2', name: 'CipherMaster', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CipherMaster', role: 'member', status: 'Online' },
    ],
    g3: [
      { id: 'm1_g3', name: userName || 'Bùi Hữu Vũ', avatar: userAvatar, role: 'admin', status: 'Online' },
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
          { id: 'm-admin', name: userName || 'Bùi Hữu Vũ', avatar: userAvatar, role: 'admin' as const, status: 'Online' },
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
    <div id="chat-view-container" className="flex h-[calc(100vh-140px)] border border-border-default bg-surface-dim overflow-hidden animate-fade-in relative">
      {/* List Sidebar of Direct & Group chats */}
      <section id="chat-sidebar" className={`${mobileActiveView === 'list' ? 'flex w-full' : 'hidden md:flex'} md:w-72 border-r border-border-default flex-col bg-surface-container-lowest/80`}>
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
                onClick={() => {
                  onSelectThread(thread.id);
                  setMobileActiveView('chat');
                }}
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
      <section id="conversation-window" className={`${mobileActiveView === 'chat' ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-background relative`}>
        {/* Active Header bar of conversation */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-border-default bg-surface-dim/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Back Button */}
            <button 
              type="button"
              onClick={() => setMobileActiveView('list')}
              className="md:hidden flex items-center justify-center w-8 h-8 mr-1 text-neon-cyan hover:text-white border border-neon-cyan/30 bg-neon-cyan/5 hover:bg-neon-cyan/20 cursor-pointer"
              title="Quay lại danh sách"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>

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
            <button 
              onClick={() => handleStartCall('video')}
              className="material-symbols-outlined p-1.5 text-sm hover:text-neon-cyan cursor-pointer transition-all active:scale-95 text-[#00D4FF]"
              title="Bắt đầu cuộc gọi Video mã hóa"
            >
              videocam
            </button>
            <button 
              onClick={() => handleStartCall('voice')}
              className="material-symbols-outlined p-1.5 text-sm hover:text-neon-cyan cursor-pointer transition-all active:scale-95 text-[#00FF88]"
              title="Bắt đầu cuộc gọi Thoại bảo mật"
            >
              call
            </button>
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
                  src={msg.isMine ? userAvatar : activeThread.avatar} 
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
                  {/* Handle file attachment presentation */}
                  {msg.file && (
                    <div className="mb-2 border border-border-default/40 bg-black/40 p-2.5 flex flex-col gap-2 max-w-[280px] sm:max-w-sm text-left">
                      {msg.file.type === 'image' ? (
                        <div className="relative group overflow-hidden border border-neon-cyan/30 bg-black/50">
                          <img 
                            src={msg.file.url || "https://api.dicebear.com/7.x/bottts/svg"} 
                            alt={msg.file.name} 
                            className="max-h-48 w-full object-cover rounded-none transition-transform duration-300 group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-2xl text-neon-cyan select-none">description</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-[10.5px] truncate">{msg.file.name}</p>
                            <p className="text-[8.5px] text-on-surface-variant/80 font-black">{msg.file.size || '0 KB'}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between border-t border-border-default/20 pt-1.5 text-[8.5px]">
                        <span className="text-neon-cyan uppercase font-black text-[7.5px]">ĐÃ KIỂM TRA QUÉT // AN TOÀN</span>
                        <a 
                          href={msg.file.url || '#'} 
                          download={msg.file.name}
                          onClick={(e) => {
                            if (!msg.file?.url) {
                              e.preventDefault();
                              alert(`Đang lấy tệp an toàn và giải nén từ máy chủ: ${msg.file?.name}`);
                            }
                          }}
                          className="text-neon-green hover:underline font-black uppercase flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[10px]">download</span> TẢI XUỐNG
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Handle sticker presentation */}
                  {msg.sticker && (
                    <div className="mb-2 border border-dashed border-neon-cyan/30 p-2.5 bg-[#0e0e13] text-center flex flex-col items-center justify-center gap-1 max-w-[150px] mx-auto select-none my-1 animate-pulse">
                      <span className="text-3xl filter drop-shadow-[0_0_6px_rgba(0,212,255,0.7)]">
                        {msg.sticker.split('::')[0]}
                      </span>
                      <span className="text-[7.5px] font-black uppercase text-neon-cyan tracking-widest leading-none bg-neon-cyan/10 px-1.5 py-0.5 border border-neon-cyan/20 truncate max-w-full">
                        {msg.sticker.split('::')[1]}
                      </span>
                    </div>
                  )}

                  {msg.text && (
                    <div>{msg.text}</div>
                  )}
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
          {/* Invisible real file native trigger */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          {/* Attachment options overlay menu */}
          {showAttachmentMenu && (
            <div className="mb-3 p-2 border border-neon-cyan/50 bg-[#0E0E14] text-xs font-mono grid grid-cols-2 gap-2 animate-fade-in relative z-30">
              <button
                type="button"
                onClick={() => {
                  setShowStickerPicker(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
                className="flex items-center justify-center gap-2 p-2 border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors text-neon-cyan uppercase font-bold text-[9px] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">image</span> GỬI ẢNH (IMAGE)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStickerPicker(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*";
                    fileInputRef.current.click();
                  }
                }}
                className="flex items-center justify-center gap-2 p-2 border border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-neon-green uppercase font-bold text-[9px] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">attach_file</span> GỬI TỆP (FILE)
              </button>
            </div>
          )}

          {/* Sticker picker overlay view */}
          {showStickerPicker && (
            <div className="mb-3 p-3 border border-neon-magenta/50 bg-[#0E0E14] max-h-60 overflow-y-auto custom-scrollbar animate-fade-in relative z-30">
              <div className="flex justify-between items-center border-b border-neon-magenta/20 pb-1.5 mb-2">
                <span className="text-[9px] font-black uppercase text-neon-magenta tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neon-magenta rounded-full animate-pulse"></span>
                  BỘ SƯU TẬP NHÃN DÁN // STICKER PACKS:
                </span>
                <button 
                  type="button"
                  onClick={() => setShowStickerPicker(false)} 
                  className="text-on-surface-variant hover:text-white text-[9.5px] font-black uppercase cursor-pointer"
                >
                  [ ĐÓNG ]
                </button>
              </div>

              {/* Subtabs for sticker packages */}
              <div className="flex border-b border-white/10 mb-3 gap-2 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveStickerTab('messenger')}
                  className={`pb-1 px-2 uppercase font-black tracking-wider transition-all cursor-pointer ${
                    activeStickerTab === 'messenger' 
                      ? 'text-neon-cyan border-b-2 border-neon-cyan drop-shadow-[0_0_4px_rgba(0,212,255,0.4)]' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  💬 MESSENGER STICKERS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStickerTab('cyber')}
                  className={`pb-1 px-2 uppercase font-black tracking-wider transition-all cursor-pointer ${
                    activeStickerTab === 'cyber' 
                      ? 'text-neon-magenta border-b-2 border-neon-magenta drop-shadow-[0_0_4px_rgba(255,121,198,0.4)]' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  ⚡ CYBERPUNK LABELS
                </button>
              </div>

              {activeStickerTab === 'cyber' ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {CYBER_STICKERS.map((stk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendSticker(stk)}
                      className="flex flex-col items-center justify-center p-2.5 border border-white/5 hover:border-neon-magenta bg-black/40 hover:bg-neon-magenta/5 transition-all cursor-pointer group rounded-none"
                    >
                      <span className="text-2xl transition-transform group-hover:scale-110 filter drop-shadow-[0_0_4px_rgba(255,121,198,0.45)]">{stk.emoji}</span>
                      <span className="text-[7.5px] text-on-surface-variant group-hover:text-white mt-1 uppercase tracking-tighter truncate w-full text-center">
                        {stk.label.split(' // ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {MESSENGER_STICKERS.map((stk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendSticker(stk)}
                      className="flex flex-col items-center justify-center p-3 border border-white/5 hover:border-neon-cyan bg-black/40 hover:bg-neon-cyan/5 transition-all cursor-pointer group rounded-none"
                    >
                      <span className="text-3xl transition-transform group-hover:scale-115 filter drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]">{stk.emoji}</span>
                      <span className="text-[7px] text-on-surface-variant group-hover:text-white mt-1.5 uppercase font-medium tracking-normal truncate w-full text-center">
                        {stk.label.split(' // ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 border border-neon-green/60 p-1.5 bg-surface-container-lowest focus-within:border-neon-green transition-all">
            <button 
              type="button"
              onClick={() => {
                setShowAttachmentMenu(!showAttachmentMenu);
                setShowStickerPicker(false);
              }}
              className={`material-symbols-outlined p-2 cursor-pointer transition-colors ${
                showAttachmentMenu ? 'text-neon-cyan' : 'text-on-surface-variant hover:text-neon-green'
              }`}
              title="Quản lý tệp đính kèm"
            >
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
              <button 
                type="button"
                onClick={() => {
                  setShowStickerPicker(!showStickerPicker);
                  setShowAttachmentMenu(false);
                }}
                className={`material-symbols-outlined p-2 cursor-pointer transition-colors ${
                  showStickerPicker ? 'text-neon-magenta' : 'text-on-surface-variant hover:text-neon-green'
                }`}
                title="Chọn Nhãn dán Cyber"
              >
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

        {/* Calling Overlay interface */}
        {callType && callState !== 'idle' && (
          <div className="absolute inset-0 z-40 flex flex-col justify-between bg-[#040406]/98 text-white p-6 font-mono border-l border-border-default/30 animate-fade-in overflow-hidden">
            
            {/* Holographic scanner grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30"></div>
            
            {/* Header section of Call */}
            <div className="flex items-center justify-between pb-4 border-b border-border-default/40 z-20">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-neon-cyan animate-ping"></div>
                <span className="text-[9px] font-black text-neon-cyan tracking-widest uppercase">
                  MẬT ĐỘ KẾT NỐI: AN TOÀN // {callType === 'video' ? 'SECURE_VIDEO_LINK_v4.2' : 'SECURE_AUDIO_LINK_v1.0'}
                </span>
              </div>
              <div className="bg-black/80 px-2 py-1 border border-border-default text-[8px] text-on-surface-variant font-bold uppercase select-none flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-neon-cyan leading-none font-black">lock</span>
                MÃ HÓA AES-256 E2M
              </div>
            </div>

            {/* Stage Body */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-20 py-6">
              {callState === 'calling' && (
                <div className="text-center space-y-6 flex flex-col items-center justify-center max-w-md w-full">
                  <div className="relative flex items-center justify-center">
                    {permissionState === 'denied' ? (
                      /* Denied Warning Rings */
                      <>
                        <div className="absolute w-28 h-28 border border-hot-pink/30 rounded-full animate-bounce"></div>
                        <div className="w-16 h-16 border-2 border-hot-pink p-1 relative z-10 bg-black flex items-center justify-center text-hot-pink">
                          <span className="material-symbols-outlined text-2xl font-black">lock_open</span>
                        </div>
                      </>
                    ) : (
                      /* Pulsing normal ring animation */
                      <>
                        <div className="absolute w-28 h-28 border border-neon-cyan/40 rounded-full animate-ping [animation-duration:2s]"></div>
                        <div className="absolute w-20 h-20 border border-neon-cyan/60 rounded-full animate-ping [animation-duration:1.5s]"></div>
                        <div className="w-16 h-16 border-2 border-neon-cyan p-0.5 relative z-10 bg-black">
                          <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </>
                    )}
                  </div>

                  {permissionState === 'checking' && (
                    <div className="space-y-4">
                      <h3 className="text-[12px] font-black uppercase text-white tracking-widest flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-ping"></span>
                        ĐANG KIỂM TRA QUYỀN TRUY CẬP...
                      </h3>
                      <p className="text-[11px] text-[#00D4FF] font-bold uppercase tracking-widest animate-pulse">
                        SỬ TRẠNG: ĐANG YÊU CẦU THIẾT BỊ HOẠT ĐỘNG...
                      </p>
                      <div className="border border-border-default/45 bg-black/60 p-4 text-[9px] text-on-surface-variant flex flex-col gap-1.5 text-left uppercase">
                        <div className="flex items-center justify-between text-white border-b border-border-default/20 pb-1 mb-1 font-bold">
                          <span>KOL / THIẾT BỊ KẾT NỐI</span>
                          <span className="text-neon-cyan">TRA ĐIỀU TRA...</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>MICROPHONE (THU ÂM)</span>
                          <span className="text-neon-cyan animate-pulse">ĐANG TRUY VẤN BIỂU QUYẾT...</span>
                        </div>
                        {callType === 'video' && (
                          <div className="flex justify-between items-center">
                            <span>CAM / WEBCAM (GHI HÌNH)</span>
                            <span className="text-neon-cyan animate-pulse">ĐANG TRUY VẤN BIỂU QUYẾT...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {permissionState === 'denied' && (
                    <div className="space-y-4 max-w-sm">
                      <h3 className="text-[12px] font-black uppercase text-hot-pink tracking-widest">
                        🚨 LỖI: CHƯA ĐƯỢC PHÉP TRUY CẬP HỆ THỐNG
                      </h3>
                      <p className="text-[9px] text-white/90 bg-hot-pink/10 border border-hot-pink/30 px-3 py-2.5 leading-relaxed uppercase">
                        {permissionErrorDetail || "QUYỀN TRUY CẬP BỊ TỪ CHỐI. QUÝ KHÁCH VUI LÒNG CẤP QUYỀN CAMERA & MICRO TRÊN TRÌNH DUYỆT ĐỂ BẮT ĐẦU KÊNH TRUYỀN."}
                      </p>
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleStartCall(callType!)}
                          className="w-full py-2 bg-[#00FF88] hover:bg-[#00FF88]/90 text-black font-black uppercase text-[10px] tracking-widest cursor-pointer hover:shadow-[0_0_12px_rgba(0,255,136,0.4)] transition-all"
                        >
                          THỬ LẠI / YÊU CẦU LẠI QUYỀN TRUY CẬP
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setCallState('idle');
                            setCallType(null);
                          }}
                          className="w-full py-2 border border-border-default/60 hover:bg-white/5 text-white/70 font-bold uppercase text-[9px] tracking-wider cursor-pointer transition-all"
                        >
                          HỦY BỎ LIÊN LẠC
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {callState === 'connected' && (
                <div className="w-full h-full flex flex-col items-center justify-between relative">
                  {callType === 'video' ? (
                    /* VIDEO CALL STAGE */
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Counterpart screen component (remote stream fallback simulator) */}
                      <div className="w-full h-full border border-border-default bg-[#07070B] flex flex-col items-center justify-center overflow-hidden relative">
                        {isCamOff && false ? (
                          <div className="text-center space-y-2">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse">videocam_off</span>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CAMERA PHÍA ĐỐI TÁC TẮT</p>
                          </div>
                        ) : (
                          <>
                            {/* Scanning overlay text */}
                            <div className="absolute top-4 left-4 z-15 bg-black/75 px-2 py-1 border border-border-default text-[8px] font-extrabold text-neon-green tracking-widest uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-ping"></span>
                              TÍN HIỆU ĐẦU RA LIVE // HD 720P
                            </div>

                            <img 
                              src={activeThread.avatar} 
                              alt={activeThread.name} 
                              className="absolute w-32 h-32 object-cover border-2 border-neon-cyan border-dashed opacity-10 animate-spin [animation-duration:120s]" 
                              referrerPolicy="no-referrer"
                            />
                            {/* Matrix waterfall simulation in bg */}
                            <div className="absolute inset-0 opacity-[0.06] pointer-events-none text-[6px] text-neon-green/45 overflow-hidden leading-none select-none select-all-none whitespace-pre uppercase select-text-none font-mono tracking-widest">
                              {`01010101011011010101010110\n10101001010101010101110101\n11100010101011110101010101\n00101101010010101011010010`}
                            </div>
                            <div className="relative text-center z-10 space-y-3">
                              <div className="w-20 h-20 border border-neon-cyan p-0.5 mx-auto bg-black">
                                <img src={activeThread.avatar} alt="Remote partner face" className="w-full h-full object-cover scale-105" referrerPolicy="no-referrer" />
                              </div>
                              <p className="text-[10px] text-white font-extrabold uppercase tracking-widest">@{activeThread.name}</p>
                              <p className="text-[8px] text-on-surface-variant uppercase">ĐƯỜNG TRUYỀN VIDEO ĐỐI TÁC ỔN ĐỊNH</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Small floating webcam picture-in-picture stream */}
                      <div className="absolute bottom-4 right-4 w-28 h-20 sm:w-36 sm:h-24 border-2 border-[#00ff88] bg-black shadow-[0_0_15px_rgba(0,255,136,0.3)] overflow-hidden z-20 flex flex-col justify-between">
                        <div className="absolute top-1 left-1 z-25 bg-black/75 px-1 py-0.2 text-[6.5px] text-[#00ff88] uppercase tracking-tighter border border-border-default/45 font-bold">
                          CAM CỦA TÔI
                        </div>
                        {isCamOff ? (
                          <div className="w-full h-full flex items-center justify-center bg-[#07070C]">
                            <span className="material-symbols-outlined text-sm text-[#00ff88]">videocam_off</span>
                          </div>
                        ) : (
                          <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    /* VOICE CALL STAGE */
                    <div className="w-full max-w-md bg-[#07070B] border border-border-default p-8 flex flex-col items-center justify-center relative py-12">
                      <div className="relative mb-8 flex items-center justify-center">
                        <div className="absolute w-36 h-36 border border-[#ff0099]/25 rounded-full animate-pulse"></div>
                        <div className="absolute w-28 h-28 border border-neon-cyan/25 rounded-full animate-ping"></div>
                        <div className="w-20 h-20 border-2 border-[#00ff88] p-0.5 relative z-10 bg-black">
                          <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>

                      <div className="text-center space-y-2 mb-8">
                        <h4 className="text-[11px] text-white uppercase tracking-widest font-black">
                          KÊNH LIÊN LẠC ĐA ĐIỂM GIỌNG NÓI
                        </h4>
                        <p className="text-[9px] text-[#00ff88] uppercase font-bold tracking-widest">
                          @{activeThread.name} // OPERATOR
                        </p>
                      </div>

                      {/* Interactive CSS simulated wave spectrum equalizer bars */}
                      <div className="flex items-end justify-center gap-1.5 h-12 w-full max-w-xs bg-black/60 p-4 border border-border-default/30">
                        {[
                          { delay: '0.1s', h: 'h-4' }, { delay: '0.4s', h: 'h-8' }, { delay: '0.2s', h: 'h-10' }, 
                          { delay: '0.6s', h: 'h-5' }, { delay: '0.3s', h: 'h-9' }, { delay: '0.8s', h: 'h-3' }, 
                          { delay: '0.5s', h: 'h-11' }, { delay: '0.2s', h: 'h-7' }, { delay: '0.7s', h: 'h-6' },
                          { delay: '0.4s', h: 'h-10' }, { delay: '0.9s', h: 'h-4' }, { delay: '0.3s', h: 'h-8' }
                        ].map((bar, bi) => (
                          <div 
                            key={bi}
                            className={`w-1.5 bg-gradient-to-t from-neon-cyan to-[#00ff88] transition-all rounded-sm ${
                              isMicMuted ? 'h-1 opacity-20' : `${bar.h} animate-pulse`
                            }`}
                            style={{
                              animationDelay: isMicMuted ? '0s' : bar.delay,
                              animationDuration: isMicMuted ? '0s' : '0.6s'
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      <p className="text-[7.5px] text-on-surface-variant uppercase mt-3 tracking-wider font-bold">
                        {isMicMuted ? 'MICROPHONE ĐANG BỊ TẮT TIẾNG // MUTED' : 'BIỂU ĐỒ TẦN SỐ ÂM THANH HOẠT ĐỘNG'}
                      </p>
                    </div>
                  )}

                  {/* Operational connected duration tracking indicator */}
                  <div className="mt-4 flex flex-col items-center space-y-1">
                    <div className="text-[14px] font-black tracking-widest text-[#00ff88] font-mono font-bold">
                      {formatTimeInCall(callSeconds)}
                    </div>
                    <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">
                      ĐÃ THIẾT LẬP KẾT NỐI // ĐANG TRUYỀN PHÁT GÓI TIN
                    </span>
                  </div>
                </div>
              )}

              {callState === 'ended' && (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 border-2 border-hot-pink flex items-center justify-center bg-hot-pink/10 mx-auto">
                    <span className="material-symbols-outlined text-3xl text-hot-pink animate-pulse">call_end</span>
                  </div>
                  <h3 className="text-xs font-black uppercase text-hot-pink tracking-widest">CUỘC GỌI ĐÃ BỊ NGẮT</h3>
                  <p className="text-[9px] text-[#FF79C6] uppercase font-bold tracking-widest">
                    HỆ THỐNG ĐÃ XÁC NHẬN RỜI KÊNH // DISCONNECTED
                  </p>
                  <p className="text-[8px] text-on-surface-variant uppercase mt-2">
                    Lịch sử và nhật ký đàm thoại bảo mật vừa được lưu vào phòng chat.
                  </p>
                </div>
              )}
            </div>

            {/* Calling Bottom Tools controller buttons */}
            <div className="flex items-center justify-center gap-4 py-4 border-t border-border-default/45 z-20">
              {callState === 'connected' && (
                <>
                  {/* MIC Toggle */}
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`w-12 h-12 flex items-center justify-center border transition-all cursor-pointer ${
                      isMicMuted 
                        ? 'bg-hot-pink/20 border-hot-pink text-hot-pink hover:bg-hot-pink/40 shadow-[0_0_8px_rgba(255,121,198,0.25)]' 
                        : 'bg-white/5 border-border-default text-white hover:border-[#00ff88] hover:text-[#00ff88] hover:bg-white/10'
                    }`}
                    title={isMicMuted ? "Bật Microphone" : "Tắt Microphone"}
                  >
                    <span className="material-symbols-outlined text-sm">{isMicMuted ? 'mic_off' : 'mic'}</span>
                  </button>

                  {/* CAM Toggle for Video call */}
                  {callType === 'video' && (
                    <button
                      type="button"
                      onClick={toggleCam}
                      className={`w-12 h-12 flex items-center justify-center border transition-all cursor-pointer ${
                        isCamOff 
                          ? 'bg-hot-pink/20 border-hot-pink text-hot-pink hover:bg-hot-pink/40 shadow-[0_0_8px_rgba(255,121,198,0.25)]' 
                          : 'bg-white/5 border-border-default text-white hover:border-[#00ff88] hover:text-[#00ff88] hover:bg-white/10'
                      }`}
                      title={isCamOff ? "Bật Camera" : "Tắt Camera"}
                    >
                      <span className="material-symbols-outlined text-sm">{isCamOff ? 'videocam_off' : 'videocam'}</span>
                    </button>
                  )}
                </>
              )}

              {/* HANG-UP RED BUTTON */}
              {callState !== 'ended' && (
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-16 h-12 flex items-center justify-center bg-hot-pink text-black border border-hot-pink hover:bg-hot-pink/90 font-bold transition-all shadow-[0_0_15px_rgba(255,0,85,0.4)] cursor-pointer"
                  title="Gác máy / Ngắt kết nối"
                >
                  <span className="material-symbols-outlined text-md font-bold">call_end</span>
                </button>
              )}
            </div>

          </div>
        )}
      </section>

      {/* Info Metadata panel */}
      {showInfoPanel && (
        <aside id="chat-info-panel" className="absolute md:static right-0 top-0 bottom-0 z-30 w-full sm:w-80 md:w-80 border-l border-border-default bg-surface-container-lowest/95 flex flex-col p-5 font-mono text-xs overflow-y-auto custom-scrollbar animate-fade-in">
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
                    <div className="absolute right-0 mt-2 w-52 bg-[#0A0A0F] border border-border-default p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.85)] z-50 animate-fade-in font-mono">
                      <div className="text-[8px] text-on-surface-variant uppercase font-bold px-2 py-1 border-b border-border-default/30">Mời gia nhập kênh</div>
                      
                      {/* Search Input inside Dropdown */}
                      <div className="p-1 border-b border-border-default/20">
                        <input
                          type="text"
                          value={memberUidSearch}
                          onChange={(e) => setMemberUidSearch(e.target.value)}
                          placeholder="TÌM THEO UID HOẶC TÊN..."
                          className="w-full bg-black border border-border-default px-1.5 py-1 text-[8px] font-mono text-neon-green outline-none focus:border-neon-green transition-all"
                        />
                      </div>

                      <div className="max-h-32 overflow-y-auto custom-scrollbar pt-1">
                        {(() => {
                          const contactUids: Record<string, string> = {
                            'ZERO_COOL': 'c1',
                            'CRASH_OVERRIDE': 'c2',
                            'ACID_BURN': 'c3',
                            'LORD_NIKON': 'c4',
                            'VOID_WALKER': 'c5',
                            'X-STATIC': 'c6'
                          };
                          const filtered = availableToAdd.filter(contactName => {
                            const uid = contactUids[contactName] || '';
                            return contactName.toLowerCase().includes(memberUidSearch.toLowerCase()) ||
                                   uid.toLowerCase().includes(memberUidSearch.toLowerCase());
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="text-[7.5px] text-hot-pink/70 p-2 italic text-center">
                                {availableToAdd.length === 0 ? "Tất cả đã ở trong kênh" : "Không tìm thấy user"}
                              </div>
                            );
                          }

                          return filtered.map(contactName => {
                            const uid = contactUids[contactName] || '??';
                            return (
                              <button
                                type="button"
                                key={contactName}
                                onClick={() => {
                                  handleAddMember(activeThread.id, contactName);
                                  setMemberUidSearch('');
                                  setShowAddMemberDropdown(false);
                                }}
                                className="w-full text-left text-[9px] px-2 py-1.5 hover:bg-neon-green/10 text-white hover:text-neon-green uppercase font-semibold transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex flex-col text-left">
                                  <span>{contactName}</span>
                                  <span className="text-[7px] text-neon-cyan lowercase leading-none mt-0.5 opacity-80">UID: {uid}</span>
                                </div>
                                <span className="material-symbols-outlined text-[10px]">add</span>
                              </button>
                            );
                          });
                        })()}
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
