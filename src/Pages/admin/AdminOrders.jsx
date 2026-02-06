import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import AdminNav from '../../components/admin/AdminNav'; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          status: statusFilter === 'all' ? '' : statusFilter,
          search: searchTerm
        }
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(
        `http://localhost:8000/api/orders/admin/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Pulse: Status → ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const deleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Decommission order #${orderNumber}?`)) return;

    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(
        `http://localhost:8000/api/orders/admin/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Order purged from system');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Purge failed');
    }
  };

  const theme = isDark 
    ? { card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white', option: 'bg-[#1a1a1a] text-white' }
    : { card: 'bg-white border-slate-200 shadow-sm', input: 'bg-white border-slate-300 text-slate-900', option: 'bg-white text-slate-900' };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 pb-32 font-sans overflow-x-hidden`}>
      <AdminNav isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-7xl mx-auto pt-24 px-4 animate-in slide-in-from-right-10 duration-700">
        
        {/* Header with Desktop Back Button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
              Hub
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Logistics Center</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Order Fulfillment Tracking</p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { l: 'Processing', v: orders.filter(o => o.orderStatus === 'Processing').length, c: 'text-amber-500' },
            { l: 'Shipped', v: orders.filter(o => o.orderStatus === 'Shipped').length, c: 'text-blue-400' },
            { l: 'Delivered', v: orders.filter(o => o.orderStatus === 'Delivered').length, c: 'text-emerald-500' },
            { l: 'Total', v: orders.length, c: 'text-white' }
          ].map((s, i) => (
            <div key={i} className={`${theme.card} p-4 rounded-2xl border flex flex-col items-center justify-center`}>
              <p className={`text-xl font-black ${s.c}`}>{s.v}</p>
              <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text" placeholder="Search order ID or customer..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full ${theme.input} rounded-2xl py-4 px-12 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm`}
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`appearance-none w-full md:w-48 ${theme.input} rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest cursor-pointer outline-none`}
            >
              <option className={theme.option} value="all">System: All</option>
              <option className={theme.option} value="Processing">Processing</option>
              <option className={theme.option} value="Confirmed">Confirmed</option>
              <option className={theme.option} value="Shipped">Shipped</option>
              <option className={theme.option} value="Delivered">Delivered</option>
              <option className={theme.option} value="Cancelled">Cancelled</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none text-amber-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className={`${theme.card} rounded-[2rem] border overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                  <th className="px-6 py-5">Reference</th>
                  <th className="px-6 py-5 hidden md:table-cell">Client</th>
                  <th className="px-6 py-5">Financials</th>
                  <th className="px-6 py-5">Status Pulse</th>
                  <th className="px-6 py-5 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id} className="hover:bg-amber-500/[0.03] transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-amber-500 font-black text-xs tracking-tighter">#{order.orderNumber}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell min-w-[200px]">
                      <p className="font-black text-xs tracking-tight truncate">{order.shippingAddress?.fullName || 'Guest Entity'}</p>
                      <p className="text-[10px] font-bold text-slate-500 truncate">{order.shippingAddress?.email || order.user?.Email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-black text-xs tracking-tighter">₹{order.totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative w-max">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`appearance-none bg-transparent text-amber-500 font-black text-[10px] uppercase tracking-widest pr-4 outline-none cursor-pointer`}
                        >
                          <option className={theme.option} value="Processing">Processing</option>
                          <option className={theme.option} value="Confirmed">Confirmed</option>
                          <option className={theme.option} value="Shipped">Shipped</option>
                          <option className={theme.option} value="Delivered">Delivered</option>
                          <option className={theme.option} value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button 
                          onClick={() => deleteOrder(order._id, order.orderNumber)}
                          className="p-2 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center opacity-40 font-black text-xs uppercase tracking-widest italic">
                      No active orders found in pulse
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`p-5 flex justify-between items-center ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-amber-500 transition-colors"
              >
                Back
              </button>
              <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Log {currentPage} // {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-amber-500 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;