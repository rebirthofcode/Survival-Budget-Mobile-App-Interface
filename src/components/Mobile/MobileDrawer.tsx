import React, { useEffect } from 'react';
import { XIcon, HomeIcon, BarChart3Icon, PiggyBankIcon, UserIcon, BellIcon, SettingsIcon, LogOutIcon, HelpCircleIcon, UserPlusIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  email: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  isGuestUser: boolean;
  onCreateAccount: () => void;
};

export const MobileDrawer = ({
  isOpen,
  onClose,
  userName,
  email,
  onNavigate,
  onLogout,
  isGuestUser,
  onCreateAccount
}: MobileDrawerProps) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle navigation and close drawer
  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  // Handle create account and close drawer
  const handleCreateAccount = () => {
    onCreateAccount();
    onClose();
  };

  // Handle logout and close drawer
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-out" 
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="h-safe-area-top bg-white"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Logo variant="light" size="sm" withText={true} tagline={true} />
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none" 
            aria-label="Close menu"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User profile */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-orange-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-600">{email}</p>
              {isGuestUser && (
                <p className="text-xs text-orange-600 font-medium">Guest User</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Navigation
          </div>
          <button 
            onClick={() => handleNavigate('dashboard')} 
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <HomeIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => handleNavigate('budget')} 
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <BarChart3Icon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Budget</span>
          </button>
          <button 
            onClick={() => handleNavigate('savings')} 
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <PiggyBankIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Savings</span>
          </button>
          <button 
            onClick={() => handleNavigate('profile')} 
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <UserIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Profile</span>
          </button>
        </div>

        <div className="border-t border-gray-200 py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </div>
          <button 
            onClick={() => handleNavigate('profile')} 
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <SettingsIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <BellIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <HelpCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          {isGuestUser ? (
            <button 
              onClick={handleCreateAccount}
              className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white hover:bg-orange-700 rounded-md mb-3"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              <span>Create Account</span>
            </button>
          ) : (
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};