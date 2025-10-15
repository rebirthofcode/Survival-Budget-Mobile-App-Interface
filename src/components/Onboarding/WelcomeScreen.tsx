import { ArrowRightIcon, CheckIcon, Home, Car, Coffee, Sprout } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-200">
        {/* Header section with logo and tagline */}
        <div className="mb-8">
          <Logo variant="default" size="lg" withText={true} tagline={true} />
        </div>
        
        <div className="flex flex-col items-center">
          {/* Main headline with improved typography */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center leading-tight">
            Survival first,<br />then build up
          </h1>
          
          {/* Subheading with better spacing */}
          <p className="text-gray-600 mb-8 text-center max-w-xs">
            Cover rent before restaurants. You'll always know what to cut when money gets tight.
          </p>
          
          {/* Priority pyramid with levels - stacked pyramid style */}
          <div className="w-full max-w-sm mb-10">
            <div className="flex flex-col items-center space-y-2">
              {/* Future Building (narrowest) - 60% wide, centered, so starts at 20% */}
              <div className="w-3/5 bg-orange-400 text-white text-sm font-medium py-3 rounded-md flex items-center shadow-md" style={{paddingLeft: '1rem', paddingRight: '1rem'}}>
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 mr-2 flex-shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>
                <span>Future Building</span>
              </div>
              
              {/* Quality of Life - 75% wide, centered, so starts at 12.5% - need 7.5% more padding */}
              <div className="w-3/4 bg-orange-500 text-white text-sm font-medium py-3 rounded-md flex items-center shadow-md" style={{paddingLeft: 'calc(1rem + 7.5%)', paddingRight: '1rem'}}>
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 mr-2 flex-shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <span>Quality of Life</span>
              </div>
              
              {/* Important - 80% wide, centered, so starts at 10% - need 10% more padding */}
              <div className="w-4/5 bg-orange-600 text-white text-sm font-medium py-3 rounded-md flex items-center shadow-md" style={{paddingLeft: 'calc(1rem + 10%)', paddingRight: '1rem'}}>
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 mr-2 flex-shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <span>Important</span>
              </div>
              
              {/* Survival (widest) - 100% wide - need 20% more padding to match */}
              <div className="w-full bg-orange-800 text-white text-sm font-medium py-3 rounded-md flex items-center shadow-md" style={{paddingLeft: 'calc(1rem + 20%)', paddingRight: '1rem'}}>
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 mr-2 flex-shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <span>Survival</span>
              </div>
            </div>
          </div>
          
          {/* Key benefits with checkmarks in filled circles */}
          <div className="space-y-5 mb-10 text-left w-full">
            <div className="flex items-start">
              <div className="bg-orange-50 rounded-full p-2 mr-4 flex-shrink-0 mt-0.5">
                <CheckIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">No guilt, no restriction.</span>{' '}
                  Just a system that makes sense.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-50 rounded-full p-2 mr-4 flex-shrink-0 mt-0.5">
                <CheckIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">See exactly where your money goes</span>{' '}
                  and what matters most.
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-orange-600 h-2.5 rounded-full"
              style={{ width: '25%' }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mb-6 text-center">
            Step 1 of 4
          </div>
          
          {/* Buttons with improved spacing and styling */}
          <div className="w-full space-y-4">
            <button
              onClick={onNext}
              className="w-full py-4 px-6 bg-orange-600 text-white rounded-md font-medium shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
            
            <button
              onClick={onSkip}
              className="w-full py-4 px-6 border border-orange-600 text-orange-600 rounded-md font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Create Account (Optional)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};