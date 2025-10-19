/**
 * Survival Budget - Comprehensive Type Definitions
 * Aligned with PRD v4
 */

// ============================================================================
// Income Types
// ============================================================================

export type IncomeFrequency = 'monthly' | 'bi-weekly' | 'weekly' | 'irregular';
export type IncomeConfidence = 'certain' | 'likely' | 'uncertain';

export type IncomeSource = {
  id: string;
  source_name: string;
  amount: number; // Base amount in the specified frequency
  frequency: IncomeFrequency;
  confidence: IncomeConfidence;
  active_dates?: {
    start: Date;
    end?: Date; // Optional end date for temporary income
  };
};

// ============================================================================
// Expense Types
// ============================================================================

export type ExpenseFrequency = 'monthly' | 'bi-weekly' | 'weekly' | 'yearly' | 'one-time';
export type ExpenseFlexibility = 'fixed' | 'somewhat_flexible' | 'very_flexible';

// Survival Expenses (The Four Walls)
export type SurvivalCategory = 'housing' | 'utilities' | 'food' | 'transportation';

// Important Expenses (Life Requirements)
export type ImportantCategory = 'insurance' | 'debt' | 'childcare' | 'medical' | 'legal';

// Quality of Life Expenses (Permission to Live)
export type QualityOfLifeCategory = 'entertainment' | 'personal_care' | 'social' | 'comfort';

// All expense categories
export type ExpenseCategory = SurvivalCategory | ImportantCategory | QualityOfLifeCategory;

export type ExpenseItem = {
  id: string;
  name: string;
  amount: number; // Monthly equivalent
  enabled: boolean;
  category: ExpenseCategory;
  frequency: ExpenseFrequency;
  due_date?: string; // ISO date string
  flexibility: ExpenseFlexibility;
  savingsGoalId?: string; // For linking to savings goals
};

// ============================================================================
// Savings/Future Building Types
// ============================================================================

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string; // ISO date string
  category: 'emergency' | 'custom';
};

export type FutureBuilding = {
  emergency_fund: {
    target_months: number;
    current_amount: number;
    monthly_essential_cost: number; // Auto-calculated
  };
  savings_goals: SavingsGoal[];
};

// ============================================================================
// Budget State (Calculated Values)
// ============================================================================

export type GapSeverity = 'none' | 'minor' | 'moderate' | 'significant' | 'severe';

export type BudgetState = {
  // Income calculations
  total_income_conservative: number; // Used for budget decisions
  total_income_typical: number; // Average case
  total_income_optimistic: number; // Best case

  // Expense totals
  survival_total: number;
  important_total: number;
  essentials_total: number; // survival + important
  quality_of_life_total: number;
  future_building_total: number;

  // Status flags
  survival_covered: boolean;
  important_covered: boolean;
  essentials_covered: boolean;

  // Money calculations
  flexible_money: number; // After essentials
  surplus_available: number; // After everything
  gap_amount: number; // Negative if short
  gap_severity: GapSeverity;

  // Metadata
  last_calculation: string; // ISO timestamp
};

// ============================================================================
// Main Budget Data Structure
// ============================================================================

export type BudgetData = {
  // Income
  income_sources: IncomeSource[];

  // Expenses by tier
  survival_expenses: ExpenseItem[];
  important_expenses: ExpenseItem[];
  quality_of_life_expenses: ExpenseItem[];

  // Future building
  future_building: FutureBuilding;

  // Calculated state
  budget_state: BudgetState;

  // Metadata
  version: number; // Data schema version for migrations
  last_updated: string; // ISO timestamp
};

// ============================================================================
// Legacy Types (for migration)
// ============================================================================

export type LegacyPriority = {
  id: number;
  name: string;
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
    category?: string;
    savingsGoalId?: string;
  }>;
  isAffordable: boolean;
  isBorderline: boolean;
};

export type LegacyBudgetData = {
  income: number;
  priorities: LegacyPriority[];
};

// ============================================================================
// User Profile & Settings
// ============================================================================

export type UserProfile = {
  setup_complete: boolean;
  onboarding_step?: number; // For progress saving
  last_updated: string;
  privacy_settings: {
    local_only: boolean;
    sync_enabled: boolean;
    analytics_enabled: boolean;
  };
};

// ============================================================================
// UI State Types
// ============================================================================

export type EmptyStateType =
  | 'no_income'
  | 'no_expenses'
  | 'zero_income'
  | 'calculation_error'
  | 'no_survival_expenses'
  | 'setup_incomplete';

export type GapMessage = {
  label: string;
  description: string;
  severity: GapSeverity;
  showHelp: boolean;
  actionSuggestions?: string[];
};
