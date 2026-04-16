export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  view: ViewMode;
  events: Event[];
}

export interface MonthDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type ViewMode = 'month' | 'week' | 'agenda';

export interface CalendarContextType {
  state: CalendarState;
  navigateMonth: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  selectDate: (date: Date) => void;
  setView: (view: ViewMode) => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => Event[];
}
