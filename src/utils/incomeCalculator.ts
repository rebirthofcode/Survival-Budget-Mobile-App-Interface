/**
 * Income Calculator Utility
 * Handles irregular income, multiple sources, and confidence levels
 * Aligned with PRD v4
 */

import type { IncomeSource, IncomeFrequency, IncomeConfidence } from '../types/budget';

/**
 * Convert any income frequency to monthly equivalent
 */
export const convertToMonthly = (amount: number, frequency: IncomeFrequency): number => {
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'bi-weekly':
      return (amount * 26) / 12; // 26 bi-weekly periods per year
    case 'weekly':
      return (amount * 52) / 12; // 52 weeks per year
    case 'irregular':
      return amount; // Assume user entered monthly average
    default:
      return amount;
  }
};

/**
 * Apply confidence multiplier to income
 * Conservative approach for budgeting safety
 */
export const applyConfidenceMultiplier = (
  amount: number,
  confidence: IncomeConfidence,
  scenario: 'conservative' | 'typical' | 'optimistic'
): number => {
  const multipliers = {
    conservative: {
      certain: 1.0,
      likely: 0.85,
      uncertain: 0.6,
    },
    typical: {
      certain: 1.0,
      likely: 0.95,
      uncertain: 0.75,
    },
    optimistic: {
      certain: 1.0,
      likely: 1.0,
      uncertain: 0.9,
    },
  };

  return amount * multipliers[scenario][confidence];
};

/**
 * Check if income source is currently active
 */
export const isIncomeActive = (source: IncomeSource, date: Date = new Date()): boolean => {
  if (!source.active_dates) return true;

  const start = new Date(source.active_dates.start);
  if (date < start) return false;

  if (source.active_dates.end) {
    const end = new Date(source.active_dates.end);
    if (date > end) return false;
  }

  return true;
};

/**
 * Calculate total monthly income across all sources
 * Returns conservative, typical, and optimistic scenarios
 */
export const calculateMonthlyIncome = (
  sources: IncomeSource[],
  referenceDate: Date = new Date()
): {
  conservative: number;
  typical: number;
  optimistic: number;
  breakdown: Array<{
    source_name: string;
    monthly_amount: number;
    confidence: IncomeConfidence;
  }>;
} => {
  // Filter to active sources only
  const activeSources = sources.filter(source => isIncomeActive(source, referenceDate));

  let conservative = 0;
  let typical = 0;
  let optimistic = 0;
  const breakdown: Array<{
    source_name: string;
    monthly_amount: number;
    confidence: IncomeConfidence;
  }> = [];

  activeSources.forEach(source => {
    // Convert to monthly
    const monthlyAmount = convertToMonthly(source.amount, source.frequency);

    // Apply confidence multipliers
    conservative += applyConfidenceMultiplier(monthlyAmount, source.confidence, 'conservative');
    typical += applyConfidenceMultiplier(monthlyAmount, source.confidence, 'typical');
    optimistic += applyConfidenceMultiplier(monthlyAmount, source.confidence, 'optimistic');

    breakdown.push({
      source_name: source.source_name,
      monthly_amount: monthlyAmount,
      confidence: source.confidence,
    });
  });

  return {
    conservative: Math.floor(conservative),
    typical: Math.floor(typical),
    optimistic: Math.floor(optimistic),
    breakdown,
  };
};

/**
 * Get display text for income confidence level
 */
export const getConfidenceLabel = (confidence: IncomeConfidence): string => {
  switch (confidence) {
    case 'certain':
      return 'Reliable';
    case 'likely':
      return 'Mostly reliable';
    case 'uncertain':
      return 'Variable';
    default:
      return 'Unknown';
  }
};

/**
 * Get display text for income frequency
 */
export const getFrequencyLabel = (frequency: IncomeFrequency): string => {
  switch (frequency) {
    case 'monthly':
      return 'Monthly';
    case 'bi-weekly':
      return 'Every 2 weeks';
    case 'weekly':
      return 'Weekly';
    case 'irregular':
      return 'Varies';
    default:
      return 'Unknown';
  }
};

/**
 * Suggest income scenario to use for budgeting
 * PRD recommends conservative by default
 */
export const getSuggestedScenario = (
  sources: IncomeSource[]
): 'conservative' | 'typical' | 'optimistic' => {
  // If all sources are certain, use typical
  const allCertain = sources.every(s => s.confidence === 'certain');
  if (allCertain) return 'typical';

  // If any source is uncertain or irregular, use conservative
  const hasUncertain = sources.some(
    s => s.confidence === 'uncertain' || s.frequency === 'irregular'
  );
  if (hasUncertain) return 'conservative';

  // Default to typical for mostly reliable income
  return 'typical';
};

/**
 * Generate income summary text for display
 */
export const getIncomeSummaryText = (
  sources: IncomeSource[],
  referenceDate?: Date
): string => {
  if (sources.length === 0) return 'No income sources';

  const income = calculateMonthlyIncome(sources, referenceDate);
  const scenario = getSuggestedScenario(sources);
  const amount = income[scenario];

  if (sources.length === 1) {
    return `$${amount.toLocaleString()}/month`;
  }

  return `$${amount.toLocaleString()}/month (${sources.length} sources)`;
};
