import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AuthViewProps {
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string, userId: string, avatar: string, cover: string) => void;
}

export default function AuthView({ onLogin, onRegister }: AuthViewProps) {
  const [phase, setPhase] = useState<'login' | 'register' | 'setup'>('login');
  
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Setup fields
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState('');
  const [cover, setCover] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh cho avatar');
        return;
      }
      setAvatar(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh cho ảnh bìa');
        return;
      }
      setCover(URL.createObjectURL(file));
      setError('');
    }
  };
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phase === 'login') {
      if (!email || !password) return;
      onLogin(email);
    } else if (phase === 'register') {
      if (!email || !password) return;
      if (password !== confirmPassword) {
        setError('Mã truy cập xác nhận không khớp');
        return;
      }
      setPhase('setup');
    } else if (phase === 'setup') {
      if (!name || !userId) {
        setError('Họ tên và User ID là bắt buộc');
        return;
      }
      const defaultAvatar = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + userId;
      const defaultCover = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
      onRegister(name, email, userId, avatar || defaultAvatar, cover || defaultCover);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-lowest border border-[#2A2A3A] shadow-[0_0_30px_rgba(0,0,0,0.85)] p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-8 h-8 md:w-32 md:h-32 bg-neon-green/5 blur-3xl -z-10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-8 h-8 md:w-32 md:h-32 bg-neon-cyan/5 blur-3xl -z-10 rounded-full"></div>

        <div className="flex flex-col items-center mb-8">
          <img 
            alt="CYBER_HUB Logo" 
            className="w-16 h-16 object-contain mb-4" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMM_9hCXx8LmVtQvXo2cCAySjAuFzAR6Apv0dQVRjaCrYqdhMiNmb8vnF5zUhkv_9IQlJotuScGYBar5Kx2cmwswIYtdVd6bxR5_1QnZSGHX-UtwLl3VqNjo8sGZEkFPjhQuSGeJmBm2D5K8CW4XW2Bq-W_vpDA84ZPCge2hEcGapD_wbpHEXcJxbrH0oQU-0qiYql8ptmylwnh3769LSt3iKYYEWZD0UHzT-PpfhRlkoQRBWY4Jj-6m2yS1cRf72ayZhv98UqfFM"
          />
          <h2 className="text-xl font-mono font-black text-white uppercase tracking-widest text-center">
            {phase === 'login' && 'Truy Cập Hệ Thống'}
            {phase === 'register' && 'Khởi Tạo Tài Khoản'}
            {phase === 'setup' && 'Thiết Lập Hồ Sơ'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(phase === 'login' || phase === 'register') && (
            <>
              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Địa Chỉ Kênh Liệt Kê (Gmail)
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                  placeholder="Nhập địa chỉ gmail..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Mã Truy Cập An Toàn (Password)
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                  placeholder="Nhập mã bảo mật..."
                  required
                />
              </div>
            </>
          )}

          {phase === 'register' && (
            <div>
              <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                Xác Nhận Mã (Confirm Password)
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                placeholder="Nhập lại mã bảo mật..."
                required
              />
            </div>
          )}

          {phase === 'setup' && (
            <>
              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Họ Tên Đầy Đủ *
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                  placeholder="Nhập họ và tên..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Định Danh Người Dùng (User ID) *
                </label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\s+/g, ''))}
                  className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                  placeholder="Ví dụ: UID_404..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Ảnh Đại Diện (Không bắt buộc)
                </label>
                <div className="flex items-center gap-4">
                  {avatar && (
                    <div className="w-12 h-12 border border-neon-cyan">
                      <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-neon-cyan font-mono hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-colors flex items-center justify-center gap-2"
                      title="Tải lên ảnh đại diện"
                    >
                      <span className="material-symbols-outlined text-lg">upload</span>
                      <span>Chọn ảnh đại diện</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                  Ảnh Bìa (Không bắt buộc)
                </label>
                <div className="flex flex-col gap-3">
                  {cover && (
                    <div className="w-full h-24 border border-neon-cyan relative">
                      <img src={cover} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input 
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-neon-cyan font-mono hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-colors flex items-center justify-center gap-2"
                    title="Tải lên ảnh bìa"
                  >
                    <span className="material-symbols-outlined text-lg">upload</span>
                    <span>Chọn ảnh bìa</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="text-hot-pink text-xs font-mono font-bold uppercase tracking-wider text-center mt-2">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-neon-cyan/10 border border-neon-cyan text-neon-cyan py-3 mt-6 text-xs font-mono font-bold uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all cursor-pointer"
          >
            {phase === 'login' && 'Đăng Nhập'}
            {phase === 'register' && 'Tiếp Tục'}
            {phase === 'setup' && 'Hoàn Tất'}
          </button>
        </form>

        {phase !== 'setup' && (
          <div className="mt-8 pt-4 border-t border-border-default/20 text-center">
            <button 
              onClick={() => {
                setPhase(phase === 'login' ? 'register' : 'login');
                setError('');
              }}
              type="button"
              className="text-[10px] text-on-surface-variant hover:text-neon-green font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              {phase === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
