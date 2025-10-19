import { useState, useEffect } from 'react';
import { PiggyBankIcon, PlusIcon, EditIcon, TrashIcon, TargetIcon, TrendingUpIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category: 'emergency' | 'custom';
};

type SavingsData = {
  emergencyFundMonths: number; // 3-6 months
  goals: SavingsGoal[];
};

type SavingsTrackerProps = {
  monthlyExpenses: number;
};

export const SavingsTracker = ({ monthlyExpenses }: SavingsTrackerProps) => {
  const [savingsData, setSavingsData] = useState<SavingsData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS_DATA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading savings data:', error);
      }
    }
    return {
      emergencyFundMonths: 3,
      goals: []
    };
  });

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_DATA, JSON.stringify(savingsData));
  }, [savingsData]);

  // Calculate emergency fund target
  const emergencyFundTarget = monthlyExpenses * savingsData.emergencyFundMonths;
  const emergencyFundGoal = savingsData.goals.find(g => g.category === 'emergency');
  const emergencyFundProgress = emergencyFundGoal
    ? (emergencyFundGoal.currentAmount / emergencyFundTarget) * 100
    : 0;

  // Total savings across all goals
  const totalSavings = savingsData.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleSetEmergencyFundMonths = (months: number) => {
    setSavingsData(prev => ({
      ...prev,
      emergencyFundMonths: months
    }));

    // Update emergency fund goal target if it exists
    setSavingsData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.category === 'emergency'
          ? { ...goal, targetAmount: monthlyExpenses * months }
          : goal
      )
    }));
  };

  const handleCreateEmergencyFund = () => {
    const newGoal: SavingsGoal = {
      id: `emergency-${Date.now()}`,
      name: 'Emergency Fund',
      targetAmount: emergencyFundTarget,
      currentAmount: 0,
      category: 'emergency'
    };

    setSavingsData(prev => ({
      ...prev,
      goals: [newGoal, ...prev.goals]
    }));
  };

  const handleAddGoal = () => {
    if (!goalName.trim() || !goalAmount) return;

    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      targetAmount: parseInt(goalAmount),
      currentAmount: 0,
      targetDate: goalDate || undefined,
      category: 'custom'
    };

    setSavingsData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));

    // Reset form
    setGoalName('');
    setGoalAmount('');
    setGoalDate('');
    setShowAddGoal(false);
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !goalName.trim() || !goalAmount) return;

    setSavingsData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === editingGoal.id
          ? {
              ...goal,
              name: goalName.trim(),
              targetAmount: parseInt(goalAmount),
              targetDate: goalDate || undefined
            }
          : goal
      )
    }));

    // Reset form
    setGoalName('');
    setGoalAmount('');
    setGoalDate('');
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setSavingsData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const handleUpdateCurrentAmount = (goalId: string, newAmount: number) => {
    setSavingsData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: Math.max(0, newAmount) }
          : goal
      )
    }));
  };

  const startEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalAmount(goal.targetAmount.toString());
    setGoalDate(goal.targetDate || '');
    setShowAddGoal(true);
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setGoalName('');
    setGoalAmount('');
    setGoalDate('');
    setShowAddGoal(false);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <PiggyBankIcon className="h-6 w-6 mr-2" />
          My Savings
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Build your safety net and save for what matters
        </p>
      </div>

      {/* Total Savings Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-6 shadow-lg">
        <p className="text-green-100 text-sm mb-1">Total Saved</p>
        <p className="text-4xl font-bold mb-2">${totalSavings.toLocaleString()}</p>
        <div className="flex items-center text-green-100 text-sm">
          <TrendingUpIcon className="h-4 w-4 mr-1" />
          {savingsData.goals.length === 0 ? 'Get started below' : `${savingsData.goals.length} ${savingsData.goals.length === 1 ? 'target' : 'targets'}`}
        </div>
      </div>

      {/* Emergency Fund Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <AlertCircleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Emergency Fund</h3>
              <p className="text-xs text-gray-600">Your safety net</p>
            </div>
          </div>
        </div>

        {/* Emergency Fund Configuration */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target: Cover expenses for how many months?
          </label>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map(months => (
              <button
                key={months}
                onClick={() => handleSetEmergencyFundMonths(months)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                  savingsData.emergencyFundMonths === months
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {months}mo
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Target Amount: <span className="font-bold text-gray-900">${emergencyFundTarget.toLocaleString()}</span>
            {monthlyExpenses > 0 && (
              <span className="text-gray-500"> (${monthlyExpenses.toLocaleString()} × {savingsData.emergencyFundMonths} months)</span>
            )}
          </p>
        </div>

        {!emergencyFundGoal ? (
          <button
            onClick={handleCreateEmergencyFund}
            disabled={monthlyExpenses === 0}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {monthlyExpenses === 0 ? 'Add Expenses to Calculate' : 'Start Emergency Fund'}
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-gray-900">{Math.min(100, emergencyFundProgress).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${getProgressColor(emergencyFundProgress)} ${emergencyFundProgress >= 100 ? 'animate-pulse' : ''}`}
                  style={{ width: `${Math.min(100, emergencyFundProgress)}%` }}
                />
              </div>
              {emergencyFundProgress >= 100 && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-sm text-green-700 font-medium flex items-center">
                    <span className="mr-2">🛡️</span>
                    Safety net complete! You're protected.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={emergencyFundGoal.currentAmount}
                  onChange={(e) => handleUpdateCurrentAmount(emergencyFundGoal.id, parseInt(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right font-medium"
                  min="0"
                />
                <span className="text-sm text-gray-600">/ ${emergencyFundGoal.targetAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saving For Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Saving For</h3>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddGoal && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">
              {editingGoal ? 'Edit' : 'What are you saving for?'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Vacation, New Car, Down Payment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  disabled={!goalName.trim() || !goalAmount}
                  className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingGoal ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {savingsData.goals.filter(g => g.category === 'custom').length === 0 && !showAddGoal && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <TargetIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">What are you saving for?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Vacation, new car, down payment, or something else?
            </p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Your First One
            </button>
          </div>
        )}

        <div className="space-y-3">
          {savingsData.goals
            .filter(goal => goal.category === 'custom')
            .map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const isComplete = progress >= 100;

              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{goal.name}</h4>
                        {isComplete && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                        )}
                      </div>
                      {goal.targetDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditGoal(goal)}
                        className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold text-gray-900">{Math.min(100, progress).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${getProgressColor(progress)} ${isComplete ? 'animate-pulse' : ''}`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                      {isComplete && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
                          <p className="text-sm text-green-700 font-medium flex items-center">
                            <span className="mr-2">🎉</span>
                            Goal reached! Congratulations!
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) => handleUpdateCurrentAmount(goal.id, parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right font-medium"
                          min="0"
                        />
                        <span className="text-sm text-gray-600">/ ${goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
