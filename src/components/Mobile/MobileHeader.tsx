import React from 'react';
import { BellIcon, MenuIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';
type MobileHeaderProps = {
  title?: string;
  showLogo?: boolean;
  showNotification?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
};
export const MobileHeader = ({
  title,
  showLogo = true,
  showNotification = true,
  showMenu = true,
  onMenuClick,
  onNotificationClick
}: MobileHeaderProps) => {
  return <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-top bg-white"></div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showMenu && <button onClick={onMenuClick} className="mr-3 text-gray-600 focus:outline-none" aria-label="Menu">
              <MenuIcon className="h-6 w-6" />
            </button>}
          {showLogo ? <Logo variant="light" size="sm" withText={true} tagline={true} /> : <h1 className="text-lg font-bold text-gray-900">{title}</h1>}
        </div>
        {showNotification && <button onClick={onNotificationClick} className="relative text-gray-600 focus:outline-none" aria-label="Notifications">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-orange-500 rounded-full"></span>
          </button>}
      </div>
    </div>;
};