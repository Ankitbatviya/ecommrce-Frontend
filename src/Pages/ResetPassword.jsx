import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ChevronLeft, KeyRound, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`);
      if (response.data.success) {
        setTokenValid(true);
        setEmail(response.data.email);
      }
    } catch (error) {
      setTokenValid(false);
      toast.error('Identity Token Expired or Invalid');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passphrase Mismatch');
    if (password.length < 6) return toast.error('Passphrase depth insufficient (min 6)');

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        token,
        password
      });

      if (response.data.success) {
        // Auto-login after reset
        const expiry = { expires: 7, path: '/' };
        Cookies.set('authToken', response.data.token, expiry);
        Cookies.set('userInfo', JSON.stringify(response.data.user), expiry);
        Cookies.set('userRole', response.data.user.role, expiry);

        toast.success('Protocol Complete: Access Restored');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update Rejected');
    } finally {
      setLoading(false);
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', input: 'bg-black/40 border-white/5 text-white focus:border-amber-500' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', input: 'bg-white border-gray-200 text-black focus:border-black shadow-sm' };

  const inputStyle = `w-full py-5 px-8 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase outline-none transition-all border ${theme.input}`;

  // Loading State UI
  if (validating) return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Validating Token...</p>
    </div>
  );

  // Invalid Token UI
  if (!tokenValid) return (
    <main className={`min-h-screen w-full flex items-center justify-center p-6 ${theme.bg}`}>
       <div className="max-w-md text-center space-y-8 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className={`text-3xl font-black tracking-tighter uppercase italic ${theme.text}`}>Token Expired</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">The restoration link has been voided.</p>
          </div>
          <button onClick={() => navigate('/forgot-password')} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl">
             Request New link
          </button>
       </div>
    </main>
  );

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${theme.bg}`}>
      
      {/* Background Editorial */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=2000" 
          className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isDark ? 'opacity-10 scale-110' : 'opacity-5'}`}
          alt="Background"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black via-transparent to-black' : 'bg-gradient-to-b from-white via-transparent to-white'}`} />
      </div>

      <section className="relative z-10 w-full max-w-lg px-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="text-center mb-12 space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border ${isDark ? 'border-white/10 bg-white/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-gray-100 bg-white shadow-xl'}`}>
            <KeyRound className="text-amber-500" size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h1 className={`text-4xl font-black tracking-tighter uppercase italic ${theme.text}`}>Set Passphrase</h1>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.4em]">Restoring Access for: {email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="New Passphrase" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            placeholder="Verify Passphrase" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
            required
          />

          <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
            <ShieldAlert className="text-amber-500 shrink-0" size={18} />
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
              Ensure your passphrase is unique. Resetting will terminate all other active sessions for security.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black dark:bg-amber-600 text-white dark:text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl hover:shadow-amber-500/20 flex items-center justify-center gap-3 group"
          >
            {loading ? 'Updating Vault...' : 'Finalize Update'} 
            <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Essential Security Hierarchy • 2026</p>
        </footer>
      </section>
    </main>
  );
};

export default ResetPassword;