import React, { useState } from 'react';
import { DollarSignIcon } from 'lucide-react';
type ExpenseItemEditProps = {
  expense: {
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
  };
  onChange: (amount: number) => void;
};
export const ExpenseItemEdit = ({
  expense,
  onChange
}: ExpenseItemEditProps) => {
  const [amount, setAmount] = useState(expense.amount.toString());
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    onChange(value ? parseInt(value) : 0);
  };
  return <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <span className="text-gray-800 font-medium">{expense.name}</span>
      </div>
      <div className="relative w-28">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSignIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input type="text" className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-right" placeholder="0" value={amount} onChange={handleChange} inputMode="numeric" aria-label={`Amount for ${expense.name}`} />
      </div>
    </div>;
};