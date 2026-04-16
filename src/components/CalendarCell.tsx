import type { MonthDay } from '../types/calendar';

interface CalendarCellProps {
  day: MonthDay;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onDeleteEvent?: (id: string) => void;
  events: Array<{
    id: string;
    title: string;
    date: string;
    color?: string;
  }>;
}

export function CalendarCell({ day, isSelected, onClick, events, onDeleteEvent }: CalendarCellProps) {
  const dayEvents = events.filter(e => e.date === day.date.toISOString().split('T')[0]);
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

  return (
    <div
      onClick={() => onClick(day.date)}
      className={`
        h-32 md:h-44 border-r border-b border-outline-variant/5 p-4 
        hover:bg-surface-container-high transition-colors group cursor-pointer
        ${!day.isCurrentMonth ? 'bg-surface-container-lowest/30 opacity-20' : ''}
        ${isSelected ? 'bg-primary-container/30 ring-2 ring-primary-container' : ''}
        ${day.isToday ? 'relative overflow-hidden' : ''}
        ${isWeekend && day.isCurrentMonth ? 'bg-surface-container-low/10' : ''}
      `}
    >
      {/* Today indicator */}
      {day.isToday && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      )}
      {day.isToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Day number */}
        <div className="flex justify-between items-start">
          <span className={`
            text-xl font-bold
            ${day.isToday ? 'text-primary' : 'group-hover:text-primary'}
            ${!day.isCurrentMonth ? 'text-on-surface-variant/40' : 'text-on-surface'}
            ${isWeekend && day.isCurrentMonth ? 'text-tertiary' : ''}
          `}>
            {day.date.getDate()}
          </span>
          {day.isToday && (
            <span className="text-[10px] font-bold text-primary tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
              BUGÜN
            </span>
          )}
        </div>

        {/* Events indicator dots */}
        {dayEvents.length > 0 && (
          <div className="mt-auto flex gap-1">
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent?.(event.id);
                }}
                className={`
                  w-2 h-2 rounded-full
                  ${idx === 0 && day.isToday ? 'bg-primary animate-pulse' : 'bg-primary-container'}
                  hover:opacity-70 cursor-pointer
                `}
                title={event.title}
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[10px] text-on-surface-variant">+{dayEvents.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}