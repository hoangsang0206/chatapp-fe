import React, { useState, useRef } from 'react';
import { CalendarTodo } from '../types';

interface CalendarTodoViewProps {
  todos: CalendarTodo[];
  onAddTodo: (newTodo: CalendarTodo) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
}

export default function CalendarTodoView({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo
}: CalendarTodoViewProps) {
  // Current month of viewing
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 4, 25)); // May 2026 as default corresponding to system time
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-05-25');
  
  // Filtering & input state
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Todo Form Data
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('CÔNG VIỆC');
  const [newTagsString, setNewTagsString] = useState<string>('');
  const [newAttachments, setNewAttachments] = useState<{name: string, url: string, type: 'file' | 'image', size: string}[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeAttachmentPreview, setActiveAttachmentPreview] = useState<{name: string, url: string, type: 'file' | 'image'} | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger Toast Alert
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    // Current time according to system time: May 2026
    const today = new Date(2026, 4, 25);
    setCurrentDate(today);
    setSelectedDateStr('2026-05-25');
    triggerToast('RETURNED TO BASELINE // 2026-05-25');
  };

  // Calendar Math calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Total days in the current viewing month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // First day of the week for day 1 of the month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  
  // Fillers for preceding month's tail days
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push({
      dayNum: prevMonthTotalDays - i,
      monthType: 'prev' as const,
      dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(prevMonthTotalDays - i).padStart(2, '0')}`
    });
  }

  // Active month's days
  const currentMonthDays = [];
  for (let i = 1; i <= totalDays; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    currentMonthDays.push({
      dayNum: i,
      monthType: 'current' as const,
      dateString: `${year}-${monthStr}-${dayStr}`
    });
  }

  // Fillers for next month's starting days so grid finishes neatly (multiple of 7)
  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = [];
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    nextMonthDays.push({
      dayNum: i,
      monthType: 'next' as const,
      dateString: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  const allGridDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Helper names
  const vietnameseMonths = [
    'THÁNG MỘT', 'THÁNG HAI', 'THÁNG BA', 'THÁNG TƯ', 'THÁNG NĂM', 'THÁNG SÁU',
    'THÁNG BẢY', 'THÁNG TÁM', 'THÁNG CHÍN', 'THÁNG MƯỜI', 'THÁNG MƯỜI MỘT', 'THÁNG MƯỜI HAI'
  ];
  const daysOfWeekLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      const fileType: 'image' | 'file' = file.type.startsWith('image/') ? 'image' : 'file';

      reader.onload = () => {
        const dataUrl = reader.result as string;
        setNewAttachments(prev => [
          ...prev,
          {
            name: file.name,
            url: dataUrl,
            type: fileType,
            size: sizeStr
          }
        ]);
        triggerToast(`ĐÃ ĐÍNH KÈM TỆP: ${file.name.toUpperCase()}`);
      };

      reader.readAsDataURL(file);
    });

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setNewAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit new task
  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      triggerToast('LỖI // TIÊU ĐỀ KHÔNG ĐƯỢC ĐỂ TRỐNG');
      return;
    }

    const tags = newTagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag !== '#');

    const newTodoObj: CalendarTodo = {
      id: `todo-${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
      dateStr: selectedDateStr,
      priority: newPriority,
      time: newTime.trim() || undefined,
      description: newDescription.trim() || undefined,
      category: newCategory,
      tags: tags.length > 0 ? tags.map(t => t.startsWith('#') ? t : `#${t}`) : undefined,
      attachments: newAttachments.length > 0 ? newAttachments : undefined
    };

    onAddTodo(newTodoObj);
    triggerToast(`ĐÃ LÊN LỊCH CHẤP HÀNH: ${newTodoObj.title.toUpperCase()}`);
    
    // Clear state
    setNewTitle('');
    setNewTime('');
    setNewPriority('medium');
    setNewDescription('');
    setNewCategory('CÔNG VIỆC');
    setNewTagsString('');
    setNewAttachments([]);
    setIsFormOpen(false);
  };

  // Get todos strictly corresponding to current selectedDateStr
  const localTodos = todos.filter(t => t.dateStr === selectedDateStr);

  // Apply filters
  const filteredTodos = localTodos.filter(t => {
    // Stage 1: Status Filter
    if (filter === 'pending' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;

    // Stage 2: Category Filter
    if (categoryFilter !== 'all') {
      const todoCat = t.category || 'CÔNG VIỆC';
      if (todoCat !== categoryFilter) return false;
    }
    return true;
  });

  // Render priority bullet
  const getPriorityColorStyle = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-hot-pink border-hot-pink text-hot-pink';
      case 'medium': return 'bg-neon-cyan border-neon-cyan text-neon-cyan';
      case 'low': return 'bg-neon-green border-neon-green text-neon-green';
    }
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'KHẨN CẤP';
      case 'medium': return 'VỪA PHẢI';
      case 'low': return 'THẤP';
    }
  };

  const formatHumanDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `Ngày ${parts[2]} Tháng ${parts[1]}, ${parts[0]}`;
  };

  return (
    <div id="calendar-view-viewport" className="grid grid-cols-12 gap-6 animate-fade-in pb-12">
      
      {/* LEFT SECTION: HIGHLY POLISHED INTERACTIVE CALENDAR GRID */}
      <div id="calendar-left-section" className="col-span-12 lg:col-span-7 flex flex-col gap-4">
        
        {/* Calendar Card Box */}
        <div className="bg-surface-card border border-border-default p-5 flex flex-col relative overflow-hidden">
          
          {/* Subtle cyber decorations */}
          <div className="absolute right-0 top-0 h-16 w-32 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.1),transparent)] pointer-events-none"></div>

          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-default/45 mb-4 gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neon-cyan text-xl animate-pulse">calendar_month</span>
              <div className="font-mono">
                <h2 className="text-[14px] font-black tracking-widest text-white uppercase">
                  {vietnameseMonths[month]} {year}
                </h2>
                <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider mt-0.5">
                  LẬP LỊCH THỜI GIAN THỰC // CHUẨN TERMINAL
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 font-mono">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center border border-border-default bg-black/40 hover:bg-white/5 text-white hover:text-neon-cyan transition-all cursor-pointer"
                title="Tháng trước"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button 
                onClick={handleGoToToday}
                className="px-3 h-8 border border-neon-cyan/50 bg-neon-cyan/5 hover:bg-neon-cyan/20 text-neon-cyan text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                HÔM NAY (25)
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center border border-border-default bg-black/40 hover:bg-white/5 text-white hover:text-neon-cyan transition-all cursor-pointer"
                title="Tháng sau"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Days of Week Labels row */}
          <div className="grid grid-cols-7 text-center font-mono py-1 mb-2 border-b border-border-default/20 bg-black/20">
            {daysOfWeekLabels.map((lbl, idx) => (
              <span 
                key={lbl} 
                className={`text-[10px] font-bold uppercase transition-all py-1.5 ${
                  idx === 0 
                    ? 'text-hot-pink' 
                    : idx === 6 
                    ? 'text-neon-cyan' 
                    : 'text-on-surface-variant'
                }`}
              >
                {lbl}
              </span>
            ))}
          </div>

          {/* Calendar Day grid */}
          <div className="grid grid-cols-7 gap-1.5 font-mono select-none">
            {allGridDays.map((day, ix) => {
              const isSelected = day.dateString === selectedDateStr;
              const isToday = day.dateString === '2026-05-25'; // System simulation standard date
              const isCurrentMonth = day.monthType === 'current';
              
              // Find todos of this cell
              const dayTodos = todos.filter(t => t.dateStr === day.dateString);
              const pendingCount = dayTodos.filter(t => !t.completed).length;
              const completedCount = dayTodos.filter(t => t.completed).length;

              return (
                <div
                  key={`${day.dateString}-${ix}`}
                  onClick={() => setSelectedDateStr(day.dateString)}
                  className={`aspect-square p-1 border flex flex-col justify-between transition-all duration-300 relative cursor-pointer group ${
                    isSelected
                      ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_12px_rgba(0,212,255,0.2)] z-10'
                      : isToday
                      ? 'border-neon-green/80 bg-neon-green/5'
                      : isCurrentMonth
                      ? 'border-border-default/50 bg-black/30 hover:border-neon-cyan/55 hover:bg-white/5'
                      : 'border-border-default/20 bg-transparent text-white/20 hover:border-border-default/40'
                  }`}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black ${
                      isToday && !isSelected
                        ? 'text-neon-green font-black underline underline-offset-2'
                        : isSelected
                        ? 'text-neon-cyan font-black'
                        : !isCurrentMonth
                        ? 'text-white/20'
                        : 'text-white'
                    }`}>
                      {day.dayNum}
                    </span>

                    {/* Pending tasks count indicator */}
                    {pendingCount > 0 && (
                      <span className="w-1.5 h-1.5 bg-hot-pink rounded-none shadow-[0_0_4px_#FF0055]"></span>
                    )}
                  </div>

                  {/* Task Mini Previews (only visible on large screens or cell content space) */}
                  <div className="hidden sm:flex flex-col gap-0.5 mt-1 overflow-hidden pointer-events-none select-none max-h-8">
                    {dayTodos.slice(0, 2).map((t, tid) => (
                      <div 
                        key={t.id} 
                        className={`text-[6.5px] truncate px-1 rounded-sm border-l uppercase font-bold py-0.2 select-none pointer-events-none ${
                          t.completed 
                            ? 'bg-neutral-900/60 text-white/35 border-neutral-600 line-through' 
                            : t.priority === 'high'
                            ? 'bg-hot-pink/10 text-hot-pink border-hot-pink'
                            : t.priority === 'medium'
                            ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan'
                            : 'bg-neon-green/10 text-neon-green border-neon-green'
                        }`}
                      >
                        {t.time ? `${t.time} ` : ''}{t.title}
                      </div>
                    ))}
                    {dayTodos.length > 2 && (
                      <div className="text-[6px] text-on-surface-variant font-bold uppercase tracking-tighter">
                        +{dayTodos.length - 2} NHIỆM VỤ
                      </div>
                    )}
                  </div>

                  {/* Tiny count dots for mobile layout view */}
                  <div className="flex sm:hidden justify-center gap-0.5 mt-auto">
                    {dayTodos.slice(0, 3).map((t) => (
                      <span 
                        key={t.id} 
                        className={`w-1 h-1 rounded-full ${
                          t.completed 
                            ? 'bg-neutral-600' 
                            : t.priority === 'high' 
                            ? 'bg-hot-pink' 
                            : t.priority === 'medium' 
                            ? 'bg-neon-cyan' 
                            : 'bg-neon-green'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Cell outer corner scanlines on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-neon-cyan/25 pointer-events-none transition-colors"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Box Card */}
        <div className="bg-black/45 border border-border-default p-4 font-mono">
          <p className="text-[8.5px] text-on-surface-variant font-bold uppercase mb-2">CHÚ GIẢI THÔNG TIN / PRIORITY LEGENDS:</p>
          <div className="flex flex-wrap gap-4 text-[8px] font-bold uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-hot-pink border border-black shadow-[0_0_4px_rgba(255,0,85,0.4)]"></span>
              <span className="text-white">Ưu tiên cao (Khẩn cấp)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-neon-cyan border border-black shadow-[0_0_4px_rgba(0,212,255,0.4)]"></span>
              <span className="text-white">Ưu tiên vừa</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 bg-neon-green border border-black shadow-[0_0_4px_rgba(0,255,136,0.4)]"></span>
              <span className="text-white">Ưu tiên thấp</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
              <span className="text-on-surface-variant">Đã hoàn thành</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SECTION: DETAILED TODO LISTS & TASK DISPATCHER */}
      <div id="calendar-right-section" className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        
        {/* Active Day Task Management */}
        <div className="bg-surface-card border border-border-default p-5 flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Header Title with date */}
            <div className="flex flex-col pb-3 border-b border-border-default/45 mb-4 font-mono">
              <span className="text-[9px] text-[#00ff88] tracking-widest uppercase font-bold">LỊCH TRÌNH VÀ NHIỆM VỤ</span>
              <h3 className="text-[13px] font-black text-white uppercase tracking-wider mt-1">
                {formatHumanDate(selectedDateStr)}
              </h3>
              <p className="text-[8px] text-on-surface-variant uppercase mt-0.5">
                Ký hiệu: Node_{selectedDateStr.replace(/-/g, '_')}
              </p>
            </div>

            {/* Filters Row */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-default/20">
              <div className="flex gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider transition-all border cursor-pointer ${
                    filter === 'all'
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5 shadow-[0_0_6px_rgba(0,212,255,0.2)]'
                      : 'border-transparent text-on-surface-variant hover:text-white'
                  }`}
                >
                  TẤT CẢ ({localTodos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider transition-all border cursor-pointer ${
                    filter === 'pending'
                      ? 'border-hot-pink text-hot-pink bg-hot-pink/5 shadow-[0_0_6px_rgba(255,0,85,0.15)]'
                      : 'border-transparent text-on-surface-variant hover:text-white'
                  }`}
                >
                  CHƯA XONG ({localTodos.filter(t => !t.completed).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('completed')}
                  className={`text-[9.5px] font-bold px-2 py-1 uppercase tracking-wider transition-all border cursor-pointer ${
                    filter === 'completed'
                      ? 'border-neon-green text-neon-green bg-neon-green/5 shadow-[0_0_6px_rgba(0,255,136,0.15)]'
                      : 'border-transparent text-on-surface-variant hover:text-white'
                  }`}
                >
                  HOÀN TẤT ({localTodos.filter(t => t.completed).length})
                </button>
              </div>

              {/* Add Task Button Trigger Toggle */}
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className={`py-1 px-2.5 font-mono text-[9px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isFormOpen 
                    ? 'border-hot-pink text-hot-pink bg-hot-pink/5' 
                    : 'border-neon-cyan text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_8px_rgba(0,212,255,0.35)]'
                }`}
              >
                <span className="material-symbols-outlined text-[11px] font-bold">
                  {isFormOpen ? 'close' : 'add'}
                </span>
                {isFormOpen ? 'HỦY BỎ' : 'THÊM VIỆC'}
              </button>
            </div>

            {/* Category Filters Row */}
            <div className="flex flex-wrap items-center gap-1.5 pb-3.5 mb-3.5 border-b border-border-default/20 font-mono">
              <span className="text-[7.5px] text-on-surface-variant font-bold uppercase tracking-wider mr-1">Danh mục:</span>
              {['all', 'CÔNG VIỆC', 'HỌC TẬP', 'CÁ NHÂN', 'BẢO MẬT', 'KHÁC'].map((cat) => {
                const count = cat === 'all' 
                  ? localTodos.length 
                  : localTodos.filter(t => (t.category || 'CÔNG VIỆC') === cat).length;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[8.5px] font-bold px-2 py-0.5 uppercase tracking-tight transition-all border cursor-pointer ${
                      categoryFilter === cat
                        ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5 shadow-[0_0_5px_rgba(0,212,255,0.15)]'
                        : 'border-transparent text-on-surface-variant/60 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'TẤT CẢ' : cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Inline Add Todo Form Option */}
            {isFormOpen && (
              <form onSubmit={handleCreateTodo} className="bg-black/85 border border-neon-cyan/40 p-4 mb-4 space-y-3.5 font-mono animate-fade-in relative">
                <div className="absolute right-2 top-2 text-[6.5px] text-neon-cyan/50 font-mono font-bold tracking-widest">INIT_SCHEDULER_V3</div>
                
                <div className="space-y-1">
                  <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Tên nhiệm vụ / Công việc *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.G. QUÉT MẬT MÃ TRUY CẬP NODE..."
                    className="w-full bg-black border border-border-default px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Thời gian (Giờ)</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-black border border-border-default px-3 py-2 text-xs text-white outline-none focus:border-neon-cyan font-mono"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Mức độ ưu tiên</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full bg-black border border-border-default px-2.5 py-2 text-xs text-white outline-none focus:border-neon-cyan font-mono"
                    >
                      <option value="high">KHẨN CẤP / CAO</option>
                      <option value="medium">BÌNH THƯỜNG / VỪA</option>
                      <option value="low">TÙY CHỌN / THẤP</option>
                    </select>
                  </div>
                </div>

                {/* Categories & Tags Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Danh mục / Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-black border border-border-default px-2.5 py-2 text-[11px] text-white outline-none focus:border-neon-cyan font-mono"
                    >
                      <option value="CÔNG VIỆC">📂 CÔNG VIỆC // WORK</option>
                      <option value="HỌC TẬP">📂 HỌC TẬP // STUDY</option>
                      <option value="CÁ NHÂN">📂 CÁ NHÂN // PERSONAL</option>
                      <option value="BẢO MẬT">📂 BẢO MẬT // SECURITY</option>
                      <option value="KHÁC">📂 KHÁC // OTHER</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Thẻ / Tag (cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={newTagsString}
                      onChange={(e) => setNewTagsString(e.target.value)}
                      placeholder="E.g. database, backup, api"
                      className="w-full bg-black border border-border-default px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-neon-cyan font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Mô tả cụ thể nhiệm vụ</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="NHẬP CHI TIẾT CÁC BƯỚC CẦN LÀM..."
                    rows={2}
                    className="w-full bg-black border border-border-default px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-neon-cyan font-mono resize-none"
                  />
                </div>

                {/* Attachments Section Inside Form */}
                <div className="space-y-1.5 border-t border-border-default/20 pt-2 text-left">
                  <label className="block text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">
                    Đính kèm tài liệu / Attachments ({newAttachments.length})
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-border-default hover:border-neon-cyan/80 bg-black/45 p-2 text-center cursor-pointer hover:bg-black transition-all flex flex-col items-center justify-center py-3"
                  >
                    <span className="material-symbols-outlined text-[15px] text-neon-cyan animate-pulse">cloud_upload</span>
                    <span className="text-[8px] text-white uppercase font-bold tracking-wider mt-1">Click để đính kèm tệp tin tài liệu/ảnh</span>
                    <span className="text-[6.5px] text-on-surface-variant uppercase mt-0.5">LƯU TRỮ OFFLINE TIÊU CHUẨN</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleAttachmentUpload}
                    className="hidden"
                  />

                  {newAttachments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1.5 bg-black/60 border border-border-default/45">
                      {newAttachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-black border border-border-default/50 p-1 text-[8px] font-mono">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="material-symbols-outlined text-[10px] text-neon-cyan">
                              {att.type === 'image' ? 'image' : 'description'}
                            </span>
                            <span className="text-white truncate max-w-[80px]" title={att.name}>{att.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAttachment(idx);
                            }}
                            className="text-hot-pink hover:bg-hot-pink/10 px-1 font-bold rounded cursor-pointer shrink-0 uppercase text-[8px]"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-neon-cyan hover:bg-neon-cyan/85 text-black font-black uppercase text-[10px] tracking-widest cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
                >
                  XÁC NHẬN LÊN LỊCH TRÌNH
                </button>
              </form>
            )}

            {/* Master Task List Scroller */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1.5">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => {
                  const priorityColor = getPriorityColorStyle(todo.priority);
                  return (
                    <div 
                      key={todo.id}
                      className={`border p-3.5 flex items-start gap-3 transition-all relative group ${
                        todo.completed 
                          ? 'border-border-default/35 bg-black/5' 
                          : 'border-border-default bg-black/60 hover:border-neon-cyan/50'
                      }`}
                    >
                      {/* Interactive Square Checkbox */}
                      <button
                        type="button"
                        onClick={() => onToggleTodo(todo.id)}
                        className={`w-5 h-5 flex items-center justify-center border font-bold transition-all cursor-pointer shrink-0 mt-0.5 ${
                          todo.completed 
                            ? 'border-neon-green text-neon-green bg-neon-green/10 shadow-[0_0_5px_rgba(0,255,136,0.1)]' 
                            : 'border-border-default hover:border-white text-transparent'
                        }`}
                        title={todo.completed ? "Đánh dấu chưa hoàn tất" : "Đánh dấu hoàn tất"}
                      >
                        {todo.completed && <span className="material-symbols-outlined text-[13px] font-black">check</span>}
                      </button>

                      {/* Task Info Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          {/* Category Badge */}
                          {(() => {
                            const cat = todo.category || 'CÔNG VIỆC';
                            let helperColor = 'border-neon-cyan/35 text-neon-cyan bg-neon-cyan/5';
                            if (cat === 'HỌC TẬP') helperColor = 'border-neon-green/35 text-neon-green bg-neon-green/5';
                            if (cat === 'CÁ NHÂN') helperColor = 'border-yellow-400/35 text-yellow-400 bg-yellow-400/5';
                            if (cat === 'BẢO MẬT') helperColor = 'border-hot-pink/35 text-hot-pink bg-hot-pink/5';
                            if (cat === 'KHÁC') helperColor = 'border-white/25 text-white/70 bg-white/5';
                            
                            return (
                              <span className={`text-[7.5px] font-black px-1.5 py-0.2 border uppercase tracking-wider font-mono shrink-0 ${
                                todo.completed ? 'border-neutral-700/40 text-neutral-500 bg-transparent' : helperColor
                              }`}>
                                📂 {cat}
                              </span>
                            );
                          })()}

                          {/* Time Stamp badge if any */}
                          {todo.time && (
                            <span className="bg-black border border-border-default/80 text-[8.5px] text-neon-cyan px-1.5 py-0.2 font-mono uppercase font-black tracking-tight shrink-0">
                              🕒 {todo.time}
                            </span>
                          )}

                          {/* Priority badge */}
                          <span className={`text-[7px] font-black px-1 py-0 border leading-none font-mono shrink-0 ${
                            todo.completed 
                              ? 'border-neutral-600/40 text-neutral-500 bg-transparent' 
                              : todo.priority === 'high'
                              ? 'border-hot-pink/35 text-hot-pink bg-hot-pink/5'
                              : todo.priority === 'medium'
                              ? 'border-neon-cyan/35 text-neon-cyan bg-neon-cyan/5'
                              : 'border-neon-green/35 text-neon-green bg-neon-green/5'
                          }`}>
                            {getPriorityLabel(todo.priority)}
                          </span>
                        </div>

                        {/* Title text */}
                        <h4 className={`text-xs font-bold font-mono tracking-wide break-words uppercase ${
                          todo.completed ? 'text-white/40 line-through' : 'text-white'
                        }`}>
                          {todo.title}
                        </h4>

                        {/* Tags display */}
                        {todo.tags && todo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {todo.tags.map((tag) => (
                              <span 
                                key={tag} 
                                className={`text-[7.5px] font-mono font-semibold tracking-tight px-1.5 py-0.2 select-none border transition-colors ${
                                  todo.completed 
                                    ? 'border-neutral-800 text-neutral-600' 
                                    : 'border-neon-cyan/20 text-neon-cyan/85 bg-neon-cyan/5 hover:bg-neon-cyan/10'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Description text */}
                        {todo.description && (
                          <p className={`text-[10px] mt-2 leading-relaxed font-mono ${
                            todo.completed ? 'text-white/20' : 'text-on-surface-variant'
                          }`}>
                            {todo.description}
                          </p>
                        )}

                        {/* Attachments display */}
                        {todo.attachments && todo.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-border-default/20 space-y-1.5">
                            <span className="text-[7.5px] font-mono text-on-surface-variant uppercase font-bold tracking-wider block">TỆP ĐÍNH KÈM ({todo.attachments.length}):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {todo.attachments.map((att, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (att.type === 'image') {
                                      setActiveAttachmentPreview(att);
                                    } else {
                                      // Trigger file download
                                      const link = document.createElement('a');
                                      link.href = att.url;
                                      link.download = att.name;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      triggerToast(`TẢI XUỐNG: ${att.name}`);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 p-1 border border-border-default bg-black/50 hover:bg-black hover:border-neon-cyan/50 cursor-pointer group/att transition-all overflow-hidden"
                                >
                                  {att.type === 'image' ? (
                                    <div className="w-5 h-5 shrink-0 overflow-hidden border border-border-default bg-neutral-900 flex items-center justify-center">
                                      <img src={att.url} alt="Att thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 shrink-0 border border-border-default bg-[#0B0B10] flex items-center justify-center text-neon-cyan text-[9px]">
                                      <span className="material-symbols-outlined text-[10px]">description</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0 text-[8px] font-mono">
                                    <p className="text-white group-hover/att:text-neon-cyan truncate leading-tight uppercase font-bold">{att.name}</p>
                                    <p className="text-on-surface-variant leading-none mt-0.5 font-bold uppercase">{att.size} • {att.type === 'image' ? 'IMAGE' : 'DOC'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Delete Control */}
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteTodo(todo.id);
                          triggerToast('ĐÃ XÓA NHIỆM VỤ RA KHỎI LỊCH');
                        }}
                        className="text-on-surface-variant font-bold hover:text-hot-pink p-1 cursor-pointer hover:bg-hot-pink/5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                        title="Xóa nhiệm vụ"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 border border-dashed border-border-default/40 flex flex-col items-center justify-center font-mono opacity-80 text-center">
                  <span className="material-symbols-outlined text-border-default text-3xl mb-2">event_busy</span>
                  <p className="text-[10.5px] font-bold text-white uppercase tracking-widest">
                    KHÔNG CÓ LỊCH TRÌNH
                  </p>
                  <p className="text-[8px] text-on-surface-variant uppercase mt-1">
                    Hệ thống trống cho ngày này. Click để thêm việc mới!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Daily Progress statistics summary */}
          <div className="pt-4 border-t border-border-default/45 mt-4 font-mono">
            {localTodos.length > 0 ? (
              <div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase mb-1.5">
                  <span className="text-neon-cyan">TIẾN TRÌNH HOÀN THÀNH NGÀY/DAY:</span>
                  <span className="text-white">
                    {localTodos.filter(t => t.completed).length}/{localTodos.length} COMPLETED
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black border border-border-default/40 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-cyan via-medium-purple to-neon-green shadow-[0_0_8px_rgba(0,255,136,0.5)] transition-all duration-300"
                    style={{ 
                      width: `${(localTodos.filter(t => t.completed).length / localTodos.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-[8px] text-on-surface-variant/40 text-center uppercase tracking-tight">
                CHƯA GHI NHẬN CHỈ SỐ NHIỆM VỤ NÀO // CALENDAR DESKTOP LIVE
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Premium Lightbox Overlay for Image Attachments */}
      {activeAttachmentPreview && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-fade-in"
          onClick={() => setActiveAttachmentPreview(null)}
        >
          <div 
            className="bg-surface-card border border-neon-cyan/50 max-w-2xl w-full p-5 relative flex flex-col gap-4 shadow-[0_0_40px_rgba(0,212,255,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-default/30 pb-2.5">
              <div className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-neon-cyan animate-pulse">image</span>
                XEM TRƯỚC ĐÍNH KÈM // ATTACHMENT PREVIEW
              </div>
              <button 
                onClick={() => setActiveAttachmentPreview(null)}
                className="text-hot-pink hover:text-white transition-colors text-[10px] font-bold uppercase cursor-pointer"
              >
                [ ĐÓNG // CLOSE ]
              </button>
            </div>
            
            <div className="flex items-center justify-center bg-black/80 border border-border-default/45 max-h-[60vh] overflow-hidden p-2">
              <img 
                src={activeAttachmentPreview.url} 
                alt="Attachment preview" 
                className="max-h-[55vh] max-w-full object-contain border border-border-default/20"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex items-center justify-between text-[9px] border-t border-border-default/20 pt-2.5">
              <span className="text-on-surface-variant truncate uppercase font-bold pr-4 max-w-[320px]" title={activeAttachmentPreview.name}>
                TÊN: {activeAttachmentPreview.name}
              </span>
              <a 
                href={activeAttachmentPreview.url}
                download={activeAttachmentPreview.name}
                onClick={() => triggerToast(`ĐANG DOWNLOAD: ${activeAttachmentPreview.name.toUpperCase()}`)}
                className="px-3.5 py-1.5 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-black uppercase text-[9px] tracking-wider transition-all hover:shadow-[0_0_10px_rgba(0,212,255,0.4)] shrink-0"
              >
                TẢI XUỐNG FILE
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
