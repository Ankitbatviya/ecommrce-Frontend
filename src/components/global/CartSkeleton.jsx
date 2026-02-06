// CartSkeleton.jsx
import React from 'react';
import '../../Stylesheet/Global/CartSkeleton.css'; // We'll create this CSS file

const CartSkeleton = () => {
  return (
    <div className="cart-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-count"></div>
      </div>
      
      <div className="skeleton-cart-container">
        {/* Cart Items Skeleton */}
        <div className="skeleton-items-section">
          <div className="skeleton-items-header">
            <div className="skeleton-header-item"></div>
            <div className="skeleton-header-item"></div>
            <div className="skeleton-header-item"></div>
          </div>
          
          {/* Cart Item Skeletons */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton-cart-item">
              <div className="skeleton-item-image"></div>
              <div className="skeleton-item-details">
                <div className="skeleton-item-name"></div>
                <div className="skeleton-item-category"></div>
                <div className="skeleton-item-options">
                  <div className="skeleton-option"></div>
                  <div className="skeleton-option"></div>
                </div>
                <div className="skeleton-item-price"></div>
              </div>
              <div className="skeleton-item-quantity">
                <div className="skeleton-quantity-control"></div>
              </div>
              <div className="skeleton-item-total">
                <div className="skeleton-total-price"></div>
              </div>
              <div className="skeleton-item-remove"></div>
            </div>
          ))}
        </div>
        
        {/* Cart Summary Skeleton */}
        <div className="skeleton-summary-section">
          <div className="skeleton-summary-card">
            <div className="skeleton-summary-title"></div>
            <div className="skeleton-summary-row">
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
            <div className="skeleton-summary-row">
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
            <div className="skeleton-summary-row">
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
            <div className="skeleton-divider"></div>
            <div className="skeleton-total-row">
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
            <div className="skeleton-checkout-btn"></div>
            <div className="skeleton-continue-shopping"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;