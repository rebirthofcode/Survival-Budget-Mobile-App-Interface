import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, PlusCircleIcon, BarChart3Icon } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { EmptyState } from './EmptyState';
import type { BudgetData } from '../types/budget';
import { calculateMonthlyIncome } from '../utils/incomeCalculator';
import { getGapMessage } from '../utils/gapMessaging';

type SummaryDashboardProps = {
  budgetData: BudgetData;
  onNavigateToBudget: () => void;
  onNavigateToIncome?: () => void;
};

export const SummaryDashboard = ({ budgetData, onNavigateToBudget, onNavigateToIncome }: SummaryDashboardProps) => {
  // Calculate monthly income from all sources (using conservative scenario)
  const incomeCalculation = calculateMonthlyIncome(budgetData.income_sources);
  const monthlyIncome = incomeCalculation.conservative;

  // Check for empty states
  const hasNoIncome = budgetData.income_sources.length === 0;
  const hasZeroIncome = monthlyIncome === 0;
  const hasSurvivalExpenses = budgetData.survival_expenses.some(e => e.enabled && e.amount > 0);

  // Handle empty states
  if (hasNoIncome) {
    return <EmptyState type="no_income" onAction={onNavigateToIncome || onNavigateToBudget} />;
  }

  if (hasZeroIncome) {
    return <EmptyState type="zero_income" onAction={onNavigateToIncome || onNavigateToBudget} />;
  }

  if (!hasSurvivalExpenses) {
    return <EmptyState type="no_survival_expenses" onAction={onNavigateToBudget} />;
  }

  // Calculate totals for each tier
  const survivalTotal = budgetData.survival_expenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const importantTotal = budgetData.important_expenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const qualityOfLifeTotal = budgetData.quality_of_life_expenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const futureBuildingTotal = budgetData.future_building.enabled
    ? budgetData.future_building.amount
    : 0;

  // Calculate essentials (Survival + Important)
  const essentialsTotal = survivalTotal + importantTotal;

  // Calculate flexible money (what's left after essentials)
  const flexibleMoney = monthlyIncome - essentialsTotal;

  // Calculate total money left (after everything)
  const moneyLeft = monthlyIncome - essentialsTotal - qualityOfLifeTotal - futureBuildingTotal;

  // Get gap message using new tiered messaging system
  const gapMessage = getGapMessage(flexibleMoney, monthlyIncome);

  // Determine Essentials Status using gap messaging
  const getEssentialsStatus = () => {
    if (gapMessage.severity === 'none') {
      // Covered - check if it's tight or comfortable
      const percentageLeft = (flexibleMoney / monthlyIncome) * 100;

      if (percentageLeft < 5) {
        return {
          label: 'Close call this month',
          description: `Essentials covered with $${flexibleMoney.toLocaleString()} left`,
          color: 'orange',
          icon: AlertTriangleIcon
        };
      } else {
        return {
          label: 'You\'re covered',
          description: 'Rent, groceries, utilities, essentials paid',
          color: 'green',
          icon: CheckCircleIcon
        };
      }
    } else {
      // Gap exists - use tiered messaging
      return {
        label: gapMessage.label,
        description: gapMessage.description,
        color: 'orange',
        icon: AlertTriangleIcon,
        actionSuggestions: gapMessage.actionSuggestions,
        showHelp: gapMessage.showHelp
      };
    }
  };

  const essentialsStatus = getEssentialsStatus();
  const EssentialsIcon = essentialsStatus.icon;

  // Get color classes based on status (NO RED EVER)
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', icon: 'text-green-600' };
      case 'orange':
        return { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', icon: 'text-orange-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: 'text-gray-600' };
    }
  };

  const colors = getColorClasses(essentialsStatus.color);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Hero: Essentials Status - THE ANSWER */}
      <div className={`${colors.bg} border-l-4 ${colors.border} rounded-r-lg p-6 shadow-md transition-all duration-300 ${essentialsStatus.color === 'green' ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}>
        <div className="flex items-start">
          <EssentialsIcon className={`h-8 w-8 ${colors.icon} mr-4 flex-shrink-0 mt-1 ${essentialsStatus.color === 'green' ? 'animate-pulse' : ''}`} />
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>{essentialsStatus.label}</h1>
            <p className="text-base text-gray-700">{essentialsStatus.description}</p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Monthly income</span>
                <span className="font-medium text-gray-900">
                  <AnimatedNumber value={monthlyIncome} prefix="$" className="font-medium text-gray-900" />
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Essentials covered</span>
                <span className="font-medium text-gray-900">${essentialsTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Suggestions for Gaps */}
            {essentialsStatus.actionSuggestions && essentialsStatus.actionSuggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">What you can do:</p>
                <ul className="space-y-1">
                  {essentialsStatus.actionSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flexible Money Card - PERMISSION TO SPEND */}
      {flexibleMoney >= 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-md transform transition-all duration-300 hover:scale-105">
          <p className="text-orange-100 text-sm mb-1">You have</p>
          <p className="text-4xl font-bold mb-2">
            <AnimatedNumber value={flexibleMoney} prefix="$" className="text-4xl font-bold" />
          </p>
          <p className="text-orange-100">to work with</p>

          {qualityOfLifeTotal > 0 && (
            <div className="mt-4 pt-4 border-t border-orange-400 text-sm">
              <p className="text-orange-100">
                ${qualityOfLifeTotal.toLocaleString()} allocated to Quality of Life
              </p>
            </div>
          )}
        </div>
      )}

      {/* What's Actually Left (After Quality of Life) */}
      {qualityOfLifeTotal > 0 && (
        <div className={`rounded-lg shadow-sm border-2 p-4 ${
          moneyLeft >= 0 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">After Quality of Life</h3>
              <div className={`text-3xl font-bold ${moneyLeft >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                ${Math.abs(moneyLeft).toLocaleString()}
              </div>
              {moneyLeft < 0 && (
                <p className="text-xs text-orange-600 mt-1">Adjust if you need breathing room</p>
              )}
              {moneyLeft >= 0 && moneyLeft < 100 && (
                <p className="text-xs text-green-600 mt-1">Perfect balance</p>
              )}
              {moneyLeft >= 100 && (
                <p className="text-xs text-green-600 mt-1">Available to save or enjoy</p>
              )}
            </div>
            <div className={`rounded-full p-3 ${moneyLeft >= 0 ? 'bg-green-100' : 'bg-orange-100'}`}>
              {moneyLeft >= 0 ? (
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangleIcon className="h-8 w-8 text-orange-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Essentials Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">What's covered</h3>
        <div className="space-y-2">
          {survivalTotal > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <CheckCircleIcon className={`h-4 w-4 mr-2 ${flexibleMoney >= 0 ? 'text-green-500' : 'text-orange-500'}`} />
                <span className="text-sm text-gray-700">Survival (rent, food, utilities)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${survivalTotal.toLocaleString()}
              </span>
            </div>
          )}
          {importantTotal > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <CheckCircleIcon className={`h-4 w-4 mr-2 ${flexibleMoney >= 0 ? 'text-green-500' : 'text-orange-500'}`} />
                <span className="text-sm text-gray-700">Important (insurance, medical)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${importantTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onNavigateToBudget}
          className="flex items-center justify-center py-3 px-4 bg-orange-600 text-white rounded-lg font-medium shadow-sm hover:bg-orange-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <BarChart3Icon className="h-5 w-5 mr-2" />
          Adjust Budget
        </button>
        <button
          onClick={onNavigateToBudget}
          className="flex items-center justify-center py-3 px-4 border-2 border-orange-600 text-orange-600 rounded-lg font-medium hover:bg-orange-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Future Building Prompt - Only if surplus exists */}
      {moneyLeft > 50 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You've got ${moneyLeft.toLocaleString()} left. Save it or spend it. Both are fine.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
