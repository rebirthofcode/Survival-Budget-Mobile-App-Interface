import React, { useState } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, XOctagonIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, ToggleLeftIcon, SaveIcon, XIcon, HomeIcon, CarIcon, CoffeeIcon, PiggyBankIcon, ArrowRightIcon } from 'lucide-react';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseItemEdit } from './ExpenseItemEdit';
type Expense = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
};
type PriorityProps = {
  priority: {
    id: number;
    name: string;
    expenses: Expense[];
    isAffordable: boolean;
    isBorderline: boolean;
  };
  toggleExpense: (priorityId: number, expenseId: string) => void;
  updateExpenseAmount: (priorityId: number, expenseId: string, amount: number) => void;
  onViewDetails?: () => void;
};
export const PriorityCard = ({
  priority,
  toggleExpense,
  updateExpenseAmount,
  onViewDetails
}: PriorityProps) => {
  // Set Priority 1 to be expanded by default to demonstrate the interaction
  const [isExpanded, setIsExpanded] = useState(priority.id === 1);
  const [isEditMode, setIsEditMode] = useState(priority.id === 1);
  const [editedExpenses, setEditedExpenses] = useState<Expense[]>([...priority.expenses]);
  const totalAmount = priority.expenses.filter(expense => expense.enabled).reduce((sum, expense) => sum + expense.amount, 0);
  const editedTotalAmount = editedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const handleEditAmount = (expenseId: string, amount: number) => {
    setEditedExpenses(editedExpenses.map(expense => {
      if (expense.id === expenseId) {
        return {
          ...expense,
          amount: amount
        };
      }
      return expense;
    }));
  };
  const handleSaveChanges = () => {
    // Update all expense amounts
    editedExpenses.forEach(expense => {
      updateExpenseAmount(priority.id, expense.id, expense.amount);
    });
    setIsEditMode(false);
  };
  const handleCancelEdit = () => {
    // Reset edited expenses to original values
    setEditedExpenses([...priority.expenses]);
    setIsEditMode(false);
  };
  const getStatusIcon = () => {
    if (priority.isAffordable) {
      return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
    } else if (priority.isBorderline) {
      return <AlertTriangleIcon className="h-8 w-8 text-orange-500" />;
    } else {
      return <XOctagonIcon className="h-8 w-8 text-red-500" />;
    }
  };
  const getStatusColor = () => {
    if (priority.isAffordable) {
      return 'border-green-500 bg-green-50';
    } else if (priority.isBorderline) {
      return 'border-orange-500 bg-orange-50';
    } else {
      return 'border-red-500 bg-red-50';
    }
  };
  const getStatusText = () => {
    if (priority.isAffordable) {
      return 'Affordable';
    } else if (priority.isBorderline) {
      return 'Borderline';
    } else {
      return 'Not Affordable';
    }
  };
  const getPriorityIcon = () => {
    switch (priority.id) {
      case 1:
        return <HomeIcon className="h-5 w-5 text-blue-600" />;
      case 2:
        return <CarIcon className="h-5 w-5 text-orange-600" />;
      case 3:
        return <CoffeeIcon className="h-5 w-5 text-pink-600" />;
      case 4:
        return <PiggyBankIcon className="h-5 w-5 text-green-600" />;
      default:
        return <HomeIcon className="h-5 w-5 text-blue-600" />;
    }
  };
  const getIconBackground = () => {
    switch (priority.id) {
      case 1:
        return 'bg-blue-100';
      case 2:
        return 'bg-orange-100';
      case 3:
        return 'bg-pink-100';
      case 4:
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };
  return <div className={`border-l-4 rounded-lg shadow-md bg-white overflow-hidden transition-all duration-300 ${getStatusColor()}`}>
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <div className="mr-3 flex items-center">
            <div className={`${getIconBackground()} rounded-full p-1 mr-2`}>
              {getPriorityIcon()}
            </div>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {priority.id}. {priority.name}
            </h3>
            <p className="text-sm text-gray-500">{getStatusText()}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-3">
            <p className="text-lg font-medium text-gray-900">
              ${isEditMode ? editedTotalAmount : totalAmount}
            </p>
            <p className="text-xs text-gray-500">total</p>
          </div>
          {isExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
        </div>
      </div>
      {isExpanded && <div className="border-t border-gray-200 px-4 py-3">
          {/* Mode Toggle Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" onClick={e => {
            e.stopPropagation();
            setIsEditMode(true);
            setEditedExpenses([...priority.expenses]);
          }} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${isEditMode ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                <PencilIcon className="h-4 w-4 inline mr-1" />
                Edit Amounts
              </button>
              <button type="button" onClick={e => {
            e.stopPropagation();
            setIsEditMode(false);
          }} className={`px-4 py-2 text-sm font-medium rounded-r-lg ${!isEditMode ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                <ToggleLeftIcon className="h-4 w-4 inline mr-1" />
                Choose Items
              </button>
            </div>
            {onViewDetails && <button onClick={e => {
          e.stopPropagation();
          onViewDetails();
        }} className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center">
                View All
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </button>}
          </div>
          {/* Column Headers */}
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-sm font-medium text-gray-600">Expense</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 mr-12">
                {isEditMode ? 'Amount' : 'Amount'}
              </span>
              {!isEditMode && <span className="text-sm font-medium text-gray-600">
                  Include
                </span>}
            </div>
          </div>
          {isEditMode ?
      // Edit mode - show editable expense items
      <>
              {editedExpenses.slice(0, 3).map(expense => <ExpenseItemEdit key={expense.id} expense={expense} onChange={amount => handleEditAmount(expense.id, amount)} />)}
              {editedExpenses.length > 3 && <div className="text-center py-2">
                  <button onClick={e => {
            e.stopPropagation();
            onViewDetails && onViewDetails();
          }} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    +{editedExpenses.length - 3} more expenses
                  </button>
                </div>}
              <div className="mt-4 flex justify-between space-x-3">
                <button onClick={handleCancelEdit} className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                  <XIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button onClick={handleSaveChanges} className="flex-1 px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center">
                  <SaveIcon className="h-4 w-4 mr-1" />
                  Save Changes
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-medium text-gray-800">New Total</span>
                <span className="font-bold text-gray-800">
                  ${editedTotalAmount}
                </span>
              </div>
            </> :
      // Toggle mode - show regular expense items with toggles
      <>
              {priority.expenses.slice(0, 3).map(expense => <ExpenseItem key={expense.id} expense={expense} onChange={() => toggleExpense(priority.id, expense.id)} />)}
              {priority.expenses.length > 3 && <div className="text-center py-2">
                  <button onClick={e => {
            e.stopPropagation();
            onViewDetails && onViewDetails();
          }} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    +{priority.expenses.length - 3} more expenses
                  </button>
                </div>}
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-bold text-gray-800">${totalAmount}</span>
              </div>
            </>}
        </div>}
    </div>;
};