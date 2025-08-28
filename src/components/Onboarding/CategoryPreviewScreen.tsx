import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon, HomeIcon, CarIcon, CoffeeIcon, PiggyBankIcon } from 'lucide-react';
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
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Here's how we'll organize your expenses
      </h2>
      <p className="text-gray-600 mb-6">
        We'll guide you through each step. Don't worry, you're in control.
      </p>
      <div className="space-y-4 mb-6">
        <div className="flex items-center p-3 bg-gray-50 rounded-md border-l-4 border-orange-200">
          <div className="bg-white rounded-full p-2 mr-3">
            <HomeIcon className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">1. Survival</h3>
            <p className="text-gray-700 text-sm">
              Essential needs like housing, food, and utilities
            </p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-md border-l-4 border-orange-500">
          <div className="bg-white rounded-full p-2 mr-3">
            <CarIcon className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">2. Important</h3>
            <p className="text-gray-700 text-sm">
              Transportation, phone, internet, and insurance
            </p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-md border-l-4 border-orange-600">
          <div className="bg-white rounded-full p-2 mr-3">
            <CoffeeIcon className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">3. Quality of Life</h3>
            <p className="text-gray-700 text-sm">
              Dining out, entertainment, subscriptions
            </p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-md border-l-4 border-orange-800">
          <div className="bg-white rounded-full p-2 mr-3">
            <PiggyBankIcon className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">4. Future Building</h3>
            <p className="text-gray-700 text-sm">
              Savings, investments, debt payoff, education
            </p>
          </div>
        </div>
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