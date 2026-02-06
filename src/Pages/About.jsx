import React from 'react';
import { useSelector } from 'react-redux';
import Footer from '../components/global/Footer';

const AboutPage = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', sub: 'text-gray-400' }
    : { bg: 'bg-[#fcfcfc]', text: 'text-gray-900', card: 'bg-white border-gray-100 shadow-lg', sub: 'text-gray-600' };

  return (
    <div className={`${theme.bg} ${theme.text} pt-24 overflow-x-hidden transition-colors duration-500 selection:bg-amber-100`}>
      {/* SECTION 1: EDITORIAL HEADER */}
      <header className="px-6 md:px-[8%] py-16 md:py-24 text-center">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Our Legacy</span>
        <h1 className="text-5xl md:text-[7rem] font-black leading-[0.9] mt-6 tracking-tighter uppercase italic">
          Defining the <br />
          <em className="font-serif italic font-light text-amber-600 not-italic uppercase">Modern Standard</em>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 md:mt-16 border-t border-gray-100 dark:border-white/5 pt-8">
          {["2014", "Paris", "Slow Fashion"].map((stat, i) => (
            <div key={i} className="flex flex-col text-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                {i === 0 ? "Est." : i === 1 ? "Origin" : "Ethos"}
              </span>
              <strong className="text-lg uppercase italic font-black">{stat}</strong>
            </div>
          ))}
        </div>
      </header>

      {/* SECTION 2: THE SPLIT STORY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 px-6 md:px-[8%] py-16 items-center">
        <div className="h-[450px] md:h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02] border border-white/10">
           <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            alt="Atelier" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        <div className="max-w-xl">
          <h3 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter uppercase italic">The Vision</h3>
          <p className={`text-lg md:text-xl leading-relaxed ${theme.sub} mb-6 font-medium uppercase tracking-tight`}>
            What started as a small atelier in the heart of the Marais has grown into 
            a global collective. We create armor for the modern visionary.
          </p>
          <p className="text-amber-600 italic text-lg leading-relaxed border-l-2 border-amber-600 pl-6 font-serif">
            Every piece in our collection is a dialogue between traditional 
            tailoring and contemporary brutalism.
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE MANIFESTO */}
      <section className={`${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'} py-24 md:py-40 px-6 md:px-[8%] text-center`}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-black leading-tight tracking-tighter uppercase italic">
            "Quality is not an act, <br /><span className="text-amber-600 italic font-serif font-light lowercase">it is a habit.</span>"
          </h2>
        </div>
      </section>

      {/* SECTION 4: THE TEAM */}
      <section className="px-6 md:px-[8%] py-24">
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">The Visionaries</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tighter uppercase italic">Behind the Seams</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 lg:gap-12">
          {[
            { id: "01", name: "Julian Vane", role: "Creative Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
            { id: "02", name: "Elena Rossi", role: "Head of Design", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" },
            { id: "03", name: "Marcus Chen", role: "Sustainability Lead", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop" }
          ].map((member, i) => (
            <div key={i} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-white/5 border-b-4 border-amber-600 md:border-none shadow-lg transition-all duration-500 group-hover:rounded-[1rem]">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-black tracking-widest text-black md:hidden uppercase">MEMB.{member.id}</div>
              </div>
              
              <div className={`relative -mt-12 mx-4 md:mt-6 md:mx-0 p-6 md:p-0 ${isDark ? 'bg-[#151515]' : 'bg-white'} md:bg-transparent shadow-xl md:shadow-none rounded-2xl md:rounded-none text-center md:text-left`}>
                <h4 className="text-xl md:text-2xl font-black mb-1 tracking-tighter uppercase italic">{member.name}</h4>
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">{member.role}</p>
                <div className="mt-4 h-[1px] w-12 bg-amber-600 mx-auto md:mx-0 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="px-6 md:px-[8%] py-24 text-center border-t dark:border-white/5 bg-[#0a0a0a] text-white">
        <div className="max-w-xl mx-auto space-y-10">
          <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase italic leading-none">Become part of the narrative.</h3>
          <button className="px-12 py-5 bg-amber-600 text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-2xl shadow-amber-600/20">
            Explore Collections
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;