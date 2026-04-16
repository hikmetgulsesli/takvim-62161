export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  view: 'month' | 'week' | 'agenda';
  events: Event[];
}

export interface MonthDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export type ViewMode = 'month' | 'week' | 'agenda';

export interface CalendarContextType {
  state: CalendarState;
  navigateMonth: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  selectDate: (date: Date) => void;
  setView: (view: ViewMode) => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => Event[];
}