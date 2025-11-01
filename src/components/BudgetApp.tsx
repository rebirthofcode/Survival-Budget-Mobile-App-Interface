import { useEffect, useState } from 'react';
import { IncomeInput } from './IncomeInput';
import { SpendingPlan } from './SpendingPlan';
import { HomeIcon, CarIcon, CoffeeIcon, PiggyBankIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, AlertTriangleIcon, Pencil } from 'lucide-react';
import { BottomSheet } from './Mobile/BottomSheet';
import { BudgetExpenseList } from './Mobile/BudgetExpenseList';
import { ExpenseModal } from './Mobile/ExpenseModal';
import { Toast } from './Mobile/Toast';
import { AFFORDABILITY_THRESHOLD, type ExpenseCategory } from '../constants';
import { createSnapshot, addSnapshot, shouldCreateSnapshot } from '../utils/budgetHistory';

// Define expense item type
type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
  category?: ExpenseCategory;
  savingsGoalId?: string; // Links to a savings goal when category is 'savings'
};

// Define priority type
type Priority = {
  id: number;
  name: string;
  expenses: ExpenseItem[];
  isAffordable: boolean;
  isBorderline: boolean;
};

type BudgetAppProps = {
  initialIncome: number;
  initialRent?: number;
  initialGroceries?: number;
  initialUtilities?: number;
};

export const BudgetApp = ({
  initialIncome,
  initialRent,
  initialGroceries,
  initialUtilities
}: BudgetAppProps) => {
  const [income, setIncome] = useState<number>(initialIncome);

  // Create initial priorities with onboarding expenses if provided
  const getInitialPriorities = (): Priority[] => {
    const survivalExpenses: ExpenseItem[] = [];

    if (initialRent && initialRent > 0) {
      survivalExpenses.push({
        id: 's1',
        name: 'Rent/Mortgage',
        amount: initialRent,
        enabled: true
      });
    }

    if (initialGroceries && initialGroceries > 0) {
      survivalExpenses.push({
        id: 's2',
        name: 'Groceries',
        amount: initialGroceries,
        enabled: true
      });
    }

    if (initialUtilities && initialUtilities > 0) {
      survivalExpenses.push({
        id: 's3',
        name: 'Utilities',
        amount: initialUtilities,
        enabled: true
      });
    }

    return [
      {
        id: 1,
        name: 'Survival',
        expenses: survivalExpenses,
        isAffordable: true,
        isBorderline: false
      },
      {
        id: 2,
        name: 'Important',
        expenses: [],
        isAffordable: true,
        isBorderline: false
      },
      {
        id: 3,
        name: 'Quality of Life',
        expenses: [],
        isAffordable: true,
        isBorderline: false
      },
      {
        id: 4,
        name: 'Future Building',
        expenses: [],
        isAffordable: true,
        isBorderline: false
      }
    ];
  };

  const [priorities, setPriorities] = useState<Priority[]>(() => {
    // ALWAYS prioritize saved priorities from localStorage
    // This prevents data loss when users return to the app
    const savedPriorities = localStorage.getItem('budgetPriorities');
    if (savedPriorities) {
      try {
        return JSON.parse(savedPriorities);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading saved priorities:', error);
        }
      }
    }

    // If no saved priorities exist, check for onboarding data (first-time user)
    const hasOnboardingData = initialRent || initialGroceries || initialUtilities;
    if (hasOnboardingData) {
      // User just completed onboarding - use fresh onboarding data
      return getInitialPriorities();
    }

    // Fallback: no saved data and no onboarding data - start empty
    return getInitialPriorities();
  });
  const [expandedPriorities, setExpandedPriorities] = useState<number[]>([]);
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState<'add' | 'edit'>('add');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [showEditIncomeModal, setShowEditIncomeModal] = useState(false);
  const [tempIncome, setTempIncome] = useState(income);

  // Toast state for undo functionality
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletedExpense, setDeletedExpense] = useState<{ priorityId: number; expense: ExpenseItem } | null>(null);

  // Save priorities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgetPriorities', JSON.stringify(priorities));
  }, [priorities]);

  // Save income to budgetData in localStorage whenever it changes
  // This keeps it in sync with App.tsx's budgetData state
  useEffect(() => {
    const savedBudgetData = localStorage.getItem('budgetData');
    if (savedBudgetData) {
      try {
        const budgetData = JSON.parse(savedBudgetData);
        budgetData.income = income;
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating income in budgetData:', error);
        }
      }
    }
  }, [income]);

  // Create monthly budget snapshots for history tracking
  useEffect(() => {
    // Only create snapshot if we have meaningful data
    if (income > 0 && priorities.some(p => p.expenses.length > 0)) {
      // Check if we need a new snapshot (once per month)
      if (shouldCreateSnapshot()) {
        const snapshot = createSnapshot(income, priorities);
        addSnapshot(snapshot);
      } else {
        // Always update current month's snapshot with latest data
        const snapshot = createSnapshot(income, priorities);
        addSnapshot(snapshot);
      }
    }
  }, [income, priorities]);

  // Calculate affordability based on income and expenses
  useEffect(() => {
    let remainingIncome = income;
    const updatedPriorities = [...priorities];
    
    updatedPriorities.forEach((priority) => {
      const priorityTotal = priority.expenses
        .filter(expense => expense.enabled)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      if (remainingIncome >= priorityTotal) {
        priority.isAffordable = true;
        priority.isBorderline = false;
        remainingIncome -= priorityTotal;
      } else if (remainingIncome > 0 && remainingIncome >= priorityTotal * AFFORDABILITY_THRESHOLD) {
        priority.isAffordable = false;
        priority.isBorderline = true;
        remainingIncome = 0;
      } else {
        priority.isAffordable = false;
        priority.isBorderline = false;
      }
    });
    
    setPriorities(updatedPriorities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, priorities.map(p => p.expenses.map(e => e.enabled ? e.amount : 0).join('')).join('')]);

  // Toggle expense enabled state
  const toggleExpense = (priorityId: number, expenseId: string) => {
    setPriorities(priorities.map(priority => {
      if (priority.id === priorityId) {
        return {
          ...priority,
          expenses: priority.expenses.map(expense => {
            if (expense.id === expenseId) {
              const newEnabled = !expense.enabled;

              // Update savings goal if this is a savings expense
              if (expense.category === 'savings' && expense.savingsGoalId) {
                if (newEnabled) {
                  updateSavingsGoalFromBudget(expense.savingsGoalId, expense.amount, 'add');
                } else {
                  updateSavingsGoalFromBudget(expense.savingsGoalId, expense.amount, 'remove');
                }
              }

              return {
                ...expense,
                enabled: newEnabled
              };
            }
            return expense;
          })
        };
      }
      return priority;
    }));
  };

  // Update expense amount
  const updateExpenseAmount = (priorityId: number, expenseId: string, amount: number) => {
    setPriorities(priorities.map(priority => {
      if (priority.id === priorityId) {
        return {
          ...priority,
          expenses: priority.expenses.map(expense => {
            if (expense.id === expenseId) {
              // Update savings goal if this is an enabled savings expense
              if (expense.category === 'savings' && expense.savingsGoalId && expense.enabled) {
                updateSavingsGoalFromBudget(expense.savingsGoalId, amount, 'update', expense.amount);
              }

              return {
                ...expense,
                amount: amount
              };
            }
            return expense;
          })
        };
      }
      return priority;
    }));
  };

  // Delete expense with undo support
  const deleteExpense = (priorityId: number, expenseId: string) => {
    // Find the expense being deleted
    const priority = priorities.find(p => p.id === priorityId);
    const expense = priority?.expenses.find(e => e.id === expenseId);

    if (expense) {
      // If this is a savings expense, remove from savings goal
      if (expense.category === 'savings' && expense.savingsGoalId && expense.enabled) {
        updateSavingsGoalFromBudget(expense.savingsGoalId, expense.amount, 'remove');
      }

      // Store the deleted expense for undo
      setDeletedExpense({ priorityId, expense });

      // Delete the expense
      setPriorities(priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            expenses: p.expenses.filter(e => e.id !== expenseId)
          };
        }
        return p;
      }));

      // Show toast with undo option
      setToastMessage(`"${expense.name}" deleted`);
      setShowToast(true);
    }
  };

  // Undo delete expense
  const undoDeleteExpense = () => {
    if (deletedExpense) {
      const { expense } = deletedExpense;

      // If this was a savings expense, restore to savings goal
      if (expense.category === 'savings' && expense.savingsGoalId && expense.enabled) {
        updateSavingsGoalFromBudget(expense.savingsGoalId, expense.amount, 'add');
      }

      setPriorities(priorities.map(priority => {
        if (priority.id === deletedExpense.priorityId) {
          return {
            ...priority,
            expenses: [...priority.expenses, deletedExpense.expense]
          };
        }
        return priority;
      }));
      setDeletedExpense(null);
      setShowToast(false);
    }
  };

  // Helper function to update savings goal when budget allocations change
  const updateSavingsGoalFromBudget = (goalId: string, amount: number, action: 'add' | 'remove' | 'update', oldAmount?: number) => {
    const savedData = localStorage.getItem('savingsData');
    if (!savedData) return;

    try {
      const savingsData = JSON.parse(savedData);
      const updatedGoals = savingsData.goals.map((goal: any) => {
        if (goal.id === goalId) {
          let newCurrentAmount = goal.currentAmount;

          if (action === 'add') {
            newCurrentAmount += amount;
          } else if (action === 'remove') {
            newCurrentAmount -= amount;
          } else if (action === 'update' && oldAmount !== undefined) {
            newCurrentAmount = newCurrentAmount - oldAmount + amount;
          }

          return {
            ...goal,
            currentAmount: Math.max(0, newCurrentAmount)
          };
        }
        return goal;
      });

      localStorage.setItem('savingsData', JSON.stringify({
        ...savingsData,
        goals: updatedGoals
      }));

      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  };

  // Add new expense
  const addExpense = (name: string, amount: number, category?: ExpenseCategory, savingsGoalId?: string) => {
    if (selectedPriorityId) {
      const newExpense: ExpenseItem = {
        id: `${selectedPriorityId}-${Date.now()}`,
        name,
        amount,
        enabled: true,
        category,
        savingsGoalId
      };

      setPriorities(priorities.map(priority => {
        if (priority.id === selectedPriorityId) {
          return {
            ...priority,
            expenses: [...priority.expenses, newExpense]
          };
        }
        return priority;
      }));

      // If this is a savings expense with a goal, update the savings goal
      if (category === 'savings' && savingsGoalId) {
        updateSavingsGoalFromBudget(savingsGoalId, amount, 'add');
      }
    }
  };

  // Update existing expense (for modal)
  const updateExpense = (name: string, amount: number, category?: ExpenseCategory, savingsGoalId?: string, newPriorityId?: number) => {
    if (selectedPriorityId && editingExpenseId) {
      // Get the old expense to check for savings goal changes
      const priority = priorities.find(p => p.id === selectedPriorityId);
      const oldExpense = priority?.expenses.find(e => e.id === editingExpenseId);

      // Check if we're moving the expense to a different priority
      const isMovingPriority = newPriorityId && newPriorityId !== selectedPriorityId;

      if (isMovingPriority) {
        // Moving expense to a different priority
        setPriorities(priorities.map(p => {
          if (p.id === selectedPriorityId) {
            // Remove expense from current priority
            return {
              ...p,
              expenses: p.expenses.filter(e => e.id !== editingExpenseId)
            };
          } else if (p.id === newPriorityId) {
            // Add updated expense to new priority
            return {
              ...p,
              expenses: [
                ...p.expenses,
                {
                  id: editingExpenseId,
                  name,
                  amount,
                  enabled: oldExpense?.enabled ?? true,
                  category,
                  savingsGoalId
                }
              ]
            };
          }
          return p;
        }));
      } else {
        // Update expense in same priority
        setPriorities(priorities.map(priority => {
          if (priority.id === selectedPriorityId) {
            return {
              ...priority,
              expenses: priority.expenses.map(expense => {
                if (expense.id === editingExpenseId) {
                  return {
                    ...expense,
                    name,
                    amount,
                    category,
                    savingsGoalId
                  };
                }
                return expense;
              })
            };
          }
          return priority;
        }));
      }

      // Handle savings goal updates
      if (oldExpense) {
        // If old expense had a savings goal, remove the old amount
        if (oldExpense.savingsGoalId && oldExpense.category === 'savings') {
          updateSavingsGoalFromBudget(oldExpense.savingsGoalId, oldExpense.amount, 'remove');
        }
        // If new expense has a savings goal, add the new amount
        if (category === 'savings' && savingsGoalId) {
          updateSavingsGoalFromBudget(savingsGoalId, amount, 'add');
        }
      }
    }
  };

  // Open modal for adding expense
  const openAddExpenseModal = (priorityId: number) => {
    setSelectedPriorityId(priorityId);
    setExpenseModalMode('add');
    setEditingExpenseId(null);
    setShowExpenseModal(true);
  };

  // Open modal for editing expense
  const openEditExpenseModal = (priorityId: number, expenseId: string) => {
    setSelectedPriorityId(priorityId);
    setExpenseModalMode('edit');
    setEditingExpenseId(expenseId);
    setShowExpenseModal(true);
  };

  // Handle modal save
  const handleExpenseModalSave = (name: string, amount: number, category?: ExpenseCategory, savingsGoalId?: string, newPriorityId?: number) => {
    if (expenseModalMode === 'add') {
      addExpense(name, amount, category, savingsGoalId);
    } else {
      updateExpense(name, amount, category, savingsGoalId, newPriorityId);
    }
    setShowExpenseModal(false);
  };

  // Toggle priority card expansion
  const togglePriority = (priorityId: number) => {
    setExpandedPriorities(prev => 
      prev.includes(priorityId) 
        ? prev.filter(id => id !== priorityId)
        : [...prev, priorityId]
    );
  };

  // Get affordable priority count
  const getAffordablePriorityCount = () => {
    const affordableCount = priorities.filter(p => p.isAffordable).length;
    const borderlineCount = priorities.filter(p => p.isBorderline).length;

    if (borderlineCount > 0) {
      return `1-${affordableCount + 1}`;
    }
    return affordableCount > 0 ? `1-${affordableCount}` : '0';
  };

  // Open expense sheet for a priority
  const openExpenseSheet = (priorityId: number) => {
    setSelectedPriorityId(priorityId);
    setShowExpenseSheet(true);
  };

  // Get selected priority
  const selectedPriority = selectedPriorityId ? priorities.find(p => p.id === selectedPriorityId) : null;

  // Get priority icon
  const getPriorityIcon = (priorityId: number) => {
    switch (priorityId) {
      case 1: return <HomeIcon className="h-5 w-5 text-blue-600" />;
      case 2: return <CarIcon className="h-5 w-5 text-orange-600" />;
      case 3: return <CoffeeIcon className="h-5 w-5 text-pink-600" />;
      case 4: return <PiggyBankIcon className="h-5 w-5 text-green-600" />;
      default: return <HomeIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getIconBackground = (priorityId: number) => {
    switch (priorityId) {
      case 1: return 'bg-blue-100';
      case 2: return 'bg-orange-100';
      case 3: return 'bg-pink-100';
      case 4: return 'bg-green-100';
      default: return 'bg-blue-100';
    }
  };

  // Calculate total expenses
  const totalExpenses = priorities.reduce((sum, priority) => {
    return sum + priority.expenses
      .filter(e => e.enabled)
      .reduce((expSum, exp) => expSum + exp.amount, 0);
  }, 0);

  // Calculate remaining budget
  const remainingBudget = income - totalExpenses;

  // Calculate remaining budget at each priority level (waterfall)
  const getRemainingBudgetAtPriority = (priorityId: number): number => {
    let remaining = income;
    for (let i = 0; i < priorities.length; i++) {
      if (priorities[i].id === priorityId) {
        // This is the priority we're calculating for - return what's left BEFORE spending here
        return remaining;
      }
      // Subtract this priority's active expenses from remaining budget
      const priorityTotal = priorities[i].expenses
        .filter(e => e.enabled)
        .reduce((sum, e) => sum + e.amount, 0);
      remaining -= priorityTotal;
    }
    return remaining;
  };

  // Get budget status for a priority (for visual indicators)
  const getPriorityBudgetStatus = (priorityId: number): 'healthy' | 'tight' | 'over' => {
    const priority = priorities.find(p => p.id === priorityId);
    if (!priority) return 'healthy';

    const remainingAtPriority = getRemainingBudgetAtPriority(priorityId);
    const priorityTotal = priority.expenses
      .filter(e => e.enabled)
      .reduce((sum, e) => sum + e.amount, 0);
    const afterThisPriority = remainingAtPriority - priorityTotal;

    if (afterThisPriority < 0) return 'over';
    if (afterThisPriority < remainingAtPriority * 0.2) return 'tight'; // Less than 20% left
    return 'healthy';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      <IncomeInput income={income} setIncome={setIncome} />

      {/* Budget Summary Card */}
      {income > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium">Monthly Income</p>
                <button
                  onClick={() => {
                    setTempIncome(income);
                    setShowEditIncomeModal(true);
                  }}
                  className="p-1 hover:bg-orange-400 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                  aria-label="Edit income"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xl font-bold">${income.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white text-sm font-medium">Allocated</p>
              <p className="text-xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="border-t border-orange-400 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-medium">What's left</p>
              <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-orange-200' : 'text-white'}`}>
                ${Math.abs(remainingBudget).toLocaleString()}
                {remainingBudget < 0 && ' over'}
              </p>
            </div>
            {remainingBudget >= 0 && (
              <p className="text-white text-xs mt-1 opacity-90">
                {remainingBudget === 0
                  ? 'Perfect! You\'ve allocated all your income.'
                  : 'Add more expenses or save this amount.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error State: Zero Income */}
      {income === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                Add your income to get started
              </h3>
              <p className="text-sm text-yellow-700">
                Enter your monthly income above to see what you can afford at each priority level.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State: Expenses Exceed Income */}
      {income > 0 && totalExpenses > income && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangleIcon className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 mb-1">
                Over Budget by ${(totalExpenses - income).toLocaleString()}
              </h3>
              <p className="text-sm text-orange-700">
                Consider disabling some expenses or increasing your income to balance your budget.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Priority Cards */}
      <div className="space-y-3">
        {priorities.map((priority) => {
          const isExpanded = expandedPriorities.includes(priority.id);
          const totalAmount = priority.expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0);
          const borderColor = priority.isAffordable ? 'border-green-500' : 'border-orange-500';

          return (
            <div key={priority.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${borderColor} overflow-hidden`}>
              {/* Card Header */}
              <button
                onClick={() => togglePriority(priority.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                aria-expanded={isExpanded}
                aria-controls={`priority-${priority.id}-content`}
              >
                <div className="flex items-center">
                  <div className={`${getIconBackground(priority.id)} rounded-full p-2 mr-3`}>
                    {getPriorityIcon(priority.id)}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">
                      {priority.id}. {priority.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center">
                      {priority.isAffordable && <CheckCircleIcon className="h-3 w-3 text-green-600 mr-1" />}
                      {!priority.isAffordable && <AlertTriangleIcon className="h-3 w-3 text-orange-600 mr-1" />}
                      {priority.isAffordable ? 'Affordable' : priority.isBorderline ? 'Close' : 'Needs adjustment'}
                      {priority.expenses.length > 0 && (
                        <span className="ml-2">• {priority.expenses.length} expense{priority.expenses.length !== 1 ? 's' : ''}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-3">
                    <p className="text-lg font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 font-medium">
                      {priority.expenses.filter(e => e.enabled).length} active
                    </p>
                  </div>
                  {isExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div
                  id={`priority-${priority.id}-content`}
                  className="border-t border-gray-200 p-4"
                >
                  {/* Budget Status Card - Show if there are expenses AND income > 0 */}
                  {priority.expenses.length > 0 && income > 0 && (
                    <div className={`mb-4 p-3 rounded-lg border-2 ${
                      getPriorityBudgetStatus(priority.id) === 'healthy'
                        ? 'bg-green-50 border-green-200'
                        : getPriorityBudgetStatus(priority.id) === 'tight'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="space-y-2">
                        {/* Remaining budget BEFORE this priority */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">Available at this level</span>
                          <span className="text-gray-900 font-bold">
                            ${getRemainingBudgetAtPriority(priority.id).toLocaleString()}
                          </span>
                        </div>

                        {/* Active expenses in this priority */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Allocated here</span>
                          <span className="text-gray-800 font-medium">
                            −${totalAmount.toLocaleString()}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-300 pt-2">
                          {(() => {
                            const availableAtLevel = getRemainingBudgetAtPriority(priority.id);
                            const remaining = availableAtLevel - totalAmount;
                            const isOver = remaining < 0;

                            return (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-semibold ${
                                  isOver ? 'text-orange-700' : 'text-green-700'
                                }`}>
                                  {isOver ? 'Over budget' : 'You can afford'}
                                </span>
                                <span className={`text-lg font-bold ${
                                  isOver ? 'text-orange-800' : 'text-green-800'
                                }`}>
                                  ${Math.abs(remaining).toLocaleString()} {isOver ? 'over' : 'more'}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {priority.expenses.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-6">
                      <PlusCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm italic mb-4">
                        Set what you want to afford at this priority level.
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddExpenseModal(priority.id);
                        }}
                        className="w-full py-2 px-4 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Set What You Can Afford
                      </button>
                    </div>
                  ) : (
                    /* Normal State with Expenses */
                    <>
                      <div className="space-y-2 mb-3">
                        {priority.expenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between py-2">
                            <span className={`text-sm ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                              {expense.name}
                            </span>
                            <span className={`text-sm font-medium ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                              ${expense.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openExpenseSheet(priority.id);
                        }}
                        className="w-full py-2 px-4 border border-orange-600 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Adjust What You Can Afford
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SpendingPlan priorityCount={getAffordablePriorityCount()} />

      {/* Privacy footer */}
      <div className="text-center py-6 text-xs text-gray-500 mt-8">
        Your data stays on your device. We don't store anything on servers.
        {' '}
        <a
          href="/privacy"
          className="text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
        >
          Learn more about privacy
        </a>
      </div>

      {/* Bottom sheet for full expense management */}
      {showExpenseSheet && selectedPriority && (
        <BottomSheet
          isOpen={showExpenseSheet}
          onClose={() => setShowExpenseSheet(false)}
          title={`${selectedPriority.name} Expenses`}
          height="large"
        >
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  selectedPriority.isAffordable
                    ? 'bg-green-100'
                    : 'bg-orange-100'
                }`}>
                  {getPriorityIcon(selectedPriority.id)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedPriority.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedPriority.isAffordable
                      ? 'Affordable'
                      : selectedPriority.isBorderline
                      ? 'Borderline'
                      : 'Not Affordable'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openAddExpenseModal(selectedPriority.id)}
                className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700"
                aria-label="Add expense"
              >
                <PlusCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Total expenses:</span>
                <span className="font-medium text-gray-900">
                  ${selectedPriority.expenses.reduce((sum, e) => sum + e.amount, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Active expenses:</span>
                <span className="font-medium text-gray-900">
                  ${selectedPriority.expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0)}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 mb-2">
                Your Expenses
              </h4>
              {selectedPriority.expenses.length === 0 ? (
                /* Empty State in Sheet */
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <PlusCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm mb-2 font-medium">
                    No expenses in this priority yet
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Tap the + button above to add your first expense
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3 md:hidden">
                    Swipe left on an expense to edit or delete it
                  </p>
                  <p className="text-sm text-gray-500 mb-3 hidden md:block">
                    Use the edit and delete buttons to manage expenses
                  </p>
                  <BudgetExpenseList
                    expenses={selectedPriority.expenses}
                    priorityId={selectedPriority.id}
                    toggleExpense={toggleExpense}
                    updateExpenseAmount={updateExpenseAmount}
                    deleteExpense={deleteExpense}
                    onEditExpense={openEditExpenseModal}
                  />
                </>
              )}
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Expense Modal */}
      {showExpenseModal && selectedPriority && (
        <ExpenseModal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          onSave={handleExpenseModalSave}
          mode={expenseModalMode}
          priorityName={selectedPriority.name}
          priorityId={selectedPriority.id}
          priorities={priorities.map(p => ({ id: p.id, name: p.name }))}
          initialData={
            expenseModalMode === 'edit' && editingExpenseId
              ? selectedPriority.expenses.find(e => e.id === editingExpenseId)
              : undefined
          }
        />
      )}

      {/* Edit Income Modal */}
      {showEditIncomeModal && (
        <BottomSheet
          isOpen={showEditIncomeModal}
          onClose={() => setShowEditIncomeModal(false)}
          title="Edit Monthly Income"
          height="small"
        >
          <div className="p-6">
            <IncomeInput
              income={tempIncome}
              setIncome={setTempIncome}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditIncomeModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIncome(tempIncome);
                  setShowEditIncomeModal(false);
                }}
                className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Toast notification with undo */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="info"
          action={{
            label: "Undo",
            onClick: undoDeleteExpense
          }}
          onClose={() => {
            setShowToast(false);
            setDeletedExpense(null);
          }}
          duration={5000}
        />
      )}
    </div>
  );
};