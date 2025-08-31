export const AppInstallBanner = ({
  onDismiss
}: AppInstallBannerProps) => {
  return null; // Temporarily disable banner entirely
  
  const [isIOS, setIsIOS] = useState(false);
  // ... rest of component
import { useEffect, useState } from 'react';
import { XIcon, DownloadIcon, SmartphoneIcon } from 'lucide-react';
type AppInstallBannerProps = {
  onDismiss: () => void;
};
export const AppInstallBanner = ({
  onDismiss
}: AppInstallBannerProps) => {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    // Check if device is iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);
  }, []);
  return <div className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-30 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <SmartphoneIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              Install Survival Budget
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isIOS ? "Tap the share button and select 'Add to Home Screen'" : 'Install this app on your device for quick access'}
            </p>
            {!isIOS && <button className="mt-3 bg-orange-600 text-white text-sm py-2 px-4 rounded-md flex items-center" aria-label="Install app">
                <DownloadIcon className="h-4 w-4 mr-1" />
                Install App
              </button>}
          </div>
          <button onClick={onDismiss} className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500" aria-label="Dismiss">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};