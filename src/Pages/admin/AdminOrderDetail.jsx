import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`http://localhost:8000/api/orders/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrder(response.data.data);
        setStatusUpdate(response.data.data.orderStatus);
        setTrackingNumber(response.data.data.trackingNumber || '');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdate) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(
        `http://localhost:8000/api/orders/admin/${id}/status`,
        {
          status: statusUpdate,
          trackingNumber: trackingNumber || undefined,
          notes: updateNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        setOrder(response.data.data);
        setUpdateNotes('');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(
        `http://localhost:8000/api/orders/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order deleted successfully');
        navigate('/admin/orders');
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

  if (!order) {
    return (
      <div className="error-state">
        <p>Order not found</p>
        <button onClick={() => navigate('/admin/orders')}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate('/admin/orders')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Orders
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
          <h1>Order #{order.orderNumber}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <button className="btn-delete-order" onClick={deleteOrder}>
          Delete Order
        </button>
      </header>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Status Update Card */}
          <div className="info-card">
            <h2>Update Order Status</h2>
            <div className="form-group">
              <label>Status</label>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                disabled={updating}
              >
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tracking Number (Optional)</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                disabled={updating}
              />
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Add notes about this update..."
                rows="3"
                disabled={updating}
              />
            </div>

            <button 
              className="btn-update" 
              onClick={handleStatusUpdate}
              disabled={updating || statusUpdate === order.orderStatus}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Customer Info */}
          <div className="info-card">
            <h2>Customer Information</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{order.shippingAddress?.fullName || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{order.shippingAddress?.email || order.user?.Email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{order.shippingAddress?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="info-card">
            <h2>Shipping Address</h2>
            <div className="address-block">
              <p><strong>{order.shippingAddress?.fullName || 'N/A'}</strong></p>
              <p>{order.shippingAddress?.addressLine1 || 'N/A'}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city || 'N/A'}, 
                {order.shippingAddress?.state || 'N/A'} - 
                {order.shippingAddress?.pincode || 'N/A'}
              </p>
              <p>{order.shippingAddress?.country || 'India'}</p>
              <p>Phone: {order.shippingAddress?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Current Status */}
          <div className="info-card">
            <h2>Current Status</h2>
            <div className="status-display">
              <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
              <span className={`payment-badge ${order.paymentStatus?.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.trackingNumber && (
              <div className="tracking-display">
                <p><strong>Tracking:</strong> {order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="info-card">
            <h2>Order Items ({order.items?.length || 0})</h2>
            <div className="items-list">
              {order.items?.map((item, index) => (
                <div key={index} className="item-row">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">Qty: {item.quantity}</p>
                    {item.size && <p className="item-details">Size: {item.size}</p>}
                    {item.color && <p className="item-details">Color: {item.color}</p>}
                    <p className="item-price">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="info-card">
            <h2>Order Summary</h2>
            <div className="summary-list">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18%):</span>
                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹{order.shippingCharge?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;