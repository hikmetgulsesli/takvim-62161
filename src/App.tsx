import { useState, useEffect } from 'react';
import { useCalendar } from './context/CalendarContext';
import { getMonthGrid, getMonthName, getWeekDays, formatDate, isSameDay } from './utils/dateUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';

function App() {
  const { state, navigateMonth, goToToday, selectDate, addEvent, deleteEvent } = useCalendar();
  const { currentDate, selectedDate, events } = state;
  const [darkMode, setDarkMode] = useLocalStorage('takvim-dark-mode', true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthGrid = getMonthGrid(year, month);
  const weekDays = getWeekDays();

  // Dark mode class toggle on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Test localStorage availability
  useEffect(() => {
    try {
      localStorage.setItem('__takvim_test', '1');
      localStorage.removeItem('__takvim_test');
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, []);

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
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteEvent(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleQuickNote = () => {
    selectDate(new Date());
    setEventDate(formatDate(new Date()));
    setShowEventModal(true);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Filter events by search query
  const filteredEvents = searchQuery.trim()
    ? events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : events;

  const hasEvents = events.length > 0;

  // Show error state if storage is broken
  if (storageError) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SideNavBar - Desktop */}
      <aside className="hidden md:flex flex-col py-8 px-4 h-full w-64 bg-surface-container-low">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black text-primary tracking-tighter">Takvim-62161</h1>
          <p className="uppercase tracking-widest text-[10px] text-on-secondary-container mt-1">The Nocturnal Architect</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 border-l-2 border-primary text-primary bg-surface-container transition-all duration-300 rounded-r-xl w-full cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_agenda</span>
            <span className="uppercase tracking-widest text-[10px]">Ajanda</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl w-full cursor-pointer">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="uppercase tracking-widest text-[10px]">Aylık</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl w-full cursor-pointer">
            <span className="material-symbols-outlined">view_week</span>
            <span className="uppercase tracking-widest text-[10px]">Haftalık</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl w-full cursor-pointer">
            <span className="material-symbols-outlined">sticky_note_2</span>
            <span className="uppercase tracking-widest text-[10px]">Notlar</span>
          </button>
        </nav>
        <div className="mt-auto px-4 space-y-6">
          <button
            onClick={handleQuickNote}
            className="w-full py-4 rounded-xl primary-gradient text-on-primary-container font-bold text-sm tracking-tight flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Yeni Etkinlik
          </button>
          <div className="pt-6 border-t border-outline-variant/20">
            <button className="flex items-center gap-3 py-2 text-on-secondary-container hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">settings</span>
              <span className="uppercase tracking-widest text-[10px]">Ayarlar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col bg-surface overflow-hidden relative">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-6 h-16 w-full bg-surface-container-low">
          <div className="flex items-center gap-4">
            <span className="md:hidden material-symbols-outlined text-primary cursor-pointer">menu</span>
            <h2 className="tracking-tight font-bold text-primary">Ajanda Görünümü</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-surface-container rounded-full px-4 py-1.5 gap-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant w-48 outline-none"
                placeholder="Notlarda ara..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Notlarda ara"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleTheme}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 cursor-pointer"
                aria-label="Tema değiştir"
              >
                <span className="material-symbols-outlined text-on-surface-variant">contrast</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 cursor-pointer" aria-label="Ayarlar">
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex p-6 gap-6 overflow-hidden">
          {!hasEvents ? (
            /* Empty State */
            <EmptyState onCreateNote={handleQuickNote} />
          ) : (
            /* Calendar Grid with Events */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevMonth} className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer" aria-label="Önceki ay">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold tracking-tighter">{getMonthName(month)} {year}</h3>
                  <button onClick={handleToday} className="px-6 py-2 bg-surface-container-high text-primary font-bold text-sm tracking-widest uppercase rounded-lg cursor-pointer hover:bg-surface-variant transition-colors">
                    Bugün
                  </button>
                </div>
                <button onClick={handleNextMonth} className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer" aria-label="Sonraki ay">
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
              <div className="grid grid-cols-7 gap-2 overflow-y-auto no-scrollbar">
                {monthGrid.map((day, index) => {
                  const dayEvents = filteredEvents.filter(e => e.date === formatDate(day.date));
                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day.date)}
                      className={`
                        min-h-[100px] p-2 rounded-lg cursor-pointer transition-colors duration-200
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
            </div>
          )}
        </div>

        {/* Mobile BottomNavBar */}
        <nav className="md:hidden flex justify-around items-center px-6 h-16 w-full bg-surface-container-low border-t border-outline-variant/10">
          <button className="flex flex-col items-center text-primary cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1 font-bold">Takvim</span>
          </button>
          <button className="flex flex-col items-center text-on-secondary-container cursor-pointer">
            <span className="material-symbols-outlined">view_agenda</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1">Ajanda</span>
          </button>
          <button
            onClick={handleQuickNote}
            className="bg-primary-container p-3 rounded-full -mt-10 shadow-xl cursor-pointer"
            aria-label="Yeni etkinlik ekle"
          >
            <span className="material-symbols-outlined text-on-primary-container">add</span>
          </button>
          <button className="flex flex-col items-center text-on-secondary-container cursor-pointer">
            <span className="material-symbols-outlined">sticky_note_2</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1">Notlar</span>
          </button>
          <button className="flex flex-col items-center text-on-secondary-container cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1">Ayarlar</span>
          </button>
        </nav>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEventModal(false)}>
          <div className="bg-surface-container rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Yeni Etkinlik</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="event-title">Başlık</label>
                <input
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="Etkinlik adı"
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="event-desc">Açıklama</label>
                <textarea
                  id="event-desc"
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Etkinlik açıklaması (opsiyonel)"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="event-date">Tarih</label>
                <input
                  id="event-date"
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
                className="flex-1 px-4 py-3 primary-gradient rounded-lg text-on-primary-container font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={cancelDelete}>
          <div className="bg-surface-container rounded-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Etkinliği Sil</h3>
            <p className="text-on-surface-variant mb-6">Bu etkinliği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-surface-container-high rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-error rounded-lg text-on-error font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
