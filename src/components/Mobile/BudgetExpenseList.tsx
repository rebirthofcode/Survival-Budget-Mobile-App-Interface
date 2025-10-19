import React from 'react';
import { SwipeableExpenseItem } from './SwipeableExpenseItem';
type Expense = {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
};
type BudgetExpenseListProps = {
  expenses: Expense[];
  priorityId: number;
  toggleExpense: (priorityId: number, expenseId: string) => void;
  updateExpenseAmount: (priorityId: number, expenseId: string, amount: number) => void;
  deleteExpense?: (priorityId: number, expenseId: string) => void;
  onEditExpense?: (priorityId: number, expenseId: string) => void;
};
export const BudgetExpenseList = ({
  expenses,
  priorityId,
  toggleExpense,
  updateExpenseAmount,
  deleteExpense,
  onEditExpense
}: BudgetExpenseListProps) => {
  return <div className="divide-y divide-gray-100">
      {expenses.map(expense => <SwipeableExpenseItem key={expense.id} expense={expense} onToggle={() => toggleExpense(priorityId, expense.id)} onEdit={amount => updateExpenseAmount(priorityId, expense.id, amount)} onEditClick={onEditExpense ? () => onEditExpense(priorityId, expense.id) : undefined} onDelete={() => deleteExpense && deleteExpense(priorityId, expense.id)} />)}
    </div>;
};