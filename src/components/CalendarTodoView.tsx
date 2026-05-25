import React, { useState } from 'react';
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
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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

  // Submit new task
  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      triggerToast('LỖI // TIÊU ĐỀ KHÔNG ĐƯỢC ĐỂ TRỐNG');
      return;
    }

    const newTodoObj: CalendarTodo = {
      id: `todo-${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
      dateStr: selectedDateStr,
      priority: newPriority,
      time: newTime.trim() || undefined,
      description: newDescription.trim() || undefined
    };

    onAddTodo(newTodoObj);
    triggerToast(`ĐÃ LÊN LỊCH: ${newTodoObj.title.toUpperCase()}`);
    
    // Clear state
    setNewTitle('');
    setNewTime('');
    setNewPriority('medium');
    setNewDescription('');
    setIsFormOpen(false);
  };

  // Get todos strictly corresponding to current selectedDateStr
  const localTodos = todos.filter(t => t.dateStr === selectedDateStr);

  // Apply filters
  const filteredTodos = localTodos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
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
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border-default/20">
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

            {/* Inline Add Todo Form Option */}
            {isFormOpen && (
              <form onSubmit={handleCreateTodo} className="bg-black/55 border border-neon-cyan/30 p-4 mb-4 space-y-3.5 font-mono animate-fade-in relative">
                <div className="absolute right-2 top-2 text-[6.5px] text-neon-cyan/50 font-mono">INIT_SCHEDULER_V2</div>
                
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
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Title text */}
                          <h4 className={`text-xs font-bold font-mono tracking-wide break-words uppercase ${
                            todo.completed ? 'text-white/40 line-through' : 'text-white'
                          }`}>
                            {todo.title}
                          </h4>

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

                        {/* Description text */}
                        {todo.description && (
                          <p className={`text-[10px] mt-1.5 leading-relaxed font-mono ${
                            todo.completed ? 'text-white/20' : 'text-on-surface-variant'
                          }`}>
                            {todo.description}
                          </p>
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

    </div>
  );
}
