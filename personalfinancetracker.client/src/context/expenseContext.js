import { createContext } from 'react';

/**
 * @typedef {import('@/models/expense.js').Expense} Expense
 * @typedef {import('@/services/expenseService.js').ExpenseInput} ExpenseInput
 * @typedef {import('@/services/expenseService.js').DailyTotalRow} DailyTotalRow
 */

/**
 * @typedef {Object} ExpenseContextValue
 * @property {Expense[]} expenses
 * @property {(input: ExpenseInput) => Expense} addExpense
 * @property {(id: string, input: ExpenseInput) => boolean} updateExpense
 * @property {(id: string) => boolean} deleteExpense
 * @property {(startIso: string, endIso: string) => Expense[]} getExpensesInRange
 * @property {(startIso: string, endIso: string) => DailyTotalRow[]} getDailyTotals
 */

/** @type {import('react').Context<ExpenseContextValue | null>} */
export const ExpenseContext = createContext(null);
