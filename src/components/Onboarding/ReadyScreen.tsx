import React from 'react';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
type ReadyScreenProps = {
  onComplete: () => void;
  onBack: () => void;
};
export const ReadyScreen = ({
  onComplete,
  onBack
}: ReadyScreenProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center border border-gray-200">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckIcon className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        You're ready to start!
      </h2>
      <p className="text-gray-600 mb-6">
        You've learned the basics of priority-based budgeting. Now it's time to
        take control of your finances.
      </p>
      <div className="space-y-4 w-full mb-6">
        <div className="flex items-start">
          <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-700 text-sm">Set up your monthly income</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-700 text-sm">
              Understand the priority system
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-700 text-sm">
              Learn how to edit and toggle expenses
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-50 p-4 rounded-md mb-6">
        <p className="text-gray-600 text-sm">
          Take your time - you can always adjust your budget as your situation
          changes. We're here to help you succeed.
        </p>
      </div>
      <div className="flex justify-between space-x-3 w-full">
        <button onClick={onBack} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        <button onClick={onComplete} className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          Start with Survival
        </button>
      </div>
    </div>;
};