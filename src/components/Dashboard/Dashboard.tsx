import {
  BarChart3Icon,
  CalendarIcon,
  PiggyBankIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  HomeIcon,
  CarIcon,
  CoffeeIcon,
  UserPlusIcon,
} from 'lucide-react';

type DashboardProps = {
  userName: string;
  isGuestUser: boolean;
  onCreateAccount: () => void;
  onStartBudgeting: () => void;
  onViewProfile: () => void;
};

export const Dashboard = ({
  userName,
  isGuestUser,
  onCreateAccount,
  onStartBudgeting,
  // onViewProfile is currently unused in this component
}: DashboardProps) => {
  // Read onboarding status from localStorage (browser-only guard)
  const onboardingCompleted =
    typeof window !== 'undefined' && localStorage.getItem('onboardingCompleted') === 'true';

  // Show the guest landing ONLY when still guest AND not completed onboarding
  const guestLanding = isGuestUser && !onboardingCompleted;

  // Debug log so you can confirm which branch is active
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const variant = guestLanding ? 'guest-view' : 'onboarded-view';
    console.groupCollapsed('[Dashboard] render');
    console.log({ isGuestUser, onboardingCompleted, guestLanding, variant });
    console.groupEnd();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Welcome back, {userName}!
        </h2>
        <p className="text-gray-600">
          {guestLanding
            ? "You're exploring as a guest. Create an account to save your progress."
            : "Your financial journey continues. Let's make every dollar count."
          }
        </p>
      </div>

      {guestLanding && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex items-center mb-3">
            <UserPlusIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Create Your Account</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Save your budgets, track your progress, and access your data from anywhere.
            Creating an account is free and takes just a few minutes.
          </p>
          <button
            onClick={onCreateAccount}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            Create Free Account
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}

      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <BarChart3Icon className="h-5 w-5 text-orange-600 mr-2" />
          <h3 className="font-medium text-gray-900">Budget Status</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {guestLanding
            ? "Try creating a budget to see how our system works. Your data won't be saved unless you create an account."
            : "You haven't created a budget yet. Start now to see your financial priorities."
          }
        </p>
        <button
          onClick={onStartBudgeting}
          className="w-full py-2 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
        >
          {guestLanding ? "Try Budget Tool" : "Create Your Budget"}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Budget Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Survival</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <CarIcon className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Important</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
              <CoffeeIcon className="h-5 w-5 text-pink-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Quality</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">Budget Timeline</h3>
          </div>
          <p className="text-sm text-gray-600">
            {guestLanding
              ? "See how budgets work over time. Create an account to save your timeline."
              : "Create your first budget to start tracking your progress over time."
            }
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <TrendingUpIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">Financial Goals</h3>
          </div>
          <p className="text-sm text-gray-600">
            {guestLanding
              ? "Explore goal setting features. Sign up to track your actual progress."
              : "Set up goals to work towards financial freedom."
            }
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <PiggyBankIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-900">Savings Potential</h3>
        </div>
        <p className="text-sm text-gray-600">
          {guestLanding
            ? "Try our budget tool to see potential savings. Create an account to track real results."
            : "After creating your budget, we'll help you identify areas where you can save."
          }
        </p>
      </div>
    </div>
  );
};
