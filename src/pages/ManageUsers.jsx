import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react';
import apiService from '../services/api';
import { useApp } from '../context/AppContext';

const ManageUsers = () => {
  const { updateUserRole, toggleUserStatus, deleteUser } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      if (roleFilter !== 'all') filters.role = roleFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      const data = await apiService.getAllUsers(filters);
      setUsers(data.map((u) => ({ ...u, id: u._id })));
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    setSuccessMsg('User role updated successfully!');
    fetchUsers();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleStatus = async (userId) => {
    await toggleUserStatus(userId);
    setSuccessMsg('User account status updated!');
    fetchUsers();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      await deleteUser(userId);
      setSuccessMsg('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      <div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Manage Users</h1>
        <p style={{ color: 'var(--dark-text-muted)' }}>Audit platform registrations, update role privileges, or suspend user access credentials.</p>
      </div>

      {successMsg && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: 'var(--accent-emerald)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }}>
              <X size={16} color="var(--dark-text-muted)" />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <select className="form-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ maxWidth: '180px' }}>
            <option value="all">All roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: '180px' }}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button type="button" onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
              Clear filters
            </button>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)', marginLeft: 'auto' }}>
            {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--dark-border)' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>No users match your filters.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--dark-border)', color: 'var(--dark-text)' }}>
                <th style={{ padding: '1.2rem 1.5rem' }}>User Profile</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>Email Address</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1.2rem 1.5rem' }}>Change Role Privilege</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--dark-border)', color: 'var(--dark-text-muted)' }}>
                  <td style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      color: 'var(--dark-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                    }}>
                      {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--dark-text)', fontWeight: '700' }}>{u.name}</span>
                      <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>Role: {u.role}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', color: 'var(--dark-text)' }}>{u.email}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <span className={`badge ${u.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>{u.status}</span>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', maxWidth: '150px', cursor: 'pointer' }}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        style={{
                          padding: '0.4rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--surface-elevated)',
                          border: '1px solid var(--dark-border)',
                          color: u.status === 'active' ? 'var(--accent-emerald)' : 'var(--dark-text-muted)',
                          cursor: 'pointer',
                        }}
                        title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                      >
                        {u.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button type="button" onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }} title="Delete User">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
