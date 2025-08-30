import { ArrowRightIcon, Home, Car, Coffee, Sprout } from 'lucide-react';
import { Logo } from '../Logo/Logo';

type WelcomeScreenProps = {
  onNext: () => void;
  onSkip: () => void;
};

export const WelcomeScreen = ({
  onNext,
  onSkip
}: WelcomeScreenProps) => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center border border-gray-200">
      <div className="w-full flex justify-start mb-6">
        <Logo variant="default" size="lg" withText={false} />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Survival Budget</h1>
      <p className="text-sm text-gray-600 mb-6">Priority-based budgeting</p>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        Survival first,<br />then build up
      </h2>
      
      <p className="text-gray-600 mb-8">
        Ensure your basic needs are met before anything else.
      </p>
      
      {/* Stepped Pyramid - Fixed */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex flex-col items-center space-y-2">
          {/* Future Building - Narrowest */}
          <div className="w-3/5 bg-orange-400 text-white text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center">
            <Sprout className="w-4 h-4 mr-2" />
            Future Building
          </div>
          
          {/* Quality of Life */}
          <div className="w-3/4 bg-orange-500 text-white text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center">
            <Coffee className="w-4 h-4 mr-2" />
            Quality of Life
          </div>
          
          {/* Important */}
          <div className="w-4/5 bg-orange-600 text-white text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 mr-2" />
            Important
          </div>
          
          {/* Survival - Widest, Foundation */}
          <div className="w-full bg-orange-800 text-white text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Survival
          </div>
        </div>
      </div>

      {/* Benefit Points */}
      <div className="space-y-4 mb-8">
        <div className="flex items-start text-left">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Rent before restaurants, groceries before gadgets.</span> You'll know exactly what to cut when money is tight.
          </p>
        </div>
        
        <div className="flex items-start text-left">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">You're not restricting everything.</span> Just organizing your spending in a way that makes sense.
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-6 space-x-2">
        <div className="h-2 w-6 rounded-full bg-orange-500"></div>
        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">Step 1 of 3</p>

      <button 
        onClick={onNext} 
        className="w-full py-3 px-4 bg-orange-500 text-white rounded-md font-medium shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mb-3 flex items-center justify-center"
      >
        Get Started
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </button>
      
      <button 
        onClick={onSkip} 
        className="text-orange-700 text-sm hover:text-orange-800 font-medium border border-orange-300 py-2 px-4 rounded-md w-full"
      >
        Create Account (Optional)
      </button>
    </div>
  );
};