import { ArrowRightIcon, ArrowLeftIcon, DollarSignIcon, HomeIcon, ShoppingBagIcon, ZapIcon, InfoIcon } from 'lucide-react';

type ExpenseData = {
  rent: number;
  groceries: number;
  utilities: number;
};

type IncomeSetupScreenProps = {
  onNext: (data: { monthlyIncome: number; essentialExpenses: ExpenseData }) => void;
  onBack: () => void;
  onSkip: () => void;
  income: number;
  setIncome: (income: number) => void;
  expenses: ExpenseData;
  setExpenses: (expenses: ExpenseData) => void;
};

const IncomeSetupScreen = ({
  onNext,
  onBack,
  onSkip,
  income,
  setIncome,
  expenses,
  setExpenses
}: IncomeSetupScreenProps) => {
  // Safety check to ensure expenses object exists
  const safeExpenses = expenses || { rent: 0, groceries: 0, utilities: 0 };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setIncome(value ? parseInt(value) : 0);
  };

  const handleExpenseChange = (category: keyof ExpenseData, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setExpenses({
      ...safeExpenses,
      [category]: value ? parseInt(value) : 0
    });
  };

  const handleNext = () => {
    const data = {
      monthlyIncome: income,
      essentialExpenses: safeExpenses
    };
    onNext(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header with Branding */}
      <div className="mb-6">
        <div className="flex items-center justify-start">
          <div className="flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="white" stroke="#FF6B35" strokeWidth="2"></rect>
              <text x="20" y="16" fontFamily="Arial, sans-serif" fontSize="12" fill="#FF6B35" fontWeight="700" textAnchor="middle">$</text>
              <rect x="14" y="22" width="12" height="2" rx="1" fill="#FF6B35"></rect>
              <rect x="12" y="26" width="16" height="2" rx="1" fill="#FF6B35"></rect>
              <rect x="10" y="30" width="20" height="2" rx="1" fill="#FF6B35"></rect>
            </svg>
          </div>
          <div className="ml-3">
            <h1 className="font-bold text-left" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontSize: '18px', color: 'rgb(55, 65, 81)' }}>
              Survival Budget
            </h1>
            <p style={{ fontFamily: '"Roboto Condensed", sans-serif', fontSize: '12px', color: 'rgb(107, 114, 128)', fontWeight: 400, textAlign: 'left', marginTop: '0px', lineHeight: 1 }}>
              Priority-based budgeting
            </p>
          </div>
        </div>
      </div>

      {/* Essentials Setup */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Essentials Setup
        </h2>
        <div className="flex items-center mb-6">
          <p className="text-gray-600 mr-2">
            Add your must-have expenses. Essentials come first—add more anytime.
          </p>
          <button className="text-gray-500 hover:text-gray-700 relative flex items-center justify-center min-w-[24px] min-h-[24px]" aria-label="More information">
            <InfoIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-orange-600 h-2.5 rounded-full" style={{width: '66%'}}></div>
        </div>
        <div className="text-xs text-gray-500 mb-6 text-center">Step 2 of 3</div>
      </div>

      {/* Monthly Income */}
      <div className="mb-6">
        <label htmlFor="income" className="block text-base font-medium text-gray-800 mb-2">
          How much do you bring in each month?
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSignIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="income"
            id="income"
            className="block w-full pl-10 pr-12 py-3 text-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 rounded-md shadow-sm min-h-[48px]"
            placeholder="0"
            inputMode="numeric"
            value={income || ''}
            onChange={handleIncomeChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">/month</span>
          </div>
        </div>
      </div>

      {/* Essential Expenses */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">Essential Expenses</h3>
        
        {/* Rent/Mortgage */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center h-5 w-5 text-blue-600 mr-2">
              <HomeIcon className="h-5 w-5" />
            </div>
            <label htmlFor="rent" className="text-gray-700">Rent/Mortgage</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="rent"
              id="rent"
              className="block w-full pl-10 py-3 border border-gray-300 focus:ring-orange-500 focus:border-orange-500 rounded-md shadow-sm min-h-[48px]"
              placeholder="0"
              inputMode="numeric"
              value={safeExpenses.rent || ''}
              onChange={(e) => handleExpenseChange('rent', e)}
            />
          </div>
        </div>

        {/* Groceries */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center h-5 w-5 text-green-600 mr-2">
              <ShoppingBagIcon className="h-5 w-5" />
            </div>
            <label htmlFor="groceries" className="text-gray-700">Groceries</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="groceries"
              id="groceries"
              className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 min-h-[48px]"
              placeholder="0"
              inputMode="numeric"
              value={safeExpenses.groceries || ''}
              onChange={(e) => handleExpenseChange('groceries', e)}
            />
          </div>
        </div>

        {/* Utilities */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center h-5 w-5 text-yellow-600 mr-2">
              <ZapIcon className="h-5 w-5" />
            </div>
            <label htmlFor="utilities" className="text-gray-700">Utilities</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="utilities"
              id="utilities"
              className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 min-h-[48px]"
              placeholder="0"
              inputMode="numeric"
              value={safeExpenses.utilities || ''}
              onChange={(e) => handleExpenseChange('utilities', e)}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between space-x-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center min-h-[48px]"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-md font-medium shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center min-h-[48px]"
        >
          Next
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Skip Intro */}
      <div className="text-center mt-4">
        <button 
          onClick={onSkip}
          className="text-orange-700 text-sm hover:text-orange-800 font-medium py-2 px-4 min-h-[44px] rounded-md"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
};

export default IncomeSetupScreen;