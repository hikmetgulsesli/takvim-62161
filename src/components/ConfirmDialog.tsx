import type { Event } from '../types/calendar';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  item?: Event | null;
}

export function ConfirmDialog({
  isOpen,
  title = 'Notu Sil',
  message = 'Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ilişkili veriler kalıcı olarak kaldırılacaktır.',
  confirmLabel = 'Sil',
  cancelLabel = 'Vazgeç',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-surface-variant/70 backdrop-blur-xl border border-outline-variant/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Interior Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-error/10 blur-[60px] rounded-full"></div>

        {/* Content Area */}
        <div className="relative p-8 flex flex-col gap-6">
          {/* Header with Editorial Icon */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-container/30 text-error">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-on-surface">{title}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-secondary-container opacity-60">İşlem Onayı</p>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {message.includes('geri alınamaz')
                ? message.split('geri alınamaz').map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <span className="text-error font-medium italic underline decoration-error/30 underline-offset-4">geri alınamaz</span>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                : message}
            </p>
          </div>

          {/* Action Footer: Asymmetric Alignment */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            {/* Confirm Delete (Primary Gradient) */}
            <button
              onClick={onConfirm}
              onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }}
              className="w-full sm:w-auto order-1 sm:order-2 px-8 py-3 rounded-xl bg-gradient-to-br from-error to-error-container text-on-error font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-error/10 cursor-pointer"
            >
              {confirmLabel}
            </button>
            {/* Cancel (Ghost Style) */}
            <button
              onClick={onCancel}
              onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 rounded-xl bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium text-sm transition-colors duration-200 outline outline-1 outline-outline-variant/20 cursor-pointer"
            >
              {cancelLabel}
            </button>
          </div>
        </div>

        {/* Progress indicator / Decorative Edge */}
        <div className="h-1 w-full bg-surface-container-lowest overflow-hidden">
          <div className="h-full w-1/3 bg-error opacity-40"></div>
        </div>
      </div>
    </div>
  );
}
