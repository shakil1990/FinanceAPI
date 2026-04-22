import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { ExpenseProvider } from '@/context/ExpenseContext.jsx';
import ExpenseSummaryPage from '@/pages/ExpenseSummaryPage.jsx';
import AddExpensePage from '@/pages/AddExpensePage.jsx';
import EditExpensePage from '@/pages/EditExpensePage.jsx';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <div className="app-shell">
        <header className="app-nav" role="navigation" aria-label="Main">
          <Link className="app-nav__brand" to="/expenses">
            Personal finance
          </Link>
          <nav className="app-nav__links">
            <Link className="app-nav__link" to="/expenses">
              Summary
            </Link>
            <Link className="app-nav__link" to="/expenses/add">
              Add expense
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/expenses" replace />} />
            <Route path="/expenses" element={<ExpenseSummaryPage />} />
            <Route path="/expenses/add" element={<AddExpensePage />} />
            <Route path="/expenses/edit/:id" element={<EditExpensePage />} />
            <Route path="*" element={<Navigate to="/expenses" replace />} />
          </Routes>
        </main>
      </div>
    </ExpenseProvider>
  );
}

export default App;
