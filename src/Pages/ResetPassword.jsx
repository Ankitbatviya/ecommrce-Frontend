// Pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import '../Stylesheet/Auth/ForgotPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/auth/reset-password/${token}`);
      
      if (response.data.success) {
        setTokenValid(true);
        setEmail(response.data.email);
      } else {
        setTokenValid(false);
        toast.error('Invalid or expired reset link');
      }
    } catch (error) {
      setTokenValid(false);
      if (error.response?.status === 400) {
        toast.error('Invalid or expired reset link');
      } else {
        toast.error('Failed to validate reset link');
      }
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/reset-password', {
        token: token,
        password: password
      });

      if (response.data.success) {
        // Store authentication data
        Cookies.set('authToken', response.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });

        Cookies.set('userInfo', JSON.stringify(response.data.user), {
          expires: 7,
          path: '/'
        });

        Cookies.set('userRole', response.data.user.role, {
          expires: 7,
          path: '/'
        });

        toast.success('Password reset successful! You are now logged in.');
        
        // Redirect to home
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to reset password');
      } else if (error.request) {
        toast.error('No response from server. Check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="loading-validation">
            <div className="spinner"></div>
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="invalid-token">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2>Invalid or Expired Link</h2>
            <p>The password reset link is invalid or has expired.</p>
            <p>Please request a new reset link.</p>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="btn-primary"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Set New Password</h1>
          <p>Create a new password for your account</p>
          <p className="reset-email">Resetting password for: <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
            <div className="password-requirements">
              <p>Password must be at least 6 characters long</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
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
                Resetting Password...
              </>
            ) : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;