import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '@/context/useExpenses.js';

export default function EditExpensePage() {
  const { id } = useParams();
  const { expenses, updateExpense, deleteExpense } = useExpenses();
  const navigate = useNavigate();

  const expense = useMemo(
    () => (id ? expenses.find((e) => e.id === id) : undefined),
    [expenses, id]
  );

  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (!expense) return;
    setDate(expense.date);
    setAmount(String(expense.amount));
    setDescription(expense.description);
  }, [expense]);

  if (!id) {
    return (
      <div className="expense-page expense-edit">
        <p>Missing expense id.</p>
        <Link className="expense-button expense-button--ghost" to="/expenses">
          Back to summary
        </Link>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="expense-page expense-edit">
        <header className="expense-page__header">
          <h1 className="expense-page__title">Expense not found</h1>
          <p className="expense-page__lede">
            This expense may have been deleted or the link is invalid.
          </p>
        </header>
        <Link className="expense-button expense-button--ghost" to="/expenses">
          Back to summary
        </Link>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const trimmed = description.trim();
    if (!trimmed) {
      setError('Description is required.');
      return;
    }

    const n = Number.parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a positive amount.');
      return;
    }

    const ok = updateExpense(id, {
      date,
      amount: n,
      description: trimmed,
    });

    if (!ok) {
      setError('That expense no longer exists.');
      return;
    }

    navigate(`/expenses?date=${encodeURIComponent(date)}`);
  }

  function handleDelete() {
    if (!window.confirm('Delete this expense? This cannot be undone.')) {
      return;
    }
    const summaryDate = date || expense.date;
    const ok = deleteExpense(id);
    if (!ok) {
      setError('That expense no longer exists.');
      return;
    }
    navigate(`/expenses?date=${encodeURIComponent(summaryDate)}`);
  }

  return (
    <div className="expense-page expense-edit">
      <header className="expense-page__header">
        <h1 className="expense-page__title">Edit expense</h1>
        <p className="expense-page__lede">Update or remove this entry.</p>
      </header>

      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="expense-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="expense-field">
          <span className="expense-field__label">Date</span>
          <input
            type="date"
            className="expense-field__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            aria-required="true"
            aria-label="Expense date"
          />
        </label>

        <label className="expense-field">
          <span className="expense-field__label">Amount</span>
          <input
            type="number"
            className="expense-field__input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            aria-label="Amount in dollars"
          />
        </label>

        <label className="expense-field">
          <span className="expense-field__label">Description</span>
          <input
            type="text"
            className="expense-field__input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
            aria-label="Expense description"
          />
        </label>

        <div className="expense-form__actions">
          <button type="submit" className="expense-button expense-button--primary">
            Save changes
          </button>
          <button
            type="button"
            className="expense-button expense-button--ghost"
            onClick={handleDelete}
          >
            Delete
          </button>
          <Link className="expense-button expense-button--ghost" to={`/expenses?date=${encodeURIComponent(date)}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
