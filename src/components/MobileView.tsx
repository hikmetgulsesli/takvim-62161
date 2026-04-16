import { useCalendar } from '../context/CalendarContext';
import { getMonthGrid, getMonthName, getWeekDays, formatDate, isSameDay } from '../utils/dateUtils';
import { useState, useEffect } from 'react';

interface MobileViewProps {
  onAddEvent?: () => void;
}

export function MobileView({ onAddEvent }: MobileViewProps) {
  const { state, navigateMonth, goToToday, selectDate, getEventsForDate } = useCalendar();
  const { currentDate, selectedDate } = state;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthGrid = getMonthGrid(year, month);
  const weekDays = getWeekDays();

  // Generate days for the date scrubber (current week + surrounding)
  const today = new Date();
  const todayDayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday = 0
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDayOfWeek);

  const scrubberDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleDaySelect = (date: Date) => {
    selectDate(date);
    const index = scrubberDays.findIndex(d => isSameDay(d, date));
    if (index >= 0) setSelectedDayIndex(index);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center">
      {/* TopAppBar */}
      <header className="bg-surface-dim w-full top-0 flex justify-between items-center px-6 h-16 z-50">
        <h1 className="text-2xl font-bold tracking-tighter text-primary-container">Takvim-62161</h1>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 rounded-full duration-200 ease-in-out cursor-pointer" aria-label="Tema değiştir">
            <span className="material-symbols-outlined">contrast</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 rounded-full duration-200 ease-in-out cursor-pointer" aria-label="Ayarlar">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Mobile Focused) */}
      <main className="w-full max-w-[480px] px-4 py-4 flex-1 flex flex-col gap-6">
        {/* Time-Scrubber (Editorial Header) */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-on-secondary-container font-label uppercase tracking-widest text-[10px] mb-1 block">{getMonthName(month)} {year}</span>
              <h2 className="text-4xl font-bold tracking-tighter text-primary">Bugün</h2>
            </div>
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 bg-surface-container rounded-xl text-primary outline-variant outline-[20%] border-0 outline-none cursor-pointer"
                aria-label="Önceki ay"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 bg-surface-container rounded-xl text-primary outline-variant outline-[20%] border-0 outline-none cursor-pointer"
                aria-label="Sonraki ay"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Date Scrubber Selection */}
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {scrubberDays.map((date, index) => {
              const isSelected = isSameDay(date, selectedDate || today);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={index}
                  onClick={() => handleDaySelect(date)}
                  className={`flex flex-col items-center min-w-[50px] py-3 rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-high border-l-2 border-primary'
                      : 'bg-surface-container-low'
                  }`}
                >
                  <span className={`text-[10px] font-label uppercase ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Compact Calendar Grid */}
        <section className="bg-surface-container rounded-xl p-4">
          <div className="calendar-grid text-center mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-[10px] font-label uppercase tracking-widest text-on-secondary-container">{day}</div>
            ))}
          </div>
          <div className="calendar-grid gap-y-2">
            {monthGrid.map((day, index) => {
              const isToday = isSameDay(day.date, today);
              const isSelected = selectedDate && isSameDay(day.date, selectedDate);
              const dayEvents = getEventsForDate(day.date);
              const hasEventDot = dayEvents.length > 0;

              return (
                <button
                  key={index}
                  onClick={() => handleDaySelect(day.date)}
                  className={`
                    text-sm py-2 transition-colors cursor-pointer
                    ${day.isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant opacity-30'}
                    ${isSelected ? 'bg-primary/20 text-primary rounded-lg font-bold' : ''}
                  `}
                >
                  {day.date.getDate()}
                  {hasEventDot && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-tertiary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Daily Tasks (Focus Area) */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-on-surface">Bugünün Planı</h3>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-secondary-container">
              {selectedEvents.length} Etkinlik
            </span>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="bg-surface-container-high rounded-xl p-4 text-center">
              <p className="text-on-surface-variant text-sm">Bu gün için etkinlik yok</p>
              <button
                onClick={onAddEvent}
                className="mt-3 text-primary text-sm font-medium cursor-pointer hover:underline"
              >
                + Etkinlik ekle
              </button>
            </div>
          ) : (
            selectedEvents.map(event => (
              <div key={event.id} className="bg-surface-container-high rounded-xl p-4 flex gap-4 items-center border-l-2 border-primary">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold">{event.time || '--:--'}</span>
                  <span className="text-[8px] uppercase text-on-surface-variant">60dk</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">{event.title}</h4>
                  <p className="text-xs text-on-surface-variant">{event.description || 'Açıklama yok'}</p>
                </div>
                <button className="text-on-surface-variant cursor-pointer" aria-label="Diğer seçenekler">
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>
            ))
          )}
        </section>
      </main>

      {/* FAB Button */}
      <button
        onClick={onAddEvent}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-container to-primary shadow-lg flex items-center justify-center text-on-primary-container z-50 cursor-pointer"
        aria-label="Etkinlik ekle"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full h-16 bg-surface-container-low flex justify-around items-center px-4 z-50 md:hidden">
        <button className="flex flex-col items-center gap-1 border-l-2 border-primary-container text-primary-container bg-surface-container px-4 py-1 transition-all duration-300 cursor-pointer">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="font-label uppercase tracking-widest text-[8px]">Aylık</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-secondary-container hover:text-primary-container hover:bg-surface-container px-4 py-1 transition-all duration-300 cursor-pointer">
          <span className="material-symbols-outlined">view_week</span>
          <span className="font-label uppercase tracking-widest text-[8px]">Haftalık</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-secondary-container hover:text-primary-container hover:bg-surface-container px-4 py-1 transition-all duration-300 cursor-pointer">
          <span className="material-symbols-outlined">view_agenda</span>
          <span className="font-label uppercase tracking-widest text-[8px]">Ajanda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-secondary-container hover:text-primary-container hover:bg-surface-container px-4 py-1 transition-all duration-300 cursor-pointer">
          <span className="material-symbols-outlined">sticky_note_2</span>
          <span className="font-label uppercase tracking-widest text-[8px]">Notlar</span>
        </button>
      </nav>

      {/* Visual Polish: Surface Nesting Background Element */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] right-[-5%] w-[40%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
