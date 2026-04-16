import { useState } from 'react';
import './App.css';
import { useCalendar } from './context/CalendarContext';
import { getMonthGrid, getMonthName, getWeekDays, formatDate, isSameDay } from './utils/dateUtils';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const { state, navigateMonth, goToToday, selectDate, addEvent } = useCalendar();
  const { currentDate, selectedDate, events } = state;
  const [darkMode, setDarkMode] = useLocalStorage('takvim-dark-mode', true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthGrid = getMonthGrid(year, month);
  const weekDays = getWeekDays();

  const handlePrevMonth = () => navigateMonth('prev');
  const handleNextMonth = () => navigateMonth('next');
  const handleToday = () => goToToday();

  const handleDayClick = (date: Date) => {
    selectDate(date);
    setEventDate(formatDate(date));
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim() || !eventDate) return;
    addEvent({
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      date: eventDate,
      time: '',
      color: '',
    });
    setEventTitle('');
    setEventDesc('');
    setShowEventModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Header */}
      <header className="bg-surface-dim text-primary font-headline tracking-tight w-full top-0 flex justify-between items-center px-6 h-16 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-lg transition-colors">contrast</span>
          <h1 className="text-lg font-semibold">Takvim</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors"
            aria-label="Tema değiştir"
          >
            {darkMode ? 'light_mode' : 'dark_mode'}
          </button>
          <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors">settings</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col py-8 px-4 h-full bg-surface-container-low text-primary font-headline uppercase">
        <button className="flex items-center gap-4 w-full px-4 py-3 border-l-2 border-primary bg-surface-container text-primary transition-all duration-300">
          <span className="material-symbols-outlined">calendar_month</span>
          <span>Aylık</span>
        </button>
        <button className="flex items-center gap-4 w-full px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300">
          <span className="material-symbols-outlined">view_week</span>
          <span>Haftalık</span>
        </button>
        <button className="flex items-center gap-4 w-full px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300">
          <span className="material-symbols-outlined">view_agenda</span>
          <span>Ajanda</span>
        </button>
        <button className="flex items-center gap-4 w-full px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300">
          <span className="material-symbols-outlined">sticky_note_2</span>
          <span>Notlar</span>
        </button>
        <div className="flex-1" />
        <button
          onClick={() => { setEventDate(formatDate(new Date())); setShowEventModal(true); }}
          className="flex items-center gap-4 w-full px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Yeni Etkinlik</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-surface overflow-y-auto no-scrollbar p-4 md:p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Önceki ay"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              {getMonthName(currentDate)} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Sonraki ay"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-all duration-200 cursor-pointer"
          >
            Bugün
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-surface-container-low">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {monthGrid.map((day, index) => {
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = day.getMonth() === month;
              const dayEvents = events.filter(e => e.date === formatDate(day));
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-[80px] p-2 border-t border-outline-variant/20 transition-colors cursor-pointer
                    ${isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant opacity-50'}
                    ${isToday ? 'bg-primary-container/30' : 'hover:bg-surface-container-high'}
                    ${isSelected ? 'bg-primary-container/50 ring-2 ring-primary' : ''}
                  `}
                  aria-label={`${day.getDate()} ${getMonthName(day)}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary font-bold' : ''}`}>
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className="w-2 h-2 rounded-full bg-primary-container"
                            title={event.title}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md px-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary">Yeni Etkinlik</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Etkinlik başlığı..."
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Açıklama
                </label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Açıklama ekleyin..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-3 text-sm font-bold text-on-primary-container bg-gradient-to-br from-primary-container to-primary rounded-xl shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
