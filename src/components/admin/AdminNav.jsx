import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { 
  Users, 
  Package, 
  LayoutDashboard, 
  ShoppingCart, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';

const AdminNav = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('System offline');
    navigate('/');
  };

  const navItems = [
    { id: 'users', path: '/admin/users', icon: Users },
    { id: 'products', path: '/admin/products', icon: Package },
    { id: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard, isHome: true },
    { id: 'orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${isDark ? 'border-white/5 bg-black/50' : 'border-slate-200 bg-white/50'} px-5 py-3`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-amber-500 rounded shadow-[0_0_10px_rgba(245,158,11,0.4)] animate-pulse" />
            <span className="font-black text-base tracking-tighter uppercase italic tracking-widest transition-colors duration-300">Core.26</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2 rounded-lg border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-amber-500 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {isDark ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
            </button>

            <button 
              onClick={handleLogout} 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
            >
              <LogOut size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
              Kill Session
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Ergonomic Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-0 w-full px-5 z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <nav className={`relative flex justify-around items-center p-2 rounded-3xl border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-[#121212]/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            if (item.isHome) return (
              <button key={item.id} onClick={() => navigate(item.path)} 
                className={`relative -mt-10 p-4 rounded-2xl shadow-xl transition-all duration-500 transform active:scale-75 ${isActive ? 'bg-amber-500 shadow-amber-500/40 opacity-100' : 'bg-slate-800 shadow-black/50 opacity-60'}`}>
                <Icon size={24} strokeWidth={3} className={`${isActive ? 'text-black' : 'text-white'}`} />
              </button>
            );

            return (
              <button key={item.id} onClick={() => navigate(item.path)} className="relative p-3 transition-all duration-300 active:scale-90 group">
                {isActive && <div className="absolute inset-0 bg-amber-500/10 rounded-xl animate-pulse" />}
                
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 3 : 2} 
                  className={`transition-colors duration-300 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} 
                />
                
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" />}
              </button>
            );
          })}

          {/* Logout Trigger */}
          <button onClick={handleLogout} className="p-3 text-red-500/40 active:text-red-500 active:scale-90 transition-all">
            <LogOut size={20} strokeWidth={2.5} />
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminNav;