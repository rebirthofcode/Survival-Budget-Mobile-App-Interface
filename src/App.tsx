import { useState, useEffect } from 'react';
import { BudgetApp } from './components/BudgetApp';
import { Onboarding } from './components/Onboarding/Onboarding';
import { MobileNavigation } from './components/Mobile/MobileNavigation';
import { MobileHeader } from './components/Mobile/MobileHeader';
import { NotificationSheet } from './components/Mobile/NotificationSheet';
import { PullToRefresh } from './components/Mobile/PullToRefresh';
import { MobileDrawer } from './components/Mobile/MobileDrawer';
import { OfflineIndicator } from './components/Mobile/OfflineIndicator';
import { HapticFeedback, useHapticFeedback } from './components/Mobile/HapticFeedback';

type BudgetData = {
  income: number;
  rent: number;
  groceries: number;
  utilities: number;
};

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    rent: 0,
    groceries: 0,
    utilities: 0
  });
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'budget' | 'savings' | 'profile'>('onboarding');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  const haptic = useHapticFeedback();

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const savedBudgetData = localStorage.getItem('budgetData');
    const lastSession = localStorage.getItem('lastSession');
    const currentTime = Date.now();
    
    if (onboardingCompleted === 'true' && savedBudgetData) {
      setShowOnboarding(false);
      setBudgetData(JSON.parse(savedBudgetData));
      
      // Check if this is a new session (user closed and reopened app)
      // Consider it a new session if more than 5 minutes have passed
      const isNewSession = !lastSession || (currentTime - parseInt(lastSession)) > 300000;
      
      if (isNewSession) {
        setIsReturningUser(true);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('budget');
      }
      
      // Update last session timestamp
      localStorage.setItem('lastSession', currentTime.toString());
    } else {
      setCurrentScreen('onboarding');
    }
  }, []);

  const completeOnboarding = (data: BudgetData) => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('budgetData', JSON.stringify(data));
    localStorage.setItem('lastSession', Date.now().toString());
    setBudgetData(data);
    setShowOnboarding(false);
    setIsReturningUser(false);
    setShowMenu(false);
    setShowNotifications(false);
    // Go directly to budget after completing onboarding
    handleNavigateWithTransition('budget');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('budgetData');
    localStorage.removeItem('lastSession');
    setShowOnboarding(true);
    setBudgetData({ income: 0, rent: 0, groceries: 0, utilities: 0 });
    setIsReturningUser(false);
    setShowMenu(false);
    setShowNotifications(false);
    handleNavigateWithTransition('onboarding');
  };

  const handleRefresh = async () => {
    haptic.trigger('light');
    return new Promise<void>(resolve => {
      setTimeout(() => {
        haptic.trigger('medium');
        resolve();
      }, 1500);
    });
  };

  const handleNavigateWithTransition = (screen: string) => {
    if (currentScreen === screen) return;
    haptic.trigger('light');
    setIsTransitioning(true);
    setPreviousScreen(currentScreen);
    
    // Clear returning user flag when navigating away from home
    if (screen !== 'home') {
      setIsReturningUser(false);
    }
    
    setTimeout(() => {
      setCurrentScreen(screen as any);
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousScreen(null);
      }, 300);
    }, 50);
  };

  const getTransitionType = () => {
    const screenOrder = ['home', 'budget', 'savings', 'profile'];
    if (!previousScreen || !currentScreen) return 'fade';
    
    if (previousScreen === 'onboarding' && currentScreen === 'budget') return 'slide-left';
    
    const prevIndex = screenOrder.indexOf(previousScreen);
    const currentIndex = screenOrder.indexOf(currentScreen);
    
    if (prevIndex !== -1 && currentIndex !== -1) {
      return prevIndex < currentIndex ? 'slide-left' : 'slide-right';
    }
    
    return 'fade';
  };

  // Show onboarding if not completed
  if (showOnboarding || currentScreen === 'onboarding') {
    return <Onboarding completeOnboarding={completeOnboarding} />;
  }

  // Notifications overlay
  const notificationsOverlay = showNotifications ? (
    <NotificationSheet 
      isOpen={showNotifications} 
      onClose={() => {
        haptic.trigger('light');
        setShowNotifications(false);
      }} 
    />
  ) : null;

  // Menu drawer
  const menuDrawer = showMenu ? (
    <MobileDrawer 
      isOpen={showMenu} 
      onClose={() => {
        haptic.trigger('light');
        setShowMenu(false);
      }} 
      userName="User"
      email="user@example.com"
      onNavigate={handleNavigateWithTransition}
      onLogout={resetOnboarding}
    />
  ) : null;

  // Determine screen content
  let screenContent;
  
  switch (currentScreen) {
    case 'home':
      // Only show welcome back screen for returning users
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader 
            showLogo={true}
            onNotificationClick={() => {
              haptic.trigger('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              haptic.trigger('light');
              setShowMenu(!showMenu);
            }}
          />
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="w-full max-w-md mx-auto p-4">
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back!</h2>
                <p className="text-gray-600 mb-6">
                  Your budget is set up. Use the navigation below to view your budget details.
                </p>
                <button
                  onClick={() => handleNavigateWithTransition('budget')}
                  className="w-full py-4 px-6 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  View Budget
                </button>
              </div>
            </div>
          </PullToRefresh>
        </div>
      );
      break;
      
    case 'budget':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader 
            title="Budget"
            showLogo={false}
            onNotificationClick={() => {
              haptic.trigger('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              haptic.trigger('light');
              setShowMenu(!showMenu);
            }}
          />
          <BudgetApp
            initialIncome={budgetData.income}
          />
        </div>
      );
      break;
      
    case 'savings':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader 
            title="Savings"
            showLogo={false}
            onNotificationClick={() => {
              haptic.trigger('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              haptic.trigger('light');
              setShowMenu(!showMenu);
            }}
          />
          <div className="w-full p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Savings</h2>
              <p className="text-gray-600">Savings features coming soon!</p>
            </div>
          </div>
        </div>
      );
      break;
      
    case 'profile':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader 
            title="Profile"
            showLogo={false}
            onNotificationClick={() => {
              haptic.trigger('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              haptic.trigger('light');
              setShowMenu(!showMenu);
            }}
          />
          <div className="w-full p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              <button
                onClick={resetOnboarding}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-md font-medium shadow-sm hover:bg-red-600"
              >
                Reset Onboarding
              </button>
            </div>
          </div>
        </div>
      );
      break;
      
    default:
      screenContent = null;
  }

  const transitionType = getTransitionType();
  const transitionClass = isTransitioning 
    ? `animate-${transitionType === 'slide-left' ? 'slide-in-left' : transitionType === 'slide-right' ? 'slide-in-right' : 'fade-in'}` 
    : '';

  return (
    <HapticFeedback>
      <div className={`relative ${transitionClass}`}>
        {screenContent}
        
        {/* Show navigation on all screens except onboarding */}
        {currentScreen !== 'onboarding' && (
          <MobileNavigation 
            activeScreen={currentScreen}
            onNavigate={handleNavigateWithTransition}
          />
        )}
        
        {notificationsOverlay}
        {menuDrawer}
        <OfflineIndicator />
      </div>
    </HapticFeedback>
  );
};

export function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AppContent />
    </div>
  );
}