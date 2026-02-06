// SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import '../Stylesheet/Login//LoginPage.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      toast.warning("Please agree to the Terms & Conditions");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Make API request to backend
      const response = await axios.post('http://localhost:8000/api/users/register', {
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // Handle successful registration
      if (response.data.success) {
        // Store token and user info in cookies
        const cookieOptions = {
          expires: 7, // 7 days
          secure: true, // Use HTTPS in production
          sameSite: 'strict',
          path: '/'
        };
        
        Cookies.set('authToken', response.data.token, cookieOptions);
        Cookies.set('userInfo', JSON.stringify(response.data.user), cookieOptions);

        toast.success('Registration successful! Redirecting...', {
          autoClose: 2000
        });

        // Clear form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false,
        });
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/'; // Change to your desired route
        }, 2000);
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data.message || 'Registration failed';
        
        if (err.response.status === 400 && errorMessage.includes('already')) {
          toast.error('Email already registered! Please login instead.');
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        // Request made but no response
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="visual-overlay-signup" >
            <span className="brand-label-alt">Join Us</span>
            <h2 className="visual-title">Start your<br />journey here.</h2>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
            alt="Sign Up Aesthetic" 
            className="visual-img"
          />
        </section>

        {/* Content Panel */}
        <section className="login-content-panel">
          <div className="form-wrapper">
            <header className="form-header">
              <span className="brand-label">New Member</span>
              <h1 className="main-title">Create Account</h1>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

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

              {/* Password Row for tighter vertical space */}
              <div className="input-row">
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
                    minLength="6"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength="6"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span className="checkbox-text">I agree to the Terms & Conditions</span>
                </label>
              </div>

              <div className="button-stack">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => window.location.href='/login'}
                  disabled={loading}
                >
                  Already a member? Sign In
                </button>
              </div>
            </form>

            <footer className="form-footer">
              <p>Secure Membership Registration</p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUp;