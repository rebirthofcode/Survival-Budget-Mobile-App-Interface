import { useEffect, useRef } from 'react';
import { XIcon, HomeIcon, BarChart3Icon, PiggyBankIcon, UserIcon, SettingsIcon, RotateCcwIcon, HelpCircleIcon, CalendarIcon, TagIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  email: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
};

export const MobileDrawer = ({
  isOpen,
  onClose,
  userName,
  email,
  onNavigate,
  onLogout
}: MobileDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  // Focus management and keyboard trap
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when opened
    const focusFirstElement = () => {
      closeButtonRef.current?.focus();
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(focusFirstElement, 100);

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus within drawer
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle navigation and close drawer
  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="h-safe-area-top bg-white"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Logo variant="light" size="sm" withText={true} tagline={true} />
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
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
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Navigation
          </div>
          <button 
            onClick={() => handleNavigate('home')}
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
            onClick={() => handleNavigate('categories')}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <TagIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => handleNavigate('history')}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <CalendarIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Budget History</span>
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
            More
          </div>
          <button
            onClick={() => handleNavigate('settings')}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <SettingsIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleNavigate('help')}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <HelpCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Reset App (was Log Out) */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-md"
          >
            <RotateCcwIcon className="h-5 w-5 mr-3" />
            <span>Reset App</span>
          </button>
        </div>
      </div>
    </div>
  );
};