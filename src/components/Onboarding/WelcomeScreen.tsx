import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';
type WelcomeScreenProps = {
  onNext: () => void;
  onSkip: () => void;
  userName?: string;
};
export const WelcomeScreen = ({
  onNext,
  onSkip,
  userName
}: WelcomeScreenProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center border border-gray-200">
      <div className="w-full flex justify-start mb-6">
        <Logo variant="default" size="lg" withText={false} />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Survival Budget</h1>
      <h2 className="text-xl font-medium text-gray-700 mb-3">
        {userName ? `Welcome, ${userName}!` : 'Budget with confidence, not stress'}
      </h2>
      <p className="text-gray-600 mb-8">
        Focus on what matters most when money is tight. We'll help you
        prioritize your expenses in a way that makes sense.
      </p>
      <div className="w-full max-w-xs mb-8">
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
      <button onClick={onNext} className="w-full py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mb-3 flex items-center justify-center">
        Get Started
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </button>
      <button onClick={onSkip} className="text-orange-700 text-sm hover:text-orange-800 font-medium">
        Skip intro
      </button>
    </div>;
};