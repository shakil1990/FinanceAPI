import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addDays, toISODateLocal } from '@/models/expense.js';
import { useExpenses } from '@/context/useExpenses.js';

const money = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDisplayDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ExpenseSummaryPage() {
  const { getDailyTotals } = useExpenses();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDateRaw = searchParams.get('date');
  const urlDate =
    urlDateRaw && /^\d{4}-\d{2}-\d{2}$/.test(urlDateRaw) ? urlDateRaw : null;

  const [rangeStart, setRangeStart] = useState(/** @type {string | null} */ (null));

  const startDate = urlDate ?? rangeStart ?? toISODateLocal(new Date());

  const endDate = useMemo(() => addDays(startDate, 9), [startDate]);

  const rows = useMemo(
    () => getDailyTotals(startDate, endDate),
    [getDailyTotals, startDate, endDate]
  );

  const highlighted = urlDate;

  return (
    <div className="expense-page expense-summary">
      <header className="expense-page__header">
        <h1 className="expense-page__title">Daily expenses</h1>
        <p className="expense-page__lede">
          Pick a start date to see totals for the next 10 days.
        </p>
      </header>

      <div className="expense-controls">
        <label className="expense-field">
          <span className="expense-field__label">Start date</span>
          <input
            type="date"
            className="expense-field__input"
            value={startDate}
            onChange={(e) => {
              setRangeStart(e.target.value);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete('date');
                return next;
              });
            }}
            aria-label="Start date for 10-day summary"
          />
        </label>
        <Link className="expense-button expense-button--primary" to="/expenses/add">
          Add expense
        </Link>
      </div>

      <div className="expense-table-wrap">
        <table className="expense-table" aria-label="Daily expense totals">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
              <th scope="col">Items</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isHighlight = highlighted === row.date;
              return (
                <tr
                  key={row.date}
                  className={isHighlight ? 'expense-table__row--highlight' : undefined}
                >
                  <td>{formatDisplayDate(row.date)}</td>
                  <td>
                    {row.total === 0 ? '—' : money.format(row.total)}
                  </td>
                  <td>{row.count === 0 ? '—' : row.count}</td>
                  <td className="expense-table__details">
                    {row.count === 0 ? (
                      '—'
                    ) : (
                      <ul className="expense-table__detail-list">
                        {row.expenses.map((e) => (
                          <li key={e.id} className="expense-table__detail-row">
                            <span className="expense-table__detail-text">
                              {money.format(e.amount)} — {e.description}
                            </span>
                            <Link
                              className="expense-table__detail-edit"
                              to={`/expenses/edit/${encodeURIComponent(e.id)}`}
                              aria-label={`Edit expense: ${e.description} on ${row.date}`}
                            >
                              Edit
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
