import { useCalendar } from '../context/CalendarContext';
import { formatDate } from '../utils/dateUtils';

interface EmptyStateProps {
  onAddEvent?: () => void;
}

export function EmptyState({ onAddEvent }: EmptyStateProps) {
  const { state } = useCalendar();
  const { selectedDate } = state;
  const displayDate = selectedDate ? formatDate(selectedDate) : formatDate(new Date());

  const handleAddClick = () => {
    if (onAddEvent) {
      onAddEvent();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">event_busy</span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">
        Henüz Etkinlik Yok
      </h3>
      <p className="text-on-surface-variant text-sm mb-6 max-w-xs">
        {displayDate} tarihi için henüz bir etkinlik eklenmedi. Yeni bir etkinlik ekleyerek başlayın.
      </p>
      <button
        onClick={handleAddClick}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary-container to-primary rounded-xl text-on-primary-container font-bold shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span className="material-symbols-outlined">add</span>
        <span>Etkinlik Ekle</span>
      </button>
    </div>
  );
}

export function EmptyCalendarState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">calendar_today</span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">
        Takviminiz Boş
      </h3>
      <p className="text-on-surface-variant text-sm mb-6 max-w-xs">
        Bu ay için henüz etkinlik bulunmuyor. Sağ alt köşedeki + butonunu kullanarak yeni etkinlik ekleyebilirsiniz.
      </p>
    </div>
  );
}
