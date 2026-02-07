import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Swapped ShieldKeyhole for ShieldCheck for better compatibility
import { ChevronLeft, Mail, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

const ForgotPassword = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email Identifier Required');

    setLoading(true);
    try {
      // Adjust this URL to your actual backend endpoint
      const response = await axios.post('http://localhost:8000/api/auth/forgot-password', {
        email: email
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success('Protocol Initiated: Check Email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transmission Error');
    } finally {
      setLoading(false);
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', input: 'bg-black/40 border-white/5 text-white focus:border-amber-500' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', input: 'bg-white border-gray-200 text-black focus:border-black shadow-sm' };

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${theme.bg}`}>
      
      {/* Background Editorial Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
          className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isDark ? 'opacity-10 brightness-50' : 'opacity-5 brightness-100'}`}
          alt="Background"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black via-transparent to-black' : 'bg-gradient-to-t from-white via-transparent to-white'}`} />
      </div>

      <section className="relative z-10 w-full max-w-lg px-6 animate-in fade-in zoom-in-95 duration-1000">
        <button onClick={() => navigate('/login')} className="mb-16 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-all mx-auto group">
          <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform"/> Return to Auth
        </button>

        {!emailSent ? (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border ${isDark ? 'border-white/10 bg-white/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-gray-100 bg-white shadow-xl'}`}>
                <ShieldCheck className="text-amber-500" size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h1 className={`text-4xl font-black tracking-tighter uppercase italic ${theme.text}`}>Identity Reset</h1>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">System Entry Restoration Protocol</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-center block">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="email" 
                    placeholder="Enter Identifier..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-5 pl-14 pr-8 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase outline-none transition-all border ${theme.input}`}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black dark:bg-amber-600 text-white dark:text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl hover:shadow-amber-500/20 flex items-center justify-center gap-3 group"
              >
                {loading ? 'Transmitting...' : 'Dispatch Reset Link'} 
                <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 border-dashed ${isDark ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-500 bg-amber-50'}`}>
              <CheckCircle2 className="text-amber-500" size={40} strokeWidth={1.5} />
            </div>
            
            <div className="space-y-3">
              <h2 className={`text-4xl font-black tracking-tighter uppercase italic ${theme.text}`}>Dispatch Complete</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] leading-relaxed">
                Reset instructions transmitted to: <br />
                <span className="text-amber-500 font-black">{email}</span>
              </p>
            </div>

            <div className={`p-6 rounded-3xl border text-left space-y-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-2">
                <RefreshCw size={12} /> Next Actions
              </h3>
              <ul className="text-[9px] font-bold text-gray-500 uppercase tracking-widest space-y-3">
                <li className="flex items-start gap-3"><span className="text-amber-500">01.</span> Check spam or junk hierarchy.</li>
                <li className="flex items-start gap-3"><span className="text-amber-500">02.</span> Use the link within 15 minutes.</li>
                <li className="flex items-start gap-3"><span className="text-amber-500">03.</span> Keep this window open until complete.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setEmailSent(false)}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                Retry Different Email
              </button>
              <Link to="/login" className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] hover:underline">
                Authenticate Now
              </Link>
            </div>
          </div>
        )}

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 italic">Essential Concierge • Secure Restoration</p>
        </footer>
      </section>
    </main>
  );
};

export default ForgotPassword;