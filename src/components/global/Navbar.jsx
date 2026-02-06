// components/global/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Logo from '../../assets/SVG/Logo.svg';
import '../../Stylesheet/Global/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes (e.g., login/logout)
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = () => {
    const token = Cookies.get('authToken');
    const user = Cookies.get('userInfo');
    
    if (token && user) {
      setIsAuthenticated(true);
      try {
        setUserInfo(JSON.parse(user));
      } catch (e) {
        setUserInfo(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  };

  // Helper to close menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
  };

  // Helper for navigation buttons
  const handleNav = (path) => {
    navigate(path);
    closeMenu();
  };

  // Logout handler
  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userInfo');
    Cookies.remove('userRole');
    
    setIsAuthenticated(false);
    setUserInfo(null);
    
    toast.success('Logged out successfully!');
    
    closeMenu();
    navigate('/');
  };

  // User dropdown toggle
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && 
          dropdownRef.current && 
          profileButtonRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !profileButtonRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Get role display text
  const getRoleDisplay = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'partner': return 'Partner';
      default: return 'Customer';
    }
  };

  // Get role color class
  const getRoleColorClass = (role) => {
    switch(role) {
      case 'admin': return 'admin';
      case 'partner': return 'partner';
      default: return 'user';
    }
  };

  return (
    <header className='Header'>
      <nav className='Nav'>
        <div className="NavBrand">
          <img 
            src={Logo} 
            alt="Brand Logo" 
            className="BrandLogo" 
            onClick={() => handleNav('/')} 
          />
          <span className="BrandName" onClick={() => handleNav('/')}>ESSENTIAL</span>
        </div>

        {/* Hamburger Menu Toggle */}
        <div 
          className={`MenuToggle ${isMenuOpen ? 'is-active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Links */}
        <ul className={`NavList ${isMenuOpen ? 'show-mobile' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          <li><Link to="/aboutus" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          
          {/* Mobile Only Actions */}
          <div className="mobile-only">
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {userInfo?.fullname?.charAt(0) || 'U'}
                  </div>
                  <div className="mobile-user-details">
                    <h4>{userInfo?.fullname || 'User'}</h4>
                    <span className={`mobile-user-role ${getRoleColorClass(userInfo?.role)}`}>
                      {getRoleDisplay(userInfo?.role)}
                    </span>
                  </div>
                </div>

                <div className="mobile-nav-section">
                  <button className='NavCartBtn' onClick={() => handleNav('/cart')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Cart
                  </button>
                  
                  <button className='mobile-nav-item' onClick={() => handleNav('/profile')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </button>
                  
                  <button className='mobile-nav-item' onClick={() => handleNav('/orders')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                    My Orders
                  </button>
                  

                  {userInfo?.role === 'admin' && (
                    <div className="mobile-admin-section">
                      <div className="mobile-section-title">Admin Panel</div>
                      <button className='mobile-nav-item admin-item' onClick={() => handleNav('/admin/dashboard')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Dashboard
                      </button>
                      <button className='mobile-nav-item admin-item' onClick={() => handleNav('/admin/products')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        Manage Products
                      </button>
                      <button className='mobile-nav-item admin-item' onClick={() => handleNav('/admin/users')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Manage Users
                      </button>
                    </div>
                  )}

                  <div className="mobile-divider"></div>
                  
                  <button className='NavLogoutBtn' onClick={handleLogout}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-actions">
                <button className='NavCartBtn' onClick={() => handleNav('/cart')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Cart
                </button>
                <button className='NavLoginBtn' onClick={() => handleNav('/login')}>Login</button>
                <button className='NavSignUpBtn' onClick={() => handleNav('/signup')}>Sign Up</button>
              </div>
            )}
          </div>
        </ul>

        {/* Action buttons for Desktop */}
        <div className="NavActions desktop-only">
          <button className='NavCartBtn' onClick={() => handleNav('/cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Cart
          </button>
          
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button 
                ref={profileButtonRef}
                className="user-profile-btn" 
                onClick={toggleUserDropdown}
                aria-label="User menu"
                aria-expanded={showUserDropdown}
              >
                <div className="user-avatar">
                  {userInfo?.fullname?.charAt(0) || 'U'}
                </div>
                <span className="user-name">{userInfo?.fullname?.split(' ')[0] || 'User'}</span>
                <svg 
                  className={`dropdown-arrow ${showUserDropdown ? 'rotated' : ''}`} 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              {showUserDropdown && (
                <div className="user-dropdown-menu" ref={dropdownRef}>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userInfo?.fullname?.charAt(0) || 'U'}
                    </div>
                    <div className="dropdown-user-name">{userInfo?.fullname || 'User'}</div>
                    <div className="dropdown-user-email">{userInfo?.email || 'user@example.com'}</div>
                    <span className={`dropdown-user-role ${getRoleColorClass(userInfo?.role)}`}>
                      {getRoleDisplay(userInfo?.role)}
                    </span>
                  </div>

                  <div className="dropdown-section-title">Account</div>
                  
                  <button className="dropdown-item" onClick={() => handleNav('/profile')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </button>
                  
                  <button className="dropdown-item" onClick={() => handleNav('/orders')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                    My Orders
                  </button>
                  


                  {userInfo?.role === 'admin' && (
                    <>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-section-title">Admin</div>
                      
                      <button className="dropdown-item admin-item" onClick={() => handleNav('/admin/dashboard')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Dashboard
                      </button>
                      
                      <button className="dropdown-item admin-item" onClick={() => handleNav('/admin/products')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        Manage Products
                      </button>
                      
                      <button className="dropdown-item admin-item" onClick={() => handleNav('/admin/users')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Manage Users
                      </button>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className='NavLoginBtn' onClick={() => handleNav('/login')}>Login</button>
              <button className='NavSignUpBtn' onClick={() => handleNav('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;