import { ArrowRightIcon, House, Car, Coffee, PiggyBank, Check } from 'lucide-react';

type WelcomeScreenProps = {
  onNext: () => void;
  onSkip: () => void;
};

export const WelcomeScreen = ({
  onNext,
  onSkip
}: WelcomeScreenProps) => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
      <div className="mb-8">
        <div className="flex items-center justify-start">
          <div className="flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="white" stroke="#FF6B35" strokeWidth="2"></rect>
              <text x="20" y="16" fontFamily="Arial, sans-serif" fontSize="12" fill="#FF6B35" fontWeight="700" textAnchor="middle">$</text>
              <rect x="14" y="22" width="12" height="2" rx="1" fill="#FF6B35"></rect>
              <rect x="12" y="26" width="16" height="2" rx="1" fill="#FF6B35"></rect>
              <rect x="10" y="30" width="20" height="2" rx="1" fill="#FF6B35"></rect>
            </svg>
          </div>
          <div className="ml-3">
            <h1 className="font-bold text-left text-2xl text-gray-700">Survival Budget</h1>
            <p className="text-sm text-gray-500 font-normal text-left mt-0 leading-none">Priority-based budgeting</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center leading-tight">
          Survival first,<br />then build up
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-xs">
          Ensure your basic needs are met before anything else.
        </p>

        <div className="w-full max-w-xs mb-10 space-y-3">
          <div className="w-[60%] mx-auto bg-orange-400 rounded-xl p-3 flex items-center justify-center">
            <div className="bg-white/20 rounded-full p-1 mr-2">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Future Building</span>
          </div>
          
          <div className="w-[75%] mx-auto bg-orange-500 rounded-xl p-3 flex items-center justify-center">
            <div className="bg-white/20 rounded-full p-1 mr-2">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Quality of Life</span>
          </div>
          
          <div className="w-[85%] mx-auto bg-orange-600 rounded-xl p-3 flex items-center justify-center">
            <div className="bg-white/20 rounded-full p-1 mr-2">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Important</span>
          </div>
          
          <div className="w-[95%] mx-auto bg-orange-700 rounded-xl p-3 flex items-center justify-center">
            <div className="bg-white/20 rounded-full p-1 mr-2">
              <House className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Survival</span>
          </div>
        </div>

        <div className="space-y-5 mb-10 text-left w-full">
          <div className="flex items-start">
            <div className="bg-orange-50 rounded-full p-2 mr-4 flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">Rent before restaurants, groceries before gadgets.</span> You'll know exactly what to cut when money is tight.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-orange-50 rounded-full p-2 mr-4 flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">You're not restricting everything.</span> Just organizing your spending in a way that makes sense.
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-orange-600 h-2.5 rounded-full" style={{width: '33%'}}></div>
        </div>
        <div className="text-xs text-gray-500 mb-6 text-center">Step 1 of 3</div>

        <div className="w-full space-y-4">
          <button 
            onClick={onNext}
            className="w-full py-4 px-6 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
          
          <button 
            onClick={onSkip}
            className="w-full py-4 px-6 border-2 border-orange-600 text-orange-600 rounded-md font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Create Account (Optional)
          </button>
        </div>
      </div>
    </div>
  );
};