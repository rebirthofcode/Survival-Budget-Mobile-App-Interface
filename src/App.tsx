import { useEffect, useState } from 'react';
import { BudgetApp } from './components/BudgetApp';
import { Onboarding } from './components/Onboarding/Onboarding';
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
import { AppInstallBanner } from './components/Mobile/AppInstallBanner';
import { OfflineIndicator } from './components/Mobile/OfflineIndicator';
import { HapticFeedback, useHapticFeedback } from './components/Mobile/HapticFeedback';
const AppContent = () => {
  const {
    user,
    login,
    logout,
    isAuthenticated
  } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [income, setIncome] = useState<number>(2000);
  const [currentScreen, setCurrentScreen] = useState<'signup' | 'registrationSuccess' | 'dashboard' | 'onboarding' | 'budget' | 'profile' | 'savings'>('signup');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const haptic = useHapticFeedback();
  useEffect(() => {
    // Check if user has completed onboarding before
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (isAuthenticated) {
      if (onboardingCompleted === 'true') {
        setCurrentScreen('dashboard');
        setShowOnboarding(false);
      } else {
        setCurrentScreen('registrationSuccess');
      }
    } else {
      setCurrentScreen('signup');
    }
    // Show install banner after 3 seconds if user is authenticated
    if (isAuthenticated && !localStorage.getItem('installBannerDismissed')) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);
  const completeOnboarding = (userIncome?: number) => {
    localStorage.setItem('onboardingCompleted', 'true');
    if (userIncome) {
      setIncome(userIncome);
    }
    setShowOnboarding(false);
    handleNavigateWithTransition('dashboard');
  };
  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    setShowOnboarding(true);
    handleNavigateWithTransition('onboarding');
  };
  const handleSignupComplete = (userData: {
    firstName: string;
    email: string;
  }) => {
    haptic.trigger('medium');
    login(userData);
    handleNavigateWithTransition('registrationSuccess');
  };
  const handleStartBudgeting = () => {
    haptic.trigger('medium');
    if (showOnboarding) {
      handleNavigateWithTransition('onboarding');
    } else {
      handleNavigateWithTransition('budget');
    }
  };
  const handleRefresh = async () => {
    // Simulate a refresh action
    haptic.trigger('light');
    return new Promise<void>(resolve => {
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
    // Short delay to allow animation to start
    setTimeout(() => {
      setCurrentScreen(screen as any);
      // Allow time for transition to complete
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousScreen(null);
      }, 300);
    }, 50);
  };
  const dismissInstallBanner = () => {
    haptic.trigger('light');
    setShowInstallBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };
  // Determine what to show
  if (!isAuthenticated) {
    return <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto p-4">
          <SignupForm onComplete={handleSignupComplete} />
        </div>
      </div>;
  }
  // Show notifications overlay if enabled
  const notificationsOverlay = showNotifications ? <NotificationSheet isOpen={showNotifications} onClose={() => {
    haptic.trigger('light');
    setShowNotifications(false);
  }} /> : null;
  // Show menu drawer if enabled
  const menuDrawer = showMenu ? <MobileDrawer isOpen={showMenu} onClose={() => {
    haptic.trigger('light');
    setShowMenu(false);
  }} userName={user?.firstName || ''} email={user?.email || ''} onNavigate={handleNavigateWithTransition} onLogout={() => {
    haptic.trigger('medium');
    logout();
  }} /> : null;
  // Get transition direction based on screen navigation
  const getTransitionType = () => {
    // Define screen order for horizontal transitions
    const screenOrder = ['dashboard', 'budget', 'savings', 'profile'];
    if (!previousScreen || !currentScreen) return 'fade';
    // Special cases
    if (previousScreen === 'registrationSuccess' && currentScreen === 'onboarding') return 'slide-left';
    if (previousScreen === 'onboarding' && currentScreen === 'dashboard') return 'slide-left';
    const prevIndex = screenOrder.indexOf(previousScreen);
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (prevIndex !== -1 && currentIndex !== -1) {
      return prevIndex < currentIndex ? 'slide-left' : 'slide-right';
    }
    return 'fade';
  };
  // Determine current screen content
  let screenContent;
  switch (currentScreen) {
    case 'registrationSuccess':
      screenContent = <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto p-4">
            <RegistrationSuccess userName={user?.firstName || ''} onContinue={() => handleNavigateWithTransition('onboarding')} />
          </div>
        </div>;
      break;
    case 'onboarding':
      screenContent = <Onboarding completeOnboarding={completeOnboarding} initialIncome={income} userName={user?.firstName} />;
      break;
    case 'dashboard':
      screenContent = <div className="w-full pb-20">
          <MobileHeader showLogo={true} onNotificationClick={() => {
          haptic.trigger('light');
          setShowNotifications(true);
        }} onMenuClick={() => {
          haptic.trigger('light');
          setShowMenu(!showMenu);
        }} />
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="w-full p-4">
              <Dashboard userName={user?.firstName || ''} onStartBudgeting={handleStartBudgeting} onViewProfile={() => handleNavigateWithTransition('profile')} />
            </div>
          </PullToRefresh>
        </div>;
      break;
    case 'budget':
      screenContent = <div className="w-full pb-20">
          <MobileHeader title="Budget" showLogo={false} onNotificationClick={() => {
          haptic.trigger('light');
          setShowNotifications(true);
        }} onMenuClick={() => {
          haptic.trigger('light');
          setShowMenu(!showMenu);
        }} />
          <BudgetApp initialIncome={income} resetOnboarding={resetOnboarding} userName={user?.firstName} />
        </div>;
      break;
    case 'profile':
      screenContent = <div className="w-full pb-20">
          <MobileHeader title="Profile" showLogo={false} onNotificationClick={() => {
          haptic.trigger('light');
          setShowNotifications(true);
        }} onMenuClick={() => {
          haptic.trigger('light');
          setShowMenu(!showMenu);
        }} />
          <div className="w-full p-4">
            <ProfileSettings userName={user?.firstName || ''} email={user?.email || ''} onBack={() => handleNavigateWithTransition('dashboard')} onLogout={() => {
            haptic.trigger('medium');
            logout();
          }} />
          </div>
        </div>;
      break;
    default:
      screenContent = <div className="w-full pb-20">
          <MobileHeader showLogo={true} onNotificationClick={() => {
          haptic.trigger('light');
          setShowNotifications(true);
        }} onMenuClick={() => {
          haptic.trigger('light');
          setShowMenu(!showMenu);
        }} />
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="w-full p-4">
              <Dashboard userName={user?.firstName || ''} onStartBudgeting={handleStartBudgeting} onViewProfile={() => handleNavigateWithTransition('profile')} />
            </div>
          </PullToRefresh>
        </div>;
  }
  // Apply transition animation classes
  const transitionType = getTransitionType();
  const transitionClass = isTransitioning ? `animate-${transitionType === 'slide-left' ? 'slide-in-left' : transitionType === 'slide-right' ? 'slide-in-right' : 'fade-in'}` : '';
  return <HapticFeedback>
      <div className={`relative ${transitionClass}`}>
        {screenContent}
        {/* Only show navigation on authenticated screens except onboarding */}
        {isAuthenticated && currentScreen !== 'onboarding' && currentScreen !== 'registrationSuccess' && <MobileNavigation activeScreen={currentScreen} onNavigate={handleNavigateWithTransition} />}
        {notificationsOverlay}
        {menuDrawer}
        {/* App install banner */}
        {/*showInstallBanner && <AppInstallBanner onDismiss={dismissInstallBanner} />*/}
        {/* Offline indicator */}
        <OfflineIndicator />
      </div>
    </HapticFeedback>;
};
export function App() {
  return <div className="flex w-full min-h-screen bg-gray-50">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>;
}