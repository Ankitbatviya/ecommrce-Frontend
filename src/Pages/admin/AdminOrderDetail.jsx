import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { ChevronLeft, Trash2, Package, Truck, User, CreditCard, Calendar, Info } from 'lucide-react';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`http://localhost:8000/api/orders/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrder(response.data.data);
        setStatusUpdate(response.data.data.orderStatus);
      }
    } catch (error) {
      toast.error('Manifest retrieval failed');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrderDetails(); }, [id]);

  const handleStatusUpdate = async () => {
    if (!statusUpdate) return toast.error('Selection required');
    setUpdating(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(`http://localhost:8000/api/orders/admin/${id}/status`,
        { status: statusUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('System: Status re-indexed');
        setOrder(response.data.data);
      }
    } catch (error) {
      toast.error('Update failed');
    } finally { setUpdating(false); }
  };

  const deleteOrder = async () => {
    if (!window.confirm('Purge this record from core?')) return;
    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(`http://localhost:8000/api/orders/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Order Purged');
        navigate('/admin/orders');
      }
    } catch (error) { toast.error('Purge error'); }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white', option: 'bg-[#1a1a1a] text-white' }
    : { bg: 'bg-slate-50', card: 'bg-white border-slate-200', input: 'bg-white border-slate-300 text-slate-900', option: 'bg-white text-slate-900' };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  return (
    <div className={`min-h-screen ${theme.bg} ${isDark ? 'text-white' : 'text-slate-900'} transition-colors duration-500 pb-20 font-sans overflow-x-hidden`}>
      
      <header className={`fixed top-0 w-full z-40 backdrop-blur-md border-b ${isDark ? 'border-white/5 bg-black/50' : 'border-slate-200 bg-white/50'} px-5 py-3`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/orders')} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600'}`}>
              <ChevronLeft size={14} strokeWidth={3} /> Back
            </button>
            <span className="font-black text-base italic tracking-tighter uppercase italic tracking-widest">Order.#{order.orderNumber}</span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`px-4 py-1.5 rounded-xl border ${theme.card} text-[10px] font-black uppercase tracking-widest`}>
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-24 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Logistics Feed</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              <Calendar size={12} className="text-amber-500" />
              Placed: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <button onClick={deleteOrder} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95">
            <Trash2 size={14} strokeWidth={3} /> Purge Order
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-6">
            {/* STREAMLINED STATUS CARD */}
            <div className={`${theme.card} rounded-[2rem] border p-6 shadow-2xl`}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Info size={14} className="text-amber-500" /> 
                Update Status
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Fulfillment State</label>
                  <select 
                    value={statusUpdate} 
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className={`appearance-none w-full ${theme.input} rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-amber-500/50`}
                  >
                    <option className={theme.option} value="Processing">Processing</option>
                    <option className={theme.option} value="Confirmed">Confirmed</option>
                    <option className={theme.option} value="Shipped">Shipped</option>
                    <option className={theme.option} value="Delivered">Delivered</option>
                    <option className={theme.option} value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  onClick={handleStatusUpdate} 
                  disabled={updating || statusUpdate === order.orderStatus}
                  className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-amber-500/20"
                >
                  {updating ? 'Processing...' : 'Execute Update'}
                </button>
              </div>
            </div>

            <div className={`${theme.card} rounded-[2rem] border p-6`}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <User size={14} className="text-amber-500" />
                Entity Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black italic">
                    {(order.shippingAddress?.fullName || 'U').charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm tracking-tight truncate">{order.shippingAddress?.fullName || 'N/A'}</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">{order.shippingAddress?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap gap-3">
              <div className={`${theme.card} px-6 py-4 rounded-2xl border flex items-center gap-3 flex-1 min-w-[150px]`}>
                <Truck size={18} className="text-amber-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase">Logistic State</p>
                  <p className="text-xs font-black uppercase text-amber-500">{order.orderStatus}</p>
                </div>
              </div>
              <div className={`${theme.card} px-6 py-4 rounded-2xl border flex items-center gap-3 flex-1 min-w-[150px]`}>
                <CreditCard size={18} className="text-amber-500" />
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase">Payment Signal</p>
                  <p className={`text-xs font-black uppercase ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-red-500'}`}>{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className={`${theme.card} rounded-[2rem] border p-6 md:p-8`}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Package size={14} className="text-amber-500" />
                Product Manifest
              </h3>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-amber-500/20 transition-all">
                    <img src={item.image} alt="" className="w-16 h-16 rounded-2xl object-cover bg-white/5 border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm tracking-tight truncate">{item.name}</p>
                      <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span className="text-amber-500">Size: {item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">₹{item.price} EA</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${theme.card} rounded-[2.5rem] border p-8 shadow-2xl`}>
              <div className="space-y-4 max-w-sm ml-auto text-right">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Final Settlement</span>
                  <span className="text-2xl font-black tracking-tighter">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetail;