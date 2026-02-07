import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { 
  Package, ChevronRight, XCircle, Search, 
  ShoppingBag, Clock, Truck, CheckCircle2, 
  MessageSquare, Loader2, Calendar 
} from 'lucide-react';

const MyOrders = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (err) {
      toast.error('Manifest Retrieval Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) return toast.error('Cancellation Protocol requires a reason');

    try {
      setCancellingOrder(orderId);
      await orderService.cancelOrder(orderId, { reason: cancelReason });
      toast.success('Manifest Terminated');
      setCancelReason('');
      setCancellingOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Termination Failed');
      setCancellingOrder(null);
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', accent: 'text-amber-500' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', accent: 'text-amber-600' };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Retrieving Archive...</p>
    </div>
  );

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-amber-500/10 pb-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 italic">User Repository</span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Your <span className="font-serif not-italic font-light text-amber-600">Orders</span>
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
            Total Entities: [{orders.length}]
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in zoom-in-95">
             <div className={`w-32 h-32 rounded-[3rem] ${theme.card} border flex items-center justify-center text-amber-500 shadow-2xl`}>
                <ShoppingBag size={48} strokeWidth={1} />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Archive Empty</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your acquisition history is currently void.</p>
             </div>
             <button onClick={() => navigate('/products')} className="bg-amber-600 text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-amber-600/20">
                Begin Indexing
             </button>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <section key={order._id} className={`rounded-[3rem] border transition-all duration-500 overflow-hidden ${theme.card} hover:border-amber-500/30 group`}>
                
                {/* Order Top Bar */}
                <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Protocol ID</p>
                      <p className="text-sm font-black italic">#{order.orderNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Timestamp</p>
                      <p className="text-sm font-black flex items-center gap-2">
                        <Calendar size={12} className="text-amber-500" /> {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Settlement</p>
                      <p className="text-xl font-black italic tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* LEFT: ITEM PREVIEW */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Package size={16} className="text-amber-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Manifest Entities</h3>
                    </div>
                    <div className="space-y-4">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img src={item.image} className="w-16 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/5" alt="" />
                          <div className="flex-grow">
                            <p className="text-[10px] font-black uppercase tracking-widest truncate w-48">{item.name}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">{item.size && `S: ${item.size}`} • Qty: {item.quantity}</p>
                          </div>
                          <p className="text-xs font-black italic opacity-40">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500 pl-20">+ {order.items.length - 2} Additional Entities</p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: TRACKING & ACTIONS */}
                  <div className="flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                       {order.orderStatus !== 'Cancelled' && <TrackingLine status={order.orderStatus} />}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                      <button 
                        onClick={() => navigate(`/order-confirmation/${order._id}`)}
                        className="flex-1 min-w-[140px] py-4 bg-white text-black dark:bg-amber-600 dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-amber-500 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Inspect <ChevronRight size={14} strokeWidth={3} />
                      </button>

                      {order.orderStatus === 'Pending' && !cancellingOrder && (
                        <button 
                          onClick={() => setCancellingOrder(order._id)}
                          className="flex-1 min-w-[140px] py-4 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* IN-LINE CANCEL FORM */}
                {cancellingOrder === order._id && (
                  <div className="p-8 bg-red-500/5 border-t border-red-500/10 animate-in slide-in-from-bottom-4">
                    <div className="max-w-xl mx-auto space-y-4">
                       <div className="flex items-center gap-3 text-red-500">
                         <MessageSquare size={16} />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Termination Reason</h4>
                       </div>
                       <textarea 
                         value={cancelReason}
                         onChange={(e) => setCancelReason(e.target.value)}
                         placeholder="Protocol Violation / Change of Intent..."
                         className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-500 transition-all"
                         rows="2"
                       />
                       <div className="flex gap-4">
                         <button onClick={() => handleCancelOrder(order._id)} className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Confirm Termination</button>
                         <button onClick={() => {setCancellingOrder(null); setCancelReason('');}} className="px-8 py-4 opacity-50 font-black text-[10px] uppercase tracking-widest">Abort</button>
                       </div>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const TrackingLine = ({ status }) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = steps.indexOf(status);
  
  return (
    <div className="flex items-center justify-between w-full relative pt-2">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-3 relative z-10">
          <div className={`w-3 h-3 rounded-full border-2 transition-all duration-1000 ${i <= currentIndex ? 'bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-black border-white/20'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${i <= currentIndex ? 'text-white' : 'text-gray-600'}`}>{step}</span>
        </div>
      ))}
      <div className="absolute top-[13px] left-0 w-full h-[1px] bg-white/5 -z-0" />
      <div 
        className="absolute top-[13px] left-0 h-[1px] bg-amber-500 transition-all duration-1000 -z-0 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />
    </div>
  );
};

export default MyOrders;