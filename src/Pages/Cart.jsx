// Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { isAuthenticated } from '../utils/auth';
import '../Stylesheet/Cart/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Please login to view your cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
      const errorMessage = err.message || 'Failed to load cart';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      
      const response = await cartService.updateCartItem(itemId, newQuantity);
      setCart(response.data);
      toast.success('Quantity updated', {
        autoClose: 1500,
      });
    } catch (err) {
      console.error('Update quantity error:', err);
      const errorMessage = err.message || 'Failed to update quantity';
      toast.error(errorMessage);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    try {
      const response = await cartService.removeFromCart(productId, size, color);
      setCart(response.data);
      toast.success('Item removed from cart', {
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Remove item error:', err);
      const errorMessage = err.message || 'Failed to remove item';
      toast.error(errorMessage);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
      toast.success('Cart cleared successfully', {
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Clear cart error:', err);
      const errorMessage = err.message || 'Failed to clear cart';
      toast.error(errorMessage);
    }
  };

  const handleCheckout = () => {
    if (cart?.items?.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    toast.info('Redirecting to checkout...', {
      autoClose: 1000,
    });
    setTimeout(() => navigate('/checkout'), 1000);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="Cart-Loading">
        <div className="Cart-Spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Cart-Error">
        <div className="Cart-Error-Icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2>Error Loading Cart</h2>
        <p>{error}</p>
        <button onClick={fetchCart} className="Cart-Retry-Btn">
          Try Again
        </button>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="Cart-Container">
      <div className="Cart-Header">
        <button className="Cart-BackBtn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          <span>Back</span>
        </button>
        <h1 className="Cart-Title">Shopping Bag</h1>
        {!isEmpty && (
          <button className="Cart-Clear-Btn" onClick={handleClearCart}>
            Clear All
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="Cart-Empty">
          <div className="Cart-Empty-Icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Your bag is empty</h2>
          <p>Add items you love to get started</p>
          <button className="Cart-Shop-Btn" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="Cart-Layout">
          <div className="Cart-Items-Section">
            <div className="Cart-Items-Header">
              <span>Item</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            {cart.items.map((item) => (
              <div key={item._id} className="Cart-Item">
                <div className="Cart-Item-Image">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    onClick={() => navigate(`/product?id=${item.product._id}`)}
                  />
                </div>

                <div className="Cart-Item-Details">
                  <h3 
                    className="Cart-Item-Name"
                    onClick={() => navigate(`/product?id=${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="Cart-Item-Brand">{item.product.brand}</p>
                  
                  <div className="Cart-Item-Attributes">
                    {item.size && (
                      <span className="Cart-Item-Attr">Size: {item.size}</span>
                    )}
                    {item.color && (
                      <span className="Cart-Item-Attr">
                        Color: 
                        <span 
                          className="Cart-Color-Dot" 
                          style={{ backgroundColor: item.color.toLowerCase() }}
                        ></span>
                        {item.color}
                      </span>
                    )}
                  </div>

                  <button 
                    className="Cart-Item-Remove"
                    onClick={() => handleRemoveItem(item.product._id, item.size, item.color)}
                  >
                    Remove
                  </button>
                </div>

                <div className="Cart-Item-Price">
                  ₹{item.price.toFixed(0)}
                </div>

                <div className="Cart-Item-Quantity">
                  <div className="Cart-Qty-Selector">
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems[item._id]}
                    >
                      −
                    </button>
                    <span>{updatingItems[item._id] ? '...' : item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || updatingItems[item._id]}
                    >
                      +
                    </button>
                  </div>
                  {item.product.stock < 5 && (
                    <span className="Cart-Stock-Warning">
                      Only {item.product.stock} left
                    </span>
                  )}
                </div>

                <div className="Cart-Item-Total">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          <div className="Cart-Summary-Section">
            <div className="Cart-Summary">
              <h2 className="Cart-Summary-Title">Order Summary</h2>

              <div className="Cart-Summary-Row">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>₹{cart.totalPrice.toFixed(0)}</span>
              </div>

              <div className="Cart-Summary-Row">
                <span>Shipping</span>
                <span className="Cart-Free">FREE</span>
              </div>

              <div className="Cart-Summary-Row">
                <span>Tax (Estimated)</span>
                <span>₹{(cart.totalPrice * 0.18).toFixed(0)}</span>
              </div>

              <div className="Cart-Summary-Divider"></div>

              <div className="Cart-Summary-Total">
                <span>Total</span>
                <span>₹{(cart.totalPrice * 1.18).toFixed(0)}</span>
              </div>

              <button className="Cart-Checkout-Btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button className="Cart-Continue-Btn" onClick={handleContinueShopping}>
                Continue Shopping
              </button>

              <div className="Cart-Summary-Features">
                <p>✓ Secured Payment</p>
                <p>✓ Free Shipping</p>
                <p>✓ Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;