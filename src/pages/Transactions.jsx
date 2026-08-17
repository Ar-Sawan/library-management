import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeftRight, Calendar, Filter, CheckSquare, PlusCircle, AlertCircle } from 'lucide-react';

const TransactionsPage = () => {
  const { currentUser, users, books, transactions, issueBook, returnBook } = useApp();
  const isManager = currentUser?.role === 'manager';

  const today = new Date().toISOString().split('T')[0];

  // Issue Book Form State (Manager)
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issueDate, setIssueDate] = useState(today);
  const [returnDate, setReturnDate] = useState('');
  const [price, setPrice] = useState('');

  // Filter state
  const [bookFilter, setBookFilter] = useState('');

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedBookId || !issueDate || !returnDate || !price) return;

    if (returnDate < issueDate) {
      alert("Return date cannot be earlier than issue date!");
      return;
    }

    const success = issueBook({
      userId: selectedUserId,
      bookId: selectedBookId,
      issueDate,
      returnDate,
      price
    });

    if (success) {
      setSelectedUserId('');
      setSelectedBookId('');
      setIssueDate(today);
      setReturnDate('');
      setPrice('');
    }
  };

  // Filter transactions
  let visibleTransactions = isManager
    ? transactions
    : transactions.filter((t) => t.userId === currentUser?.id);

  if (bookFilter) {
    visibleTransactions = visibleTransactions.filter(
      (t) => t.bookId === parseInt(bookFilter)
    );
  }

  // Pre-fill book price when book selected
  const handleBookSelect = (bId) => {
    setSelectedBookId(bId);
    const foundBook = books.find((b) => b.id === parseInt(bId));
    if (foundBook) {
      setPrice(foundBook.price || 0.00);
    }
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            Transaction History
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track book issuing, rental prices, expected return dates, and returned books.
          </p>
        </div>
      </div>

      {/* Manager Issue Book Panel */}
      {isManager && (
        <div className="card-panel" style={{ marginBottom: '2rem' }}>
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <h2 className="panel-title">
              <PlusCircle size={22} color="#34d399" />
              <span>Issue a Book to User</span>
            </h2>
          </div>

          <form onSubmit={handleIssueSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Select User *</label>
                <select
                  className="form-control"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.fullname})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Book *</label>
                <select
                  className="form-control"
                  value={selectedBookId}
                  onChange={(e) => handleBookSelect(e.target.value)}
                  required
                >
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (${parseFloat(b.price || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Issue Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  max={today}
                  required
                />
              </div>

              <div className="form-group">
                <label>Return Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={issueDate || today}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price / Rental Fee ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <ArrowLeftRight size={16} />
              <span>Issue Book</span>
            </button>
          </form>
        </div>
      )}

      {/* Filter by Book */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} />
          <span style={{ fontWeight: 600 }}>Filter by Book:</span>
        </div>
        <select
          className="form-control"
          style={{ maxWidth: '300px' }}
          value={bookFilter}
          onChange={(e) => setBookFilter(e.target.value)}
        >
          <option value="">All Books</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                {isManager && <th>User</th>}
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 7 : 6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                    No transaction records found.
                  </td>
                </tr>
              ) : (
                visibleTransactions.map((t) => {
                  const isOverdue = t.status === 'issued' && t.returnDate < today;
                  const currentStatus = isOverdue ? 'overdue' : t.status;

                  return (
                    <tr key={t.id}>
                      {isManager && (
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.username}</div>
                        </td>
                      )}
                      <td>
                        <div style={{ fontWeight: 600, color: '#a5b4fc' }}>{t.bookTitle}</div>
                      </td>
                      <td>{t.issueDate}</td>
                      <td>{t.returnDate || 'Not Returned'}</td>
                      <td>${parseFloat(t.price || 0).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${currentStatus}`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {t.status === 'issued' && (isManager || t.userId === currentUser?.id) && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => returnBook(t.id, today)}
                            title="Mark as returned"
                          >
                            <CheckSquare size={14} color="#34d399" />
                            <span>Return</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
