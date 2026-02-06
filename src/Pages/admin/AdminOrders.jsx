import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          status: statusFilter === 'all' ? '' : statusFilter,
          search: searchTerm
        }
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(
        `http://localhost:8000/api/orders/admin/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const deleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
      return;
    }

    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(
        `http://localhost:8000/api/orders/admin/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order deleted successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
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
    <div className="admin-orders">
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
          <h1>Order Management</h1>
          <p>View and manage customer orders</p>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-box">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Processing</p>
          <p className="stat-value">{orders.filter(o => o.orderStatus === 'Processing').length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Shipped</p>
          <p className="stat-value">{orders.filter(o => o.orderStatus === 'Shipped').length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Delivered</p>
          <p className="stat-value">{orders.filter(o => o.orderStatus === 'Delivered').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
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
        <select value={statusFilter} onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}>
          <option value="all">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>#{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <p className="customer-name">{order.shippingAddress?.fullName || 'N/A'}</p>
                      <p className="customer-email">{order.shippingAddress?.email || order.user?.Email || 'N/A'}</p>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="items-badge">{order.items?.length || 0} items</span>
                  </td>
                  <td>₹{order.totalAmount?.toLocaleString() || '0'}</td>
                  <td>
                    <span className={`payment-badge ${order.paymentStatus?.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => deleteOrder(order._id, order.orderNumber)}
                      >
                        Delete
                      </button>
                    </div>
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

export default AdminOrders;