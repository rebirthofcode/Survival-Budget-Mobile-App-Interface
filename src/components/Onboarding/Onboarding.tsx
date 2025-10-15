import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { EssentialsSetup } from './IncomeSetupScreen';
import { BudgetSnapshot } from './BudgetSnapshot';
import { OnboardingComplete } from './OnboardingComplete';

type OnboardingProps = {
  completeOnboarding: (budgetData: {
    income: number;
    rent: number;
    groceries: number;
    utilities: number;
  }) => void;
};

export const Onboarding = ({
  completeOnboarding,
}: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // All values default to 0 instead of hardcoded amounts
  const [income, setIncome] = useState<number>(0);
  const [rent, setRent] = useState<number>(0);
  const [groceries, setGroceries] = useState<number>(0);
  const [utilities, setUtilities] = useState<number>(0);
  
  const totalSteps = 4;

  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding({ income, rent, groceries, utilities });
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    // Pass current values even if incomplete
    completeOnboarding({ income, rent, groceries, utilities });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeScreen 
            onNext={goToNext} 
            onSkip={skipOnboarding} 
          />
        );
      case 2:
        return (
          <EssentialsSetup
            onNext={goToNext}
            onBack={goToPrevious}
            onSkip={skipOnboarding}
            income={income}
            setIncome={setIncome}
            rent={rent}
            setRent={setRent}
            groceries={groceries}
            setGroceries={setGroceries}
            utilities={utilities}
            setUtilities={setUtilities}
          />
        );
      case 3:
        return (
          <BudgetSnapshot
            onComplete={goToNext}
            onBack={goToPrevious}
            income={income}
            rent={rent}
            groceries={groceries}
            utilities={utilities}
          />
        );
      case 4:
        return (
          <OnboardingComplete
            onContinue={() => completeOnboarding({ income, rent, groceries, utilities })}
          />
        );
      default:
        return (
          <WelcomeScreen 
            onNext={goToNext} 
            onSkip={skipOnboarding} 
          />
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4">
        {renderCurrentStep()}
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                  ? 'bg-orange-700 w-6'
                  : index + 1 < currentStep
                  ? 'bg-orange-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};