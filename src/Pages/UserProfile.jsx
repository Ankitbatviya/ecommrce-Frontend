import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../Stylesheet/User/UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    Fullname: '',
    Email: '',
    Role: '',
    CreatedAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    brand: '',
    category: 'Apparel',
    gender: 'Unisex',
    price: '',
    discount: '0',
    sizes: [],
    colors: [],
    stock: '',
    images: ['']
  });
  const [orderFilter, setOrderFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (userData.Role === 'partner' && activeTab === 'products') {
      fetchPartnerProducts();
    }
  }, [activeTab, userData.Role]);

  useEffect(() => {
    if (orders.length > 0) {
      filterOrdersByStatus(orderFilter);
    }
  }, [orders, orderFilter]);

  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get('authToken');
      
      const response = await axios.get('http://localhost:8000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        Cookies.remove('authToken');
        Cookies.remove('userRole');
        Cookies.remove('userInfo');
        navigate('/login');
      } else {
        toast.error('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        console.log('Orders fetched:', response.data.data);
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status !== 404) {
        toast.error('Failed to load orders. Please try again.');
      }
    }
  };

  const fetchPartnerProducts = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/products/partner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPartnerProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching partner products:', error);
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        toast.error('Failed to load products');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('authToken');
      
      // Validate required fields
      if (!newProduct.name || !newProduct.description || !newProduct.brand || !newProduct.price || !newProduct.stock) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Prepare product data
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        brand: newProduct.brand.trim(),
        category: newProduct.category,
        gender: newProduct.gender,
        price: parseFloat(newProduct.price),
        discount: parseFloat(newProduct.discount) || 0,
        stock: parseInt(newProduct.stock, 10),
        sizes: newProduct.sizes.filter(size => size.trim()).map(size => size.trim()),
        colors: newProduct.colors.filter(color => color.trim()).map(color => color.trim()),
        images: newProduct.images.filter(img => img.trim()).map(img => img.trim())
      };

      // Validate images
      if (productData.images.length === 0) {
        toast.error('At least one image URL is required');
        return;
      }

      // Validate sizes based on category
      const categorySizes = {
        Apparel: ["XS", "S", "M", "L", "XL", "XXL"],
        Footwear: ["6", "7", "8", "9", "10", "11", "12"],
        Accessories: ["S", "M", "L"],
        Electronics: []
      };

      const allowedSizes = categorySizes[productData.category] || [];
      if (productData.sizes.length > 0) {
        const invalidSizes = productData.sizes.filter(size => !allowedSizes.includes(size));
        if (invalidSizes.length > 0) {
          toast.error(`Invalid sizes for ${productData.category} category: ${invalidSizes.join(', ')}`);
          return;
        }
      }

      console.log('Sending product data:', productData);

      const response = await axios.post(
        'http://localhost:8000/api/products/partner',
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Product added successfully!');
        setShowAddProduct(false);
        resetProductForm();
        fetchPartnerProducts();
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.response.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Failed to add product. Please try again.');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      brand: '',
      category: 'Apparel',
      gender: 'Unisex',
      price: '',
      discount: '0',
      sizes: [],
      colors: [],
      stock: '',
      images: ['']
    });
  };

  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.orderStatus?.toLowerCase().includes(status.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.put(
          `http://localhost:8000/api/orders/${orderId}/cancel`,
          { reason: "Cancelled by user" },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          toast.success('Order cancelled successfully');
          fetchUserOrders();
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'processing';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending')) return 'pending';
    if (statusLower.includes('processing')) return 'processing';
    if (statusLower.includes('shipped')) return 'shipped';
    if (statusLower.includes('delivered')) return 'delivered';
    if (statusLower.includes('cancelled')) return 'cancelled';
    return 'processing';
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'partner': return 'Partner';
      default: return 'Customer';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your profile and activities</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-summary">
            <div className="user-avatar-large">
              {userData.Fullname?.charAt(0) || 'U'}
            </div>
            <div className="user-info-summary">
              <h3>{userData.Fullname || 'User'}</h3>
              <p className="user-email">{userData.Email || 'No email'}</p>
              <span className={`user-role-badge ${userData.Role}`}>
                {getRoleDisplay(userData.Role)}
              </span>
              <p className="member-since">
                Member since {formatDate(userData.CreatedAt)}
              </p>
            </div>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile Information
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
              </svg>
              My Orders ({orders.length})
            </button>

            {/* Partner-specific navigation */}
            {userData.Role === 'partner' && (
              <button 
                className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                My Products ({partnerProducts.length})
              </button>
            )}

            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Security
            </button>

            {/* Admin/Partner Panel */}
            {(userData.Role === 'admin' || userData.Role === 'partner') && (
              <div className="admin-section">
                <div className="section-title">Control Panel</div>
                {userData.Role === 'admin' && (
                  <button 
                    className="nav-item admin-nav"
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                    Admin Dashboard
                  </button>
                )}
                {userData.Role === 'partner' && (
                  <button 
                    className="nav-item admin-nav"
                    onClick={() => setShowAddProduct(true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add New Product
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Profile Information</h2>
              
              <div className="profile-card">
                <div className="info-row">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">{userData.Fullname || 'Not available'}</div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Email Address</div>
                  <div className="info-value">{userData.Email || 'Not available'}</div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Account Type</div>
                  <div className="info-value">
                    <span className={`role-display ${userData.Role}`}>
                      {getRoleDisplay(userData.Role)}
                    </span>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">Member Since</div>
                  <div className="info-value">{formatDate(userData.CreatedAt)}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="tab-header">
                <h2>My Orders ({orders.length})</h2>
                <div className="order-filters">
                  <select 
                    className="filter-select"
                    value={orderFilter}
                    onChange={(e) => {
                      setOrderFilter(e.target.value);
                      filterOrdersByStatus(e.target.value);
                    }}
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="empty-orders">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {orderFilter === 'all' ? (
                    <>
                      <h3>No orders yet</h3>
                      <p>Start shopping to see your orders here</p>
                      <button 
                        className="btn-primary"
                        onClick={() => navigate('/products')}
                      >
                        Start Shopping
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>No {orderFilter} orders</h3>
                      <p>You don't have any {orderFilter} orders at the moment</p>
                      <button 
                        className="btn-outline"
                        onClick={() => setOrderFilter('all')}
                      >
                        View All Orders
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => {
                    // Calculate item count
                    const itemCount = order.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
                    
                    return (
                      <div key={order._id || order.orderNumber} className="order-card">
                        <div className="order-header">
                          <div>
                            <h4>Order #{order.orderNumber || order._id?.substring(18, 24) || 'N/A'}</h4>
                            <p className="order-date">
                              {formatDate(order.createdAt || order.orderDate)}
                            </p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                              {order.orderStatus || 'Processing'}
                            </span>
                            <span className="payment-info">
                              {order.paymentMethod || 'COD'} • {order.paymentStatus || 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-body">
                          <div className="order-items">
                            {order.items?.slice(0, 3).map((item, index) => (
                              <div key={index} className="order-item">
                                <div className="item-image">
                                  {item.image || (item.product?.images?.[0]) ? (
                                    <img 
                                      src={item.image || item.product?.images[0]} 
                                      alt={item.name || item.product?.name} 
                                    />
                                  ) : (
                                    <div className="image-placeholder"></div>
                                  )}
                                </div>
                                <div className="item-details">
                                  <h5>{item.name || item.product?.name || 'Product'}</h5>
                                  <div className="item-info">
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.color && <span>Color: {item.color}</span>}
                                    <span>Qty: {item.quantity || 1}</span>
                                  </div>
                                </div>
                                <div className="item-price">₹{item.price || 0}</div>
                              </div>
                            ))}
                          </div>
                          
                          {order.items?.length > 3 && (
                            <div className="more-items">
                              <p>+{order.items.length - 3} more items</p>
                            </div>
                          )}
                          
                          <div className="order-summary">
                            <div className="summary-row">
                              <span>Items ({itemCount})</span>
                              <span>₹{order.subtotal || 0}</span>
                            </div>
                            {order.tax > 0 && (
                              <div className="summary-row">
                                <span>Tax (GST)</span>
                                <span>₹{order.tax || 0}</span>
                              </div>
                            )}
                            {order.shippingCharge > 0 ? (
                              <div className="summary-row">
                                <span>Shipping</span>
                                <span>₹{order.shippingCharge || 0}</span>
                              </div>
                            ) : (
                              <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                              </div>
                            )}
                            <div className="summary-row total">
                              <span>Order Total</span>
                              <strong>₹{order.totalAmount || 0}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="order-footer">
                          <div className="shipping-info">
                            <span className="shipping-label">Shipping to:</span>
                            <span className="shipping-address">
                              {order.shippingAddress?.address || 'Address not available'}, 
                              {order.shippingAddress?.city || ''}
                            </span>
                          </div>
                          <div className="order-actions">
                            {order.orderStatus?.toLowerCase() === 'pending' && (
                              <button 
                                className="btn-outline btn-danger"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel Order
                              </button>
                            )}
                            <button 
                              className="btn-primary"
                              onClick={() => navigate(`/order/${order._id}`)}
                            >
                              View Details
                            </button>
                            <button className="btn-outline">
                              Track Order
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Partner Products Tab */}
          {activeTab === 'products' && userData.Role === 'partner' && (
            <div className="products-tab">
              <div className="tab-header">
                <h2>My Products ({partnerProducts.length})</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddProduct(true)}
                >
                  + Add New Product
                </button>
              </div>
              
              {partnerProducts.length === 0 ? (
                <div className="empty-products">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <h3>No products yet</h3>
                  <p>Start by adding your first product</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddProduct(true)}
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {partnerProducts.map((product) => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="image-placeholder"></div>
                        )}
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-brand">{product.brand}</p>
                        <div className="product-category">
                          <span className="category-badge">{product.category}</span>
                          <span className="gender-badge">{product.gender}</span>
                        </div>
                        <div className="product-price">
                          <span className="price">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="discount">{product.discount}% OFF</span>
                          )}
                        </div>
                        <div className="product-stock">
                          <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {product.stock} in stock
                          </span>
                        </div>
                        <div className="product-actions">
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-tab">
              <h2>Security Settings</h2>
              
              <div className="security-card">
                <div className="security-section">
                  <h3>Change Password</h3>
                  <p>Update your password to keep your account secure</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Change Password
                  </button>
                </div>
                
                <div className="security-section">
                  <h3>Login Activity</h3>
                  <p>Review recent login activity on your account</p>
                  <button className="btn-secondary">View Activity</button>
                </div>
                
                <div className="security-section">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowAddProduct(false);
            resetProductForm();
          }
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddProduct(false);
                  resetProductForm();
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    required
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({...newProduct, gender: e.target.value})}
                    required
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                    min="0"
                    max="90"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={newProduct.sizes.join(', ')}
                    onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div className="form-group">
                  <label>Colors (comma separated)</label>
                  <input
                    type="text"
                    value={newProduct.colors.join(', ')}
                    onChange={(e) => setNewProduct({...newProduct, colors: e.target.value.split(',').map(c => c.trim())})}
                    placeholder="Red, Blue, Green"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                    rows="4"
                    placeholder="Enter detailed product description..."
                    minLength="20"
                  />
                  <small className="char-count">
                    Minimum 20 characters required
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>Image URLs (one per line) *</label>
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="image-input-group">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...newProduct.images];
                          newImages[index] = e.target.value;
                          setNewProduct({...newProduct, images: newImages});
                        }}
                        placeholder="https://example.com/image.jpg"
                        required={index === 0}
                      />
                      {newProduct.images.length > 1 && (
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            const newImages = newProduct.images.filter((_, i) => i !== index);
                            setNewProduct({...newProduct, images: newImages});
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-image-btn"
                    onClick={() => setNewProduct({...newProduct, images: [...newProduct.images, '']})}
                  >
                    + Add Another Image
                  </button>
                  <small className="image-note">
                    First image will be used as the main product image
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddProduct(false);
                    resetProductForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;