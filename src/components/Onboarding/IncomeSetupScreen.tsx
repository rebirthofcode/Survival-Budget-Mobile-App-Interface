import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon, DollarSignIcon, Home, ShoppingBag, Zap } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type EssentialsSetupProps = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  income: number;
  setIncome: (income: number) => void;
  rent: number;
  setRent: (rent: number) => void;
  groceries: number;
  setGroceries: (groceries: number) => void;
  utilities: number;
  setUtilities: (utilities: number) => void;
};

export const EssentialsSetup = ({
  onNext,
  onBack,
  onSkip,
  income,
  setIncome,
  rent,
  setRent,
  groceries,
  setGroceries,
  utilities,
  setUtilities
}: EssentialsSetupProps) => {
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setIncome(value ? parseInt(value) : 0);
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setRent(value ? parseInt(value) : 0);
  };

  const handleGroceriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setGroceries(value ? parseInt(value) : 0);
  };

  const handleUtilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setUtilities(value ? parseInt(value) : 0);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
        <div className="mb-6">
          <Logo variant="default" size="md" withText={true} tagline={true} />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Essentials Setup
        </h2>
        
        <p className="text-gray-600 mb-6">
          Essentials come first. Add more anytime.
        </p>

        {/* Monthly Income */}
        <div className="mb-6">
          <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly income
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              name="income" 
              id="income"
              className="block w-full pl-10 pr-16 py-3 text-lg border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="0"
              value={income || ''}
              onChange={handleIncomeChange}
              inputMode="numeric"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">/month</span>
            </div>
          </div>
        </div>

        {/* Essential Expenses Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Essential Expenses</h3>
          <p className="text-xs text-gray-500 mb-4">These are the big three. You can add more next.</p>
          
          {/* Rent/Mortgage */}
          <div className="mb-4">
            <label htmlFor="rent" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Home className="h-4 w-4 text-blue-600 mr-2" />
              Rent/Mortgage
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                name="rent" 
                id="rent"
                className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
                value={rent || ''}
                onChange={handleRentChange}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Groceries */}
          <div className="mb-4">
            <label htmlFor="groceries" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <ShoppingBag className="h-4 w-4 text-green-600 mr-2" />
              Groceries
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                name="groceries" 
                id="groceries"
                className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
                value={groceries || ''}
                onChange={handleGroceriesChange}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Utilities */}
          <div className="mb-4">
            <label htmlFor="utilities" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Zap className="h-4 w-4 text-yellow-600 mr-2" />
              Utilities
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                name="utilities" 
                id="utilities"
                className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
                value={utilities || ''}
                onChange={handleUtilitiesChange}
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-3 mb-4">
          <button 
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </button>
          
          <button 
            onClick={onNext}
            className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
          >
            Next
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>

        <div className="text-center mb-6">
          <button 
            onClick={onSkip}
            className="text-orange-700 text-sm hover:text-orange-800 font-medium"
          >
            Skip intro
          </button>
        </div>

        {/* Progress dots at bottom */}
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          <div className="h-2 w-6 rounded-full bg-orange-500"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};