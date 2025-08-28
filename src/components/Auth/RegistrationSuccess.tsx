import React from 'react';
import { CheckCircleIcon, ArrowRightIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';
type RegistrationSuccessProps = {
  userName: string;
  onContinue: () => void;
};
export const RegistrationSuccess = ({
  userName,
  onContinue
}: RegistrationSuccessProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col items-center text-center">
        <div className="w-full flex justify-start mb-6">
          <Logo variant="light" size="md" withText={true} tagline={true} />
        </div>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {userName}!
        </h2>
        <p className="text-gray-600 mb-6">
          Your account has been successfully created. You're now ready to take
          control of your finances with Survival Budget.
        </p>
        <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-800 mb-2">What's next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 flex-shrink-0">
                <span className="text-orange-600 text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Complete a quick onboarding to understand how priority-based
                budgeting works
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 flex-shrink-0">
                <span className="text-orange-600 text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Set up your income and customize your expense categories
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 flex-shrink-0">
                <span className="text-orange-600 text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Start making informed decisions about your spending priorities
              </p>
            </li>
          </ul>
        </div>
        <button onClick={onContinue} className="w-full py-3 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          Get Started
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>;
};