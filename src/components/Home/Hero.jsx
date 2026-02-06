import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Stylesheet/Home/Hero.css'
import BobShape from '../../assets/blob-haikei.svg'

function Hero() {
  const navigate = useNavigate();

  return (
    <main className="hero-section">
      {/* Decorative Watermark */}
      <div className="bg-watermark">2026</div>

      <div className="hero-wrapper">
        <div className="hero-text-side">
          <div className="hero-tagline">
            <span className="line"></span>
            PREMIUM APPAREL
          </div>
          
          <h1 className="hero-heading">
            ESSENTIAL <br />
            <span className="italic-gold">COLLECTION</span>
          </h1>

          <p className="hero-desc">
            Curating timeless elegance for the modern individual. 
            Elevate your everyday wardrobe with our hand-picked pieces.
          </p>

          <div className="hero-btns">
            <button className="cta-primary" onClick={() => navigate("/products")}>
              EXPLORE SHOP
            </button>
            <button className="cta-link" onClick={() => navigate("/about")}>
              OUR STORY —
            </button>
          </div>
        </div>


      </div>

      {/* Trust Bar - Now scrolls horizontally on mobile if needed */}
      <div className="hero-footer">
        <div className="stat-item"><span>100%</span> Organic Cotton</div>
        <div className="stat-item"><span>FREE</span> Global Shipping</div>
        <div className="stat-item"><span>24/7</span> Style Support</div>
      </div>
    </main>
  );
}

export default Hero;