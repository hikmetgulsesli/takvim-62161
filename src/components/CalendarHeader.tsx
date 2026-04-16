import { getMonthName } from '../utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const seasonMap: Record<string, string> = {
    '0': 'KIŞ DÖNEMİ',
    '1': 'KIŞ DÖNEMİ',
    '2': 'İLKBAHAR ÇEYREĞİ',
    '3': 'İLKBAHAR ÇEYREĞİ',
    '4': 'İLKBAHAR ÇEYREĞİ',
    '5': 'YAZ ÇEYREĞİ',
    '6': 'YAZ ÇEYREĞİ',
    '7': 'YAZ ÇEYREĞİ',
    '8': 'SONBAHAR ÇEYREĞİ',
    '9': 'SONBAHAR ÇEYREĞİ',
    '10': 'SONBAHAR ÇEYREĞİ',
    '11': 'KIŞ DÖNEMİ',
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      {/* Month and Season */}
      <div className="space-y-1">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface">
          {getMonthName(month)} {year}
        </h1>
        <p className="text-on-surface-variant font-medium tracking-wide">
          {seasonMap[month.toString()]}
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
        <button
          onClick={onPrevMonth}
          className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center cursor-pointer"
          aria-label="Önceki ay"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          onClick={onToday}
          className="px-6 py-2 bg-surface-container-high text-primary font-bold text-sm tracking-widest uppercase rounded-lg cursor-pointer hover:bg-surface-variant transition-colors"
        >
          Bugün
        </button>
        <button
          onClick={onNextMonth}
          className="p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center cursor-pointer"
          aria-label="Sonraki ay"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}