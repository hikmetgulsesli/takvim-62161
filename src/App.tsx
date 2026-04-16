import { useState } from 'react';
import './App.css';
import { useCalendar } from './context/CalendarContext';
import { getMonthGrid, getMonthName, getWeekDays, formatDate, isSameDay } from './utils/dateUtils';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const { state, navigateMonth, goToToday, selectDate, addEvent, deleteEvent } = useCalendar();
  const { currentDate, selectedDate, events } = state;
  const [theme, toggleTheme] = useTheme();
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

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
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
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
          <span className="material-symbols-outlined">settings</span>
          <span>Ayarlar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-surface overflow-y-auto no-scrollbar p-4 md:p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center" aria-label="Önceki ay">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{getMonthName(month)} {year}</h2>
            <button onClick={handleToday} className="px-6 py-2 bg-surface-container-high text-primary font-bold text-sm tracking-widest uppercase rounded-lg cursor-pointer hover:bg-surface-variant transition-colors">
              Bugün
            </button>
          </div>
          <button onClick={handleNextMonth} className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center" aria-label="Sonraki ay">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-on-surface-variant py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthGrid.map((day, index) => {
            const dayEvents = events.filter(e => e.date === formatDate(day.date));
            return (
              <div
                key={index}
                onClick={() => handleDayClick(day.date)}
                className={`
                  min-h-[100px] p-2 rounded-lg cursor-pointer transition-all duration-200
                  ${day.isCurrentMonth ? 'bg-surface-container hover:bg-surface-container-high' : 'bg-surface-dim opacity-50'}
                  ${day.isToday ? 'ring-2 ring-primary' : ''}
                  ${selectedDate && isSameDay(day.date, selectedDate) ? 'bg-primary-container' : ''}
                  hover:ring-1 hover:ring-primary-container
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${day.isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant'}
                  ${day.isToday ? 'text-primary font-bold' : ''}
                `}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className="text-xs px-2 py-1 rounded bg-primary-container text-on-primary-container truncate cursor-pointer hover:bg-primary/20"
                      onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-on-surface-variant">
                      +{dayEvents.length - 2} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-container-low glass-effect flex justify-around items-center">
        <button className="flex flex-col items-center gap-1 text-primary cursor-pointer">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-xs">Aylık</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">view_week</span>
          <span className="text-xs">Hafta</span>
        </button>
        <button
          onClick={() => { setEventDate(formatDate(new Date())); setShowEventModal(true); }}
          className="w-14 h-14 bg-gradient-to-br from-primary-container to-primary rounded-full -mt-10 shadow-lg shadow-primary/30 flex items-center justify-center text-on-primary-container cursor-pointer"
          aria-label="Yeni etkinlik"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">view_agenda</span>
          <span className="text-xs">Ajanda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">sticky_note_2</span>
          <span className="text-xs">Notlar</span>
        </button>
      </nav>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEventModal(false)}>
          <div className="bg-surface-container rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Yeni Etkinlik</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Başlık</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="Etkinlik adı"
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Açıklama</label>
                <textarea
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Etkinlik açıklaması (opsiyonel)"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Tarih</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 px-4 py-3 bg-surface-container-high rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-primary-container to-primary rounded-lg text-on-primary-container font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;