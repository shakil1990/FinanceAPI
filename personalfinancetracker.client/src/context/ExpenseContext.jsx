import { useCallback, useMemo, useRef, useState } from 'react';
import { ExpenseContext } from '@/context/expenseContext.js';
import {
  addExpense as appendExpense,
  deleteExpense as removeExpense,
  getDailyTotals as computeDailyTotals,
  getExpensesInRange as filterExpensesInRange,
  updateExpense as patchExpense,
} from '@/services/expenseService.js';

/**
 * @typedef {import('@/models/expense.js').Expense} Expense
 */

/**
 * @param {{ children: React.ReactNode }} props
 */
export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(
    /** @type {Expense[]} */ ([])
  );
  const expensesRef = useRef(expenses);
  expensesRef.current = expenses;

  const addExpense = useCallback((input) => {
    /** @type {Expense | undefined} */
    let created;
    setExpenses((prev) => {
      const next = appendExpense(prev, input);
      created = next.created;
      return next.list;
    });
    return /** @type {Expense} */ (created);
  }, []);

  const updateExpense = useCallback((id, input) => {
    const result = patchExpense(expensesRef.current, id, input);
    if (result === null) return false;
    setExpenses(result.list);
    return true;
  }, []);

  const deleteExpense = useCallback((id) => {
    const next = removeExpense(expensesRef.current, id);
    if (next === null) return false;
    setExpenses(next);
    return true;
  }, []);

  const getExpensesInRange = useCallback(
    (startIso, endIso) => filterExpensesInRange(expenses, startIso, endIso),
    [expenses]
  );

  const getDailyTotals = useCallback(
    (startIso, endIso) => computeDailyTotals(expenses, startIso, endIso),
    [expenses]
  );

  const value = useMemo(
    () => ({
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesInRange,
      getDailyTotals,
    }),
    [
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesInRange,
      getDailyTotals,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
