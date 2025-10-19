import { STORAGE_KEYS } from '../constants';

export type BudgetSnapshot = {
  id: string;
  date: string; // ISO date string (YYYY-MM)
  timestamp: number;
  income: number;
  priorities: {
    id: number;
    name: string;
    totalExpenses: number;
    activeExpenses: number;
    expenseCount: number;
    isAffordable: boolean;
    isBorderline: boolean;
  }[];
  totalSpending: number;
  moneyLeft: number;
  survivalCovered: boolean;
};

export type BudgetHistory = BudgetSnapshot[];

/**
 * Get the current month key (YYYY-MM)
 */
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Load budget history from localStorage
 */
export const loadBudgetHistory = (): BudgetHistory => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGET_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading budget history:', error);
  }
  return [];
};

/**
 * Save budget history to localStorage
 */
export const saveBudgetHistory = (history: BudgetHistory): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving budget history:', error);
  }
};

/**
 * Create a snapshot of the current budget state
 */
export const createSnapshot = (
  income: number,
  priorities: any[]
): BudgetSnapshot => {
  const monthKey = getCurrentMonthKey();
  const timestamp = Date.now();

  // Calculate totals
  let totalSpending = 0;
  const prioritySummaries = priorities.map(priority => {
    const activeExpenses = priority.expenses.filter((e: any) => e.enabled);
    const totalExpenses = activeExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    totalSpending += totalExpenses;

    return {
      id: priority.id,
      name: priority.name,
      totalExpenses,
      activeExpenses: activeExpenses.length,
      expenseCount: priority.expenses.length,
      isAffordable: priority.isAffordable,
      isBorderline: priority.isBorderline
    };
  });

  const moneyLeft = income - totalSpending;
  const survivalPriority = prioritySummaries.find(p => p.id === 1);
  const survivalCovered = survivalPriority?.isAffordable ?? false;

  return {
    id: `${monthKey}-${timestamp}`,
    date: monthKey,
    timestamp,
    income,
    priorities: prioritySummaries,
    totalSpending,
    moneyLeft,
    survivalCovered
  };
};

/**
 * Check if we should create a new snapshot (once per month)
 */
export const shouldCreateSnapshot = (): boolean => {
  const lastSnapshotDate = localStorage.getItem(STORAGE_KEYS.LAST_SNAPSHOT_DATE);
  const currentMonthKey = getCurrentMonthKey();

  // Create snapshot if:
  // 1. Never created one before
  // 2. Current month is different from last snapshot month
  return !lastSnapshotDate || lastSnapshotDate !== currentMonthKey;
};

/**
 * Add a snapshot to history (or update if same month exists)
 */
export const addSnapshot = (snapshot: BudgetSnapshot): void => {
  const history = loadBudgetHistory();

  // Check if snapshot for this month already exists
  const existingIndex = history.findIndex(s => s.date === snapshot.date);

  if (existingIndex >= 0) {
    // Update existing snapshot (always use latest data for current month)
    history[existingIndex] = snapshot;
  } else {
    // Add new snapshot
    history.push(snapshot);
  }

  // Sort by date descending (most recent first)
  history.sort((a, b) => b.timestamp - a.timestamp);

  // Keep only last 12 months
  const trimmedHistory = history.slice(0, 12);

  saveBudgetHistory(trimmedHistory);
  localStorage.setItem(STORAGE_KEYS.LAST_SNAPSHOT_DATE, snapshot.date);
};

/**
 * Get snapshot for a specific month
 */
export const getSnapshotForMonth = (monthKey: string): BudgetSnapshot | undefined => {
  const history = loadBudgetHistory();
  return history.find(s => s.date === monthKey);
};

/**
 * Get comparison between two snapshots
 */
export const compareSnapshots = (
  current: BudgetSnapshot,
  previous: BudgetSnapshot | undefined
) => {
  if (!previous) {
    return {
      incomeChange: 0,
      spendingChange: 0,
      moneyLeftChange: 0,
      incomeChangePercent: 0,
      spendingChangePercent: 0,
      moneyLeftChangePercent: 0
    };
  }

  const incomeChange = current.income - previous.income;
  const spendingChange = current.totalSpending - previous.totalSpending;
  const moneyLeftChange = current.moneyLeft - previous.moneyLeft;

  const incomeChangePercent = previous.income > 0
    ? (incomeChange / previous.income) * 100
    : 0;
  const spendingChangePercent = previous.totalSpending > 0
    ? (spendingChange / previous.totalSpending) * 100
    : 0;
  const moneyLeftChangePercent = previous.moneyLeft !== 0
    ? (moneyLeftChange / Math.abs(previous.moneyLeft)) * 100
    : 0;

  return {
    incomeChange,
    spendingChange,
    moneyLeftChange,
    incomeChangePercent,
    spendingChangePercent,
    moneyLeftChangePercent
  };
};

/**
 * Format month key to readable string
 */
export const formatMonthKey = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
