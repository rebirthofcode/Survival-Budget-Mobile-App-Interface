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
import { ExpenseCategories } from './components/ExpenseCategories';
import { BetaAccessGate, hasBetaAccess } from './components/BetaAccessGate';
import { Privacy } from './pages/Privacy';

type BudgetData = {
  income: number;
  rent: number;
  groceries: number;
  utilities: number;
};

type Screen = 'onboarding' | 'home' | 'budget' | 'categories' | 'savings' | 'profile';

const LS = {
  onboarded: 'onboardingCompleted',
  budget: 'budgetData',
  lastSession: 'lastSession',
} as const;

const SCREEN_ORDER: Screen[] = ['home', 'budget', 'categories', 'savings', 'profile'];

const getTransition = (
  prev: Screen | null,
  curr: Screen
): 'slide-left' | 'slide-right' | 'fade' => {
  if (!prev) return 'fade';
  if (prev === 'onboarding' && curr === 'budget') return 'slide-left';
  const pi = SCREEN_ORDER.indexOf(prev);
  const ci = SCREEN_ORDER.indexOf(curr);
  if (pi !== -1 && ci !== -1) return pi < ci ? 'slide-left' : 'slide-right';
  return 'fade';
};

const AppContent = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    rent: 0,
    groceries: 0,
    utilities: 0,
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [priorities, setPriorities] = useState<any[]>([]);

  const haptic = useHapticFeedback();
  const safeHaptic = (t: Parameters<typeof haptic.trigger>[0]) => {
    try {
      haptic.trigger(t);
    } catch (error) {
      // Haptic feedback not supported
      if (process.env.NODE_ENV === 'development') {
        console.warn('Haptic feedback not supported:', error);
      }
    }
  };

  // Initial load: determine onboarding vs. home/budget and load saved data
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem(LS.onboarded);
    const savedBudgetData = localStorage.getItem(LS.budget);
    const savedPriorities = localStorage.getItem('budgetPriorities');
    const lastSession = localStorage.getItem(LS.lastSession);
    const now = Date.now();

    // Load priorities if available
    if (savedPriorities) {
      try {
        setPriorities(JSON.parse(savedPriorities));
      } catch (error) {
        console.error('Error loading priorities:', error);
      }
    }

    if (onboardingCompleted === 'true' && savedBudgetData) {
      setBudgetData(JSON.parse(savedBudgetData));

      const isNewSession = !lastSession || now - parseInt(lastSession, 10) > 86400000; // 24 hours
      if (isNewSession) {
        setIsReturningUser(true);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('budget');
      }

      localStorage.setItem(LS.lastSession, String(now));
    } else {
      setCurrentScreen('onboarding');
    }
  }, []);

  // Listen for priority changes from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPriorities = localStorage.getItem('budgetPriorities');
      if (savedPriorities) {
        try {
          setPriorities(JSON.parse(savedPriorities));
        } catch (error) {
          console.error('Error loading priorities:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavigateWithTransition = (screen: Screen) => {
    if (currentScreen === screen) return;
    safeHaptic('light');
    setIsTransitioning(true);
    setPreviousScreen(currentScreen);

    // Clear returning user flag when leaving home
    if (screen !== 'home') setIsReturningUser(false);

    // Small delay lets CSS animation class apply cleanly
    setTimeout(() => {
      setCurrentScreen(screen);
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousScreen(null);
      }, 300);
    }, 50);
  };

  const completeOnboarding = (data: BudgetData) => {
    localStorage.setItem(LS.onboarded, 'true');
    localStorage.setItem(LS.budget, JSON.stringify(data));
    localStorage.setItem(LS.lastSession, String(Date.now()));
    setBudgetData(data);
    setIsReturningUser(false);
    setShowMenu(false);
    setShowNotifications(false);
    handleNavigateWithTransition('budget');
  };

  const resetOnboarding = () => {
    localStorage.removeItem(LS.onboarded);
    localStorage.removeItem(LS.budget);
    localStorage.removeItem(LS.lastSession);
    setBudgetData({ income: 0, rent: 0, groceries: 0, utilities: 0 });
    setIsReturningUser(false);
    setShowMenu(false);
    setShowNotifications(false);
    handleNavigateWithTransition('onboarding');
  };

  const handleRefresh = async () => {
    safeHaptic('light');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        safeHaptic('medium');
        resolve();
      }, 1500);
    });
  };

  const transitionType = getTransition(previousScreen, currentScreen);
  const transitionClass = isTransitioning
    ? `motion-safe:animate-${
        transitionType === 'slide-left'
          ? 'slide-in-left'
          : transitionType === 'slide-right'
          ? 'slide-in-right'
          : 'fade-in'
      }`
    : '';

  // Notifications overlay
  const notificationsOverlay = showNotifications ? (
    <NotificationSheet
      isOpen={showNotifications}
      onClose={() => {
        safeHaptic('light');
        setShowNotifications(false);
      }}
    />
  ) : null;

  // Menu drawer
  const menuDrawer = showMenu ? (
    <MobileDrawer
      isOpen={showMenu}
      onClose={() => {
        safeHaptic('light');
        setShowMenu(false);
      }}
      userName="User"
      email="user@example.com"
      onNavigate={handleNavigateWithTransition}
      onLogout={resetOnboarding}
    />
  ) : null;

  // Early return for onboarding
  if (currentScreen === 'onboarding') {
    return <Onboarding completeOnboarding={completeOnboarding} />;
  }

  // Determine screen content
  let screenContent: JSX.Element | null = null;

  switch (currentScreen) {
    case 'home':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader
            showLogo={true}
            onNotificationClick={() => {
              safeHaptic('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              safeHaptic('light');
              setShowMenu(!showMenu);
            }}
          />
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="w-full max-w-md mx-auto p-4">
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
                {isReturningUser && (
                  <p className="text-xs text-gray-500 mb-2">Welcome back 👋</p>
                )}
                <h2 className="text-xl font-bold text-gray-900 mb-4">You’re set up</h2>
                <p className="text-gray-600 mb-6">
                  Your budget is ready. Use the navigation below to view details.
                </p>
                <button
                  aria-label="View your budget"
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
              safeHaptic('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              safeHaptic('light');
              setShowMenu(!showMenu);
            }}
          />
          <BudgetApp
            initialIncome={budgetData.income}
            initialRent={budgetData.rent}
            initialGroceries={budgetData.groceries}
            initialUtilities={budgetData.utilities}
          />
        </div>
      );
      break;

    case 'categories':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader
            title="Categories"
            showLogo={false}
            onNotificationClick={() => {
              safeHaptic('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              safeHaptic('light');
              setShowMenu(!showMenu);
            }}
          />
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="w-full p-4">
              <ExpenseCategories priorities={priorities} />
            </div>
          </PullToRefresh>
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
              safeHaptic('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              safeHaptic('light');
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
              safeHaptic('light');
              setShowNotifications(true);
            }}
            onMenuClick={() => {
              safeHaptic('light');
              setShowMenu(!showMenu);
            }}
          />
          <div className="w-full p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              <button
                aria-label="Reset app and start over"
                onClick={resetOnboarding}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-md font-medium shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reset app & start over
              </button>
            </div>
          </div>
        </div>
      );
      break;

    default:
      screenContent = null;
  }

  return (
    <HapticFeedback>
      <div className={`relative ${transitionClass}`}>
        {screenContent}

        {/* Bottom nav on all non-onboarding screens */}
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
  // Check if we're on the privacy page
  if (window.location.pathname === '/privacy') {
    return <Privacy />;
  }

  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    // Check if user has beta access on mount
    const checkAccess = () => {
      const access = hasBetaAccess();
      setHasAccess(access);
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, []);

  const handleGrantAccess = () => {
    setHasAccess(true);
  };

  // Show loading state briefly
  if (isCheckingAccess) {
    return (
      <div className="flex w-full min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show beta gate if no access
  if (!hasAccess) {
    return <BetaAccessGate onGrantAccess={handleGrantAccess} />;
  }

  // Show main app if access granted
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AppContent />
    </div>
  );
}
