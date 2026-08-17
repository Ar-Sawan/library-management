import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, BookOpen, Users, ArrowLeftRight, BookMarked, ShieldCheck, LogIn, ExternalLink } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  const { currentUser, books, users, transactions, login } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Login form state for quick inline login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Suggestions logic (replicating suggest.php prefix filter)
  const suggestions = searchQuery.trim() === ''
    ? []
    : books.filter((b) => b.title.toLowerCase().startsWith(searchQuery.trim().toLowerCase())).slice(0, 8);

  const selectedBook = searchQuery.trim() !== ''
    ? books.find((b) => b.title.toLowerCase() === searchQuery.trim().toLowerCase())
    : null;

  const handleInlineLogin = (e) => {
    e.preventDefault();
    if (login(loginUsername, loginPassword)) {
      setLoginUsername('');
      setLoginPassword('');
    }
  };

  const activeIssuedCount = transactions.filter((t) => t.status === 'issued').length;

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1 className="hero-title">Welcome to Library Management System</h1>
        <p className="hero-subtitle">
          Discover thousands of titles, manage borrowings, users, and transactions effortlessly on local host.
        </p>

        {/* Live Search Bar */}
        <div className="search-box-wrapper">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search for books by title (e.g. Ramayana, Mahabharata)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button onClick={() => setShowSuggestions(true)}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>

          {/* Autosuggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((b) => (
                <div
                  key={b.id}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchQuery(b.title);
                    setShowSuggestions(false);
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{b.title}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>by {b.author}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Result Card if selected */}
        {selectedBook && (
          <div
            style={{
              marginTop: '1.5rem',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc', marginBottom: '0.25rem' }}>{selectedBook.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Author: {selectedBook.author}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{selectedBook.description}</p>
            </div>
            <a
              href={selectedBook.link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0 }}
            >
              <span>View Book</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {/* Stats Counter Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-number">{books.length}</div>
            <div className="stat-label">Total Books in Catalog</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Registered Library Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <div className="stat-number">{activeIssuedCount}</div>
            <div className="stat-label">Currently Issued Books</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-number">{currentUser ? currentUser.role : 'Guest'}</div>
            <div className="stat-label">Current Role Access</div>
          </div>
        </div>
      </div>

      {/* Quick Login Form if logged out */}
      {!currentUser && (
        <div className="card-panel" style={{ maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <h2 className="panel-title">
              <LogIn size={22} color="#818cf8" />
              <span>Quick Login</span>
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Log in to manage books, issue transactions, or view your borrowing history.
          </p>

          <form onSubmit={handleInlineLogin}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Manager: manager | User: john_doe"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Manager: password123 | User: user123"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('register')}
              >
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Features Overview */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card-panel" style={{ margin: 0 }}>
          <BookMarked size={32} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Book Management</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Browse books, search titles dynamically, and add new books with price and external links.
          </p>
        </div>

        <div className="card-panel" style={{ margin: 0 }}>
          <Users size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>User Management</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Managers can manage user accounts, assign roles (User/Manager), update details, and view profiles.
          </p>
        </div>

        <div className="card-panel" style={{ margin: 0 }}>
          <ArrowLeftRight size={32} color="#fbbf24" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Transaction Tracking</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Issue books with issue/return dates, record rental prices, and mark returned books with ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
