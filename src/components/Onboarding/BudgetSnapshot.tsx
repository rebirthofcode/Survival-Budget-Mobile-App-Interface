import { ArrowLeft, ArrowRight, Check, Home, ShoppingBag, Zap } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type BudgetSnapshotProps = {
  onComplete: () => void;
  onBack: () => void;
  income: number;
  expenses: {
    rent: number;
    groceries: number;
    utilities: number;
  };
};

export const BudgetSnapshot = ({
  onComplete,
  onBack,
  income,
  expenses
}: BudgetSnapshotProps) => {
  // Use the actual expense values from props
  const { rent, groceries, utilities } = expenses;
  const totalEssentials = rent + groceries + utilities;
  const remaining = income - totalEssentials;
  const essentialsPercentage = income > 0 ? Math.round((totalEssentials / income) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <Logo variant="default" size="md" withText={true} />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Budget Snapshot
      </h2>
      
      <p className="text-gray-600 mb-6">
        Your survival foundation is secure! Here's what you have left to build up.
      </p>

      {/* Progress Indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className="bg-orange-500 h-2 rounded-full w-full"></div>
      </div>
      <p className="text-sm text-gray-500 text-center mb-6">Step 3 of 3</p>

      {/* Success Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Essentials locked in! Here's your foundation and what's next.
            </h3>
            <p className="text-sm text-green-700 mt-1">
              You have ${remaining.toLocaleString()} left for other priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Your Budget Breakdown</h3>
        
        {/* Progress Bar */}
        <div className="flex items-center mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-6 mr-4">
            <div 
              className="bg-orange-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${essentialsPercentage}%` }}
            >
              Essentials {essentialsPercentage}%
            </div>
          </div>
          <span className="text-sm text-gray-500">Other Priorities</span>
        </div>
      </div>

      {/* Essential Expenses */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Essential Expenses</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="h-4 w-4 text-blue-600 mr-3" />
              <span className="text-gray-900">Rent/Mortgage</span>
            </div>
            <span className="font-medium text-gray-900">${rent.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 text-green-600 mr-3" />
              <span className="text-gray-900">Groceries</span>
            </div>
            <span className="font-medium text-gray-900">${groceries.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-yellow-600 mr-3" />
              <span className="text-gray-900">Utilities</span>
            </div>
            <span className="font-medium text-gray-900">${utilities.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex items-center justify-between font-medium">
            <span className="text-gray-900">Total Essentials</span>
            <span className="text-gray-900">${totalEssentials.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-900">Monthly Income</span>
          <span className="font-medium text-gray-900">${income.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-900">Remaining for Other Priorities</span>
          <span className="font-medium text-green-600">${remaining.toLocaleString()}</span>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-500 text-center mb-6">
        Edit or add categories anytime as your needs change.
      </p>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <button 
          onClick={onComplete}
          className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Local Storage Notice */}
      <p className="text-xs text-gray-500 text-center">
        Your budget is saved locally. Create an account later to access from any device.
      </p>
    </div>
  );
};