import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AuthViewProps {
  onLogin: (name: string) => void;
  onRegister: (name: string, email: string) => void;
}

export default function AuthView({ onLogin, onRegister }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !password) return;
    
    if (isLogin) {
      onLogin(name);
    } else {
      if (!email) return;
      if (password !== confirmPassword) {
        setError('Mã truy cập xác nhận không khớp');
        return;
      }
      onRegister(name, email);
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
            {isLogin ? 'Truy Cập Hệ Thống' : 'Khởi Tạo Tài Khoản'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
              Định Danh Người Dùng (Name)
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
              placeholder="Nhập tên..."
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] text-neon-cyan font-mono font-bold uppercase tracking-widest mb-1.5">
                Địa Chỉ Kênh Liệt Kê (Email)
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-border-default/40 p-3 text-sm text-white font-mono focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-on-surface-variant/40"
                placeholder="Nhập email..."
                required
              />
            </div>
          )}

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

          {!isLogin && (
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

          {error && (
            <div className="text-hot-pink text-xs font-mono font-bold uppercase tracking-wider text-center mt-2">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-neon-cyan/10 border border-neon-cyan text-neon-cyan py-3 mt-6 text-xs font-mono font-bold uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all cursor-pointer"
          >
            {isLogin ? 'Đăng Nhập' : 'Xác Nhận Đăng Ký'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-border-default/20 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-[10px] text-on-surface-variant hover:text-neon-green font-mono uppercase tracking-wider transition-all cursor-pointer"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
