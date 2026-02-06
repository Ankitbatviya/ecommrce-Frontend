import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [uRes, oRes, pRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users/all', config),
        axios.get('http://localhost:8000/api/orders/admin/all', config),
        axios.get('http://localhost:8000/api/products/admin/all', config)
      ]);

      if (uRes.data.success) {
        const users = uRes.data.data || [];
        const orders = oRes.data.data || [];
        const products = pRes.data.data || [];
        
        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentOrders(orders.slice(-5).reverse());
      }
    } catch (error) {
      toast.error('Performance data could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Home
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-200">
                  <span className="text-xl">◆</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  AdminPanel
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-100 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '₹', color: 'bg-amber-500' },
            { label: 'Orders', value: stats.totalOrders, icon: '📦', color: 'bg-orange-500' },
            { label: 'Users', value: stats.totalUsers, icon: '👥', color: 'bg-amber-400' },
            { label: 'Products', value: stats.totalProducts, icon: '🛍️', color: 'bg-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-inner`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Manage Users', icon: '👤', path: '/admin/users' },
            { label: 'Manage Products', icon: '📦', path: '/admin/products' },
            { label: 'View Orders', icon: '🛒', path: '/admin/orders' },
          ].map((action, i) => (
            <button 
              key={i}
              onClick={() => navigate(action.path)}
              className="flex items-center justify-center gap-3 p-4 bg-white border border-amber-100 rounded-xl font-semibold text-slate-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
              <button onClick={() => navigate('/admin/orders')} className="text-sm font-semibold text-orange-600 hover:text-orange-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Order</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">#{order.orderNumber}</td>
                      <td className="px-6 py-4 text-slate-600">{order.user?.name || 'Guest'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold
                          ${order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-orange-600 hover:underline font-medium text-sm"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-800">New Users</h2>
            </div>
            <div className="p-6 space-y-4">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                    {(user.Fullname || user.fullname || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.Fullname || user.fullname}</p>
                    <p className="text-xs text-slate-500 truncate">{user.Email || user.email}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                    (user.Role || user.role) === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.Role || user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;