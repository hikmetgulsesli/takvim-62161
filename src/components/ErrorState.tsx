interface ErrorStateProps {
  errorCode?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onGoToSettings?: () => void;
}

export default function ErrorState({
  errorCode = 'LOCAL_STORAGE_ACCESS_DENIED',
  errorMessage = 'Tarayıcı depolama alanı dolu veya erişilemiyor. Lütfen çerez ayarlarınızı kontrol edin.',
  onRetry,
  onGoToSettings
}: ErrorStateProps) {

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleSettings = () => {
    if (onGoToSettings) {
      onGoToSettings();
    }
  };

  return (
    <main className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
      {/* Background Decoration (Ambient Lighting) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full"></div>
      </div>
      {/* Error Container - Editorial Precision Layout */}
      <div className="w-full bg-surface-container-low/70 backdrop-blur-md p-8 md:p-12 rounded-xl flex flex-col items-center text-center border border-outline-variant/10">
        {/* Icon with radial glow */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full scale-150"></div>
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-surface-container-highest">
            <span className="material-symbols-outlined text-5xl text-error">storage</span>
            <span className="material-symbols-outlined absolute -top-1 -right-1 text-2xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
        </div>
        {/* Typography Hierarchy */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface mb-6 font-['Inter']">
          Veri Depolama Hatası
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 font-['Inter']">
          {errorMessage}
        </p>
        {/* Technical Detail Card (Minimalist Layering) */}
        <div className="w-full bg-surface-container-low p-4 rounded-lg mb-10 flex items-start gap-4 text-left border-l-2 border-error/50">
          <span className="material-symbols-outlined text-on-secondary-container mt-1">info</span>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-on-secondary-container font-bold mb-1">Hata Kodu: {errorCode}</span>
            <p className="text-xs text-on-surface-variant leading-snug font-['Inter']">
              Sistem yerel veritabanına erişim sağlayamadı. Gizli sekme kullanımı veya düşük disk alanı buna sebep olmuş olabilir.
            </p>
          </div>
        </div>
        {/* Action Area */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleRetry}
            className="flex-1 h-14 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
            <span>Tekrar Dene</span>
          </button>
          <button
            onClick={handleSettings}
            className="flex-1 h-14 border border-outline-variant/20 text-primary font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span>Ayarlar</span>
          </button>
        </div>
      </div>
      {/* Footer / Editorial Context */}
      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-medium font-['Inter']">
          The Nocturnal Architect — Takvim-62161
        </p>
      </div>
    </main>
  );
}
