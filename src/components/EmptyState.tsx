import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';

interface EmptyStateProps {
  onCreateNote?: () => void;
}

export default function EmptyState({ onCreateNote }: EmptyStateProps) {
  const { selectDate } = useCalendar();
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickNote = () => {
    if (onCreateNote) {
      onCreateNote();
    }
    selectDate(new Date());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SideNavBar Component */}
      <aside className="hidden md:flex flex-col py-8 px-4 h-full w-64 bg-surface-container-low">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black text-primary tracking-tighter">Takvim-62161</h1>
          <p className="font-['Inter'] uppercase tracking-widest text-[10px] text-on-secondary-container mt-1">The Nocturnal Architect</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl group cursor-pointer w-full">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">Aylık</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl group cursor-pointer w-full">
            <span className="material-symbols-outlined">view_week</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">Haftalık</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 border-l-2 border-primary text-primary bg-surface-container transition-all duration-300 rounded-r-xl group cursor-pointer w-full">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>view_agenda</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">Ajanda</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:text-primary hover:bg-surface-container transition-all duration-300 rounded-xl group cursor-pointer w-full">
            <span className="material-symbols-outlined">sticky_note_2</span>
            <span className="font-['Inter'] uppercase tracking-widest text-[10px]">Notlar</span>
          </button>
        </nav>
        <div className="mt-auto px-4 space-y-6">
          <button className="w-full py-4 rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-bold text-sm tracking-tight flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            Yeni Etkinlik
          </button>
          <div className="pt-6 border-t border-outline-variant/20">
            <button className="flex items-center gap-3 py-2 text-on-secondary-container hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-['Inter'] uppercase tracking-widest text-[10px]">Ayarlar</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Main Canvas */}
      <main className="flex-1 flex flex-col bg-surface overflow-hidden relative">
        {/* TopAppBar Component */}
        <header className="flex justify-between items-center px-6 h-16 w-full bg-surface-container-low">
          <div className="flex items-center gap-4">
            <span className="md:hidden material-symbols-outlined text-primary cursor-pointer">menu</span>
            <h2 className="font-['Inter'] tracking-tight font-bold text-primary">Ajanda Görünümü</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-surface-container rounded-full px-4 py-1.5 gap-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant w-48"
                placeholder="Notlarda ara..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 cursor-pointer" aria-label="Tema değiştir">
                <span className="material-symbols-outlined text-on-surface-variant">contrast</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 cursor-pointer" aria-label="Ayarlar">
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
                <img alt="Kullanıcı avatarı" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCcE2ohLjcltJ5CHXxoZy32o7fUYe3RxI3ZSRJrlJ63Ws4Kq_rnbgGdXrMwej6lCuJmuMFoeTuUPz-lIbXPwQCOWICNv5-VCOUmHQpiSdlmSwQ-3e8KHbxXGMentaG7eegc5QBsB37k9yEPb5fBF" />
              </div>
            </div>
          </div>
        </header>
        {/* Calendar Content Area */}
        <div className="flex-1 flex p-6 gap-6">
          {/* Left Section: Minimalist Calendar Grid (Faded) */}
          <div className="hidden lg:flex flex-col flex-[2] bg-surface-container rounded-xl overflow-hidden opacity-40 select-none grayscale">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tighter">Ekim 2023</h3>
              <div className="flex gap-2">
                <span className="material-symbols-outlined cursor-pointer">chevron_left</span>
                <span className="material-symbols-outlined cursor-pointer">chevron_right</span>
              </div>
            </div>
            <div className="grid grid-cols-7 flex-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="p-4 border-r border-b border-outline-variant/10"></div>
              ))}
            </div>
          </div>
          {/* Right Section: Empty State Focus (The Nocturnal Architect Style) */}
          <div className="flex-1 lg:flex-[1.2] flex flex-col justify-center items-center p-12 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-surface-container-low rounded-3xl -z-10 border border-outline-variant/10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl"></div>
            {/* Empty State Content */}
            <div className="max-w-xs text-center space-y-8 flex flex-col items-center">
              {/* Icon with Architectural Depth */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-10"></div>
                  <span className="material-symbols-outlined text-5xl text-primary relative z-10" style={{ fontVariationSettings: "'wght' 200" }}>calendar_today</span>
                </div>
                {/* Decorative Sparkle */}
                <div className="absolute -top-2 -right-2 p-1 bg-surface-container-high rounded-lg shadow-xl">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">auto_awesome</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tighter text-on-surface leading-tight">Henüz not eklenmemiş</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">Plan yapmaya başlamak için takvimde bir güne tıklayın.</p>
              </div>
              <div className="pt-4 w-full">
                <button
                  onClick={handleQuickNote}
                  className="w-full bg-surface-container-low/70 backdrop-blur-md border border-outline-variant/20 py-4 px-6 rounded-xl text-primary font-bold hover:bg-surface-container-highest transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">add</span>
                  <span>Hızlı Not Oluştur</span>
                </button>
                <p className="mt-6 text-[10px] uppercase tracking-widest text-on-secondary-container font-semibold">Veya bir .ics dosyası içe aktarın</p>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile BottomNavBar (Responsive Pivot) */}
        <nav className="md:hidden flex justify-around items-center px-6 h-16 w-full bg-surface-container-low border-t border-outline-variant/10">
          <button className="flex flex-col items-center text-primary cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1 font-bold">Takvim</span>
          </button>
          <button className="flex flex-col items-center text-on-secondary-container cursor-pointer">
            <span className="material-symbols-outlined">view_agenda</span>
            <span className="text-[10px] uppercase tracking-tighter mt-1">Ajanda</span>
          </button>
          <button className="bg-primary-container p-3 rounded-full -mt-10 shadow-xl cursor-pointer">
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
    </div>
  );
}
