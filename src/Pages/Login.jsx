import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { ChevronLeft, ArrowRight, Fingerprint, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const Login = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/login', {
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        Cookies.set('authToken', response.data.token, { expires: 7, path: '/' });
        Cookies.set('userInfo', JSON.stringify(response.data.user), { expires: 7, path: '/' });
        toast.success(`Access Granted: ${response.data.user.fullname}`);
        setTimeout(() => { window.location.href = response.data.redirectTo; }, 1000);
      }
    } catch (err) {
      toast.error('Identity Verification Failed');
    } finally { setLoading(false); }
  };

  const isAdminEmail = formData.email.toLowerCase() === 'ankitbatviya94@gmail.com';

  const inputStyle = `w-full py-5 px-8 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase outline-none transition-all border ${
    isDark 
    ? 'bg-black/40 border-white/5 text-white focus:border-amber-500 focus:bg-black/60' 
    : 'bg-white border-gray-100 text-black focus:border-black focus:shadow-xl'
  }`;

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}`}>
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000" 
          className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isDark ? 'opacity-20 brightness-50 scale-110' : 'opacity-10 brightness-100'}`}
          alt="Background"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black via-transparent to-black' : 'bg-gradient-to-t from-white via-transparent to-white'}`} />
      </div>

      <section className="relative z-10 w-full max-w-lg px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <button onClick={() => window.history.back()} className="mb-16 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-all mx-auto group">
          <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform"/> Return to Core
        </button>

        <div className="text-center mb-12 space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border ${isDark ? 'border-white/10 bg-white/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-gray-100 bg-white shadow-xl'}`}>
            <Fingerprint className="text-amber-500" size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h1 className={`text-4xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>Terminal.Login</h1>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.4em]">Authorization Protocol Required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group relative">
            <input 
              type="email" 
              placeholder="Email Identifier" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={inputStyle}
              required
            />
          </div>

          <div className="group relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Secret Passphrase" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={inputStyle}
              required
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-2">
            <button 
              type="button" 
              onClick={() => window.location.href='/forgot-password'}
              className="text-[9px] font-black text-gray-500 hover:text-amber-500 uppercase tracking-widest transition-colors italic"
            >
              Reset Protocol?
            </button>
          </div>

          {isAdminEmail && (
            <div className={`py-4 px-6 rounded-2xl border flex items-center gap-4 animate-pulse ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
              <ShieldAlert className="text-amber-600" size={18} />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Admin Signature Detected</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black dark:bg-amber-600 text-white dark:text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl hover:shadow-amber-500/20 flex items-center justify-center gap-3 group"
          >
            {loading ? 'Validating...' : 'Establish Session'} 
            <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-16 text-center">
          <button onClick={() => window.location.href='/signup'} className="group">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              New Entity? <span className={`transition-colors group-hover:text-amber-500 ${isDark ? 'text-white' : 'text-black'}`}>Register Registry</span>
            </p>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Login;