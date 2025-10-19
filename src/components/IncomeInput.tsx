import React, { useState } from 'react';
import { DollarSignIcon, AlertCircleIcon } from 'lucide-react';

type IncomeInputProps = {
  income: number;
  setIncome: (income: number) => void;
};

const MAX_INCOME = 10000000; // 10 million reasonable max
const WARN_THRESHOLD = 1000000; // Warn at 1 million

export const IncomeInput = ({
  income,
  setIncome
}: IncomeInputProps) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = value ? parseInt(value) : 0;

    // Cap at max value
    const cappedValue = Math.min(numValue, MAX_INCOME);

    // Show warning for very high values
    setShowWarning(cappedValue >= WARN_THRESHOLD);

    setIncome(cappedValue);
  };

  // Format number with commas for display
  const formattedValue = income > 0 ? income.toLocaleString() : '';

  return <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
        Monthly Income
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSignIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" name="income" id="income" className="block w-full pl-10 pr-12 py-3 text-lg border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="0" value={formattedValue} onChange={handleChange} inputMode="numeric" />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">/month</span>
        </div>
      </div>
      {showWarning && (
        <div className="mt-2 flex items-start text-amber-700 text-xs">
          <AlertCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
          <span>This is an unusually high income. Please double-check the amount.</span>
        </div>
      )}
      {income === MAX_INCOME && (
        <div className="mt-2 flex items-start text-orange-700 text-xs">
          <AlertCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
          <span>Maximum income reached (${MAX_INCOME.toLocaleString()})</span>
        </div>
      )}
    </div>;
};