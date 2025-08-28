import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
type PhilosophyScreenProps = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};
export const PhilosophyScreen = ({
  onNext,
  onBack,
  onSkip
}: PhilosophyScreenProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Why priorities work better
      </h2>
      <div className="w-full max-w-xs mx-auto mb-6">
        <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-orange-800 h-1/4 flex items-center justify-center text-white text-xs font-medium">
            Future Building
          </div>
          <div className="absolute bottom-1/4 left-0 right-0 bg-orange-600 h-1/4 flex items-center justify-center text-white text-xs font-medium">
            Quality of Life
          </div>
          <div className="absolute bottom-2/4 left-0 right-0 bg-orange-500 h-1/4 flex items-center justify-center text-white text-xs font-medium">
            Important
          </div>
          <div className="absolute bottom-3/4 left-0 right-0 bg-orange-200 h-1/4 flex items-center justify-center text-gray-900 text-xs font-medium">
            Survival
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-orange-500">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              Cover survival first, then build up
            </h3>
            <p className="text-gray-600 text-sm">
              Ensure your basic needs are met before anything else.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-orange-500">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              Rent before restaurants, groceries before gadgets
            </h3>
            <p className="text-gray-600 text-sm">
              You'll know exactly what to cut when money is tight.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-orange-500">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              You're not restricting everything
            </h3>
            <p className="text-gray-600 text-sm">
              Just organizing your spending in a way that makes sense.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between space-x-3 mt-6">
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