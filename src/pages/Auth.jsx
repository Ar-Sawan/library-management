import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, ShieldAlert, KeyRound } from 'lucide-react';

const Auth = ({ initialMode = 'login', setActiveTab }) => {
  const { login, register } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;

    if (login(loginUsername, loginPassword)) {
      setActiveTab('home');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !email || !regUsername || !regPassword || !phone) return;

    if (regPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const success = register({
      fullname,
      email,
      username: regUsername,
      password: regPassword,
      phone
    });

    if (success) {
      setMode('login');
      setLoginUsername(regUsername);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card-panel">
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <h2 className="panel-title" style={{ fontSize: '1.25rem' }}>
                <LogIn size={20} color="#818cf8" />
                <span>Account Login</span>
              </h2>
            </div>

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
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Sign In
            </button>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: '0.2rem' }}>Default Test Credentials:</div>
              <div>• <b>Manager:</b> <code>manager</code> / <code>password123</code></div>
              <div>• <b>User:</b> <code>john_doe</code> / <code>user123</code></div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <h2 className="panel-title" style={{ fontSize: '1.25rem' }}>
                <UserPlus size={20} color="#34d399" />
                <span>User Registration</span>
              </h2>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Username *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Choose username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
