import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, User, Menu, X, ChevronDown, 
  LayoutDashboard, Package, LogOut, ShoppingBag, 
  Info, PhoneCall, Sun, Moon 
} from 'lucide-react';
import Logo from '../../assets/SVG/Logo.svg';

function Navbar() {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = () => {
    const token = Cookies.get('authToken');
    const user = Cookies.get('userInfo');
    if (token && user) {
      setIsAuthenticated(true);
      try { setUserInfo(JSON.parse(user)); } catch (e) { setUserInfo(null); }
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userInfo');
    setIsAuthenticated(false);
    toast.success('System Offline');
    setIsMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !profileButtonRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: ShoppingBag },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'About', path: '/aboutus', icon: Info },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const themeStyles = isDark 
    ? "bg-black/80 border-white/10 text-white shadow-2xl shadow-black/50" 
    : "bg-white/80 border-gray-200 text-gray-900 shadow-lg";

  return (
    <header className="fixed top-0 w-full z-[100] font-sans">
      <nav className="mx-auto max-w-7xl mt-4 px-4 sm:px-6">
        <div className={`${themeStyles} backdrop-blur-xl border rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-500`}>
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className={`w-10 h-10 ${isDark ? 'bg-amber-500' : 'bg-black'} rounded-xl flex items-center justify-center transition-all shadow-md`}>
              <img src={Logo} alt="Logo" className={`w-6 h-6 ${isDark ? '' : 'invert'}`} />
            </div>
            <span className={`font-black tracking-[0.2em] text-lg hidden sm:block uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>Essential</span>
          </div>

          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-amber-500 ${location.pathname === link.path ? 'text-amber-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{link.name}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button onClick={() => dispatch(toggleTheme())} className={`p-2 rounded-xl transition-all ${isDark ? 'text-amber-500 bg-white/10 hover:bg-white/20' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
              {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
            
            <button onClick={() => navigate('/cart')} className={`p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-amber-500' : 'text-gray-500 hover:text-amber-500'}`}>
              <ShoppingCart size={20} strokeWidth={2.5} />
            </button>

            {isAuthenticated ? (
              <div className="relative hidden lg:block">
                <button ref={profileButtonRef} onClick={() => setShowUserDropdown(!showUserDropdown)} className={`flex items-center gap-3 p-1 pr-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">{userInfo?.fullname?.charAt(0)}</div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isDark ? 'text-white' : 'text-black'} ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showUserDropdown && (
                  <div ref={dropdownRef} className={`absolute right-0 mt-4 w-60 border rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
                    <div className="space-y-1">
                      <DropdownLink to="/profile" icon={User} label="Profile" isDark={isDark} onClick={() => setShowUserDropdown(false)} />
                      <DropdownLink to="/orders" icon={ShoppingBag} label="Orders" isDark={isDark} onClick={() => setShowUserDropdown(false)} />
                      {userInfo?.role === 'admin' && <DropdownLink to="/admin/dashboard" icon={LayoutDashboard} label="Admin Hub" accent isDark={isDark} onClick={() => setShowUserDropdown(false)} />}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase mt-2"><LogOut size={16} /> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className={`hidden lg:block px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isDark ? 'bg-white text-black hover:bg-amber-500' : 'bg-black text-white hover:bg-amber-600'}`}>Join</button>
            )}

            {/* HAMBURGER BTN THEME FIXED */}
            <button className={`lg:hidden p-2 rounded-xl transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-black hover:bg-gray-200'}`} onClick={() => setIsMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER THEME FIXED */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm shadow-2xl transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-8 flex items-center justify-between">
              <span className="font-black text-amber-500 text-2xl uppercase italic tracking-tighter">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className={`p-2 rounded-xl ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'}`}><X size={20}/></button>
            </div>
            
            <div className="px-8 py-4 space-y-6 flex-1">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={`flex text-4xl font-black tracking-tighter uppercase italic transition-colors ${isDark ? 'text-white hover:text-amber-500' : 'text-black hover:text-amber-500'}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className={`p-8 space-y-4 border-t ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'}`}>
              {isAuthenticated ? (
                <>
                  <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-xl">{userInfo?.fullname?.charAt(0)}</div>
                    <div className="min-w-0">
                      <p className={`font-black uppercase text-xs truncate italic ${isDark ? 'text-white' : 'text-black'}`}>{userInfo?.fullname}</p>
                      <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">{userInfo?.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => {navigate('/profile'); setIsMenuOpen(false);}} className={`p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/10 text-white border border-white/5' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}>Profile</button>
                    <button onClick={() => {navigate('/orders'); setIsMenuOpen(false);}} className={`p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/10 text-white border border-white/5' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}>Orders</button>
                  </div>
                  <button onClick={handleLogout} className="w-full p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all">Terminate Session</button>
                </>
              ) : (
                <button onClick={() => {navigate('/login'); setIsMenuOpen(false);}} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl text-[10px] uppercase shadow-lg active:scale-95 transition-all">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const DropdownLink = ({ to, icon: Icon, label, accent, isDark, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl transition-all text-[10px] font-black uppercase ${accent ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : isDark ? 'text-white hover:bg-white/10 hover:text-amber-500' : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'}`}>
    <Icon size={16} /> {label}
  </Link>
);

export default Navbar;