import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export default function SettingsView({ profile, onUpdateProfile }: SettingsViewProps) {
  const [fullName, setFullName] = useState<string>(profile.name);
  const [bio, setBio] = useState<string>(profile.bio);
  const [userId, setUserId] = useState<string>(profile.userId);
  const [currentPassword, setCurrentPassword] = useState<string>('********');
  const [newPassword, setNewPassword] = useState<string>('');
  const [mfa, setMfa] = useState<boolean>(true);
  const [terminalSound, setTerminalSound] = useState<boolean>(true);
  const [desktopNotif, setDesktopNotif] = useState<boolean>(false);
  
  const [devices, setDevices] = useState([
    { id: 'dev1', name: 'NeuralLink Workstation - 2024', loc: 'TP. Hồ Chí Minh, Việt Nam • Đang hoạt động', active: true },
    { id: 'dev2', name: 'CyberPhone X1', loc: 'Hà Nội, Việt Nam • Truy cập 2 giờ trước', active: false }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: fullName,
      bio: bio,
      userId: userId
    });
    triggerToast('CẬP NHẬT TÀI KHOẢN THÀNH CÔNG // ĐỒNG BỘ HOÀN TẤT');
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('ĐÃ THAY ĐỔI CẤU HÌNH BẢO MẬT // KHÓA ĐẦU RA AN TOÀN');
    setNewPassword('');
  };

  const handleDisconnectDevice = (id: string, name: string) => {
    setDevices(devices.filter(d => d.id !== id));
    triggerToast(`ĐÃ NGẮT KẾT NỐI THIẾT BỊ: ${name.toUpperCase()}`);
  };

  const changeAvatarSeed = () => {
    const randomSeeds = ['Aria', 'Kaelen', 'Ryder', 'Nyx', 'Rogue', 'Helix', 'Nexus'];
    const randomSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
    const newAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randomSeed}`;
    onUpdateProfile({
      ...profile,
      avatar: newAvatar
    });
    triggerToast('ĐÃ ĐỔI AVATAR PHÂN PHỐI LƯỚI');
  };

  const changeBannerSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const newBanner = `https://picsum.photos/id/${randomSeed}/800/400`;
    onUpdateProfile({
      ...profile,
      banner: newBanner
    });
    triggerToast('ĐÃ ĐỒI BANNER HÌNH NỀN HỆ THỐNG');
  };

  return (
    <div id="settings-view-scroller" className="h-[calc(100vh-140px)] overflow-y-auto p-6 md:p-8 custom-scrollbar relative bg-surface-dim/30">
      {/* Toast alert overlay */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-[#0E0E13] border-2 border-neon-green text-neon-green px-5 py-3 font-mono text-xs uppercase shadow-[0_0_20px_rgba(0,255,136,0.5)] z-[110] animate-bounce">
           [ {toastMessage} ]
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neon-green/20 pb-4">
          <div>
            <h2 className="font-sans text-2xl font-black text-white tracking-widest glow-text-green uppercase">
              THIẾT LẬP HỆ THỐNG // USER MODIFICATION
            </h2>
            <p className="font-mono text-[10px] text-neon-cyan uppercase mt-1">Trạng thái: Thống nhất danh tính hệ thống</p>
          </div>
          <div className="font-mono text-[9px] text-on-surface-variant text-right mt-2 md:mt-0 opacity-70">
            KỌC: 10.8231° N, 106.6297° E<br />
            GIỜ: {new Date().toISOString().slice(0, 19).replace('T', '_')}
          </div>
        </div>

        {/* Profile Media Header Block */}
        <div className="relative">
          {/* Cover Banner */}
          <div className="h-44 md:h-52 w-full bg-surface-container-high border border-border-default overflow-hidden relative group">
            <img 
              className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-65" 
              src={profile.banner} 
              alt="Cyberpunk grid banner"
              referrerPolicy="no-referrer"
            />
            <div 
              onClick={changeBannerSeed}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-neon-cyan text-3xl">add_a_photo</span>
                <span className="font-mono text-[9px] text-neon-cyan uppercase tracking-widest">ĐỔI BANNER (RANDOM)</span>
              </div>
            </div>
            <div className="scanline"></div>
          </div>

          {/* Profile Avatar circle */}
          <div className="absolute -bottom-10 left-8 md:left-12 group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-none border-2 border-neon-green bg-surface-card overflow-hidden relative shadow-glow-sm">
              <img 
                className="w-full h-full object-cover" 
                src={profile.avatar} 
                alt="Account profile operator avatar"
                referrerPolicy="no-referrer"
              />
              <div 
                onClick={changeAvatarSeed}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 cursor-pointer"
              >
                <span className="material-symbols-outlined text-neon-green text-2xl">photo_camera</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Forms vertical cascade */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left forms panel */}
          <div className="md:col-span-7 space-y-8">
            {/* TÀI KHOẢN (Account info summary form) */}
            <section className="bg-surface-card border border-border-default p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-neon-green/5 -rotate-45 translate-x-6 -translate-y-6"></div>
              <div className="flex items-center gap-2.5 mb-5 border-b border-border-default pb-2">
                <span className="material-symbols-outlined text-neon-green">badge</span>
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">TÀI KHOẢN</h3>
              </div>

              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">MÃ TÀI KHOẢN (USER_ID)</label>
                  <input 
                    type="text" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-black border border-border-default p-3 font-mono text-xs text-neon-green outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Họ và tên</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black border border-border-default p-3 font-mono text-xs text-white outline-none focus:border-neon-green input-glow transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Tiểu sử (Bio)</label>
                  <textarea 
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-black border border-border-default p-3 font-mono text-xs text-white outline-none focus:border-neon-green input-glow transition-all"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="border border-neon-green text-neon-green px-5 py-2 text-[10px] font-bold uppercase hover:bg-neon-green/10 transition-all tracking-wider cursor-pointer font-mono"
                  >
                    Cập nhật tài khoản
                  </button>
                </div>
              </form>
            </section>

            {/* BẢO MẬT (Security) */}
            <section className="bg-surface-card border border-border-default p-5 pb-6">
              <div className="flex items-center gap-2.5 mb-5 border-b border-border-default pb-2">
                <span className="material-symbols-outlined text-neon-green">security</span>
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">BẢO MẬT THÔNG TIN</h3>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-on-surface-variant uppercase font-bold">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-black border border-border-default p-3 font-mono text-xs text-white outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] text-on-surface-variant uppercase font-bold">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="MÃ MỚI AN TOÀN"
                      className="w-full bg-black border border-border-default p-3 font-mono text-xs text-white outline-none focus:border-neon-green" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 border border-border-default bg-black/60">
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Xác thực hai yếu tố (MFA)</h4>
                    <p className="text-[9px] text-on-surface-variant/70 mt-0.5">Tăng cường lớp bảo vệ sinh trắc học và mã OTP</p>
                  </div>
                  <div 
                    onClick={() => setMfa(!mfa)}
                    className="w-12 h-6 bg-surface-variant flex items-center p-0.5 cursor-pointer transition-colors relative"
                    style={{ backgroundColor: mfa ? 'rgba(0, 255, 136, 0.15)' : '#35343a' }}
                  >
                    <div 
                      className={`w-5 h-5 transition-transform duration-300 ${mfa ? 'translate-x-6 bg-neon-green' : 'bg-white'}`}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="border border-neon-cyan text-neon-cyan px-5 py-2 text-[10px] font-bold uppercase hover:bg-neon-cyan/10 transition-all font-mono"
                  >
                    Lưu cấu hình bảo mật
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right forms panel */}
          <div className="md:col-span-5 space-y-8">
            {/* THÔNG BÁO (Notifications UI toggles) */}
            <section className="bg-surface-card border border-border-default p-5">
              <div className="flex items-center gap-2.5 mb-5 border-b border-border-default pb-2">
                <span className="material-symbols-outlined text-neon-green">notifications_active</span>
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">THÔNG BÁO HỆ THỐNG</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 border border-border-default bg-surface-container hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">volume_up</span>
                    <span className="text-[11px] font-bold text-on-surface uppercase font-mono">Âm thanh Terminal</span>
                  </div>
                  <div 
                    onClick={() => setTerminalSound(!terminalSound)}
                    className="w-10 h-5 bg-surface-variant flex items-center p-0.5 cursor-pointer relative"
                  >
                    <div className={`w-4 h-4 ${terminalSound ? 'translate-x-5 bg-neon-green' : 'bg-white'} transition-transform`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 border border-border-default bg-surface-container hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">desktop_windows</span>
                    <span className="text-[11px] font-bold text-on-surface uppercase font-mono">Thông báo Desktop</span>
                  </div>
                  <div 
                    onClick={() => setDesktopNotif(!desktopNotif)}
                    className="w-10 h-5 bg-surface-variant flex items-center p-0.5 cursor-pointer relative"
                  >
                    <div className={`w-4 h-4 ${desktopNotif ? 'translate-x-5 bg-neon-green' : 'bg-white'} transition-transform`}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* THIẾT BỊ HOẠT ĐỘNG (Devices log management) */}
            <section className="bg-surface-card border border-border-default p-5">
              <div className="flex items-center gap-2.5 mb-5 border-b border-border-default pb-2">
                <span className="material-symbols-outlined text-neon-green">devices</span>
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">THIẾT BỊ HOẠT ĐỘNG</h3>
              </div>

              <div className="space-y-3">
                {devices.map(dev => (
                  <div 
                    key={dev.id} 
                    id={`device-${dev.id}`}
                    className="flex flex-col p-3 border border-border-default bg-black/50 hover:border-neon-cyan transition-all space-y-2.5"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`material-symbols-outlined ${dev.active ? 'text-neon-green' : 'text-on-surface-variant'} text-2xl`}>
                        {dev.name.includes('Phone') ? 'smartphone' : 'laptop'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-white uppercase truncate font-mono">{dev.name}</p>
                        <p className="text-[8px] text-on-surface-variant/80 font-mono font-semibold">{dev.loc}</p>
                      </div>
                    </div>
                    {dev.active ? (
                      <span className="text-[8px] tracking-wider text-center bg-neon-green/10 text-neon-green py-1 border border-neon-green/30 uppercase font-mono font-bold">
                        Thiết bị hiện tại
                      </span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleDisconnectDevice(dev.id, dev.name)}
                        className="w-full border border-hot-pink text-hot-pink py-1 text-[8px] font-bold uppercase transition-all hover:bg-hot-pink hover:text-black font-mono cursor-pointer"
                      >
                        Ngắt kết nối
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3.5 border-t border-border-default/40">
                <button 
                  onClick={() => {
                    setDevices(devices.filter(d => d.active));
                    triggerToast('ĐÃ ĐĂNG XUẤT KHỎI TOÀN BỘ CÁC THIẾT BỊ NGOẠI VI');
                  }}
                  className="w-full bg-error-container/10 border border-error text-error py-2.5 text-[9px] font-bold uppercase tracking-wider hover:bg-error-container/20 transition-all font-mono cursor-pointer"
                >
                  ĐĂNG XUẤT CÁC THIẾT BỊ KHÁC
                </button>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
