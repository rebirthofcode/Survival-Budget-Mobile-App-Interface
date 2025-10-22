import React, { useEffect, useState, useRef } from 'react';
import { XIcon, DollarSignIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../../constants';

type Priority = {
  id: number;
  name: string;
};

type ExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, amount: number, category?: ExpenseCategory, savingsGoalId?: string, newPriorityId?: number) => void;
  mode: 'add' | 'edit';
  priorityName: string;
  priorityId: number;
  priorities?: Priority[];
  initialData?: {
    name: string;
    amount: number;
    category?: ExpenseCategory;
    savingsGoalId?: string;
  };
};

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSave,
  mode,
  priorityName,
  priorityId,
  priorities = [],
  initialData
}: ExpenseModalProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<ExpenseCategory | undefined>(initialData?.category);
  const [savingsGoalId, setSavingsGoalId] = useState<string | undefined>(initialData?.savingsGoalId);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number>(priorityId);
  const [savingsGoals, setSavingsGoals] = useState<Array<{ id: string; name: string; targetAmount: number; currentAmount: number }>>([]);
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [touched, setTouched] = useState({ name: false, amount: false });

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Load savings goals from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('savingsData');
      if (savedData) {
        try {
          const savingsData = JSON.parse(savedData);
          setSavingsGoals(savingsData.goals || []);
        } catch (error) {
          console.error('Error loading savings goals:', error);
          setSavingsGoals([]);
        }
      }
    }
  }, [isOpen]);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setAmount(initialData?.amount.toString() || '');
      setCategory(initialData?.category);
      setSavingsGoalId(initialData?.savingsGoalId);
      setSelectedPriorityId(priorityId);
      setNameError('');
      setAmountError('');
      setTouched({ name: false, amount: false });
    }
  }, [isOpen, initialData, mode, priorityId]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus management and keyboard trap
  useEffect(() => {
    if (!isOpen) return;

    // Focus name input when opened
    const focusFirstElement = () => {
      nameInputRef.current?.focus();
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(focusFirstElement, 100);

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Trap focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Validation
  const validateName = (value: string): string => {
    if (!value.trim()) {
      return 'Expense name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (value.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }
    return '';
  };

  const validateAmount = (value: string): string => {
    if (!value) {
      return 'Amount is required';
    }
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return 'Amount must be a number';
    }
    if (numValue <= 0) {
      return 'Amount must be greater than 0';
    }
    if (numValue > 1000000) {
      return 'Amount must be less than $1,000,000';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow digits
    const sanitized = value.replace(/\D/g, '');
    setAmount(sanitized);
    if (touched.amount) {
      setAmountError(validateAmount(sanitized));
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    setNameError(validateName(name));
  };

  const handleAmountBlur = () => {
    setTouched(prev => ({ ...prev, amount: true }));
    setAmountError(validateAmount(amount));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, amount: true });

    // Validate all fields
    const nameValidationError = validateName(name);
    const amountValidationError = validateAmount(amount);

    setNameError(nameValidationError);
    setAmountError(amountValidationError);

    // If validation passes, save
    if (!nameValidationError && !amountValidationError) {
      // Pass the new priority ID only if it changed (for edit mode)
      const newPriorityId = mode === 'edit' && selectedPriorityId !== priorityId ? selectedPriorityId : undefined;
      onSave(name.trim(), parseInt(amount), category, category === 'savings' ? savingsGoalId : undefined, newPriorityId);
      handleClose();
    }
  };

  const isFormValid = () => {
    const baseValid = name.trim().length >= 2 &&
                      amount &&
                      !isNaN(parseInt(amount)) &&
                      parseInt(amount) > 0;

    // If category is savings, require a savings goal to be selected
    if (category === 'savings') {
      return baseValid && !!savingsGoalId;
    }

    return baseValid;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center sm:justify-center">
      <div
        ref={modalRef}
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 id="expense-modal-title" className="text-lg font-bold text-gray-900">
              {mode === 'add' ? 'Add Expense' : 'Edit Expense'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {priorityName} Priority
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full p-1"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Expense Name */}
            <div>
              <label htmlFor="expense-name" className="block text-sm font-medium text-gray-700 mb-2">
                Expense Name
                <span className="text-orange-500 ml-1">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="expense-name"
                name="expense-name"
                className={`block w-full px-4 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  nameError && touched.name
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="e.g., Rent, Groceries, Netflix"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                aria-invalid={!!nameError && touched.name}
                aria-describedby={nameError && touched.name ? 'name-error' : undefined}
                autoComplete="off"
                maxLength={50}
              />
              {nameError && touched.name ? (
                <div id="name-error" className="mt-2 flex items-start text-sm text-orange-600">
                  <AlertCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>{nameError}</span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  {name.length}/50 characters
                </p>
              )}
            </div>

            {/* Priority Selection - Only shown in edit mode */}
            {mode === 'edit' && priorities.length > 0 && (
              <div>
                <label htmlFor="expense-priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Move to Priority
                </label>
                <select
                  id="expense-priority"
                  value={selectedPriorityId}
                  onChange={(e) => setSelectedPriorityId(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
                {selectedPriorityId !== priorityId && (
                  <div className="mt-2 flex items-start text-sm text-orange-600">
                    <AlertCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                    <span>This expense will be moved to {priorities.find(p => p.id === selectedPriorityId)?.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Amount */}
            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Amount
                <span className="text-orange-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSignIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="expense-amount"
                  name="expense-amount"
                  className={`block w-full pl-12 pr-4 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    amountError && touched.amount
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="0"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onBlur={handleAmountBlur}
                  inputMode="numeric"
                  aria-invalid={!!amountError && touched.amount}
                  aria-describedby={amountError && touched.amount ? 'amount-error' : undefined}
                  autoComplete="off"
                />
                {amount && !amountError && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                )}
              </div>
              {amountError && touched.amount ? (
                <div id="amount-error" className="mt-2 flex items-start text-sm text-orange-600">
                  <AlertCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>{amountError}</span>
                </div>
              ) : amount && parseInt(amount) > 0 ? (
                <div className="mt-2 flex items-start text-sm text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>${parseInt(amount).toLocaleString()} per month</span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Enter the monthly cost for this expense
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      const newCategory = category === cat.id ? undefined : cat.id;
                      setCategory(newCategory);
                      // Clear savings goal if category is no longer savings
                      if (newCategory !== 'savings') {
                        setSavingsGoalId(undefined);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all min-h-[72px] ${
                      category === cat.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-xs text-gray-700 text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Select a category to organize your expenses
              </p>
            </div>

            {/* Savings Goal Selection - Only shown when category is 'savings' */}
            {category === 'savings' && (
              <div>
                <label htmlFor="savings-goal" className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Savings Goal
                  <span className="text-orange-500 ml-1">*</span>
                </label>
                {savingsGoals.length === 0 ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <p className="text-sm text-yellow-700">
                      No savings goals found. Create a savings goal in the Savings Tracker tab first.
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      id="savings-goal"
                      value={savingsGoalId || ''}
                      onChange={(e) => setSavingsGoalId(e.target.value || undefined)}
                      className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select a savings goal...</option>
                      {savingsGoals.map((goal) => (
                        <option key={goal.id} value={goal.id}>
                          {goal.name} (${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      This budget allocation will automatically contribute to the selected savings goal
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Helper text */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {mode === 'add'
                      ? 'This expense will be added to your budget and affect your affordability calculations.'
                      : 'Changes to this expense will update your budget immediately.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 min-h-[44px] border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`flex-1 py-3 px-4 min-h-[44px] rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
                isFormValid()
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {mode === 'add' ? 'Add Expense' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
