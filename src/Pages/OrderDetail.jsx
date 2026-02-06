import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import '../Stylesheet/OrderDetail/OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error(response.message || 'Order not found');
        navigate('/orders');
      }
    } catch (err) {
      console.error('Fetch order error:', err);
      toast.error(err.message || 'Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(id, cancelReason);
      if (response.success) {
        toast.success('Order cancelled successfully');
        setOrder(response.data);
        setShowCancelForm(false);
        setCancelReason('');
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Processing': return '#3b82f6';
      case 'Shipped': return '#10b981';
      case 'Delivered': return '#059669';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Processing': return '🔄';
      case 'Shipped': return '🚚';
      case 'Delivered': return '✅';
      case 'Cancelled': return '❌';
      default: return '📦';
    }
  };

  const canCancelOrder = () => {
    if (!order) return false;
    return order.orderStatus !== 'Cancelled' && 
           order.orderStatus !== 'Delivered' && 
           order.orderStatus !== 'Shipped';
  };

  const canTrackOrder = () => {
    if (!order) return false;
    return order.orderStatus !== 'Cancelled' && 
           order.orderStatus !== 'Delivered';
  };

  const canDownloadInvoice = () => {
    if (!order) return false;
    return order.paymentStatus === 'Paid' || order.orderStatus === 'Delivered';
  };

  if (loading) {
    return (
      <div className="OrderDetail-Loading">
        <div className="OrderDetail-Spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="OrderDetail-NotFound">
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <button onClick={() => navigate('/orders')} className="OrderDetail-BackBtn">
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="OrderDetail-Container">
      <div className="OrderDetail-Header">
        <div className="OrderDetail-Breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/orders">My Orders</Link> / 
          <span>Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="OrderDetail-TitleSection">
          <h1>Order Details</h1>
          <div className="OrderDetail-StatusBadge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
            {getStatusIcon(order.orderStatus)} {order.orderStatus}
          </div>
        </div>
        <p className="OrderDetail-OrderInfo">
          Order Placed: {formatDate(order.createdAt)} | 
          Order ID: {order._id.slice(-8).toUpperCase()} | 
          Payment: {order.paymentMethod} ({order.paymentStatus})
        </p>
      </div>

      <div className="OrderDetail-Grid">
        {/* Left Column - Order Items */}
        <div className="OrderDetail-Section OrderDetail-ItemsSection">
          <h2>Order Items ({order.items?.length || 0})</h2>
          <div className="OrderDetail-ItemsList">
            {order.items?.map((item, index) => (
              <div key={index} className="OrderDetail-Item">
                <div className="OrderDetail-ItemImage">
                  <img 
                    src={item.image || item.product?.images?.[0] || '/placeholder-product.jpg'} 
                    alt={item.name || item.product?.name} 
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                <div className="OrderDetail-ItemDetails">
                  <h3>{item.name || item.product?.name || 'Product'}</h3>
                  <div className="OrderDetail-ItemAttributes">
                    {item.size && (
                      <span className="OrderDetail-Attribute">
                        <strong>Size:</strong> {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="OrderDetail-Attribute">
                        <strong>Color:</strong> {item.color}
                      </span>
                    )}
                    <span className="OrderDetail-Attribute">
                      <strong>Quantity:</strong> {item.quantity || 1}
                    </span>
                  </div>
                  {item.product?._id && (
                    <Link 
                      to={`/products/${item.product._id}`} 
                      className="OrderDetail-ViewProduct"
                    >
                      View Product
                    </Link>
                  )}
                </div>
                <div className="OrderDetail-ItemPrice">
                  <div className="OrderDetail-PriceRow">
                    <span>Price:</span>
                    <span>{formatCurrency(item.price || 0)}</span>
                  </div>
                  <div className="OrderDetail-PriceRow OrderDetail-TotalRow">
                    <span>Total:</span>
                    <span>{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="OrderDetail-Sidebar">
          {/* Order Summary */}
          <div className="OrderDetail-SummaryCard">
            <h3>Order Summary</h3>
            <div className="OrderDetail-SummaryRow">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="OrderDetail-SummaryRow">
              <span>Tax (GST 18%)</span>
              <span>{formatCurrency(order.tax || 0)}</span>
            </div>
            <div className="OrderDetail-SummaryRow">
              <span>Shipping</span>
              <span>{order.shippingCharge > 0 ? formatCurrency(order.shippingCharge) : 'FREE'}</span>
            </div>
            <div className="OrderDetail-SummaryRow OrderDetail-GrandTotal">
              <span>Grand Total</span>
              <span>{formatCurrency(order.totalAmount || 0)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="OrderDetail-SummaryCard">
            <h3>Shipping Address</h3>
            {order.shippingAddress ? (
              <div className="OrderDetail-Address">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="OrderDetail-Phone">
                  <strong>Phone:</strong> {order.shippingAddress.phone}
                </p>
                {order.shippingAddress.email && (
                  <p className="OrderDetail-Email">
                    <strong>Email:</strong> {order.shippingAddress.email}
                  </p>
                )}
              </div>
            ) : (
              <p>No shipping address provided</p>
            )}
          </div>

          {/* Order Notes */}
          {order.orderNotes && (
            <div className="OrderDetail-SummaryCard">
              <h3>Order Notes</h3>
              <p className="OrderDetail-Notes">{order.orderNotes}</p>
            </div>
          )}

          {/* Cancellation Info */}
          {order.orderStatus === 'Cancelled' && order.cancellationReason && (
            <div className="OrderDetail-SummaryCard OrderDetail-CancelledInfo">
              <h3>Cancellation Details</h3>
              <p><strong>Reason:</strong> {order.cancellationReason}</p>
              {order.cancelledAt && (
                <p><strong>Cancelled on:</strong> {formatDate(order.cancelledAt)}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="OrderDetail-Actions">
            {canCancelOrder() && !showCancelForm && (
              <button 
                onClick={() => setShowCancelForm(true)}
                className="OrderDetail-Btn OrderDetail-CancelBtn"
              >
                Cancel Order
              </button>
            )}

            {canTrackOrder() && (
              <button className="OrderDetail-Btn OrderDetail-TrackBtn">
                Track Order
              </button>
            )}

            {canDownloadInvoice() && (
              <button className="OrderDetail-Btn OrderDetail-InvoiceBtn">
                Download Invoice
              </button>
            )}

            <button 
              onClick={() => navigate('/orders')}
              className="OrderDetail-Btn OrderDetail-BackBtn"
            >
              Back to Orders
            </button>

            <button 
              onClick={() => navigate('/products')}
              className="OrderDetail-Btn OrderDetail-ShopBtn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Order Form Modal */}
      {showCancelForm && (
        <div className="OrderDetail-Modal">
          <div className="OrderDetail-ModalContent">
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order?</p>
            
            <div className="OrderDetail-CancelForm">
              <label htmlFor="cancelReason">Reason for cancellation *</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this order..."
                rows="4"
                required
                maxLength="500"
              />
              <small className="OrderDetail-CharCount">
                {cancelReason.length}/500 characters
              </small>
            </div>

            <div className="OrderDetail-ModalActions">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="OrderDetail-Btn OrderDetail-ConfirmCancelBtn"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
              <button
                onClick={() => {
                  setShowCancelForm(false);
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="OrderDetail-Btn OrderDetail-CancelModalBtn"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Timeline */}
      <div className="OrderDetail-TimelineSection">
        <h2>Order Timeline</h2>
        <div className="OrderDetail-Timeline">
          <div className={`OrderDetail-TimelineStep ${order.orderStatus !== 'Cancelled' ? 'active' : ''}`}>
            <div className="OrderDetail-TimelineDot"></div>
            <div className="OrderDetail-TimelineContent">
              <h4>Order Placed</h4>
              <p>{formatDate(order.createdAt)}</p>
            </div>
          </div>
          
          <div className={`OrderDetail-TimelineStep ${['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'active' : ''}`}>
            <div className="OrderDetail-TimelineDot"></div>
            <div className="OrderDetail-TimelineContent">
              <h4>Processing</h4>
              <p>Order is being processed</p>
            </div>
          </div>
          
          <div className={`OrderDetail-TimelineStep ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'active' : ''}`}>
            <div className="OrderDetail-TimelineDot"></div>
            <div className="OrderDetail-TimelineContent">
              <h4>Shipped</h4>
              <p>Order has been shipped</p>
            </div>
          </div>
          
          <div className={`OrderDetail-TimelineStep ${order.orderStatus === 'Delivered' ? 'active' : ''}`}>
            <div className="OrderDetail-TimelineDot"></div>
            <div className="OrderDetail-TimelineContent">
              <h4>Delivered</h4>
              <p>Order has been delivered</p>
            </div>
          </div>

          {order.orderStatus === 'Cancelled' && (
            <div className="OrderDetail-TimelineStep OrderDetail-CancelledStep">
              <div className="OrderDetail-TimelineDot"></div>
              <div className="OrderDetail-TimelineContent">
                <h4>Cancelled</h4>
                <p>Order was cancelled</p>
                {order.cancelledAt && <p>{formatDate(order.cancelledAt)}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;