import { useState } from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Bir Hata Oluştu',
  message = 'İşlem sırasında beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.',
  onRetry
}: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-error">error</span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">
        {title}
      </h3>
      <p className="text-on-surface-variant text-sm mb-6 max-w-xs">
        {message}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-xl text-on-surface hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined ${isRetrying ? 'animate-spin' : ''}`}>refresh</span>
            <span>Tekrar Dene</span>
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-error-container rounded-xl text-error hover:bg-error/20 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Ana Sayfa</span>
        </button>
      </div>
    </div>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Bağlantı Hatası"
      message="İnternet bağlantınızı kontrol edin veya daha sonra tekrar deneyin."
      onRetry={onRetry}
    />
  );
}

export function StorageErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Veri Kayıt Hatası"
      message="Etkinlikler kaydedilemedi. Lütfen tarayıcı depolama alanınızı kontrol edin."
      onRetry={onRetry}
    />
  );
}
