import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { ChevronLeft, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passphrase Conflict");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/users/register', {
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        Cookies.set('authToken', response.data.token, { expires: 7, path: '/' });
        Cookies.set('userInfo', JSON.stringify(response.data.user), { expires: 7, path: '/' });
        toast.success('Registry Entry Confirmed');
        setTimeout(() => { window.location.href = '/'; }, 1000);
      }
    } catch (err) {
      toast.error('Initialization Failed');
    } finally { setLoading(false); }
  };

  const inputStyle = `w-full py-5 px-8 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase outline-none transition-all border ${
    isDark 
    ? 'bg-black/40 border-white/5 text-white focus:border-amber-500 focus:bg-black/60' 
    : 'bg-white border-gray-100 text-black focus:border-black shadow-sm focus:shadow-xl'
  }`;

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}`}>
      
      {/* Background Editorial Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isDark ? 'opacity-20 brightness-50' : 'opacity-10 brightness-100'}`}
          alt="Background"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black via-transparent to-black' : 'bg-gradient-to-b from-white via-transparent to-white'}`} />
      </div>

      <section className="relative z-10 w-full max-w-xl px-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <button onClick={() => window.history.back()} className="mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-all mx-auto">
          <ChevronLeft size={14} strokeWidth={3} /> Return
        </button>

        <div className="text-center mb-12 space-y-3">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 border-dashed ${isDark ? 'border-amber-500/30' : 'border-amber-500'}`}>
            <UserPlus className="text-amber-500" size={32} strokeWidth={1} />
          </div>
          <h1 className={`text-5xl font-black tracking-tighter uppercase italic leading-none ${isDark ? 'text-white' : 'text-black'}`}>
            Registry
          </h1>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Protocol Initiation // Entry 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Legal Name" 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={inputStyle}
              required
            />
            <input 
              type="email" 
              placeholder="Email Identifier" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={inputStyle}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Passphrase" 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={inputStyle}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Verify Pass" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className={inputStyle}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 group"
          >
            {loading ? 'Processing Entry...' : 'Confirm Entry'} 
            <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <button onClick={() => window.location.href='/login'} className="group">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Existing Account? <span className={`transition-colors group-hover:text-amber-500 ${isDark ? 'text-white' : 'text-black'}`}>Authenticate</span>
            </p>
          </button>
        </div>
      </section>
    </main>
  );
};

export default SignUp;