import React from 'react';
import { DollarSignIcon } from 'lucide-react';
type IncomeInputProps = {
  income: number;
  setIncome: (income: number) => void;
};
export const IncomeInput = ({
  income,
  setIncome
}: IncomeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setIncome(value ? parseInt(value) : 0);
  };
  return <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
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
    </div>;
};