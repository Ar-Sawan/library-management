import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Home, Book, Users, ArrowLeftRight, Mail, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useApp();
  const isManager = currentUser?.role === 'manager';

  return (
    <header className="app-header">
      <div className="header-container">
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
        >
          <BookOpen size={28} />
          <span>Library System</span>
        </a>

        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <Book size={18} />
            <span>Books</span>
          </button>

          {isManager && (
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>Users</span>
            </button>
          )}

          {currentUser && (
            <button
              className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <ArrowLeftRight size={18} />
              <span>Transactions</span>
            </button>
          )}

          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={18} />
            <span>Contact</span>
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <div className="user-badge">
                <span>{currentUser.username}</span>
                <span className={`user-role-tag role-${currentUser.role}`}>
                  {currentUser.role}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={logout}
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('login')}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab('register')}
              >
                <UserPlus size={16} />
                <span>Register</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
