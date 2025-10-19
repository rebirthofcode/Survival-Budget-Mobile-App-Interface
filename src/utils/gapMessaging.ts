/**
 * Gap Messaging Utility
 * Provides supportive, tiered messaging for budget shortfalls
 * Aligned with PRD v4 - "No punishment, only support"
 */

import type { GapMessage, GapSeverity } from '../types/budget';

/**
 * Determine gap severity based on amount and income context
 */
export const calculateGapSeverity = (
  gapAmount: number,
  totalIncome: number
): GapSeverity => {
  if (gapAmount >= 0) return 'none';

  const absGap = Math.abs(gapAmount);
  const gapPercentage = totalIncome > 0 ? (absGap / totalIncome) * 100 : 100;

  // Minor: Small gap (≤$50)
  if (absGap <= 50) {
    return 'minor';
  }

  // Moderate: Noticeable gap (≤$200)
  if (absGap <= 200) {
    return 'moderate';
  }

  // Significant: Large but manageable gap (<50% of income)
  if (gapPercentage < 50) {
    return 'significant';
  }

  // Severe: Very large gap (≥50% of income)
  return 'severe';
};

/**
 * Get supportive messaging for a budget gap
 * PRD v4: "When users struggle, we help them succeed, never shame them"
 */
export const getGapMessage = (
  gapAmount: number,
  totalIncome: number
): GapMessage => {
  const severity = calculateGapSeverity(gapAmount, totalIncome);

  switch (severity) {
    case 'none':
      return {
        label: 'You\'re covered',
        description: 'Essentials are taken care of',
        severity: 'none',
        showHelp: false,
      };

    case 'minor':
      return {
        label: `You're close. Maybe $${Math.abs(gapAmount)} short`,
        description: 'Small adjustment and you\'re there.',
        severity: 'minor',
        showHelp: false,
        actionSuggestions: [
          'Check if any expenses can wait',
          'See if you can pick up an extra shift',
          'Look for a small side gig',
        ],
      };

    case 'moderate':
      return {
        label: `You need $${Math.abs(gapAmount).toLocaleString()} more`,
        description: 'Not the end of the world. Let\'s see what we can adjust.',
        severity: 'moderate',
        showHelp: false,
        actionSuggestions: [
          'Review which expenses are most flexible',
          'Consider temporary income sources',
          'Talk to service providers about payment plans',
        ],
      };

    case 'significant':
      return {
        label: `This month is tight. $${Math.abs(gapAmount).toLocaleString()} short`,
        description: 'This is fixable. Here are your options.',
        severity: 'significant',
        showHelp: true,
        actionSuggestions: [
          'Prioritize the absolute essentials first',
          'Contact creditors about extensions',
          'Look into emergency assistance programs',
          'Consider temporary gig work',
        ],
      };

    case 'severe':
      return {
        label: 'This month looks really tough',
        description: 'You\'re not alone in this. Let\'s prioritize what matters most.',
        severity: 'severe',
        showHelp: true,
        actionSuggestions: [
          'Focus on the four walls: housing, utilities, food, transportation',
          'Contact service providers immediately about hardship programs',
          'Look into local assistance (211 helpline)',
          'Reach out to family or friends if possible',
          'Explore emergency relief options',
        ],
      };
  }
};

/**
 * Get color classes for gap severity
 */
export const getGapColorClasses = (severity: GapSeverity) => {
  switch (severity) {
    case 'none':
      return {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: 'text-green-600',
      };
    case 'minor':
    case 'moderate':
    case 'significant':
    case 'severe':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-700',
        icon: 'text-orange-600',
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-300',
        text: 'text-gray-700',
        icon: 'text-gray-600',
      };
  }
};

/**
 * Get supportive message for specific expense categories that are over budget
 */
export const getCategoryOverageMessage = (
  categoryName: string,
  overageAmount: number
): string => {
  const absOverage = Math.abs(overageAmount);

  if (absOverage <= 50) {
    return `${categoryName} is slightly over by $${absOverage}. Small tweaks can help.`;
  } else if (absOverage <= 200) {
    return `${categoryName} needs $${absOverage} more. Let's find where to adjust.`;
  } else {
    return `${categoryName} is the biggest challenge at $${absOverage} over. Let's prioritize here.`;
  }
};

/**
 * Get encouraging message when user improves their situation
 */
export const getImprovementMessage = (
  previousGap: number,
  currentGap: number
): string | null => {
  // Only show if there was a gap and it improved
  if (previousGap >= 0 || currentGap >= previousGap) return null;

  const improvement = previousGap - currentGap;

  if (currentGap >= 0) {
    return `🎉 You did it! You covered the gap and have $${currentGap.toLocaleString()} to work with.`;
  } else {
    return `💪 Progress! You closed the gap by $${improvement.toLocaleString()}. Keep going.`;
  }
};
