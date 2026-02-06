// Pages/TermsConditions.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Stylesheet/Legal/TermsConditions.css';

const TermsConditions = () => {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(type || 'terms');
  const [termsContent, setTermsContent] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'terms', title: 'Terms of Service', description: 'Our terms and conditions' },
    { id: 'privacy', title: 'Privacy Policy', description: 'How we handle your data' },
    { id: 'shipping', title: 'Shipping Policy', description: 'Delivery information' },
    { id: 'returns', title: 'Returns & Refunds', description: 'Return and refund policy' }
  ];

  // Handle direct policy routes and hash navigation
  useEffect(() => {
    const path = location.pathname;
    
    // Handle direct policy routes like /privacy-policy
    if (path === '/privacy-policy') {
      setActiveTab('privacy');
      navigate('/terms/privacy', { replace: true });
    } else if (path === '/shipping-policy') {
      setActiveTab('shipping');
      navigate('/terms/shipping', { replace: true });
    } else if (path === '/returns-policy') {
      setActiveTab('returns');
      navigate('/terms/returns', { replace: true });
    } else if (path === '/terms' && !type) {
      setActiveTab('terms');
      navigate('/terms/terms', { replace: true });
    } else if (location.hash) {
      const tabId = location.hash.replace('#', '');
      if (tabs.some(tab => tab.id === tabId)) {
        setActiveTab(tabId);
      }
    }
  }, [location.pathname, location.hash, type, navigate]);

  // Fetch terms when active tab changes
  useEffect(() => {
    fetchTerms(activeTab);
  }, [activeTab]);

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/terms/${tabId}`);
  };

  // Fetch terms from API - FIXED ENDPOINT
  const fetchTerms = async (tabId) => {
    setLoading(true);
    try {
      console.log(`Fetching terms for: ${tabId}`);
      const response = await axios.get(`http://localhost:8000/api/terms/${tabId}`, {
        timeout: 5000
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setTermsContent(prev => ({
          ...prev,
          [tabId]: response.data.data
        }));
      } else {
        // API returned success: false
        setTermsContent(prev => ({
          ...prev,
          [tabId]: null
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${tabId}:`, error);
      
      // Handle different error cases
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 404:
            setTermsContent(prev => ({
              ...prev,
              [tabId]: null
            }));
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error(`Failed to load ${tabId.replace('-', ' ')}`);
        }
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Failed to load ${tabId.replace('-', ' ')}`);
      }
      
      // Ensure content is set to null for 404
      if (error.response?.status === 404) {
        setTermsContent(prev => ({
          ...prev,
          [tabId]: null
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Format content with proper HTML
  const formatContent = (content) => {
    if (!content) return '';
    
    // Convert markdown-style headers to HTML
    let formatted = content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs if not already
    if (!formatted.includes('<h') && !formatted.includes('<p>')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
  };

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Legal Information</h1>
        <p>Important information about using our services</p>
      </div>

      <div className="terms-layout">
        {/* Sidebar Navigation */}
        <div className="terms-sidebar">
          <nav className="terms-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <div className="tab-icon">
                  {tab.id === 'terms' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  )}
                  {tab.id === 'privacy' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                  {tab.id === 'shipping' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="7" cy="7" r="2" />
                      <circle cx="17" cy="17" r="2" />
                      <path d="M9.5 6.5L12 3h8v8l-3.5 3.5" />
                      <path d="M14 14l-3.5 3.5" />
                      <path d="M9.5 6.5L6.5 9.5" />
                    </svg>
                  )}
                  {tab.id === 'returns' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 12.5V22H4V2h8.5" />
                      <polyline points="14 2 20 2 20 8" />
                      <path d="M12 12l4-4-4-4" />
                      <path d="M16 8H8" />
                      <circle cx="8" cy="16" r="2" />
                      <path d="M10 16c0-1.1.9-2 2-2s2 .9 2 2" />
                    </svg>
                  )}
                </div>
                <div className="tab-info">
                  <span className="tab-title">{tab.title}</span>
                  <span className="tab-desc">{tab.description}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="terms-content">
          {loading ? (
            <div className="terms-loading">
              <div className="spinner"></div>
              <p>Loading {tabs.find(t => t.id === activeTab)?.title}...</p>
            </div>
          ) : termsContent[activeTab] ? (
            <div className="terms-document">
              <div className="document-header">
                <h2>{termsContent[activeTab].title}</h2>
                <div className="document-meta">
                  <span className="version">Version {termsContent[activeTab].version || 1}</span>
                  <span className="last-updated">
                    Last updated: {formatDate(termsContent[activeTab].lastUpdated)}
                  </span>
                </div>
              </div>

              <div className="document-content">
                {/* Safely render HTML content */}
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: formatContent(termsContent[activeTab].content)
                  }} 
                />
              </div>

              <div className="document-footer">
                <p>
                  <strong>Note:</strong> By using our services, you agree to these terms.
                  Please review them carefully.
                </p>
                <p className="contact-info">
                  For questions about our policies, contact us at <strong>legal@essential.com</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="no-terms">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <h3>No {tabs.find(t => t.id === activeTab)?.title} Available</h3>
              <p>Check back soon for our {activeTab.replace('-', ' ')} policy.</p>
              <button 
                className="retry-btn"
                onClick={() => fetchTerms(activeTab)}
              >
                Retry Loading
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;