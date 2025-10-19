/**
 * Empty State Component
 * Handles missing data scenarios with supportive guidance
 * Aligned with PRD v4 - "Supportive recovery"
 */

import React from 'react';
import { AlertCircleIcon, DollarSignIcon, ReceiptIcon, HelpCircleIcon } from 'lucide-react';
import type { EmptyStateType } from '../types/budget';

type EmptyStateProps = {
  type: EmptyStateType;
  onAction: () => void;
  actionLabel?: string;
};

export const EmptyState = ({ type, onAction, actionLabel }: EmptyStateProps) => {
  const config = getEmptyStateConfig(type);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.iconBg} mb-4`}>
          <config.icon className={`h-8 w-8 ${config.iconColor}`} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {config.heading}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {config.description}
        </p>

        {/* Action Button */}
        <button
          onClick={onAction}
          className="w-full py-3 px-6 bg-orange-600 text-white rounded-lg font-medium shadow-sm hover:bg-orange-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
        >
          {actionLabel || config.actionLabel}
        </button>

        {/* Additional Help Text */}
        {config.helpText && (
          <p className="text-sm text-gray-500 mt-4">
            {config.helpText}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Configuration for different empty states
 */
const getEmptyStateConfig = (type: EmptyStateType) => {
  switch (type) {
    case 'no_income':
      return {
        icon: DollarSignIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        heading: 'No income added yet',
        description: 'Even if it\'s uncertain, let\'s put something down. We can adjust as we go.',
        actionLabel: 'Add Income',
        helpText: 'Your income information stays private on your device.',
      };

    case 'zero_income':
      return {
        icon: DollarSignIcon,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        heading: 'That\'s okay. Let\'s see what we\'re working with',
        description: 'Even with no income right now, we can help you prioritize what matters most.',
        actionLabel: 'Review Expenses',
        helpText: 'You can add income later when your situation changes.',
      };

    case 'no_expenses':
      return {
        icon: ReceiptIcon,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        heading: 'No expenses yet',
        description: 'Everyone has at least housing and food. Let\'s start there.',
        actionLabel: 'Add Expenses',
        helpText: 'Start with your essentials: rent, groceries, utilities.',
      };

    case 'no_survival_expenses':
      return {
        icon: AlertCircleIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        heading: 'Let\'s add your essential expenses',
        description: 'Housing, utilities, food, and transportation - these are your four walls.',
        actionLabel: 'Add Essentials',
        helpText: 'These are the expenses that keep you safe.',
      };

    case 'setup_incomplete':
      return {
        icon: HelpCircleIcon,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        heading: 'Let\'s finish setup',
        description: 'You\'re almost there. Just a few more details and we can show you if you\'re covered.',
        actionLabel: 'Continue Setup',
        helpText: 'This will only take a minute.',
      };

    case 'calculation_error':
      return {
        icon: AlertCircleIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        heading: 'Something doesn\'t add up',
        description: 'Mind double-checking? Sometimes numbers get mixed up.',
        actionLabel: 'Review Budget',
        helpText: 'You can also reset and start fresh if needed.',
      };

    default:
      return {
        icon: HelpCircleIcon,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        heading: 'Something went wrong',
        description: 'Let\'s get you back on track.',
        actionLabel: 'Continue',
        helpText: null,
      };
  }
};
