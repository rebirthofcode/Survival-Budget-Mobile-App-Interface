import React, { useEffect, useState } from 'react';
import { WifiOffIcon } from 'lucide-react';
export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Keep the "back online" message visible for a moment
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Initial check
    setIsOffline(!navigator.onLine);
    setIsVisible(!navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  if (!isVisible) return null;
  return <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm font-medium transition-all duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isOffline ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`} style={{
    paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)'
  }}>
      {isOffline ? <div className="flex items-center justify-center">
          <WifiOffIcon className="h-4 w-4 mr-1" />
          <span>You're offline. Some features may be unavailable.</span>
        </div> : <span>You're back online!</span>}
    </div>;
};