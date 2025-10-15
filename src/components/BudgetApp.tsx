import { useEffect, useState } from 'react';
import { IncomeInput } from './IncomeInput';
import { SpendingPlan } from './SpendingPlan';
import { HomeIcon, CarIcon, CoffeeIcon, PiggyBankIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { BottomSheet } from './Mobile/BottomSheet';
import { BudgetExpenseList } from './Mobile/BudgetExpenseList';

// Define expense item type
type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
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
};

// Default priorities data (used as fallback)
const defaultPriorities: Priority[] = [
  {
    id: 1,
    name: 'Survival',
    expenses: [
      {
        id: 's1',
        name: 'Rent/Mortgage',
        amount: 800,
        enabled: true
      },
      {
        id: 's2',
        name: 'Groceries',
        amount: 300,
        enabled: true
      },
      {
        id: 's3',
        name: 'Utilities',
        amount: 150,
        enabled: true
      },
      {
        id: 's4',
        name: 'Healthcare',
        amount: 100,
        enabled: true
      }
    ],
    isAffordable: true,
    isBorderline: false
  },
  {
    id: 2,
    name: 'Important',
    expenses: [
      {
        id: 'i1',
        name: 'Transportation',
        amount: 200,
        enabled: true
      },
      {
        id: 'i2',
        name: 'Phone',
        amount: 70,
        enabled: true
      },
      {
        id: 'i3',
        name: 'Internet',
        amount: 60,
        enabled: true
      },
      {
        id: 'i4',
        name: 'Insurance',
        amount: 150,
        enabled: true
      }
    ],
    isAffordable: true,
    isBorderline: false
  },
  {
    id: 3,
    name: 'Quality of Life',
    expenses: [
      {
        id: 'q1',
        name: 'Dining Out',
        amount: 200,
        enabled: true
      },
      {
        id: 'q2',
        name: 'Entertainment',
        amount: 100,
        enabled: true
      },
      {
        id: 'q3',
        name: 'Subscriptions',
        amount: 50,
        enabled: true
      },
      {
        id: 'q4',
        name: 'Clothing',
        amount: 100,
        enabled: true
      }
    ],
    isAffordable: false,
    isBorderline: true
  },
  {
    id: 4,
    name: 'Future Building',
    expenses: [
      {
        id: 'f1',
        name: 'Savings',
        amount: 200,
        enabled: true
      },
      {
        id: 'f2',
        name: 'Investments',
        amount: 200,
        enabled: true
      },
      {
        id: 'f3',
        name: 'Debt Payoff',
        amount: 150,
        enabled: true
      },
      {
        id: 'f4',
        name: 'Education',
        amount: 100,
        enabled: true
      }
    ],
    isAffordable: false,
    isBorderline: false
  }
];

export const BudgetApp = ({
  initialIncome
}: BudgetAppProps) => {
  const [income, setIncome] = useState<number>(initialIncome);
  const [priorities, setPriorities] = useState<Priority[]>(defaultPriorities);
  const [expandedPriorities, setExpandedPriorities] = useState<number[]>([]);
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // Load saved priorities from localStorage on component mount
  useEffect(() => {
    const savedPriorities = localStorage.getItem('budgetPriorities');
    if (savedPriorities) {
      try {
        const parsedPriorities = JSON.parse(savedPriorities);
        setPriorities(parsedPriorities);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading saved priorities:', error);
        }
      }
    }
  }, []);

  // Save priorities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgetPriorities', JSON.stringify(priorities));
  }, [priorities]);

  // Load saved income from localStorage
  useEffect(() => {
    const savedIncome = localStorage.getItem('budgetIncome');
    if (savedIncome) {
      try {
        const parsedIncome = parseInt(savedIncome);
        if (!isNaN(parsedIncome)) {
          setIncome(parsedIncome);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading saved income:', error);
        }
      }
    }
  }, []);

  // Save income to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetIncome', income.toString());
  }, [income]);

  // Calculate affordability based on income and expenses
  useEffect(() => {
    let remainingIncome = income;
    const updatedPriorities = [...priorities];
    
    updatedPriorities.forEach((priority, index) => {
      const priorityTotal = priority.expenses
        .filter(expense => expense.enabled)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      if (remainingIncome >= priorityTotal) {
        priority.isAffordable = true;
        priority.isBorderline = false;
        remainingIncome -= priorityTotal;
      } else if (remainingIncome > 0 && remainingIncome >= priorityTotal * 0.5) {
        priority.isAffordable = false;
        priority.isBorderline = true;
        remainingIncome = 0;
      } else {
        priority.isAffordable = false;
        priority.isBorderline = false;
      }
    });
    
    setPriorities(updatedPriorities);
  }, [income, priorities.map(p => p.expenses.map(e => e.enabled ? e.amount : 0).join('')).join('')]);

  // Toggle expense enabled state
  const toggleExpense = (priorityId: number, expenseId: string) => {
    setPriorities(priorities.map(priority => {
      if (priority.id === priorityId) {
        return {
          ...priority,
          expenses: priority.expenses.map(expense => {
            if (expense.id === expenseId) {
              return {
                ...expense,
                enabled: !expense.enabled
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

  // Delete expense
  const deleteExpense = (priorityId: number, expenseId: string) => {
    setPriorities(priorities.map(priority => {
      if (priority.id === priorityId) {
        return {
          ...priority,
          expenses: priority.expenses.filter(expense => expense.id !== expenseId)
        };
      }
      return priority;
    }));
  };

  // Add new expense
  const addExpense = () => {
    if (selectedPriorityId && newExpenseName.trim() && newExpenseAmount) {
      const amount = parseInt(newExpenseAmount);
      if (isNaN(amount)) return;

      setPriorities(priorities.map(priority => {
        if (priority.id === selectedPriorityId) {
          return {
            ...priority,
            expenses: [
              ...priority.expenses,
              {
                id: `${priority.id}-${Date.now()}`,
                name: newExpenseName.trim(),
                amount,
                enabled: true
              }
            ]
          };
        }
        return priority;
      }));

      setNewExpenseName('');
      setNewExpenseAmount('');
      setIsAddingExpense(false);
    }
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

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      <IncomeInput income={income} setIncome={setIncome} />

      {/* Priority Cards */}
      <div className="space-y-3">
        {priorities.map((priority) => {
          const isExpanded = expandedPriorities.includes(priority.id);
          const totalAmount = priority.expenses.filter(e => e.enabled).reduce((sum, e) => sum + e.amount, 0);
          const borderColor = priority.isAffordable ? 'border-green-500' : priority.isBorderline ? 'border-orange-500' : 'border-red-500';

          return (
            <div key={priority.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${borderColor} overflow-hidden`}>
              {/* Card Header */}
              <button
                onClick={() => togglePriority(priority.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                      {priority.isBorderline && <AlertTriangleIcon className="h-3 w-3 text-orange-600 mr-1" />}
                      {!priority.isAffordable && !priority.isBorderline && <XCircleIcon className="h-3 w-3 text-red-600 mr-1" />}
                      {priority.isAffordable ? 'Affordable' : priority.isBorderline ? 'Borderline' : 'Not Affordable'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-3">
                    <p className="font-medium text-gray-900">${totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                  {isExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-2 mb-3">
                    {priority.expenses.slice(0, 3).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between py-2">
                        <span className={`text-sm ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {expense.name}
                        </span>
                        <span className={`text-sm font-medium ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          ${expense.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {priority.expenses.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{priority.expenses.length - 3} more expenses
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openExpenseSheet(priority.id);
                    }}
                    className="w-full py-2 px-4 border border-orange-600 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-50"
                  >
                    Manage Expenses
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SpendingPlan priorityCount={getAffordablePriorityCount()} />

      {/* Bottom sheet for full expense management */}
      {showExpenseSheet && selectedPriority && (
        <BottomSheet
          isOpen={showExpenseSheet}
          onClose={() => {
            setShowExpenseSheet(false);
            setIsAddingExpense(false);
          }}
          title={`${selectedPriority.name} Expenses`}
          height="large"
        >
          {isAddingExpense ? (
            <div className="py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Expense
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Name
                  </label>
                  <input
                    type="text"
                    id="expenseName"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Gym Membership"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="text"
                      id="expenseAmount"
                      className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value.replace(/\D/g, ''))}
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-3">
                  <button
                    onClick={() => setIsAddingExpense(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700"
                    disabled={!newExpenseName.trim() || !newExpenseAmount}
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      selectedPriority.isAffordable
                        ? 'bg-green-100'
                        : selectedPriority.isBorderline
                        ? 'bg-orange-100'
                        : 'bg-red-100'
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
                    onClick={() => setIsAddingExpense(true)}
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
                  <p className="text-sm text-gray-500 mb-3">
                    Swipe left on an expense to edit or delete it
                  </p>
                  <BudgetExpenseList
                    expenses={selectedPriority.expenses}
                    priorityId={selectedPriority.id}
                    toggleExpense={toggleExpense}
                    updateExpenseAmount={updateExpenseAmount}
                    deleteExpense={deleteExpense}
                  />
                </div>
              </div>
            </>
          )}
        </BottomSheet>
      )}
    </div>
  );
};