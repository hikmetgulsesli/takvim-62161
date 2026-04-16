import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CalendarState, CalendarContextType, Event, ViewMode } from '../types/calendar';
import { formatDate } from '../utils/dateUtils';
import { loadEvents, saveEvents, generateEventId } from '../utils/storageUtils';

const CalendarContext = createContext<CalendarContextType | null>(null);

const initialState: CalendarState = {
  currentDate: new Date(),
  selectedDate: null,
  view: 'month',
  events: [],
};

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalendarState>(initialState);

  useEffect(() => {
    const events = loadEvents();
    setState(prev => ({ ...prev, events }));
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setState(prev => {
      const newDate = new Date(prev.currentDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({ ...prev, currentDate: new Date() }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  const setView = useCallback((view: ViewMode) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEvent: Event = {
      ...eventData,
      id: generateEventId(),
      createdAt: now,
      updatedAt: now,
    };
    setState(prev => {
      const newEvents = [...prev.events, newEvent];
      saveEvents(newEvents);
      return { ...prev, events: newEvents };
    });
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setState(prev => {
      const newEvents = prev.events.map(e =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      );
      saveEvents(newEvents);
      return { ...prev, events: newEvents };
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setState(prev => {
      const newEvents = prev.events.filter(e => e.id !== id);
      saveEvents(newEvents);
      return { ...prev, events: newEvents };
    });
  }, []);

  const getEventsForDate = useCallback((date: Date) => {
    const dateStr = formatDate(date);
    return state.events.filter(e => e.date === dateStr);
  }, [state.events]);

  return (
    <CalendarContext.Provider value={{
      state,
      navigateMonth,
      goToToday,
      selectDate,
      setView,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsForDate,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
