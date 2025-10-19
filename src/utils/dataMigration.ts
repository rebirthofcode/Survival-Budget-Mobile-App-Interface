/**
 * Data Migration Utility
 * Converts legacy budget data to PRD v4 format
 * Preserves user data during schema changes
 */

import type {
  BudgetData,
  LegacyBudgetData,
  IncomeSource,
  ExpenseItem,
  FutureBuilding,
  BudgetState,
  ExpenseCategory,
  SurvivalCategory,
  ImportantCategory,
  QualityOfLifeCategory,
} from '../types/budget';
import { calculateMonthlyIncome } from './incomeCalculator';

const DATA_VERSION = 2; // Current schema version

/**
 * Detect if data is in legacy format
 */
export const isLegacyFormat = (data: any): data is LegacyBudgetData => {
  return (
    data &&
    typeof data.income === 'number' &&
    Array.isArray(data.priorities) &&
    !data.version
  );
};

/**
 * Map legacy priority ID to new category
 */
const mapPriorityToCategory = (priorityId: number, expenseName: string): ExpenseCategory => {
  // Priority 1: Survival (Four Walls)
  if (priorityId === 1) {
    const name = expenseName.toLowerCase();
    if (name.includes('rent') || name.includes('mortgage') || name.includes('housing')) {
      return 'housing';
    }
    if (name.includes('electric') || name.includes('water') || name.includes('gas') ||
        name.includes('internet') || name.includes('phone') || name.includes('utility')) {
      return 'utilities';
    }
    if (name.includes('food') || name.includes('groceries') || name.includes('grocery')) {
      return 'food';
    }
    if (name.includes('car') || name.includes('gas') || name.includes('transport') ||
        name.includes('bus') || name.includes('train')) {
      return 'transportation';
    }
    // Default to housing if we can't determine
    return 'housing';
  }

  // Priority 2: Important
  if (priorityId === 2) {
    const name = expenseName.toLowerCase();
    if (name.includes('insurance')) return 'insurance';
    if (name.includes('debt') || name.includes('loan') || name.includes('payment')) return 'debt';
    if (name.includes('childcare') || name.includes('daycare')) return 'childcare';
    if (name.includes('medical') || name.includes('doctor') || name.includes('prescription')) return 'medical';
    if (name.includes('child support') || name.includes('legal')) return 'legal';
    // Default to insurance
    return 'insurance';
  }

  // Priority 3: Quality of Life
  if (priorityId === 3) {
    const name = expenseName.toLowerCase();
    if (name.includes('streaming') || name.includes('entertainment') || name.includes('movie')) {
      return 'entertainment';
    }
    if (name.includes('haircut') || name.includes('gym') || name.includes('personal')) {
      return 'personal_care';
    }
    if (name.includes('gift') || name.includes('social')) return 'social';
    // Default to comfort
    return 'comfort';
  }

  // Priority 4: Future Building - these will be moved to savings goals
  // For now, categorize as comfort
  return 'comfort';
};

/**
 * Convert legacy expense to new format
 */
const migrateLegacyExpense = (
  expense: any,
  priorityId: number
): ExpenseItem => {
  return {
    id: expense.id || `exp_${Date.now()}_${Math.random()}`,
    name: expense.name,
    amount: expense.amount,
    enabled: expense.enabled !== false, // Default to true if not specified
    category: mapPriorityToCategory(priorityId, expense.name),
    frequency: 'monthly', // Assume monthly for legacy data
    flexibility: priorityId === 1 ? 'fixed' : priorityId === 2 ? 'somewhat_flexible' : 'very_flexible',
    savingsGoalId: expense.savingsGoalId,
  };
};

/**
 * Calculate initial budget state
 */
const calculateInitialBudgetState = (
  incomeSources: IncomeSource[],
  survivalExpenses: ExpenseItem[],
  importantExpenses: ExpenseItem[],
  qualityOfLifeExpenses: ExpenseItem[]
): BudgetState => {
  const income = calculateMonthlyIncome(incomeSources);

  const survivalTotal = survivalExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const importantTotal = importantExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const essentialsTotal = survivalTotal + importantTotal;

  const qualityOfLifeTotal = qualityOfLifeExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const flexibleMoney = income.conservative - essentialsTotal;
  const surplusAvailable = flexibleMoney - qualityOfLifeTotal;
  const gapAmount = flexibleMoney < 0 ? flexibleMoney : 0;

  // Determine gap severity
  let gapSeverity: BudgetState['gap_severity'] = 'none';
  if (gapAmount < 0) {
    const absGap = Math.abs(gapAmount);
    const gapPercentage = (absGap / income.conservative) * 100;

    if (absGap <= 50) {
      gapSeverity = 'minor';
    } else if (absGap <= 200) {
      gapSeverity = 'moderate';
    } else if (gapPercentage < 50) {
      gapSeverity = 'significant';
    } else {
      gapSeverity = 'severe';
    }
  }

  return {
    total_income_conservative: income.conservative,
    total_income_typical: income.typical,
    total_income_optimistic: income.optimistic,
    survival_total: survivalTotal,
    important_total: importantTotal,
    essentials_total: essentialsTotal,
    quality_of_life_total: qualityOfLifeTotal,
    future_building_total: 0,
    survival_covered: income.conservative >= survivalTotal,
    important_covered: income.conservative >= essentialsTotal,
    essentials_covered: income.conservative >= essentialsTotal,
    flexible_money: flexibleMoney,
    surplus_available: surplusAvailable,
    gap_amount: gapAmount,
    gap_severity: gapSeverity,
    last_calculation: new Date().toISOString(),
  };
};

/**
 * Migrate legacy budget data to new format
 */
export const migrateLegacyData = (legacyData: LegacyBudgetData): BudgetData => {
  // Convert single income to income source
  const incomeSources: IncomeSource[] = legacyData.income > 0 ? [{
    id: `income_${Date.now()}`,
    source_name: 'Primary Income',
    amount: legacyData.income,
    frequency: 'monthly',
    confidence: 'certain',
  }] : [];

  // Separate expenses by priority
  const survivalExpenses: ExpenseItem[] = [];
  const importantExpenses: ExpenseItem[] = [];
  const qualityOfLifeExpenses: ExpenseItem[] = [];

  legacyData.priorities.forEach(priority => {
    priority.expenses.forEach(expense => {
      const migratedExpense = migrateLegacyExpense(expense, priority.id);

      if (priority.id === 1) {
        survivalExpenses.push(migratedExpense);
      } else if (priority.id === 2) {
        importantExpenses.push(migratedExpense);
      } else if (priority.id === 3) {
        qualityOfLifeExpenses.push(migratedExpense);
      }
      // Priority 4 (Future Building) expenses are skipped for now
      // They should be converted to savings goals in a future enhancement
    });
  });

  // Initialize future building (empty for now)
  const futureBuilding: FutureBuilding = {
    emergency_fund: {
      target_months: 3,
      current_amount: 0,
      monthly_essential_cost: 0,
    },
    savings_goals: [],
  };

  // Calculate initial budget state
  const budgetState = calculateInitialBudgetState(
    incomeSources,
    survivalExpenses,
    importantExpenses,
    qualityOfLifeExpenses
  );

  return {
    income_sources: incomeSources,
    survival_expenses: survivalExpenses,
    important_expenses: importantExpenses,
    quality_of_life_expenses: qualityOfLifeExpenses,
    future_building: futureBuilding,
    budget_state: budgetState,
    version: DATA_VERSION,
    last_updated: new Date().toISOString(),
  };
};

/**
 * Load and migrate budget data from localStorage
 */
export const loadAndMigrateBudgetData = (): BudgetData | null => {
  const stored = localStorage.getItem('budgetData');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);

    // Check if migration is needed
    if (isLegacyFormat(data)) {
      console.log('Migrating legacy budget data to v2 format...');
      const migratedData = migrateLegacyData(data);

      // Save migrated data
      localStorage.setItem('budgetData', JSON.stringify(migratedData));

      console.log('Migration complete');
      return migratedData;
    }

    // Already in new format
    return data as BudgetData;
  } catch (error) {
    console.error('Error loading budget data:', error);
    return null;
  }
};

/**
 * Save budget data to localStorage
 */
export const saveBudgetData = (data: BudgetData): void => {
  data.last_updated = new Date().toISOString();
  localStorage.setItem('budgetData', JSON.stringify(data));
};
