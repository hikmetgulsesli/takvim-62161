import { useState } from 'react';
import type { Event } from '../types/calendar';
import { getDayName, getMonthName } from '../utils/dateUtils';
import { ConfirmDialog } from './ConfirmDialog';

export interface DayDetailModalProps {
  date: Date;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEvent: (id: string, updates: Partial<Event>) => void;
}

export function DayDetailModal({
  date,
  events,
  isOpen,
  onClose,
  onDeleteEvent,
  onUpdateEvent,
}: DayDetailModalProps) {
  const [noteText, setNoteText] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Reset state when modal opens with new date/events
  const resetState = () => {
    setNoteText('');
    setEditingEventId(null);
    setEditingNote('');
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  // Call reset when isOpen changes
  if (!isOpen) {
    if (noteText !== '' || editingEventId !== null || showDeleteConfirm) {
      resetState();
    }
    return null;
  }

  const dayName = getDayName(date);
  const formattedDate = `${date.getDate()} ${getMonthName(date)} ${date.getFullYear()}`;

  const handleNoteSave = () => {
    if (editingEventId && noteText !== editingNote) {
      onUpdateEvent(editingEventId, { description: noteText });
      setEditingNote(noteText);
    }
    setEditingEventId(null);
  };

  const handleEventClick = (event: Event) => {
    setEditingEventId(event.id);
    setNoteText(event.description || '');
    setEditingNote(event.description || '');
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete);
    }
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md px-4">
        <div className="glass-modal w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col relative border border-outline-variant/20">
          {/* Modal Header */}
          <div className="p-6 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-on-secondary-container uppercase">
                {dayName}
              </span>
              <h2 className="text-3xl font-bold tracking-tighter text-primary">
                {formattedDate}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-error transition-colors duration-200 cursor-pointer"
              title="Kapat"
              aria-label="Modalı kapat"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Notlar ve Hatırlatıcılar */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                Notlar ve Hatırlatıcılar
              </label>
              <div className="relative group">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onBlur={handleNoteSave}
                  placeholder="Bir şeyler ekleyin..."
                  className="w-full h-40 bg-surface-container-low/50 text-on-surface border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 focus:bg-surface-container transition-all duration-300 resize-none p-4 rounded-lg placeholder:text-on-surface-variant/40"
                  aria-label="Gün notları"
                />
              </div>
            </div>

            {/* Events List */}
            {events.length > 0 && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  Etkinlikler
                </label>
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="p-4 bg-surface-container-low rounded-lg flex items-start gap-3 cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary mt-1" style={{ fontSize: '20px' }}>
                      event
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(event.id);
                      }}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors duration-200 cursor-pointer flex-shrink-0"
                      title="Sil"
                      aria-label="Etkinliği sil"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {events.length === 0 && (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                <p className="text-sm">Bu gün için etkinlik yok</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2.5 text-sm font-bold text-on-primary-container bg-gradient-to-br from-primary-container to-primary rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-200 cursor-pointer"
            >
              Kaydet
            </button>
          </div>

          {/* Ambient Light Source (Visual Decoration) */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Notu Sil"
        message="Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ilişkili veriler kalıcı olarak kaldırılacaktır."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
