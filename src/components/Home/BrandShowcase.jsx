import React from 'react';
import { useSelector } from 'react-redux';

const categories = [
  { id: 1, type: "Apparel", desc: "Premium tailored garments.", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80", logo: "AP" },
  { id: 2, type: "Electronics", desc: "Smart home technology.", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80", logo: "EL" },
  { id: 3, type: "Footwear", desc: "Handcrafted comfort.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", logo: "FW" },
  { id: 4, type: "Accessories", desc: "The finishing touches.", img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80", logo: "AC" }
];

function BrandShowcase() {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <section className={`py-24 px-6 md:px-[8%] transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#fdfdfc]'}`}>
      <div className="max-w-7xl mx-auto text-center mb-16 space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">The Essentials</span>
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>Category Showcase</h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {categories.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            {/* Image Wrapper */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100 shadow-2xl">
              <img 
                src={item.img} 
                alt={item.type} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
              />
              {/* Initials Badge */}
              <div className="absolute top-5 right-5 w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black text-black tracking-tighter">{item.logo}</span>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="mt-6 space-y-2 px-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-between gap-2">
                <h4 className={`text-lg font-black uppercase italic tracking-tighter transition-colors group-hover:text-amber-500 ${isDark ? 'text-white' : 'text-black'}`}>
                  {item.type}
                </h4>
                <div className="text-amber-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 hidden lg:block">↗</div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandShowcase;