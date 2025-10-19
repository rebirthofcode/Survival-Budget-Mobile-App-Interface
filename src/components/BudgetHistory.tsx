import { useState, useEffect } from 'react';
import { CalendarIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, ChevronRightIcon, ShoppingBagIcon, PiggyBankIcon } from 'lucide-react';
import { loadBudgetHistory, compareSnapshots, formatMonthKey, type BudgetSnapshot } from '../utils/budgetHistory';

export const BudgetHistory = () => {
  const [history, setHistory] = useState<BudgetSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<BudgetSnapshot | null>(null);

  // Load history on mount
  useEffect(() => {
    const loadedHistory = loadBudgetHistory();
    setHistory(loadedHistory);
  }, []);

  // Reload history when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const loadedHistory = loadBudgetHistory();
        setHistory(loadedHistory);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Get comparison with previous month
  const getComparison = (snapshot: BudgetSnapshot) => {
    const currentIndex = history.findIndex(s => s.id === snapshot.id);
    const previousSnapshot = currentIndex < history.length - 1 ? history[currentIndex + 1] : undefined;
    return compareSnapshots(snapshot, previousSnapshot);
  };

  // Format change percentage
  const formatChange = (value: number, percent: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}$${Math.abs(value).toLocaleString()} (${sign}${percent.toFixed(1)}%)`;
  };

  // Get trend icon
  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUpIcon className="h-4 w-4" />;
    if (value < 0) return <TrendingDownIcon className="h-4 w-4" />;
    return <MinusIcon className="h-4 w-4" />;
  };

  // Get trend color
  const getTrendColor = (value: number, inverse = false) => {
    if (value === 0) return 'text-gray-500';
    const isPositive = inverse ? value < 0 : value > 0;
    return isPositive ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2" />
          Budget History
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Track your spending trends over time
        </p>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-600 text-sm">
            Your budget history will appear here as you use the app. Start by setting up your income and expenses!
          </p>
        </div>
      )}

      {/* Detail View */}
      {selectedSnapshot && (
        <div className="mb-6">
          <button
            onClick={() => setSelectedSnapshot(null)}
            className="text-orange-600 hover:text-orange-700 font-medium mb-4 flex items-center"
          >
            ← Back to Timeline
          </button>

          {/* Month Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white mb-4">
            <h2 className="text-2xl font-bold mb-2">
              {formatMonthKey(selectedSnapshot.date)}
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Monthly Income</p>
                <p className="text-3xl font-bold">${selectedSnapshot.income.toLocaleString()}</p>
              </div>
              <div className={`text-right px-4 py-2 rounded-lg ${
                selectedSnapshot.survivalCovered ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                <p className="text-xs opacity-90">Survival Priority</p>
                <p className="font-bold">{selectedSnapshot.survivalCovered ? 'Covered' : 'At Risk'}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center mb-2">
                <ShoppingBagIcon className="h-5 w-5 text-orange-500 mr-2" />
                <p className="text-xs text-gray-600">Total Spending</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${selectedSnapshot.totalSpending.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center mb-2">
                <PiggyBankIcon className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-xs text-gray-600">Money Left</p>
              </div>
              <p className={`text-2xl font-bold ${
                selectedSnapshot.moneyLeft >= 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                ${Math.abs(selectedSnapshot.moneyLeft).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Month-over-Month Comparison */}
          {(() => {
            const comparison = getComparison(selectedSnapshot);
            const hasPrevious = history.findIndex(s => s.id === selectedSnapshot.id) < history.length - 1;

            if (!hasPrevious) {
              return (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                  <p className="text-sm text-blue-700">
                    This is your first recorded month. Future months will show comparisons here.
                  </p>
                </div>
              );
            }

            return (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">vs. Previous Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Income Change</span>
                    <div className={`flex items-center ${getTrendColor(comparison.incomeChange)}`}>
                      {getTrendIcon(comparison.incomeChange)}
                      <span className="text-sm font-medium ml-1">
                        {formatChange(comparison.incomeChange, comparison.incomeChangePercent)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Spending Change</span>
                    <div className={`flex items-center ${getTrendColor(comparison.spendingChange, true)}`}>
                      {getTrendIcon(comparison.spendingChange)}
                      <span className="text-sm font-medium ml-1">
                        {formatChange(comparison.spendingChange, comparison.spendingChangePercent)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Money Left Change</span>
                    <div className={`flex items-center ${getTrendColor(comparison.moneyLeftChange)}`}>
                      {getTrendIcon(comparison.moneyLeftChange)}
                      <span className="text-sm font-medium ml-1">
                        {formatChange(comparison.moneyLeftChange, comparison.moneyLeftChangePercent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Priority Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Priority Breakdown</h3>
            <div className="space-y-3">
              {selectedSnapshot.priorities.map(priority => (
                <div key={priority.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{priority.name}</p>
                    <p className="text-xs text-gray-500">
                      {priority.activeExpenses} of {priority.expenseCount} expenses active
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${priority.totalExpenses.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      priority.isAffordable ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {priority.isAffordable ? 'Affordable' :
                       priority.isBorderline ? 'Close' : 'Needs adjustment'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {!selectedSnapshot && history.length > 0 && (
        <div className="space-y-3">
          {history.map((snapshot, index) => {
            const comparison = getComparison(snapshot);
            const isCurrentMonth = index === 0;

            return (
              <button
                key={snapshot.id}
                onClick={() => setSelectedSnapshot(snapshot)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {formatMonthKey(snapshot.date)}
                      {isCurrentMonth && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Income: ${snapshot.income.toLocaleString()}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Spending</p>
                    <p className="font-bold text-gray-900">
                      ${snapshot.totalSpending.toLocaleString()}
                    </p>
                    {index < history.length - 1 && comparison.spendingChange !== 0 && (
                      <div className={`flex items-center text-xs mt-1 ${getTrendColor(comparison.spendingChange, true)}`}>
                        {getTrendIcon(comparison.spendingChange)}
                        <span className="ml-1">
                          {comparison.spendingChangePercent.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Money Left</p>
                    <p className={`font-bold ${
                      snapshot.moneyLeft >= 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      ${Math.abs(snapshot.moneyLeft).toLocaleString()}
                    </p>
                    {index < history.length - 1 && comparison.moneyLeftChange !== 0 && (
                      <div className={`flex items-center text-xs mt-1 ${getTrendColor(comparison.moneyLeftChange)}`}>
                        {getTrendIcon(comparison.moneyLeftChange)}
                        <span className="ml-1">
                          {Math.abs(comparison.moneyLeftChangePercent).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Survival Priority</span>
                    <span className={`font-medium ${
                      snapshot.survivalCovered ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {snapshot.survivalCovered ? 'Covered ✓' : 'At Risk'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
