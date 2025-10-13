

export function DevControls() {
  if (process.env.NODE_ENV === 'production') return null;

  const setAndReload = (pairs: Record<string, string | null>) => {
    Object.entries(pairs).forEach(([k, v]) => {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    });
    window.location.reload();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        background: '#111827',
        color: 'white',
        padding: '8px 10px',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,.25)',
        fontSize: 12,
        display: 'flex',
        gap: 8,
      }}
    >
      <span style={{ opacity: 0.7 }}>Dev:</span>
      <button onClick={() => setAndReload({ guestSession: 'true', onboardingCompleted: 'false' })}>
        Guest
      </button>
      <button onClick={() => setAndReload({ guestSession: 'true', onboardingCompleted: 'false' })}>
        Onboarding
      </button>
      <button onClick={() => setAndReload({ guestSession: 'true', onboardingCompleted: 'true' })}>
        Onboarded→Dashboard
      </button>
      <button onClick={() => setAndReload({ guestSession: null, onboardingCompleted: null })}>
        Clear Keys
      </button>
    </div>
  );
}
