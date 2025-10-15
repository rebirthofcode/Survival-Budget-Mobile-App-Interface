import { CheckCircle, BarChart3, Edit3, PiggyBank, ArrowRightIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type OnboardingCompleteProps = {
  onContinue: () => void;
};

export const OnboardingComplete = ({ onContinue }: OnboardingCompleteProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
        <div className="mb-6">
          <Logo variant="default" size="md" withText={true} />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          You're all set
        </h2>
        
        <p className="text-gray-600 mb-8 text-center">
          Your essentials are covered. Now you can track spending, adjust categories, or just keep an eye on what's left.
        </p>

        {/* What You Can Do */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Track daily spending</h3>
              <p className="text-sm text-gray-600">See where your money goes in real time</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Edit3 className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Adjust your categories</h3>
              <p className="text-sm text-gray-600">Change amounts or add new expenses anytime</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <PiggyBank className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Save for the future</h3>
              <p className="text-sm text-gray-600">Build up after covering your essentials</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onContinue}
          className="w-full py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center"
        >
          Let's go
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};