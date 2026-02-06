import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../Stylesheet/Auth/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/forgot-password', {
        email: email
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success('Password reset link sent to your email!');
      } else {
        toast.error(response.data.message || 'Failed to send reset link');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        toast.error('No response from server. Check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <Link to="/login" className="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Login
            </Link>
            <h1>Reset Your Password</h1>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending Reset Link...
                  </>
                ) : 'Send Reset Link'}
              </button>

              <div className="form-footer">
                <p>
                  Remember your password?{' '}
                  <Link to="/login" className="login-link">Back to Login</Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="email-sent-message">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>Check Your Email</h2>
              <p className="email-sent-text">
                We've sent a password reset link to:
                <strong>{email}</strong>
              </p>
              <p className="instruction-text">
                Click the link in the email to reset your password. The link will expire in 15 minutes.
              </p>
              
              <div className="email-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setEmailSent(false)}
                >
                  Try another email
                </button>
                <Link to="/login" className="btn-primary">
                  Back to Login
                </Link>
              </div>

              <div className="email-tips">
                <h3>Didn't receive the email?</h3>
                <ul>
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Try requesting a new reset link</li>
                  <li>Contact support if you continue to have issues</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;