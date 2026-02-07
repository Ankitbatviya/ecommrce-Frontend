import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Instagram, Twitter, Facebook, ArrowRight, Globe } from 'lucide-react';
import Logo from '../../assets/SVG/Logo.svg';

const Footer = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  // Theme-based styling logic
  const theme = isDark 
    ? {
        bg: "bg-[#050505]",
        text: "text-white",
        muted: "text-gray-500",
        border: "border-white/5",
        input: "bg-white/5 border-white/10",
        logo: "bg-amber-500",
        logoImg: ""
      }
    : {
        bg: "bg-[#fafafa]",
        text: "text-black",
        muted: "text-gray-400",
        border: "border-gray-200",
        input: "bg-white border-gray-200",
        logo: "bg-black",
        logoImg: "invert"
      };

  return (
    <footer className={`pt-24 pb-10 px-6 md:px-[8%] font-sans border-t transition-colors duration-700 ${theme.bg} ${theme.text} ${theme.border}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className={`w-12 h-12 ${theme.logo} rounded-[1.2rem] flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 shadow-xl`}>
                <img src={Logo} alt="Logo" className={`w-7 h-7 ${theme.logoImg}`} />
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-[0.3em] text-2xl uppercase italic leading-none">Essential</span>
                <span className="text-[8px] font-bold tracking-[0.5em] uppercase opacity-40">Narrative 2026</span>
              </div>
            </div>

            <p className={`${theme.muted} text-sm leading-relaxed max-w-sm font-medium uppercase tracking-tight`}>
              Redefining the archive of slow fashion. We curate timeless silhouettes for the digital age, prioritizing sustainability over trends.
            </p>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Subscribe to Intel</h5>
              <div className="relative max-w-sm group">
                <input 
                  type="email" 
                  placeholder="DIGITAL IDENTIFIER..." 
                  className={`w-full ${theme.input} border rounded-2xl py-5 px-6 text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-amber-500/30 transition-all uppercase placeholder:opacity-30`} 
                />
                <button className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-400 text-black px-5 rounded-xl transition-all shadow-lg active:scale-95">
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            <FooterCol title="Collections">
              <Link to="/products">New Arrivals</Link>
              <Link to="/products?category=SlowFashion">Slow Fashion</Link>
              <Link to="/products?category=Apparel">Archive 01</Link>
              <Link to="/products?category=Jewelry">Accessories</Link>
            </FooterCol>

            <FooterCol title="Company">
              <Link to="/aboutus">Our Story</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/stores">Locations</Link>
            </FooterCol>

            <FooterCol title="Legal Protocol">
              <Link to="/terms/terms">Terms of Service</Link>
              <Link to="/terms/privacy">Privacy Policy</Link>
              <Link to="/terms/shipping">Shipping Policy</Link>
              <Link to="/terms/returns">Returns & Refunds</Link>
            </FooterCol>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${theme.border} pt-12 flex flex-col md:flex-row justify-between items-center gap-8`}>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
              &copy; 2026 Essential Collection. All rights reserved.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
              <Globe size={10} className="text-amber-500" />
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">India / Global</span>
            </div>
          </div>

          <div className="flex gap-8">
            <SocialLink icon={<Instagram size={18} />} href="#" />
            <SocialLink icon={<Twitter size={18} />} href="#" />
            <SocialLink icon={<Facebook size={18} />} href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sub-components for better organization
const FooterCol = ({ title, children }) => (
  <div className="space-y-8">
    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] relative w-fit">
      {title}
      <span className="absolute -bottom-2 left-0 w-4 h-[2px] bg-amber-500/30" />
    </h5>
    <ul className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
      {React.Children.map(children, child => (
        <li className="hover:text-amber-500 hover:opacity-100 transition-all cursor-pointer transform hover:translate-x-1">
          {child}
        </li>
      ))}
    </ul>
  </div>
);

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="opacity-40 hover:opacity-100 hover:text-amber-500 transition-all transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;