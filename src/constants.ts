// Survival Budget - Application Constants
// Centralized location for all magic numbers and configuration values

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

/**
 * Session timeout duration in milliseconds
 * After this time of inactivity, user is considered to have started a new session
 * Currently set to 5 minutes
 */
export const SESSION_TIMEOUT = 300000; // 5 minutes

/**
 * Delay for refresh animation in milliseconds
 * Time to show the refresh spinner before completing
 */
export const REFRESH_DELAY = 1500; // 1.5 seconds

/**
 * Screen transition animation duration in milliseconds
 */
export const TRANSITION_DURATION = 300; // 300ms

/**
 * Delay before starting transition animation
 */
export const TRANSITION_START_DELAY = 50; // 50ms

// ============================================================================
// UI INTERACTION THRESHOLDS
// ============================================================================

/**
 * Minimum drag distance in pixels before triggering bottom sheet close
 */
export const DRAG_CLOSE_THRESHOLD = 100; // 100 pixels

/**
 * Minimum pull distance in pixels to trigger refresh
 */
export const PULL_TO_REFRESH_THRESHOLD = 60; // 60 pixels

// ============================================================================
// BUDGET CALCULATION THRESHOLDS
// ============================================================================

/**
 * Threshold for marking a budget priority as "borderline"
 * If remaining income is >= this percentage of priority cost, mark as borderline
 * Otherwise mark as not affordable
 */
export const AFFORDABILITY_THRESHOLD = 0.5; // 50%

// ============================================================================
// HAPTIC FEEDBACK DURATIONS (milliseconds)
// ============================================================================

export const HAPTIC_DURATION = {
  LIGHT: 10,
  MEDIUM: 15,
  HEAVY_PATTERN: [10, 10, 20] as const
} as const;

// ============================================================================
// COLOR CONSTANTS
// ============================================================================

/**
 * Primary brand color (orange)
 * Used throughout the app for CTAs, highlights, and branding
 */
export const PRIMARY_COLOR = '#FF6B35';

/**
 * Theme color for PWA and mobile browsers
 */
export const THEME_COLOR = '#FF6B35';

/**
 * Border colors for budget affordability states
 * Applied to priority cards based on budget calculations
 */
export const BORDER_COLORS = {
  affordable: 'border-green-500',
  borderline: 'border-orange-500',
  notAffordable: 'border-red-500'
} as const;

/**
 * Background colors for budget affordability states
 */
export const BG_COLORS = {
  affordable: 'bg-green-100',
  borderline: 'bg-orange-100',
  notAffordable: 'bg-red-100'
} as const;

/**
 * Text colors for budget affordability states
 */
export const TEXT_COLORS = {
  affordable: 'text-green-800',
  borderline: 'text-orange-800',
  notAffordable: 'text-red-800'
} as const;

/**
 * Icon background colors for priority categories
 */
export const ICON_BG_COLORS = {
  survival: 'bg-blue-100',
  important: 'bg-orange-100',
  qualityOfLife: 'bg-pink-100',
  futureBuilding: 'bg-green-100'
} as const;

// ============================================================================
// PRIORITY CONFIGURATION
// ============================================================================

/**
 * Default priority IDs
 */
export const PRIORITY_IDS = {
  SURVIVAL: 1,
  IMPORTANT: 2,
  QUALITY_OF_LIFE: 3,
  FUTURE_BUILDING: 4
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

/**
 * Keys used for localStorage persistence
 * Centralized to prevent typos and enable easy refactoring
 */
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  BUDGET_DATA: 'budgetData',
  LAST_SESSION: 'lastSession',
  APP_VERSION: 'appVersion',
  BUDGET_HISTORY: 'budgetHistory',
  LAST_SNAPSHOT_DATE: 'lastSnapshotDate',
  SAVINGS_DATA: 'savingsData'
} as const;

/**
 * Current app version - increment when making breaking changes to data structure
 * This will trigger automatic localStorage cleanup for users
 */
export const APP_VERSION = '1.0.0';

// ============================================================================
// EXPENSE CATEGORIES (PRD v4 - Aligned)
// ============================================================================

/**
 * Survival Expenses - The Four Walls
 * Essential expenses that must be covered for basic safety
 */
export const SURVIVAL_CATEGORIES = [
  { id: 'housing', name: 'Housing', icon: '🏠', color: 'blue', tier: 'survival' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: 'yellow', tier: 'survival' },
  { id: 'food', name: 'Food & Groceries', icon: '🍽️', color: 'green', tier: 'survival' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'purple', tier: 'survival' },
] as const;

/**
 * Important Expenses - Life Requirements
 * Critical obligations that must be met
 */
export const IMPORTANT_CATEGORIES = [
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'indigo', tier: 'important' },
  { id: 'debt', name: 'Debt Payments', icon: '💳', color: 'orange', tier: 'important' },
  { id: 'childcare', name: 'Childcare', icon: '👶', color: 'pink', tier: 'important' },
  { id: 'medical', name: 'Medical', icon: '⚕️', color: 'rose', tier: 'important' },
  { id: 'legal', name: 'Legal Obligations', icon: '⚖️', color: 'slate', tier: 'important' },
] as const;

/**
 * Quality of Life Expenses - Permission to Live
 * Things that make life worth living
 */
export const QUALITY_OF_LIFE_CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'fuchsia', tier: 'quality_of_life' },
  { id: 'personal_care', name: 'Personal Care', icon: '✨', color: 'violet', tier: 'quality_of_life' },
  { id: 'social', name: 'Social & Gifts', icon: '🎁', color: 'cyan', tier: 'quality_of_life' },
  { id: 'comfort', name: 'Comfort & Treats', icon: '☕', color: 'amber', tier: 'quality_of_life' },
] as const;

/**
 * All expense categories combined for backward compatibility
 */
export const EXPENSE_CATEGORIES = [
  ...SURVIVAL_CATEGORIES,
  ...IMPORTANT_CATEGORIES,
  ...QUALITY_OF_LIFE_CATEGORIES,
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['id'];

/**
 * Helper function to get category tier
 */
export const getCategoryTier = (categoryId: string): 'survival' | 'important' | 'quality_of_life' => {
  const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
  return category?.tier || 'quality_of_life';
};
