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

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadEvents(): Event[] {
  try {
    const stored = localStorage.getItem('takvim-events');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: Event[]): void {
  try {
    localStorage.setItem('takvim-events', JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save events:', e);
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
  events[index] = { ...events[index], ...updates };
  saveEvents(events);
  return true;
}

export function deleteEventFromStorage(id: string): boolean {
  const events = loadEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  saveEvents(events);
  return true;
}
