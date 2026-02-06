import React from 'react';
import Footer from '../components/global/Footer'
import '../Stylesheet/AboutUs.css';

const AboutPage = () => {
  return (
    <div className="AboutContainer">
      {/* SECTION 1: EDITORIAL HEADER */}
      <header className="AboutHeader">
        <span className="SectionLabel">Our Legacy</span>
        <h1 className="EditorialTitle">Defining the <br/><em>Modern Standard</em></h1>
        <div className="HeaderStats">
          <div className="StatItem"><span>Est.</span><strong>2014</strong></div>
          <div className="StatItem"><span>Origin</span><strong>Paris</strong></div>
          <div className="StatItem"><span>Ethos</span><strong>Slow Fashion</strong></div>
        </div>
      </header>

      {/* SECTION 2: THE SPLIT STORY (Magazine Style) */}
      <section className="StoryGrid">
        <div className="StoryImage side-img-1"></div>
        <div className="StoryContent">
          <h3>The Vision</h3>
          <p>
            What started as a small atelier in the heart of the Marais has grown into 
            a global collective. We didn't want to just make clothes; we wanted to 
            create armor for the modern visionary.
          </p>
          <p className="TextMuted">
            Every piece in our collection is a dialogue between traditional 
            tailoring and contemporary brutalism.
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE MANIFESTO (Big Typography) */}
      <section className="Manifesto">
        <div className="ManifestoWrapper">
          <h2 className="BigQuote">
            "Quality is not an act, <span className="GoldItalic">it is a habit.</span>"
          </h2>
        </div>
      </section>

      {/* SECTION 4: THE TEAM (Minimalist Grid) */}
      <section className="TeamSection">
        <div className="BrandHeader">
          <span className="SectionLabel">The Visionaries</span>
          <h2 className="SectionTitle">Behind the Seams</h2>
        </div>
        
        <div className="TeamGrid">
          {[
            { name: "Julian Vane", role: "Creative Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
            { name: "Elena Rossi", role: "Head of Design", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" },
            { name: "Marcus Chen", role: "Sustainability Lead", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop" }
          ].map((member, i) => (
            <div key={i} className="TeamCard">
              <div className="TeamImageWrapper">
                <img src={member.img} alt={member.name} />
              </div>
              <div className="TeamMeta">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="JoinSection">
        <div className="brand-header-box">
          <h3>Become part of the narrative.</h3>
          <button className="primary-btn">Explore Collections</button>
        </div>
      </section>
      
      <Footer/>
    </div>
  );
};

export default AboutPage;