// OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import '../Stylesheet/OrderConfirmation/OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Fetch order error:', err);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="OrderConf-Loading">
        <div className="OrderConf-Spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="OrderConf-Container">
      <div className="OrderConf-Success-Icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <h1 className="OrderConf-Title">Order Confirmed!</h1>
      <p className="OrderConf-Subtitle">
        Thank you for your order. We've sent a confirmation email to <strong>{order.shippingAddress.email}</strong>
      </p>

      <div className="OrderConf-Number">
        Order Number: <strong>{order.orderNumber}</strong>
      </div>

      <div className="OrderConf-Content">
        <div className="OrderConf-Section">
          <h2>Order Details</h2>
          <div className="OrderConf-Items">
            {order.items.map((item, index) => (
              <div key={index} className="OrderConf-Item">
                <img src={item.image} alt={item.name} />
                <div className="OrderConf-Item-Info">
                  <h4>{item.name}</h4>
                  <p>
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' | '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="OrderConf-Item-Price">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="OrderConf-Section">
          <h2>Shipping Address</h2>
          <div className="OrderConf-Address">
            <p><strong>{order.shippingAddress.fullName}</strong></p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="OrderConf-Section">
          <h2>Payment Summary</h2>
          <div className="OrderConf-Summary">
            <div className="OrderConf-Summary-Row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(0)}</span>
            </div>
            <div className="OrderConf-Summary-Row">
              <span>Tax (GST 18%)</span>
              <span>₹{order.tax.toFixed(0)}</span>
            </div>
            <div className="OrderConf-Summary-Row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="OrderConf-Summary-Total">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(0)}</span>
            </div>
            <div className="OrderConf-Payment-Method">
              Payment Method: <strong>{order.paymentMethod}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="OrderConf-Actions">
        <button className="OrderConf-Primary-Btn" onClick={() => navigate('/orders')}>
          View My Orders
        </button>
        <button className="OrderConf-Secondary-Btn" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;