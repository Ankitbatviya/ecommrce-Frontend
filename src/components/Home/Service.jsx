import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Crown, Sparkles, MoveRight } from 'lucide-react';

function Service() {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <section className={`py-20 px-6 md:px-[8%] transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[700px]">
        
        {/* Left Side: Editorial Image Box */}
        <div className="lg:col-span-7 relative group overflow-hidden rounded-[2.5rem] min-h-[450px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Couture" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute bottom-10 left-10 z-20 space-y-4">
            <span className="bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">New Season</span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">High-End <br/> Couture</h2>
            <button 
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.3em] hover:text-amber-500 transition-colors"
            >
              Explore Lookbook <MoveRight size={18}/>
            </button>
          </div>
        </div>

        {/* Right Side: Stacked Info Boxes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Top Info: Brand Identity */}
          <div className={`flex-1 p-10 rounded-[2.5rem] border flex flex-col items-center justify-center text-center space-y-4 transition-all ${isDark ? 'bg-[#111] border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Crown size={32} strokeWidth={1.5} />
            </div>
            <h3 className={`text-xl font-black uppercase italic tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>Premium Brands</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
              Curating the world’s finest fabrics and most iconic labels just for you.
            </p>
          </div>

          {/* Bottom Info: Contact CTA */}
          <div className={`p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${isDark ? 'bg-amber-600/5 border-amber-600/20' : 'bg-amber-50 border-amber-100'}`}>
            <div className="text-center md:text-left">
              <h4 className={`text-lg font-black uppercase italic tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>Let's Connect</h4>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">contact@essential.com</p>
            </div>
            <button 
              onClick={() => navigate("/contact")}
              className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Contact Us
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Service;