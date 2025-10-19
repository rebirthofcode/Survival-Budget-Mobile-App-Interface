import { XIcon, HistoryIcon, SettingsIcon, HelpCircleIcon, InfoIcon, MenuIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

type NavigationMenuProps = {
  onNavigate: (page: 'budget' | 'history' | 'settings' | 'help' | 'about') => void;
};

export const NavigationMenu = ({ onNavigate }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap - keep focus within menu when open
  useEffect(() => {
    if (isOpen) {
      const menuElement = document.getElementById('navigation-menu');
      const focusableElements = menuElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  const handleNavigate = (page: 'budget' | 'history' | 'settings' | 'help' | 'about') => {
    setIsOpen(false);
    onNavigate(page);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {isOpen && (
        <div
          id="navigation-menu"
          className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl z-50 animate-slide-in-right"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('history')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <HistoryIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Budget History</p>
                    <p className="text-xs text-gray-500">View past monthly budgets</p>
                  </div>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigate('settings')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <SettingsIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-xs text-gray-500">Manage preferences</p>
                  </div>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigate('help')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <HelpCircleIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Help</p>
                    <p className="text-xs text-gray-500">Learn how to use the app</p>
                  </div>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <InfoIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">About</p>
                    <p className="text-xs text-gray-500">App version and info</p>
                  </div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Survival Budget v1.0
              <br />
              Priority-based budgeting
            </p>
          </div>
        </div>
      )}
    </>
  );
};
