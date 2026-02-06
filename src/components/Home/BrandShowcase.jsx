import React from 'react';
import '../../Stylesheet/Home/BrandShowcase.css';

const categories = [
  {
    id: 1,
    type: "Apparel",
    description: "Premium tailored garments.",
    img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    logoText: "AP"
  },
  {
    id: 2,
    type: "Electronics",
    description: "Smart home technology.",
    img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    logoText: "EL"
  },
  {
    id: 3,
    type: "Footwear",
    description: "Handcrafted comfort.",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    logoText: "FW"
  },
  {
    id: 4,
    type: "Accessories",
    description: "The finishing touches.",
    img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80",
    logoText: "AC"
  }
];

function BrandShowcase() {
  return (
    <section className="HBS-container">
      <div className="HBS-header">
        <span className="HBS-label">The Essentials</span>
        <h2 className="HBS-title">Category Showcase</h2>
      </div>

      <div className="HBS-grid">
        {categories.map((item) => (
          <div key={item.id} className="HBS-card">
            <div className="HBS-image-wrapper">
              <img src={item.img} alt={item.type} className="HBS-image" />
              <div className="HBS-overlay-logo">
                <span className="LogoText">{item.logoText}</span>
              </div>
            </div>
            
            <div className="HBS-content">
              <div className="HBS-meta-row">
                <h4 className="HBS-brand-name">{item.type}</h4>
                <div className="HBS-arrow">↗</div>
              </div>
              <p className="HBS-category">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandShowcase;