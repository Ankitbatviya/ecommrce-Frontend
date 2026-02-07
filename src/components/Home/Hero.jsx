import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight, ShieldCheck, Globe, Zap } from 'lucide-react';

function Hero() {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    // Added pt-32 for mobile and md:pt-40 for desktop to clear the Navbar
    <main className={`relative min-h-[80vh] flex flex-col items-center justify-center pt-32 md:pt-40 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}>
      
      {/* Dynamic Watermark */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black pointer-events-none select-none transition-opacity duration-700 ${isDark ? 'text-white/[0.02]' : 'text-black/[0.03]'}`}>
        2026
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="h-[1px] w-8 bg-amber-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Premium Apparel</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter uppercase italic">
            Essential <br />
            <span className="font-serif not-italic font-light text-amber-600 uppercase">Collection</span>
          </h1>

          <p className="max-w-md mx-auto lg:mx-0 text-sm md:text-base font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
            Curating timeless elegance for the modern individual. Elevate your everyday wardrobe with our hand-picked pieces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Explore Shop <ArrowUpRight size={16} />
            </button>
            <button 
              onClick={() => navigate("/aboutus")}
              className={`w-full sm:w-auto px-10 py-5 font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'text-white hover:text-amber-500' : 'text-black hover:text-amber-600'}`}
            >
              Our Story —
            </button>
          </div>
        </div>

        {/* Abstract Visual Element - Resized Image */}
        <div className="hidden lg:flex justify-center relative">
            <div className={`w-[350px] h-[350px] rounded-full blur-[80px] animate-pulse absolute ${isDark ? 'bg-amber-600/10' : 'bg-amber-200/40'}`}></div>
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop" 
              alt="Hero" 
              // Reduced max-w-sm and set aspect-ratio to make image smaller
              className="relative z-10 w-full max-w-sm aspect-[4/5] object-cover rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10"
            />
        </div>
      </div>

      {/* Adaptive Trust Bar */}
      <div className={`w-full mt-12 border-t py-10 transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatItem icon={<ShieldCheck className="text-amber-500"/>} label="100%" desc="Organic Cotton" isDark={isDark} />
          <StatItem icon={<Globe className="text-amber-500"/>} label="Free" desc="Global Shipping" isDark={isDark} />
          <StatItem icon={<Zap className="text-amber-500"/>} label="24/7" desc="Style Support" isDark={isDark} />
        </div>
      </div>
    </main>
  );
}

const StatItem = ({ icon, label, desc, isDark }) => (
  <div className="flex items-center justify-center gap-4 group cursor-default">
    <div className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10'}`}>
      {icon}
    </div>
    <div className="text-left">
      <p className="text-xs font-black uppercase tracking-widest">{label}</p>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{desc}</p>
    </div>
  </div>
);

export default Hero;