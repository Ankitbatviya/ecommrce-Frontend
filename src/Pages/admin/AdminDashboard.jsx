import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [uRes, oRes, pRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users/all', config),
        axios.get('http://localhost:8000/api/orders/admin/all', config),
        axios.get('http://localhost:8000/api/products/admin/all', config)
      ]);

      if (uRes.data.success) {
        const users = uRes.data.data || [];
        const orders = oRes.data.data || [];
        const products = pRes.data.data || [];
        
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentOrders(orders.slice(-5).reverse());
      }
    } catch (error) {
      toast.error('Performance data could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="admin-dashboard">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
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
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store efficiently</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">₹</div>
          <div className="stat-details">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-details">
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-card" onClick={() => navigate('/admin/users')}>
          <span className="action-icon">👤</span>
          <span>Manage Users</span>
        </button>
        <button className="action-card" onClick={() => navigate('/admin/products')}>
          <span className="action-icon">📦</span>
          <span>Manage Products</span>
        </button>
        <button className="action-card" onClick={() => navigate('/admin/orders')}>
          <span className="action-icon">🛒</span>
          <span>View Orders</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        {/* Recent Orders */}
        <div className="activity-card">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td><strong>#{order.orderNumber}</strong></td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="activity-card">
          <div className="card-header">
            <h2>Recent Users</h2>
          </div>
          <div className="users-container">
            {recentUsers.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-avatar">
                  {(user.Fullname || user.fullname || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <p className="user-name">{user.Fullname || user.fullname}</p>
                  <p className="user-email">{user.Email || user.email}</p>
                </div>
                <span className={`role-badge ${(user.Role || user.role)?.toLowerCase()}`}>
                  {user.Role || user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;