import { CheckCircle, BarChart3, Edit3, PiggyBank, ArrowRightIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type OnboardingCompleteProps = {
  onContinue: () => void;
  income?: number;
  rent?: number;
  groceries?: number;
  utilities?: number;
};

export const OnboardingComplete = ({ onContinue, income = 0, rent = 0, groceries = 0, utilities = 0 }: OnboardingCompleteProps) => {
  // Calculate what was actually saved
  const savedExpenses = [
    { name: 'Rent/Mortgage', amount: rent },
    { name: 'Groceries', amount: groceries },
    { name: 'Utilities', amount: utilities }
  ].filter(expense => expense.amount > 0);

  const totalSurvivalExpenses = rent + groceries + utilities;
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
        <div className="mb-6">
          <Logo variant="default" size="md" withText={true} tagline={true} />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          Your essentials are set
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          You've added your income, rent, groceries, and utilities — your core Survival Budget.
        </p>

        {/* Visual confirmation of what was saved */}
        {(income > 0 || savedExpenses.length > 0) && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Here's what we saved:
            </h3>
            <div className="space-y-2">
              {income > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Monthly Income</span>
                  <span className="font-bold text-gray-900">${income.toLocaleString()}</span>
                </div>
              )}
              {savedExpenses.length > 0 && (
                <div className="border-t border-green-200 pt-2 mt-2">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Survival Expenses:</p>
                  {savedExpenses.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center text-sm pl-3">
                      <span className="text-gray-600">{expense.name}</span>
                      <span className="font-medium text-gray-800">${expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {totalSurvivalExpenses > 0 && (
                    <div className="flex justify-between items-center text-sm font-semibold mt-2 pt-2 border-t border-green-200">
                      <span className="text-green-800">Total Survival</span>
                      <span className="text-green-800">${totalSurvivalExpenses.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              {income > 0 && totalSurvivalExpenses > 0 && (
                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-green-300 mt-2">
                  <span className="text-green-900">Available for Next Priorities</span>
                  <span className="text-green-900">${(income - totalSurvivalExpenses).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps - More actionable */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">What happens next:</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Expand the "Important" priority</span> to add things like car payments or insurance
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Edit3 className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">See what you can afford</span> at each level with the new budget status cards
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <PiggyBank className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Add to "Future Building"</span> when you're ready to allocate toward savings
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onContinue}
          className="w-full py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
        >
          Let's go
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};