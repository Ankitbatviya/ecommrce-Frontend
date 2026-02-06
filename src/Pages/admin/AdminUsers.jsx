import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          role: roleFilter === 'all' ? '' : roleFilter
        }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalUsers(response.data.pagination?.totalUsers || 0);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('User role updated successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (userEmail === 'ankitbatviya94@gmail.com') {
      toast.error('Cannot delete the primary admin');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete this user?`)) {
      return;
    }

    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(
        `http://localhost:8000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </button>
            <div className="logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">AdminPanel</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-box">
          <p className="stat-label">Total Users</p>
          <p className="stat-value">{totalUsers}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Admins</p>
          <p className="stat-value">{users.filter(u => (u.Role || u.role) === 'admin').length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Customers</p>
          <p className="stat-value">{users.filter(u => (u.Role || u.role) === 'user').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <select value={roleFilter} onChange={(e) => {
          setRoleFilter(e.target.value);
          setCurrentPage(1);
        }}>
          <option value="all">All Roles</option>
          <option value="user">Customers</option>
          <option value="admin">Admins</option>
          <option value="partner">Partners</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {(user.Fullname || user.fullname || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="user-name">
                          {user.Fullname || user.fullname}
                          {(user.Email || user.email) === 'ankitbatviya94@gmail.com' && (
                            <span className="owner-badge">Owner</span>
                          )}
                        </p>
                        <p className="user-id">ID: {user._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.Email || user.email}</td>
                  <td>
                    <select
                      value={user.Role || user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="role-select"
                      disabled={(user.Email || user.email) === 'ankitbatviya94@gmail.com'}
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="partner">Partner</option>
                    </select>
                  </td>
                  <td>{new Date(user.CreatedAt || user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {(user.Email || user.email) !== 'ankitbatviya94@gmail.com' ? (
                      <button
                        className="btn-delete"
                        onClick={() => deleteUser(user._id, user.Email || user.email)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="protected-badge">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">Page {currentPage} of {totalPages}</span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;