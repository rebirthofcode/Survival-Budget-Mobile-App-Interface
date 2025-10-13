import { useEffect, useState } from 'react';
import { BudgetApp } from './components/BudgetApp';
import Onboarding from './components/Onboarding/Onboarding';
import { DevControls } from './components/DevControls';

import { SignupForm } from './components/Auth/SignupForm';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import { RegistrationSuccess } from './components/Auth/RegistrationSuccess';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { MobileNavigation } from './components/Mobile/MobileNavigation';
import { MobileHeader } from './components/Mobile/MobileHeader';
import { NotificationSheet } from './components/Mobile/NotificationSheet';
import { PullToRefresh } from './components/Mobile/PullToRefresh';
import { MobileDrawer } from './components/Mobile/MobileDrawer';
import { OfflineIndicator } from './components/Mobile/OfflineIndicator';
import { HapticFeedback, useHapticFeedback } from './components/Mobile/HapticFeedback';

const AppContent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [income, setIncome] = useState<number>(2000);
  const [currentScreen, setCurrentScreen] = useState<
    'signup' | 'registrationSuccess' | 'dashboard' | 'onboarding' | 'budget' | 'profile' | 'savings'
  >('onboarding');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);

  const [previousScreen, setPreviousScreen] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const haptic = useHapticFeedback();

  // Debug: Track screen changes
  useEffect(() => {
    console.log('Current screen changed to:', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    console.log('=== App useEffect triggered ===');
    console.log('isAuthenticated:', isAuthenticated);

    // Read as booleans
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    const hasGuestSession = localStorage.getItem('guestSession') === 'true';

    console.log('onboardingCompleted:', onboardingCompleted);
    console.log('hasGuestSession:', hasGuestSession);

    if (isAuthenticated) {
      console.log('Branch: authenticated user');
      if (onboardingCompleted) {
        console.log('Setting screen to dashboard');
        setIsGuestUser(false); // ✅ authenticated + completed => not a guest view
        setCurrentScreen('dashboard');
        setShowOnboarding(false);
      } else {
        console.log('Setting screen to onboarding (authenticated)');
        setIsGuestUser(false); // keep non-guest
        setCurrentScreen('onboarding');
      }
    } else if (hasGuestSession) {
      console.log('Branch: returning guest');
      if (onboardingCompleted) {
        // ✅ onboarded guest should see the onboarded dashboard
        setIsGuestUser(false);
        setCurrentScreen('dashboard');
        setShowOnboarding(false);
      } else {
        setIsGuestUser(true);
        setCurrentScreen('onboarding');
      }
      // Auto-login as guest identity for the session
      login({ firstName: 'Guest', email: 'guest@app.com' });
    } else {
      console.log('Branch: new user');
      setIsGuestUser(true);
      localStorage.setItem('guestSession', 'true');
      console.log('Setting currentScreen to onboarding');
      setCurrentScreen('onboarding');
      console.log('Calling login for guest');
      login({ firstName: 'Guest', email: 'guest@app.com' });
    }
  }, [isAuthenticated, login]);

  const completeOnboarding = (userIncome?: number) => {
    localStorage.setItem('onboardingCompleted', 'true');
    if (userIncome) setIncome(userIncome);
    setIsGuestUser(false); // ✅ flip to non-guest so Dashboard shows Essentials Covered
    setShowOnboarding(false);
    handleNavigateWithTransition('dashboard');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    setIsGuestUser(true);
    setShowOnboarding(true);
    handleNavigateWithTransition('onboarding');
  };

  const handleSignupComplete = (userData: { firstName: string; email: string }) => {
    haptic.trigger('medium');
    setIsGuestUser(false);
    localStorage.removeItem('guestSession');
    login(userData);
    handleNavigateWithTransition('dashboard');
  };

  const handleCreateAccount = () => {
    haptic.trigger('medium');
    handleNavigateWithTransition('signup');
  };

  const handleStartBudgeting = () => {
    haptic.trigger('medium');
    if (showOnboarding) handleNavigateWithTransition('onboarding');
    else handleNavigateWithTransition('budget');
  };

  const handleRefresh = async () => {
    haptic.trigger('light');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Content refreshed');
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
    setTimeout(() => {
      setCurrentScreen(screen as any);
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousScreen(null);
      }, 300);
    }, 50);
  };

  const notificationsOverlay = showNotifications ? (
    <NotificationSheet
      isOpen={showNotifications}
      onClose={() => {
        haptic.trigger('light');
        setShowNotifications(false);
      }}
    />
  ) : null;

  const menuDrawer = showMenu ? (
    <MobileDrawer
      isOpen={showMenu}
      onClose={() => {
        haptic.trigger('light');
        setShowMenu(false);
      }}
      userName={user?.firstName || ''}
      email={user?.email || ''}
      onNavigate={handleNavigateWithTransition}
      onLogout={() => {
        haptic.trigger('medium');
        logout();
      }}
      isGuestUser={isGuestUser}
      onCreateAccount={handleCreateAccount}
    />
  ) : null;

  const getTransitionType = () => {
    const screenOrder = ['dashboard', 'budget', 'savings', 'profile'];
    if (!previousScreen || !currentScreen) return 'fade';
    if (previousScreen === 'registrationSuccess' && currentScreen === 'onboarding') return 'slide-left';
    if (previousScreen === 'onboarding' && currentScreen === 'dashboard') return 'slide-left';
    if (previousScreen === 'dashboard' && currentScreen === 'signup') return 'slide-up';
    if (previousScreen === 'signup' && currentScreen === 'dashboard') return 'slide-down';
    const prevIndex = screenOrder.indexOf(previousScreen);
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (prevIndex !== -1 && currentIndex !== -1) {
      return prevIndex < currentIndex ? 'slide-left' : 'slide-right';
    }
    return 'fade';
  };

  console.log('=== Rendering screen ===', currentScreen);

  let screenContent: JSX.Element;
  switch (currentScreen) {
    case 'signup':
      screenContent = (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto p-4">
            <SignupForm onComplete={handleSignupComplete} />
          </div>
        </div>
      );
      break;
    case 'registrationSuccess':
      screenContent = (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto p-4">
            <RegistrationSuccess
              userName={user?.firstName || ''}
              onContinue={() => handleNavigateWithTransition('onboarding')}
            />
          </div>
        </div>
      );
      break;
    case 'onboarding':
      screenContent = (
        <Onboarding
          completeOnboarding={completeOnboarding}
          initialIncome={income}
          userName={user?.firstName}
        />
      );
      break;
    case 'dashboard':
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader
            showLogo
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
            <div className="w-full p-4">
              <Dashboard
                userName={user?.firstName || ''}
                isGuestUser={isGuestUser}
                onCreateAccount={handleCreateAccount}
                onStartBudgeting={handleStartBudgeting}
                onViewProfile={() => handleNavigateWithTransition('profile')}
              />
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
          <BudgetApp initialIncome={income} resetOnboarding={resetOnboarding} userName={user?.firstName} />
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
            <ProfileSettings
              userName={user?.firstName || ''}
              email={user?.email || ''}
              isGuestUser={isGuestUser}
              onCreateAccount={handleCreateAccount}
              onBack={() => handleNavigateWithTransition('dashboard')}
              onLogout={() => {
                haptic.trigger('medium');
                logout();
              }}
            />
          </div>
        </div>
      );
      break;
    default:
      screenContent = (
        <div className="w-full pb-20">
          <MobileHeader
            showLogo
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
            <div className="w-full p-4">
              <Dashboard
                userName={user?.firstName || ''}
                isGuestUser={isGuestUser}
                onCreateAccount={handleCreateAccount}
                onStartBudgeting={handleStartBudgeting}
                onViewProfile={() => handleNavigateWithTransition('profile')}
              />
            </div>
          </PullToRefresh>
        </div>
      );
  }

  const transitionType = getTransitionType();
  const transitionClass = isTransitioning
    ? `animate-${
        transitionType === 'slide-left'
          ? 'slide-in-left'
          : transitionType === 'slide-right'
          ? 'slide-in-right'
          : 'fade-in'
      }`
    : '';

  return (
    <HapticFeedback>
      <div className={`relative ${transitionClass}`}>
        {screenContent}
        {/* Only show navigation on authenticated screens except onboarding and signup */}
        {currentScreen !== 'onboarding' &&
          currentScreen !== 'registrationSuccess' &&
          currentScreen !== 'signup' && (
            <MobileNavigation activeScreen={currentScreen} onNavigate={handleNavigateWithTransition} />
          )}
        {notificationsOverlay}
        {menuDrawer}
        <OfflineIndicator />
      </div>

      {/* Dev-only controls (auto-hidden in production) */}
      <DevControls />
    </HapticFeedback>
  );
};

export function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}
