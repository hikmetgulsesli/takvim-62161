import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Notu Sil',
    message: 'Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ilişkili veriler kalıcı olarak kaldırılacaktır.',
    confirmLabel: 'Sil',
    cancelLabel: 'Vazgeç',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render title and message correctly', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Notu Sil')).toBeTruthy();
    expect(screen.getByText('İşlem Onayı')).toBeTruthy();
    expect(screen.getByText(/Bu notu silmek istediğinize emin misiniz/i)).toBeTruthy();
  });

  it('should render custom title when provided', () => {
    render(<ConfirmDialog {...defaultProps} title="Öğeyi Sil" />);
    expect(screen.getByText('Öğeyi Sil')).toBeTruthy();
  });

  it('should render custom message when provided', () => {
    render(<ConfirmDialog {...defaultProps} message="Bu işlem geri alınamaz." />);
    expect(screen.getByText('Bu işlem geri alınamaz.')).toBeTruthy();
  });

  it('should render confirm and cancel buttons with correct labels', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Sil' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Vazgeç' })).toBeTruthy();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sil' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Vazgeç' }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should render delete_forever icon', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const icon = document.querySelector('.material-symbols-outlined');
    expect(icon?.textContent).toBe('delete_forever');
  });

  it('should render with backdrop', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const backdrop = document.querySelector('.fixed.inset-0.z-50');
    expect(backdrop).toBeTruthy();
  });

  it('should render progress indicator', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const progressBar = document.querySelector('.bg-error.opacity-40');
    expect(progressBar).toBeTruthy();
  });

  it('should render with glassmorphism effect', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const dialog = document.querySelector('.backdrop-blur-xl');
    expect(dialog).toBeTruthy();
  });

  it('should render error highlight for "geri alınamaz" text', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const highlightedText = document.querySelector('.text-error.underline');
    expect(highlightedText?.textContent).toBe('geri alınamaz');
  });

  it('should use default values when optional props are not provided', () => {
    const minimalProps = {
      isOpen: true,
      message: 'Test mesajı',
      onConfirm: vi.fn(),
      onCancel: vi.fn(),
    };
    render(<ConfirmDialog {...minimalProps} />);
    expect(screen.getByText('Notu Sil')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sil' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Vazgeç' })).toBeTruthy();
  });

  it('should call onConfirm with Enter key', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmBtn = screen.getByRole('button', { name: 'Sil' });
    fireEvent.keyDown(confirmBtn, { key: 'Enter' });
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel with Escape key', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const cancelBtn = screen.getByRole('button', { name: 'Vazgeç' });
    fireEvent.keyDown(cancelBtn, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
