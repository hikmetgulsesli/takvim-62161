import type { Event } from '../types/calendar';
import { formatDate } from './dateUtils';

const EVENTS_KEY = 'takvim-events';

export function loadEvents(): Event[] {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: Event[]): void {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
}

export function addEventToStorage(event: Event): void {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
}

export function updateEventInStorage(id: string, updates: Partial<Event>): boolean {
  const events = loadEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;
  events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
  saveEvents(events);
  return true;
}

export function deleteEventFromStorage(id: string): boolean {
  const events = loadEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return false;
  saveEvents(filtered);
  return true;
}

export function getEventsForDateStorage(date: Date): Event[] {
  const dateStr = formatDate(date);
  return loadEvents().filter(e => e.date === dateStr);
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}