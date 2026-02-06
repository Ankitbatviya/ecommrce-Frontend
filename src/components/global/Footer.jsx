import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import Logo from '../../assets/SVG/Logo.svg';

function Footer() {
  const isDark = useSelector((state) => state.theme.isDark);

  const footerBg = isDark ? "bg-[#0a0a0a] text-white border-white/5" : "bg-gray-50 text-gray-900 border-gray-200";
  const mutedText = isDark ? "text-gray-500" : "text-gray-400";

  return (
    <footer className={`pt-20 pb-10 px-6 md:px-[8%] font-sans border-t transition-colors duration-500 ${footerBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${isDark ? 'bg-amber-500' : 'bg-black'} rounded-xl flex items-center justify-center`}>
                <img src={Logo} alt="Logo" className={`w-6 h-6 ${isDark ? '' : 'invert'}`} />
              </div>
              <span className="font-black tracking-[0.2em] text-xl uppercase italic">Essential</span>
            </div>
            <p className={`${mutedText} text-sm leading-relaxed max-w-sm font-medium uppercase tracking-tight`}>
              Defining the future of timeless fashion through curated excellence.
            </p>
            <div className="relative max-w-sm group">
              <input type="email" placeholder="Join narrative..." className={`w-full ${isDark ? 'bg-white/5' : 'bg-white'} border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/50`} />
              <button className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-400 text-black px-4 rounded-xl transition-all">
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterCol title="Collections" isDark={isDark}>
              <a href="#">New Arrivals</a>
              <a href="#">Slow Fashion</a>
            </FooterCol>
            <FooterCol title="Company" isDark={isDark}>
              <Link to="/aboutus">Our Story</Link>
              <Link to="/contact">Contact</Link>
            </FooterCol>
            <FooterCol title="Legal" isDark={isDark}>
              <Link to="/terms/privacy">Privacy</Link>
              <Link to="/terms/terms">Terms</Link>
            </FooterCol>
          </div>
        </div>

        <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-200'} pt-10 flex flex-col md:flex-row justify-between items-center gap-6`}>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">&copy; 2026 ESSENTIAL COLLECTION.</p>
          <div className="flex gap-6 opacity-40">
             <Instagram size={18} /> <Twitter size={18} /> <Facebook size={18} />
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterCol = ({ title, children, isDark }) => (
  <div className="space-y-6">
    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">{title}</h5>
    <ul className={`text-xs font-bold space-y-4 uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
      {React.Children.map(children, child => (
        <li className="hover:text-amber-500 transition-colors cursor-pointer">{child}</li>
      ))}
    </ul>
  </div>
);

export default Footer;