import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon, HomeIcon, CarIcon, CoffeeIcon, PiggyBankIcon, ShoppingBagIcon, WifiIcon, HeartIcon, UtensilsIcon } from 'lucide-react';
type CategoryPreviewScreenProps = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};
export const CategoryPreviewScreen = ({
  onNext,
  onBack,
  onSkip
}: CategoryPreviewScreenProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Here's how we'll organize your expenses
      </h2>
      <p className="text-gray-600 mb-6">
        We'll guide you through each step. Don't worry, you're in control.
      </p>
      {/* Priority Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Expense Categories
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Survival Category */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <HomeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Survival</span>
          </div>
          {/* Important Category */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <CarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Important</span>
          </div>
          {/* Quality of Life Category */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2">
              <CoffeeIcon className="h-8 w-8 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Quality of Life
            </span>
          </div>
          {/* Future Building Category */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <PiggyBankIcon className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Future Building
            </span>
          </div>
        </div>
      </div>
      {/* Default Expenses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Default Expenses
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Housing</span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <ShoppingBagIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Groceries</span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <WifiIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Utilities</span>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-pink-100 rounded-full p-2 mr-3">
              <UtensilsIcon className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Dining Out</span>
            </div>
          </div>
        </div>
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