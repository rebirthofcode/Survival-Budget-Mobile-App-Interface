import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import IncomeSetupScreen from './IncomeSetupScreen';
import { BudgetSnapshot } from './BudgetSnapshot';

type ExpenseData = {
  rent: number;
  groceries: number;
  utilities: number;
};

type OnboardingProps = {
  completeOnboarding: (income?: number) => void;
  initialIncome: number;
  userName?: string;
};

export default function Onboarding({
  completeOnboarding,
  initialIncome,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [income, setIncome] = useState<number>(initialIncome);
  const [expenses, setExpenses] = useState<ExpenseData>({
    rent: 0,
    groceries: 0,
    utilities: 0,
  });
  const totalSteps = 3;

  const goToNext = (data?: { monthlyIncome: number; essentialExpenses: ExpenseData }) => {
    // Use the freshest values even if state hasn't committed yet
    const nextIncome = data?.monthlyIncome ?? income;
    const nextExpenses = data?.essentialExpenses ?? expenses;

    if (data) {
      setIncome(nextIncome);
      setExpenses(nextExpenses);
    }

    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    } else {
      completeOnboarding(nextIncome);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding(income);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen onNext={goToNext} onSkip={skipOnboarding} />;

      case 2:
        return (
          <IncomeSetupScreen
            onNext={goToNext}
            onBack={goToPrevious}
            onSkip={skipOnboarding}
            income={income}
            setIncome={setIncome}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        );

      case 3:
        return (
          <BudgetSnapshot
            onComplete={() => completeOnboarding(income)}
            onBack={goToPrevious}
            income={income}
            expenses={expenses}
          />
        );

      default:
        return null;
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
}
