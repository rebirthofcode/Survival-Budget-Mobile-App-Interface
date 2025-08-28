import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { PhilosophyScreen } from './PhilosophyScreen';
import { IncomeSetupScreen } from './IncomeSetupScreen';
import { CategoryPreviewScreen } from './CategoryPreviewScreen';
import { FirstCategoryScreen } from './FirstCategoryScreen';
import { ReadyScreen } from './ReadyScreen';
type OnboardingProps = {
  completeOnboarding: (income?: number) => void;
  initialIncome: number;
  userName?: string;
};
export const Onboarding = ({
  completeOnboarding,
  initialIncome,
  userName
}: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [income, setIncome] = useState<number>(initialIncome);
  const totalSteps = 6;
  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(income);
    }
  };
  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const skipOnboarding = () => {
    completeOnboarding(income);
  };
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen onNext={goToNext} onSkip={skipOnboarding} userName={userName} />;
      case 2:
        return <PhilosophyScreen onNext={goToNext} onBack={goToPrevious} onSkip={skipOnboarding} />;
      case 3:
        return <IncomeSetupScreen onNext={goToNext} onBack={goToPrevious} onSkip={skipOnboarding} income={income} setIncome={setIncome} />;
      case 4:
        return <CategoryPreviewScreen onNext={goToNext} onBack={goToPrevious} onSkip={skipOnboarding} />;
      case 5:
        return <FirstCategoryScreen onNext={goToNext} onBack={goToPrevious} onSkip={skipOnboarding} />;
      case 6:
        return <ReadyScreen onComplete={() => completeOnboarding(income)} onBack={goToPrevious} />;
      default:
        return <WelcomeScreen onNext={goToNext} onSkip={skipOnboarding} userName={userName} />;
    }
  };
  return <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4">
        {renderCurrentStep()}
        {/* Progress indicator */}
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({
          length: totalSteps
        }).map((_, index) => <div key={index} className={`h-3 w-3 rounded-full transition-all duration-300 ${index + 1 === currentStep ? 'bg-orange-700 w-6' : index + 1 < currentStep ? 'bg-orange-600' : 'bg-gray-300'}`} />)}
        </div>
      </div>
    </div>;
};