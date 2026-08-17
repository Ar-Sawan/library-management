import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, Edit3, Trash2, Shield, User as UserIcon, X, Lock } from 'lucide-react';

const UsersPage = () => {
  const { currentUser, users, addUser, editUser, deleteUser } = useApp();
  const isManager = currentUser?.role === 'manager';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Add form state
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');

  // Edit form state
  const [editFullname, setEditFullname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('user');

  if (!isManager) {
    return (
      <div className="card-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <Shield size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          You must be logged in as a Manager to access User Management.
        </p>
      </div>
    );
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !email || !username || !password || !phone) return;

    const success = addUser({
      fullname,
      email,
      username,
      password,
      phone,
      role
    });

    if (success) {
      setFullname('');
      setEmail('');
      setUsername('');
      setPassword('');
      setPhone('');
      setRole('user');
      setShowAddModal(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditFullname(user.fullname);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    editUser(editingUser.id, {
      fullname: editFullname,
      email: editEmail,
      phone: editPhone,
      role: editRole
    });

    setEditingUser(null);
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage registered library users, phone numbers, and manager access privileges.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Username</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.fullname}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserIcon size={14} color="#818cf8" />
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`user-role-tag role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => startEdit(user)}
                        title="Edit details"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (user.username === currentUser.username) {
                            alert("You cannot delete your own logged-in account!");
                            return;
                          }
                          if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
                            deleteUser(user.id);
                          }
                        }}
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button className="flash-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Edit User: {editingUser.username}</h2>
              <button className="flash-close-btn" onClick={() => setEditingUser(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFullname}
                  onChange={(e) => setEditFullname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
