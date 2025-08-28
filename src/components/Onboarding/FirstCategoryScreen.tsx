import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon, DollarSignIcon, ToggleLeftIcon, PencilIcon, HomeIcon, ShoppingBagIcon, UtensilsIcon, HeartIcon } from 'lucide-react';
type FirstCategoryScreenProps = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};
export const FirstCategoryScreen = ({
  onNext,
  onBack,
  onSkip
}: FirstCategoryScreenProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Let's start with Survival
      </h2>
      <p className="text-gray-600 mb-6">
        These are your most essential expenses that need to be covered first.
      </p>
      {/* Survival Category Icons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <HomeIcon className="h-8 w-8 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Housing</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <ShoppingBagIcon className="h-8 w-8 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">Groceries</span>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        {/* Card header mockup */}
        <div className="p-4 bg-green-50 border-l-4 border-green-500 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">1. Survival</h3>
              <p className="text-sm text-gray-500">Affordable</p>
            </div>
          </div>
        </div>
        {/* Mode toggle mockup */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-l-lg bg-orange-600 text-white">
                <PencilIcon className="h-4 w-4 inline mr-1" />
                Edit Amounts
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-r-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                <ToggleLeftIcon className="h-4 w-4 inline mr-1" />
                Choose Items
              </button>
            </div>
          </div>
          {/* Expense item mockup */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1 flex items-center">
              <div className="bg-blue-100 rounded-full p-1.5 mr-3">
                <HomeIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-900 font-medium">Rent/Mortgage</span>
            </div>
            <div className="relative w-28">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md shadow-sm text-right bg-gray-50">
                800
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1 flex items-center">
              <div className="bg-green-100 rounded-full p-1.5 mr-3">
                <ShoppingBagIcon className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-900 font-medium">Groceries</span>
            </div>
            <div className="relative w-28">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md shadow-sm text-right bg-gray-50">
                300
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
        <p className="text-gray-700 text-sm">
          <span className="font-medium">How it works:</span> First set amounts
          for each expense, then choose which ones to include in your budget.
          We'll help you prioritize when money is tight.
        </p>
      </div>
      <div className="flex justify-between space-x-3">
        <button onClick={onBack} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        <button onClick={onNext} className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
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