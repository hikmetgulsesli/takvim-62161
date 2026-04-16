import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DayDetailModal } from '../components/DayDetailModal';
import type { Event } from '../types/calendar';

describe('DayDetailModal', () => {
  const mockDate = new Date(2026, 3, 14); // 14 Nisan 2026
  const mockOnClose = vi.fn();
  const mockOnDeleteEvent = vi.fn();
  const mockOnUpdateEvent = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={false}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Salı')).toBeTruthy();
    expect(screen.getByText('14 Nisan 2026')).toBeTruthy();
  });

  it('displays day name in header', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Salı')).toBeTruthy();
  });

  it('displays formatted date', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('14 Nisan 2026')).toBeTruthy();
  });

  it('renders textarea for notes', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const textarea = screen.getByLabelText('Gün notları');
    expect(textarea).toBeTruthy();
  });

  it('shows empty state when no events', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Bu gün için etkinlik yok')).toBeTruthy();
    expect(screen.getByText('event_busy')).toBeTruthy();
  });

  it('displays events list when events exist', () => {
    const eventsWithData: Event[] = [
      {
        id: '1',
        title: 'Proje toplantısı',
        description: 'Önemli toplantı',
        date: '2026-04-14',
        time: '10:00',
        createdAt: '2026-04-14T08:00:00Z',
        updatedAt: '2026-04-14T08:00:00Z',
      },
    ];

    render(
      <DayDetailModal
        date={mockDate}
        events={eventsWithData}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Proje toplantısı')).toBeTruthy();
    expect(screen.getByText('Önemli toplantı')).toBeTruthy();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const closeButton = screen.getByLabelText('Modalı kapat');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Vazgeç button is clicked', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    fireEvent.click(screen.getByText('Vazgeç'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Kaydet button is clicked', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    fireEvent.click(screen.getByText('Kaydet'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onDeleteEvent when delete button is clicked', () => {
    const eventsWithData: Event[] = [
      {
        id: 'event-1',
        title: 'Toplantı',
        description: '',
        date: '2026-04-14',
        createdAt: '2026-04-14T08:00:00Z',
        updatedAt: '2026-04-14T08:00:00Z',
      },
    ];

    render(
      <DayDetailModal
        date={mockDate}
        events={eventsWithData}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const deleteButton = screen.getByLabelText('Etkinliği sil');
    fireEvent.click(deleteButton);
    expect(mockOnDeleteEvent).toHaveBeenCalledWith('event-1');
  });

  it('allows typing in textarea', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const textarea = screen.getByLabelText('Gün notları');
    fireEvent.change(textarea, { target: { value: 'Yeni not' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('Yeni not');
  });

  it('displays multiple events correctly', () => {
    const multipleEvents: Event[] = [
      {
        id: '1',
        title: 'Sabah toplantısı',
        description: '',
        date: '2026-04-14',
        createdAt: '2026-04-14T08:00:00Z',
        updatedAt: '2026-04-14T08:00:00Z',
      },
      {
        id: '2',
        title: 'Öğle yemeği',
        description: 'Müşteri ile',
        date: '2026-04-14',
        createdAt: '2026-04-14T08:00:00Z',
        updatedAt: '2026-04-14T08:00:00Z',
      },
    ];

    render(
      <DayDetailModal
        date={mockDate}
        events={multipleEvents}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Sabah toplantısı')).toBeTruthy();
    expect(screen.getByText('Öğle yemeği')).toBeTruthy();
    expect(screen.getByText('Müşteri ile')).toBeTruthy();
  });

  it('shows event icon for each event', () => {
    const eventsWithData: Event[] = [
      {
        id: '1',
        title: 'Randevu',
        description: '',
        date: '2026-04-14',
        createdAt: '2026-04-14T08:00:00Z',
        updatedAt: '2026-04-14T08:00:00Z',
      },
    ];

    render(
      <DayDetailModal
        date={mockDate}
        events={eventsWithData}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const eventIcon = screen.getByText('event');
    expect(eventIcon).toBeTruthy();
  });

  it('renders with backdrop', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const backdrop = document.querySelector('.bg-surface-dim\\/80');
    expect(backdrop).toBeTruthy();
  });

  it('renders glass modal effect', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const modal = document.querySelector('.glass-modal');
    expect(modal).toBeTruthy();
  });

  it('handles different dates correctly', () => {
    const differentDate = new Date(2026, 0, 1); // 1 Ocak 2026

    render(
      <DayDetailModal
        date={differentDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    expect(screen.getByText('Perşembe')).toBeTruthy();
    expect(screen.getByText('1 Ocak 2026')).toBeTruthy();
  });

  it('does not call onClose when clicking inside modal', () => {
    render(
      <DayDetailModal
        date={mockDate}
        events={[]}
        isOpen={true}
        onClose={mockOnClose}
        onDeleteEvent={mockOnDeleteEvent}
        onUpdateEvent={mockOnUpdateEvent}
      />
    );

    const modal = document.querySelector('.glass-modal');
    if (modal) {
      fireEvent.click(modal);
    }
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});