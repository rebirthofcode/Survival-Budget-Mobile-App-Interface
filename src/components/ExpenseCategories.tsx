import { useState, useMemo } from 'react';
import { EXPENSE_CATEGORIES } from '../constants';
import { ChevronRightIcon, FilterIcon, XIcon } from 'lucide-react';

type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
  category?: string;
  priorityName: string;
  priorityId: number;
};

type ExpenseCategoriesProps = {
  priorities: any[];
};

export const ExpenseCategories = ({ priorities }: ExpenseCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Flatten all expenses from all priorities with priority info
  const allExpenses: ExpenseItem[] = useMemo(() => {
    return priorities.flatMap(priority =>
      priority.expenses.map((expense: any) => ({
        ...expense,
        priorityName: priority.name,
        priorityId: priority.id
      }))
    );
  }, [priorities]);

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const grouped = new Map<string, ExpenseItem[]>();

    // Initialize with all categories
    EXPENSE_CATEGORIES.forEach(cat => {
      grouped.set(cat.id, []);
    });

    // Add 'uncategorized' group
    grouped.set('uncategorized', []);

    // Group expenses
    allExpenses.forEach(expense => {
      const categoryId = expense.category || 'uncategorized';
      const existing = grouped.get(categoryId) || [];
      grouped.set(categoryId, [...existing, expense]);
    });

    return grouped;
  }, [allExpenses]);

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    if (categoryId === 'uncategorized') {
      return { id: 'uncategorized', name: 'Uncategorized', icon: '❓', color: 'gray' };
    }
    return EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
  };

  // Get color classes for category
  const getCategoryColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
      red: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
      fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
      violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
      slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
    };
    return colorMap[color] || colorMap.gray;
  };

  // Get priority icon background
  const getPriorityBadgeColor = (priorityId: number) => {
    switch (priorityId) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-orange-100 text-orange-700';
      case 3: return 'bg-pink-100 text-pink-700';
      case 4: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter categories that have expenses
  const categoriesWithExpenses = Array.from(expensesByCategory.entries())
    .filter(([_, expenses]) => expenses.length > 0)
    .sort((a, b) => {
      // Sort by total amount descending
      const totalA = a[1].reduce((sum, e) => sum + (e.enabled ? e.amount : 0), 0);
      const totalB = b[1].reduce((sum, e) => sum + (e.enabled ? e.amount : 0), 0);
      return totalB - totalA;
    });

  // Get filtered expenses if category is selected
  const filteredExpenses = selectedCategory
    ? expensesByCategory.get(selectedCategory) || []
    : [];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FilterIcon className="h-6 w-6 mr-2" />
          Expense Categories
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          View your expenses organized by category
        </p>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{allExpenses.length}</p>
            <p className="text-xs text-gray-600 mt-1">Total Expenses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{categoriesWithExpenses.length}</p>
            <p className="text-xs text-gray-600 mt-1">Categories Used</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${allExpenses.reduce((sum, e) => sum + (e.enabled ? e.amount : 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {categoriesWithExpenses.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FilterIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Expenses Yet</h3>
          <p className="text-gray-600 text-sm">
            Start adding expenses to your budget priorities to see them organized by category here.
          </p>
        </div>
      )}

      {/* Category Cards */}
      {!selectedCategory && categoriesWithExpenses.length > 0 && (
        <div className="space-y-3">
          {categoriesWithExpenses.map(([categoryId, expenses]) => {
            const categoryInfo = getCategoryInfo(categoryId);
            if (!categoryInfo) return null;

            const colors = getCategoryColorClasses(categoryInfo.color);
            const activeExpenses = expenses.filter(e => e.enabled);
            const totalAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

            return (
              <button
                key={categoryId}
                onClick={() => setSelectedCategory(categoryId)}
                className={`w-full ${colors.bg} border ${colors.border} rounded-lg p-4 text-left hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-3xl mr-3">{categoryInfo.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${colors.text}`}>
                        {categoryInfo.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                        {' • '}
                        {activeExpenses.length} active
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <p className={`font-bold ${colors.text} text-lg`}>
                        ${totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">per month</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Category Detail View */}
      {selectedCategory && (
        <div className="space-y-4">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <XIcon className="h-5 w-5 mr-1" />
            Back to Categories
          </button>

          {/* Category Header */}
          {(() => {
            const categoryInfo = getCategoryInfo(selectedCategory);
            if (!categoryInfo) return null;

            const colors = getCategoryColorClasses(categoryInfo.color);
            const activeExpenses = filteredExpenses.filter(e => e.enabled);
            const totalAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

            return (
              <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-3">{categoryInfo.icon}</span>
                  <div>
                    <h2 className={`text-xl font-bold ${colors.text}`}>
                      {categoryInfo.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Monthly Cost:</span>
                    <span className={`text-xl font-bold ${colors.text}`}>
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Expense List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-medium ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {expense.name}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(expense.priorityId)}`}>
                        {expense.priorityName}
                      </span>
                      {!expense.enabled && (
                        <span className="text-xs text-gray-500 ml-2">(Disabled)</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${expense.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      ${expense.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
