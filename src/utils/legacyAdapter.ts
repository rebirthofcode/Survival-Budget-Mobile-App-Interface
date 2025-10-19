/**
 * Legacy Adapter Utility
 *
 * Converts legacy Priority-based data structure to PRD v4 BudgetData format.
 * This enables components using the new BudgetData type to work with legacy data
 * during the incremental migration period.
 *
 * @see .sessions/2025-01-19_prd-v4-implementation.md for migration plan
 */

import type { BudgetData, IncomeSource, ExpenseItem, FutureBuilding, BudgetState } from '../types/budget';

// Legacy types (matching current BudgetApp.tsx)
type LegacyExpenseItem = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
  category?: string;
  savingsGoalId?: string;
};

type LegacyPriority = {
  id: number;
  name: string;
  expenses: LegacyExpenseItem[];
  isAffordable: boolean;
  isBorderline: boolean;
};

/**
 * Converts legacy Priority[] and income to PRD v4 BudgetData format
 *
 * @param income - Single income number from legacy system
 * @param priorities - Legacy priority array (1=Survival, 2=Important, 3=Quality of Life, 4=Future Building)
 * @returns BudgetData in PRD v4 format
 */
export const convertLegacyToBudgetData = (
  income: number,
  priorities: LegacyPriority[]
): BudgetData => {
  // Convert single income to income_sources array
  const income_sources: IncomeSource[] = income > 0 ? [{
    id: `legacy_income_${Date.now()}`,
    source_name: 'Primary Income',
    amount: income,
    frequency: 'monthly',
    confidence: 'certain',
  }] : [];

  // Find priorities by ID
  const survivalPriority = priorities.find(p => p.id === 1);
  const importantPriority = priorities.find(p => p.id === 2);
  const qualityOfLifePriority = priorities.find(p => p.id === 3);
  const futureBuildingPriority = priorities.find(p => p.id === 4);

  // Convert legacy expenses to new ExpenseItem format
  const convertExpenses = (legacyExpenses: LegacyExpenseItem[]): ExpenseItem[] => {
    return legacyExpenses.map(expense => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      enabled: expense.enabled,
      category: mapLegacyCategory(expense.name, expense.category),
      due_date: undefined, // Not tracked in legacy system
      is_recurring: true, // Assume all legacy expenses are recurring
      notes: undefined,
    }));
  };

  // Map legacy expense names/categories to PRD v4 categories
  const mapLegacyCategory = (name: string, legacyCategory?: string): any => {
    const nameLower = name.toLowerCase();

    // Map based on common expense names
    if (nameLower.includes('rent') || nameLower.includes('mortgage')) return 'housing';
    if (nameLower.includes('electric') || nameLower.includes('utility') || nameLower.includes('utilities')) return 'utilities';
    if (nameLower.includes('food') || nameLower.includes('groceries')) return 'food';
    if (nameLower.includes('car') || nameLower.includes('transport') || nameLower.includes('gas')) return 'transportation';
    if (nameLower.includes('insurance')) return 'insurance';
    if (nameLower.includes('debt') || nameLower.includes('loan') || nameLower.includes('credit')) return 'debt';
    if (nameLower.includes('child') || nameLower.includes('daycare')) return 'childcare';
    if (nameLower.includes('medical') || nameLower.includes('doctor') || nameLower.includes('health')) return 'medical';

    // Default categories by priority level
    return legacyCategory || 'other';
  };

  // Extract expenses by priority
  const survival_expenses = survivalPriority ? convertExpenses(survivalPriority.expenses) : [];
  const important_expenses = importantPriority ? convertExpenses(importantPriority.expenses) : [];
  const quality_of_life_expenses = qualityOfLifePriority ? convertExpenses(qualityOfLifePriority.expenses) : [];

  // Extract future building
  const futureBuildingExpenses = futureBuildingPriority?.expenses || [];
  const futureBuildingTotal = futureBuildingExpenses
    .filter(e => e.enabled)
    .reduce((sum, e) => sum + e.amount, 0);

  const future_building: FutureBuilding = {
    enabled: futureBuildingTotal > 0,
    amount: futureBuildingTotal,
    breakdown: futureBuildingExpenses.map(e => ({
      category: e.savingsGoalId ? 'savings' : 'other',
      amount: e.amount,
      enabled: e.enabled,
    })),
  };

  // Calculate budget state
  const totalExpenses =
    survival_expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0) +
    important_expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0) +
    quality_of_life_expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0) +
    futureBuildingTotal;

  const remaining = income - totalExpenses;

  const budget_state: BudgetState = {
    total_income: income,
    total_expenses: totalExpenses,
    remaining,
    last_updated: new Date().toISOString(),
  };

  return {
    income_sources,
    survival_expenses,
    important_expenses,
    quality_of_life_expenses,
    future_building,
    budget_state,
    version: 2,
    last_updated: new Date().toISOString(),
  };
};

/**
 * Loads legacy data from localStorage and converts to BudgetData format
 * Falls back to empty BudgetData if no legacy data exists
 */
export const loadLegacyDataAsBudgetData = (): BudgetData => {
  // Load legacy income
  const savedIncome = localStorage.getItem('budgetIncome');
  const income = savedIncome ? parseInt(savedIncome) : 0;

  // Load legacy priorities
  const savedPriorities = localStorage.getItem('budgetPriorities');
  const priorities: LegacyPriority[] = savedPriorities ? JSON.parse(savedPriorities) : [];

  return convertLegacyToBudgetData(income, priorities);
};
