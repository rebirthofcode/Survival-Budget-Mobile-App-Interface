import React from 'react';
import { HomeIcon, BarChart3Icon, PiggyBankIcon, UserIcon, PlusIcon } from 'lucide-react';
type NavigationItem = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
};
type MobileNavigationProps = {
  activeScreen: string;
  onNavigate: (screen: string) => void;
};
export const MobileNavigation = ({
  activeScreen,
  onNavigate
}: MobileNavigationProps) => {
  const navigationItems: NavigationItem[] = [{
    icon: <HomeIcon className="h-6 w-6" />,
    label: 'Home',
    isActive: activeScreen === 'dashboard',
    onClick: () => onNavigate('dashboard')
  }, {
    icon: <BarChart3Icon className="h-6 w-6" />,
    label: 'Budget',
    isActive: activeScreen === 'budget',
    onClick: () => onNavigate('budget')
  }, {
    icon: <div className="relative -mt-8 bg-orange-600 rounded-full p-3 border-4 border-white shadow-lg">
          <PlusIcon className="h-6 w-6 text-white" />
        </div>,
    label: '',
    isActive: false,
    onClick: () => onNavigate('onboarding')
  }, {
    icon: <PiggyBankIcon className="h-6 w-6" />,
    label: 'Savings',
    isActive: activeScreen === 'savings',
    onClick: () => onNavigate('budget')
  }, {
    icon: <UserIcon className="h-6 w-6" />,
    label: 'Profile',
    isActive: activeScreen === 'profile',
    onClick: () => onNavigate('profile')
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-10">
      <div className="flex justify-around items-center">
        {navigationItems.map((item, index) => <button key={index} className={`flex flex-col items-center justify-center ${item.isActive ? 'text-orange-600' : 'text-gray-500'}`} onClick={item.onClick}>
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>)}
      </div>
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-bottom bg-white"></div>
    </div>;
};