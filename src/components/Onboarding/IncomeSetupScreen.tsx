import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon, DollarSignIcon, ShieldIcon } from 'lucide-react';
type IncomeSetupScreenProps = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  income: number;
  setIncome: (income: number) => void;
};
export const IncomeSetupScreen = ({
  onNext,
  onBack,
  onSkip,
  income,
  setIncome
}: IncomeSetupScreenProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setIncome(value ? parseInt(value) : 0);
  };
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Let's start with your monthly income
      </h2>
      <p className="text-gray-600 mb-6">
        Include all reliable income sources. This is the foundation of your
        budget.
      </p>
      <div className="mb-6">
        <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
          Monthly Income
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSignIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" name="income" id="income" className="block w-full pl-10 pr-12 py-3 text-lg border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="0" value={income || ''} onChange={handleChange} inputMode="numeric" />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">/month</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Every budget starts here – no judgment, just a starting point.
        </p>
      </div>
      <div className="flex items-start bg-gray-50 p-3 rounded-md mb-6">
        <ShieldIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
        <p className="text-gray-600 text-sm">
          This stays private and secure. We don't store or share your financial
          data.
        </p>
      </div>
      <div className="flex justify-between space-x-3">
        <button onClick={onBack} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        <button onClick={onNext} className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          Next
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
      <div className="text-center mt-4">
        <button onClick={onSkip} className="text-orange-700 text-sm hover:text-orange-800 font-medium">
          Skip intro
        </button>
      </div>
    </div>;
};