import { useMemo } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarCell } from './CalendarCell';
import { useCalendar } from '../context/CalendarContext';
import { getWeekDays } from '../utils/dateUtils';
import type { MonthDay } from '../types/calendar';

export function CalendarGrid() {
  const { state, navigateMonth, goToToday, selectDate, deleteEvent, getEventsForDate } = useCalendar();
  const { currentDate, selectedDate } = state;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const weekDays = useMemo(() => getWeekDays(), []);

  const handlePrevMonth = () => navigateMonth('prev');
  const handleNextMonth = () => navigateMonth('next');
  const handleToday = () => goToToday();

  const handleDayClick = (date: Date) => {
    selectDate(date);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    ) : false;
  };

  // Generate month grid (6 weeks = 42 days)
  const monthGrid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: Date[] = [];

    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Next month padding (fill to 42 cells)
    while (days.length < 42) {
      days.push(new Date(year, month + 1, days.length - lastDay.getDate() - startDayOfWeek + 1));
    }

    return days;
  }, [year, month]);

  const today = new Date();
  const isToday = (date: Date): boolean => {
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month;
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Monthly Grid Container */}
      <div className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 border-b border-outline-variant/10">
          {weekDays.map(day => (
            <div
              key={day}
              className={`
                py-4 text-center text-[10px] font-black tracking-[0.2em]
                ${day === 'Cum' || day === 'Cmt' ? 'text-tertiary' : 'text-on-secondary-container'}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {monthGrid.map((date: Date, index: number) => {
            const events = getEventsForDate(date);
            const day: MonthDay = {
              date,
              isCurrentMonth: isCurrentMonth(date),
              isToday: isToday(date),
              events: [],
            };
            return (
              <CalendarCell
                key={index}
                day={day}
                isSelected={isSelected(date)}
                onClick={handleDayClick}
                events={events.map(e => ({
                  id: e.id,
                  title: e.title,
                  date: e.date,
                  color: e.color,
                }))}
                onDeleteEvent={handleDeleteEvent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}