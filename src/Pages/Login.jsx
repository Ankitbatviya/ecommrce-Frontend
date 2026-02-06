// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import '../Stylesheet/Login/loginPage.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Set cookie expiration
        const expiresInDays = formData.rememberMe ? 7 : 1;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);

        // Store authentication data
        Cookies.set('authToken', response.data.token, {
          expires: expirationDate,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });

        Cookies.set('userInfo', JSON.stringify(response.data.user), {
          expires: expirationDate,
          path: '/'
        });

        Cookies.set('userRole', response.data.user.role, {
          expires: expirationDate,
          path: '/'
        });

        toast.success(`Welcome back, ${response.data.user.fullname}!`, {
          autoClose: 1500
        });

        // Clear form
        setFormData({
          email: '',
          password: '',
          rememberMe: false,
        });

        // Redirect based on role
        setTimeout(() => {
          window.location.href = response.data.redirectTo;
        }, 1500);

      } else {
        toast.error(response.data.message || 'Login failed');
      }
      
    } catch (err) {
      let errorMessage = 'An error occurred during login';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Validation error';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if email is ankitbatviya94@gmail.com to show admin hint
  const isAdminEmail = formData.email.toLowerCase() === 'ankitbatviya94@gmail.com';

  return (
    <main className="login-container">
      <button className="nav-back-btn" onClick={() => window.history.back()}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Return
      </button>

      <div className="login-split-layout">
        {/* Visual Panel */}
        <section className="login-visual-panel">
          <div className="visual-overlay">
            <span className="brand-label-alt">Welcome Back</span>
            <h2 className="visual-title">
              {isAdminEmail ? 'Admin Access' : 'Continue your journey'}
            </h2>
            {isAdminEmail && (
              <p className="admin-hint">Admin privileges will be granted</p>
            )}
          </div>
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" 
            alt="Login Aesthetic" 
            className="visual-img"
          />
        </section>

        {/* Content Panel */}
        <section className="login-content-panel">
          <div className="form-wrapper">
            <header className="form-header">
              <span className="brand-label">Member Login</span>
              <h1 className="main-title">Sign In</h1>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkbox-text">Remember me for 7 days</span>
                </label>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              {isAdminEmail && (
                <div className="admin-notice">
                  <span className="admin-badge">Admin Account</span>
                  <p className="admin-notice-text">
                    This email will grant administrative privileges
                  </p>
                </div>
              )}

              <div className="button-stack">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => window.location.href='/signup'}
                  disabled={loading}
                >
                  New here? Create Account
                </button>
              </div>
            </form>

            <footer className="form-footer">
              <p>Secure Login • Protected Connection • Role-based Access</p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;