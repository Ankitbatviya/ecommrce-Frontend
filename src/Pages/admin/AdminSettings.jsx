import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminSettings.css';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    siteName: 'My Store',
    currency: '₹',
    taxRate: 18,
    shippingCost: 0,
    minOrderAmount: 0,
    storeEmail: 'admin@mystore.com',
    storePhone: '+91 9876543210',
    maintenanceMode: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      siteName: 'My Store',
      currency: '₹',
      taxRate: 18,
      shippingCost: 0,
      minOrderAmount: 0,
      storeEmail: 'admin@mystore.com',
      storePhone: '+91 9876543210',
      maintenanceMode: false
    });
    toast.info('Settings reset to default');
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="admin-settings">
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
          <h1>System Settings</h1>
          <p>Configure your store settings</p>
        </div>
      </header>

      {/* Settings Grid */}
      <div className="settings-container">
        {/* General Settings */}
        <div className="settings-card">
          <h2>General Settings</h2>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              placeholder="Enter store name"
            />
          </div>
          
          <div className="form-group">
            <label>Currency Symbol</label>
            <input
              type="text"
              name="currency"
              value={settings.currency}
              onChange={handleInputChange}
              maxLength="3"
              placeholder="₹"
            />
          </div>
          
          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleInputChange}
              min="0"
              max="100"
              placeholder="18"
            />
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="settings-card">
          <h2>Shipping Settings</h2>
          <div className="form-group">
            <label>Shipping Cost (₹)</label>
            <input
              type="number"
              name="shippingCost"
              value={settings.shippingCost}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
            />
          </div>
          
          <div className="form-group">
            <label>Minimum Order Amount (₹)</label>
            <input
              type="number"
              name="minOrderAmount"
              value={settings.minOrderAmount}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="settings-card">
          <h2>Contact Information</h2>
          <div className="form-group">
            <label>Store Email</label>
            <input
              type="email"
              name="storeEmail"
              value={settings.storeEmail}
              onChange={handleInputChange}
              placeholder="admin@store.com"
            />
          </div>
          
          <div className="form-group">
            <label>Store Phone</label>
            <input
              type="tel"
              name="storePhone"
              value={settings.storePhone}
              onChange={handleInputChange}
              placeholder="+91 1234567890"
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-card">
          <h2>System Settings</h2>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleInputChange}
            />
            <label htmlFor="maintenanceMode">Enable Maintenance Mode</label>
          </div>
          <p className="help-text">When enabled, the store will display a maintenance message to visitors.</p>
          
          <div className="form-group">
            <button
              className="btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all cache?')) {
                  toast.success('Cache cleared successfully!');
                }
              }}
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button className="btn-secondary" onClick={handleReset}>
          Reset to Default
        </button>
        <button className="btn-primary" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;