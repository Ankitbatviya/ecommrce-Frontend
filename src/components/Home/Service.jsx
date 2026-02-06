import React from 'react';
import crown from '../../assets/SVG/Crown.svg';
import { useNavigate } from 'react-router-dom';
import '../../Stylesheet/Home/Service.css';

function Service() {
    const navigate = useNavigate();
    return (
        /* Unique namespace class added here */
        <div className='couture-service-section'>
            <div className="service-wrapper">

                {/* Left Side: Full height visual */}
                <div className="service-left-full">
                    <div className="left-content">
                        <span className="service-label-tag">New Season</span>
                        <h2 className="service-main-title">High-End<br />Couture</h2>
                        <button className="service-ghost-btn" onClick={()=> navigate("/contact")}>Explore Lookbook</button>
                    </div>
                </div>

                {/* Right Side: Stacked boxes */}
                <div className="service-right-stack">

                    {/* Top Box: Brand Identity */}
                    <div className="brand-header-box">
                        <img src={crown} alt="Crown" className='service-crown-icon' />
                        <div className="service-text-content">
                            <h3 className="service-sub-heading">Premium Brands</h3>
                            <p className="service-para-text">Curating the world’s finest fabrics and most iconic labels just for you.</p>
                        </div>
                    </div>

                    {/* Bottom Box: Contact/Connect */}
                    <div className="contact-action-box">
                        <div className="service-contact-details">
                            <h4 className="service-contact-title">Let's Connect</h4>
                            <p className="service-info-text">contact@brand.com</p>
                            <p className="service-info-text">+1 (555) 000-1234</p>
                        </div>
                        <button className="service-primary-btn" onClick={()=> navigate("/contact")}>Contact Us</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Service;