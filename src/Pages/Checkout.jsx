// Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { isAuthenticated } from '../utils/auth';
import '../Stylesheet/Checkout/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'COD',
    orderNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Please login to checkout');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      
      if (!response.data || response.data.items.length === 0) {
        toast.info('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCart(response.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes
      };

      const response = await orderService.createOrder(orderData);

      toast.success('Order placed successfully! 🎉', {
        autoClose: 3000,
      });

      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/order-confirmation/${response.data._id}`);
      }, 1500);

    } catch (err) {
      console.error('Order creation error:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="Checkout-Loading">
        <div className="Checkout-Spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.18;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="Checkout-Container">
      <div className="Checkout-Header">
        <button className="Checkout-BackBtn" onClick={() => navigate('/cart')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          <span>Back to Cart</span>
        </button>
        <h1 className="Checkout-Title">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="Checkout-Layout">
        <div className="Checkout-Form-Section">
          {/* Contact Information */}
          <div className="Checkout-Card">
            <h2 className="Checkout-Section-Title">Contact Information</h2>
            
            <div className="Checkout-Form-Grid">
              <div className="Checkout-Form-Group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="Checkout-Error">{errors.fullName}</span>}
              </div>

              <div className="Checkout-Form-Group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="Checkout-Error">{errors.phone}</span>}
              </div>

              <div className="Checkout-Form-Group full-width">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="Checkout-Error">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="Checkout-Card">
            <h2 className="Checkout-Section-Title">Shipping Address</h2>
            
            <div className="Checkout-Form-Grid">
              <div className="Checkout-Form-Group full-width">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="House No., Building Name"
                  className={errors.addressLine1 ? 'error' : ''}
                />
                {errors.addressLine1 && <span className="Checkout-Error">{errors.addressLine1}</span>}
              </div>

              <div className="Checkout-Form-Group full-width">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Street, Area, Landmark"
                />
              </div>

              <div className="Checkout-Form-Group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="Checkout-Error">{errors.city}</span>}
              </div>

              <div className="Checkout-Form-Group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="Checkout-Error">{errors.state}</span>}
              </div>

              <div className="Checkout-Form-Group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  maxLength="6"
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <span className="Checkout-Error">{errors.pincode}</span>}
              </div>

              <div className="Checkout-Form-Group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="Checkout-Card">
            <h2 className="Checkout-Section-Title">Payment Method</h2>
            
            <div className="Checkout-Payment-Options">
              <label className="Checkout-Payment-Option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                <span className="Checkout-Radio-Label">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when you receive</small>
                </span>
              </label>

              <label className="Checkout-Payment-Option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={handleChange}
                />
                <span className="Checkout-Radio-Label">
                  <strong>Credit/Debit Card</strong>
                  <small>Visa, Mastercard, Rupay</small>
                </span>
              </label>

              <label className="Checkout-Payment-Option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={handleChange}
                />
                <span className="Checkout-Radio-Label">
                  <strong>UPI</strong>
                  <small>GPay, PhonePe, Paytm</small>
                </span>
              </label>

              <label className="Checkout-Payment-Option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="NetBanking"
                  checked={formData.paymentMethod === 'NetBanking'}
                  onChange={handleChange}
                />
                <span className="Checkout-Radio-Label">
                  <strong>Net Banking</strong>
                  <small>All major banks</small>
                </span>
              </label>
            </div>
          </div>

          {/* Order Notes */}
          <div className="Checkout-Card">
            <h2 className="Checkout-Section-Title">Order Notes (Optional)</h2>
            <textarea
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Any special instructions for delivery?"
              rows="3"
              className="Checkout-Textarea"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="Checkout-Summary-Section">
          <div className="Checkout-Summary">
            <h2 className="Checkout-Summary-Title">Order Summary</h2>

            <div className="Checkout-Summary-Items">
              {cart.items.map((item) => (
                <div key={item._id} className="Checkout-Summary-Item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div className="Checkout-Item-Details">
                    <h4>{item.product.name}</h4>
                    <p>
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' | '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="Checkout-Item-Price">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>

            <div className="Checkout-Summary-Totals">
              <div className="Checkout-Summary-Row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="Checkout-Summary-Row">
                <span>Shipping</span>
                <span className="Checkout-Free">FREE</span>
              </div>
              <div className="Checkout-Summary-Row">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="Checkout-Summary-Divider"></div>
              <div className="Checkout-Summary-Total">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="Checkout-Submit-Btn"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className="Checkout-Security-Badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;