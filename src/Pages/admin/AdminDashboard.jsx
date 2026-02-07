import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Users, Package, ShoppingCart, ArrowRight } from 'lucide-react'; // Import Lucide for buttons
import AdminNav from '../../components/admin/AdminNav'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true); 
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [u, o, p] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/all`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/admin/all`, config)
      ]);
      setStats({
        totalUsers: u.data.data?.length || 0,
        totalProducts: p.data.data?.length || 0,
        totalOrders: o.data.data?.length || 0,
        totalRevenue: o.data.data?.reduce((s, x) => s + (x.totalAmount || 0), 0) || 0
      });
      setRecentUsers((u.data.data || []).slice(-5).reverse());
      setRecentOrders((o.data.data || []).slice(-5).reverse());
    } catch (e) { toast.error('Sync error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const theme = isDark 
    ? { bg: 'bg-[#050505]', card: 'bg-[#111] border-white/5', text: 'text-white' }
    : { bg: 'bg-slate-50', card: 'bg-white border-slate-200 shadow-sm', text: 'text-slate-900' };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-500 pb-36 overflow-x-hidden font-sans`}>
      <AdminNav isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-7xl mx-auto pt-24 px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="mb-10">
          <h2 className="text-4xl font-black tracking-tighter mb-1">Command <span className="text-amber-500 italic">Pulse</span></h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-80">Operational Analytics // 2026</p>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { l: 'Revenue', v: `₹${stats.totalRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}`, i: '◈' },
            { l: 'Orders', v: stats.totalOrders, i: '⬢' },
            { l: 'Users', v: stats.totalUsers, i: '◆' },
            { l: 'Stock', v: stats.totalProducts, i: '▲' }
          ].map((s, i) => (
            <div key={i} className={`${theme.card} p-5 rounded-[2rem] border transition-transform hover:scale-[1.02] duration-300`}>
              <div className="text-amber-500 mb-2 text-sm">{s.i}</div>
              <p className="font-black tracking-tighter text-xl">{s.v}</p>
              <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>

        {/* LAPTOP ONLY: Quick Access Command Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-12">
          {[
            { n: 'Manage Catalog', p: '/admin/products', icon: Package, desc: 'Update inventory & styles' },
            { n: 'Dispatch Center', p: '/admin/orders', icon: ShoppingCart, desc: 'Fulfill & track shipments' },
            { n: 'Identity Vault', p: '/admin/users', icon: Users, desc: 'Manage access & roles' },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => navigate(action.p)}
              className={`${theme.card} group relative overflow-hidden p-8 rounded-[2.5rem] border text-left transition-all hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform duration-500">
                  <action.icon size={24} strokeWidth={2.5} />
                </div>
                <ArrowRight size={20} className="text-slate-700 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="font-black text-lg tracking-tight mb-1 uppercase italic">{action.n}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Invoices */}
          <div className={`lg:col-span-8 ${theme.card} rounded-[2.5rem] border p-6 md:p-8 shadow-2xl`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                Live Feed <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              </h3>
              <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-black uppercase text-amber-500 hover:underline">Full Logs</button>
            </div>
            
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o._id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                  <div className="min-w-0 text-xs sm:text-sm">
                    <p className="text-amber-500 font-black tracking-tighter">#{o.orderNumber}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate max-w-[120px]">{o.user?.name || 'Guest Entity'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">₹{Number(o.totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="text-[8px] font-black uppercase opacity-40 hover:opacity-100">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrivals */}
          <div className={`lg:col-span-4 ${theme.card} rounded-[2.5rem] border p-6 md:p-8`}>
            <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-amber-500">Latest Entry</h3>
            <div className="space-y-5">
              {recentUsers.map(u => (
                <div key={u._id} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black group-hover:scale-110 transition-transform uppercase">
                    {(u.Fullname || u.fullname || 'U').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black tracking-tight uppercase italic">{u.Fullname || u.fullname}</p>
                    <p className="text-[9px] uppercase text-slate-500 font-bold tracking-tighter">{u.Role || u.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/admin/users')} className="w-full mt-10 py-4 rounded-2xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all">
              System Directory
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;