import React from 'react';
type ExpenseItemProps = {
  expense: {
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
  };
  onChange: () => void;
};
export const ExpenseItem = ({
  expense,
  onChange
}: ExpenseItemProps) => {
  return <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <span className="text-gray-800 font-medium">{expense.name}</span>
      </div>
      <div className="flex items-center">
        <span className="text-gray-700 font-medium mr-4">
          ${expense.amount}
        </span>
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={expense.enabled} onChange={onChange} />
            <div className={`block w-14 h-8 rounded-full ${expense.enabled ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-200`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${expense.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>
    </div>;
};