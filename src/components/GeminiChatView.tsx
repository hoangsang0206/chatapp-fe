import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GeminiMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export default function GeminiChatView() {
  const [messages, setMessages] = useState<GeminiMessage[]>(() => {
    const saved = localStorage.getItem('cyber_gemini_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'welcome',
        sender: 'gemini',
        text: 'CẢNH BÁO: BẠN ĐÃ ĐĂNG NHẬP THÀNH CÔNG VÀO PHÂN KHU ĐẶC BIỆT GEMINI CODENAME AI.\n\nTổ hợp tri thức mạng được mã hóa và sẵn sàng hỗ trợ các truy vấn hệ thống vượt rào cản bức tường lửa. Gõ lệnh hoặc nhập văn bản truy vấn của bạn dưới đây.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cyber_gemini_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: GeminiMessage = {
      id: `gemini-msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Send chat request to our Express proxy endpoint
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage: userMsg.text,
          history: messages.slice(-12) // send last 12 messages for short context
        })
      });

      if (!response.ok) {
        throw new Error(`Mật độ phản hồi lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const geminiMsg: GeminiMessage = {
        id: `gemini-msg-${Date.now() + 1}`,
        sender: 'gemini',
        text: data.text || 'Giao thức rỗng. Không có dữ liệu đầu ra từ Gemini.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, geminiMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Mất đồng bộ kết nối với nhân Gemini AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Hành động này sẽ xóa toàn bộ nhật ký mật mã với Gemini AI. Tiếp tục?')) {
      const defaultState: GeminiMessage[] = [
        {
          id: 'welcome-reset',
          sender: 'gemini',
          text: 'HỆ THỐNG ĐÃ LÀM SẠCH VÀ REBOOT THÀNH CÔNG.\n\nĐường truyền an toàn mới đã thiết lập. Nhập câu hỏi để bắt đầu phiên giải mã mới.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(defaultState);
      setErrorMsg('');
    }
  };

  const quickPrompts = [
    { title: '🔒 Mã hóa AES-256', prompt: 'Giải thích giao thức mã hóa đối xứng AES-256 hoạt động thế nào trong mạng lưới kết nối bảo mật?' },
    { title: '🛡️ Quét Trojan', prompt: 'Làm thế nào để phát hiện và cô lập các đoạn code Trojan/Phần mềm gián điệp trong hạ tầng phân tán?' },
    { title: '💡 Ý tưởng Cyberpunk', prompt: 'Viết cho tôi một kịch bản ngắn mốc năm 2088 về việc hacker thâm nhập vào trí tuệ nhân tạo Gemini.' },
    { title: '🧬 Giải mã lỗi', prompt: 'Giúp tôi viết một function JavaScript mã hóa mật khẩu người dùng sử dụng thuật toán PBKDF2.' }
  ];

  return (
    <div id="gemini-chat-view-container" className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto border border-border-default bg-[#07070B] rounded-none overflow-hidden font-mono text-on-surface relative">
      {/* Decrypting Scanning scanline overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30"></div>
      
      {/* Gemini Header bar */}
      <header className="flex items-center justify-between p-4 border-b border-border-default/80 bg-surface-container bg-opacity-40 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-2.5 h-2.5 bg-neon-cyan block rounded-full animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 bg-neon-cyan block rounded-full"></span>
          </div>
          <div>
            <h2 className="text-xs font-black uppercase text-neon-cyan tracking-widest flex items-center gap-2">
              GEMINI CODENAME AI v3.5 // CONSOLE TERMINAL
            </h2>
            <p className="text-[8px] text-on-surface-variant/80 uppercase">STATUS: SECURE_MATRIX_CONNECTED // COMPILER: GEMINI-3.5-FLASH</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleClearHistory}
            className="px-2 py-1 border border-hot-pink/40 hover:border-hot-pink text-[9px] font-bold text-hot-pink hover:bg-hot-pink/10 transition-all uppercase tracking-wider cursor-pointer"
            title="Dọn sạch nhật ký giải mật"
          >
            DỌN SẠCH CHAT
          </button>
          
          <div className="hidden sm:flex bg-black/80 px-2 py-1 border border-border-default text-[8px] text-on-surface-variant font-black uppercase select-none items-center gap-1">
            <span className="material-symbols-outlined text-[10px] text-neon-cyan leading-none">lock</span>
            MÃ HÓA TLS v1.3
          </div>
        </div>
      </header>

      {/* Suggestion Quick prompts bar */}
      {messages.length <= 1 && (
        <div className="p-4 border-b border-border-default/40 bg-black/40 z-20">
          <p className="text-[9px] text-[#00FF88] font-black uppercase mb-2 tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></span>
            GỢI Ý TÁC VỤ INJECTION CHƯA KHAI THÁC:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp.prompt)}
                className="text-left p-2.5 border border-border-default/60 hover:border-neon-cyan bg-surface-card hover:bg-neon-cyan/5 transition-all text-[10px] leading-relaxed cursor-pointer group flex items-start gap-2"
              >
                <span className="text-[#00D4FF] group-hover:translate-x-0.5 transition-transform">❯</span>
                <span className="flex-1 text-on-surface-variant group-hover:text-white transition-colors">
                  <strong className="text-white block sm:inline mr-1">{qp.title}:</strong>
                  {qp.prompt.substring(0, 50)}...
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages viewport stage */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20 z-20 relative">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Message Identity Tag */}
                <span className={`text-[8px] font-bold tracking-widest mb-1 select-none ${isUser ? 'text-neon-green' : 'text-neon-cyan'}`}>
                  {isUser ? `[MẠNG NỘI BỘ // USER]` : `[XUNG ĐỐI / GEMINI_AI]`} // {msg.timestamp}
                </span>

                {/* Speech context card bubble */}
                <div 
                  className={`max-w-[85%] p-3 border text-[11px] leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'border-neon-green/45 bg-neon-green/[0.03] text-white shadow-[inset_0_0_10px_rgba(0,255,136,0.05)]' 
                      : 'border-neon-cyan/45 bg-neon-cyan/[0.02] text-on-surface shadow-[inset_0_0_10px_rgba(0,212,255,0.05)]'
                  }`}
                  style={{
                    boxShadow: isUser ? '0 0 10px rgba(0,255,136,0.02)' : '0 0 10px rgba(0,212,255,0.02)'
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading/Decryption Simulator */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-[8px] font-bold tracking-widest mb-1 text-neon-cyan animate-pulse">
              [TRUY VẤN LIÊN LẠC // GEMINI] // CODENAME DANG GIAI MA...
            </span>
            <div className="p-3 border border-neon-cyan/35 bg-neon-cyan/[0.01] text-[11px] text-neon-cyan/85 w-full flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-neon-cyan block animate-pulse"></span>
                <span className="w-1.5 h-4 bg-neon-cyan block animate-pulse [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-4 bg-neon-cyan block animate-pulse [animation-delay:0.3s]"></span>
              </div>
              <p className="animate-pulse font-bold tracking-wider uppercase text-[10px]">
                Đang biên dịch gói tin mật và giải mã thông điệp AI...
              </p>
            </div>
          </div>
        )}

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="p-3 border border-hot-pink bg-hot-pink/10 text-[10px] text-hot-pink uppercase tracking-wider font-bold">
            🚨 LỖI GIAO THỨC TRẢ VỀ: {errorMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Input controls panel */}
      <footer className="p-4 border-t border-border-default bg-surface-container bg-opacity-20 z-20">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1 flex items-center border border-border-default focus-within:border-neon-cyan hover:border-neon-green/60 transition-colors bg-black/60 px-3 py-2">
            <span className="text-neon-cyan text-xs font-bold mr-2 select-none">❯</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Vui lòng đợi kết thúc giải mã kết nối..." : "Nhập câu hỏi hoặc yêu cầu hệ thống..."}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-[11px] text-white font-mono placeholder:text-on-surface-variant/40"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all ${
              !input.trim() || isLoading
                ? 'border border-border-default/40 bg-[#0F0F16] text-on-surface-variant/40 cursor-not-allowed shadow-none'
                : 'bg-neon-cyan text-black border border-neon-cyan'
            }`}
          >
            GỬI
          </button>
        </form>
        
        <div className="flex justify-between items-center text-[7.5px] text-on-surface-variant/50 uppercase mt-3 font-mono">
          <span>PORT: 3000 // BAO MAT: KINH MAT AES-256</span>
          <span>GEMINI CORE ONLINE TERMINAL // VERSION 3.5-FLASH</span>
        </div>
      </footer>
    </div>
  );
}
