import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Logo from '../../assets/SVG/logo.svg';

function Footer() {
  return (
    <footer className="Footer">
      <div className="FooterTop">
        <div className="FooterBrand">
          <div className="NavBrand">
            <img src={Logo} alt="Brand Logo" className="BrandLogo" />
            <span className="BrandName">ESSENTIAL</span>
          </div>
          <p className="FooterMotto">
            Defining the future of timeless fashion through curated excellence and sustainable craft.
          </p>
          <div className="NewsletterBox">
            <input type="email" placeholder="Enter your email" className="NewsletterInput" />
            <button className="NewsletterBtn">JOIN</button>
          </div>
        </div>

        <div className="FooterLinks">
          <div className="LinkCol">
            <h5>COLLECTIONS</h5>
            <ul>
              <li><a href="#new">New Arrivals</a></li>
              <li><a href="#women">Women's Wear</a></li>
              <li><a href="#men">Men's Wear</a></li>
              <li><a href="#acc">Accessories</a></li>
            </ul>
          </div>
          <div className="LinkCol">
            <h5>COMPANY</h5>
            <ul>
              <li><Link to="/aboutus">Our Story</Link></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#stores">Boutiques</a></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="LinkCol">
            <h5>SUPPORT</h5>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns Info</a></li>
              <li><a href="#size">Size Guide</a></li>
            </ul>
          </div>
          
          {/* Add Legal Links Column */}
          <div className="LinkCol">
            <h5>LEGAL</h5>
            <ul>
              <li><Link to="/terms/terms">Terms of Service</Link></li>
              <li><Link to="/terms/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms/shipping">Shipping Policy</Link></li>
              <li><Link to="/terms/returns">Returns Policy</Link></li>
              <li><Link to="/terms/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="FooterBottom">
        <p>&copy; 2026 ESSENTIAL COLLECTION. ALL RIGHTS RESERVED.</p>
        <div className="LegalLinks">
          {/* Legal links at the bottom - commonly placed here */}
          <Link to="/terms/privacy">Privacy</Link>
          <span className="separator">|</span>
          <Link to="/terms/terms">Terms</Link>
          <span className="separator">|</span>
          <Link to="/terms/returns">Returns</Link>
          <span className="separator">|</span>
          <Link to="/terms/shipping">Shipping</Link>
        </div>
        <div className="SocialLinks">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TWITTER</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;