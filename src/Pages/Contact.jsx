import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowRight, Send } from 'lucide-react';
import Footer from '../components/global/Footer';

const ContactPage = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white' }
    : { bg: 'bg-[#fcfcfc]', text: 'text-gray-900', card: 'bg-white border-gray-100 shadow-xl', input: 'bg-gray-50 border-gray-200 text-black' };

  return (
    <div className={`${theme.bg} ${theme.text} pt-24 transition-colors duration-500 font-sans`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT SIDE: CONCIERGE INFO */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-5 duration-700">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Concierge Desk</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] italic">
                We are here to <br /><span className="font-serif not-italic font-light text-amber-600">assist you.</span>
              </h1>
              <p className="text-gray-500 max-w-md text-sm md:text-base font-medium leading-relaxed">
                Whether you have a question about our collections, bespoke services, 
                or a press inquiry, our team is dedicated to providing an exceptional experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-8 border-t border-gray-100 dark:border-white/5">
              <ContactMethod 
                title="Boutique Inquiries" 
                detail1="concierge@essential.com" 
                detail2="+1 (555) 0123 4567" 
              />
              <ContactMethod 
                title="Visit our Atelier" 
                detail1="124 Avenue des Champs-Élysées" 
                detail2="75008 Paris, France" 
              />
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Social Channels</h5>
                <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-tighter italic">
                  <a href="#" className="hover:text-amber-500 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-amber-500 transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-amber-500 transition-colors">Vogue Business</a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE FORM */}
          <div className={`${theme.card} rounded-[2.5rem] p-8 md:p-12 animate-in fade-in slide-in-from-right-5 duration-700`}>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <input type="text" placeholder="Alexander McQueen" className={`w-full ${theme.input} rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/50 transition-all`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <input type="email" placeholder="alex@luxury.com" className={`w-full ${theme.input} rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/50 transition-all`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Inquiry Type</label>
                <select className={`w-full ${theme.input} rounded-2xl p-4 text-xs font-black uppercase outline-none appearance-none cursor-pointer`}>
                  <option className="bg-black text-white">General Inquiry</option>
                  <option className="bg-black text-white">Bespoke Tailoring</option>
                  <option className="bg-black text-white">Order Status</option>
                  <option className="bg-black text-white">Press & Media</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                <textarea rows="5" placeholder="How can we help you today?" className={`w-full ${theme.input} rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none`}></textarea>
              </div>

              <button type="submit" className="w-full bg-black dark:bg-amber-600 text-white dark:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                Send Inquiry <Send size={14} strokeWidth={3} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* MAP / IMAGE OVERLAY SECTION */}
      <section className="relative h-[500px] mt-20 group overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]" 
          alt="Showroom" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
          <div className="max-w-xl space-y-6">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Experience the Craft in Person</h3>
            <p className="text-gray-300 text-sm font-medium uppercase tracking-widest">Book a private appointment at any of our global showrooms.</p>
            <button className="px-10 py-4 border-2 border-white text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Find a Boutique</button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const ContactMethod = ({ title, detail1, detail2 }) => (
  <div className="space-y-2">
    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">{title}</h5>
    <p className="text-xs font-bold uppercase tracking-tight">{detail1}</p>
    <p className="text-xs font-bold opacity-60 uppercase tracking-tight">{detail2}</p>
  </div>
);

export default ContactPage;