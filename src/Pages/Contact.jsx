import React from 'react';
import '../Stylesheet/ContactPage.css';

const ContactPage = () => {
  return (
    <div className="ContactContainer">
      <div className="ContactWrapper">
        
        {/* LEFT SIDE: CONCIERGE INFO */}
        <div className="ContactInfo">
          <span className="SectionLabel">Get in Touch</span>
          <h1 className="ContactTitle">We are here to <span>assist you.</span></h1>
          <p className="ContactDesc">
            Whether you have a question about our collections, bespoke services, 
            or a press inquiry, our team is dedicated to providing an exceptional experience.
          </p>

          <div className="ContactMethods">
            <div className="MethodItem">
              <h5>Boutique Inquiries</h5>
              <p>concierge@brand.com</p>
              <p>+1 (555) 0123 4567</p>
            </div>
            
            <div className="MethodItem">
              <h5>Visit our Atelier</h5>
              <p>124 Avenue des Champs-Élysées</p>
              <p>75008 Paris, France</p>
            </div>

            <div className="MethodItem">
              <h5>Social Channels</h5>
              <div className="ContactSocials">
                <a href="#">Instagram</a>
                <a href="#">LinkedIn</a>
                <a href="#">Vogue Business</a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: INTERACTIVE FORM */}
        <div className="ContactFormArea">
          <form className="StyledForm" onSubmit={(e) => e.preventDefault()}>
            <div className="FormRow">
              <div className="InputGroup">
                <label>Full Name</label>
                <input type="text" placeholder="Alexander McQueen" />
              </div>
              <div className="InputGroup">
                <label>Email Address</label>
                <input type="email" placeholder="alexander@luxury.com" />
              </div>
            </div>

            <div className="InputGroup">
              <label>Subject</label>
              <select className="StyledSelect">
                <option>General Inquiry</option>
                <option>Bespoke Tailoring</option>
                <option>Order Status</option>
                <option>Press & Media</option>
              </select>
            </div>

            <div className="InputGroup">
              <label>Your Message</label>
              <textarea rows="6" placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" className="hero-cta form-submit">
              Send Inquiry
            </button>
          </form>
        </div>

      </div>

      {/* MAP / IMAGE OVERLAY SECTION */}
      <section className="ContactVisual">
        <div className="VisualOverlay">
          <h3>Experience the Craft in Person</h3>
          <p>Book a private appointment at any of our global showrooms.</p>
          <button className="ghost-btn" style={{color: 'white', borderColor: 'white'}}>Find a Boutique</button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;