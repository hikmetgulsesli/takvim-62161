import type { MonthDay, Event } from '../types/calendar';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Get the day of week of the first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();
  // Adjust for Monday start (European calendar style)
  const adjustedStart = (startDayOfWeek + 6) % 7;

  // Add days from previous month
  for (let i = adjustedStart - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month to complete the grid (6 rows × 7 days = 42)
  while (days.length < 42) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate() - adjustedStart + 1));
  }

  return days;
}

export function getMonthGrid(year: number, month: number): MonthDay[] {
  const today = new Date();
  const days = getMonthDays(year, month);

  return days.map(date => ({
    date,
    isCurrentMonth: date.getMonth() === month,
    isToday: isSameDay(date, today),
    events: [],
  }));
}

export function getDayName(date: Date): string {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const dayIndex = (date.getDay() + 6) % 7; // Monday = 0
  return days[dayIndex];
}

export function getMonthName(month: number): string {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return months[month];
}

export function getWeekDays(): string[] {
  return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cum', 'Paz'];
}

export function getEventColor(_event: Event, index: number): string {
  const colors = [
    'bg-[#60a5fa]', // blue
    'bg-[#fabd34]', // yellow
    'bg-[#34d399]', // green
    'bg-[#f472b6]', // pink
    'bg-[#a78bfa]', // purple
    'bg-[#fb923c]', // orange
  ];
  return colors[index % colors.length];
}