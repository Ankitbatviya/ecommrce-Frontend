import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import '../Stylesheet/MyOrders/MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setCancellingOrder(orderId);
      await orderService.cancelOrder(orderId, { reason: cancelReason });
      toast.success('Order cancelled successfully');
      setCancelReason('');
      setCancellingOrder(null);
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error('Cancel order error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      setCancellingOrder(null);
    }
  };

  const startCancelProcess = (orderId) => {
    setCancellingOrder(orderId);
  };

  const cancelCancelProcess = () => {
    setCancellingOrder(null);
    setCancelReason('');
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#4caf50';
      case 'Delivered': return '#2e7d32';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="MyOrders-Loading">
        <div className="MyOrders-Spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="MyOrders-Container">
      <div className="MyOrders-Header">
        <h1>My Orders</h1>
        <p>View and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="MyOrders-Empty">
          <div className="MyOrders-Empty-Icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders. Start shopping to see your orders here.</p>
          <button 
            className="MyOrders-Shop-Btn"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="MyOrders-List">
          {orders.map((order) => (
            <div key={order._id} className="MyOrders-Card">
              <div className="MyOrders-Card-Header">
                <div className="MyOrders-Order-Info">
                  <div>
                    <strong>Order #{order.orderNumber}</strong>
                    <span className="MyOrders-Date">Placed on {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="MyOrders-Price">
                    ₹{order.totalAmount.toFixed(0)}
                  </div>
                </div>
                
                <div className="MyOrders-Status-Info">
                  <span 
                    className="MyOrders-Status-Badge"
                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="MyOrders-Payment-Method">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="MyOrders-Items-Preview">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="MyOrders-Preview-Item">
                    <img src={item.image} alt={item.name} />
                    <div className="MyOrders-Preview-Info">
                      <h4>{item.name}</h4>
                      <p>
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="MyOrders-Preview-Price">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="MyOrders-More-Items">
                    +{order.items.length - 2} more item(s)
                  </div>
                )}
              </div>

              {cancellingOrder === order._id ? (
                <div className="MyOrders-Cancel-Form">
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide reason for cancellation..."
                    rows="3"
                  />
                  <div className="MyOrders-Cancel-Actions">
                    <button
                      className="MyOrders-Confirm-Cancel"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrder === order._id && !cancelReason.trim()}
                    >
                      {cancellingOrder === order._id ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                    <button
                      className="MyOrders-Cancel-Cancel"
                      onClick={cancelCancelProcess}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="MyOrders-Actions">
                  <button
                    className="MyOrders-View-Btn"
                    onClick={() => handleViewOrder(order._id)}
                  >
                    View Details
                  </button>
                  
                  {order.orderStatus !== 'Cancelled' && 
                   order.orderStatus !== 'Delivered' && (
                    <button
                      className="MyOrders-Cancel-Btn"
                      onClick={() => startCancelProcess(order._id)}
                      disabled={order.orderStatus === 'Cancelled'}
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.orderStatus === 'Delivered' && (
                    <button className="MyOrders-Return-Btn">
                      Return/Exchange
                    </button>
                  )}
                </div>
              )}

              <div className="MyOrders-Tracking">
                {order.orderStatus !== 'Cancelled' && (
                  <div className="MyOrders-Tracking-Steps">
                    <div className={`MyOrders-Step ${order.orderStatus === 'Pending' || order.orderStatus === 'Processing' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                      <div className="MyOrders-Step-Dot"></div>
                      <span>Order Placed</span>
                    </div>
                    <div className={`MyOrders-Step ${order.orderStatus === 'Processing' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                      <div className="MyOrders-Step-Dot"></div>
                      <span>Processing</span>
                    </div>
                    <div className={`MyOrders-Step ${order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                      <div className="MyOrders-Step-Dot"></div>
                      <span>Shipped</span>
                    </div>
                    <div className={`MyOrders-Step ${order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                      <div className="MyOrders-Step-Dot"></div>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;