import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { 
  ChevronLeft, Package, MapPin, CreditCard, 
  Trash2, Download, Truck, Calendar, 
  MessageSquare, ShoppingBag, Loader2, X, 
  Clock,
  CheckCircle2
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error('Manifest not found');
        navigate('/orders');
      }
    } catch (err) {
      toast.error('Data retrieval failure');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return toast.error('Termination reason required');

    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(id, cancelReason);
      if (response.success) {
        toast.success('Manifest Terminated');
        setOrder(response.data);
        setShowCancelForm(false);
      }
    } catch (err) {
      toast.error('Termination failed');
    } finally {
      setCancelling(false);
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', sub: 'text-gray-500' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', sub: 'text-gray-400' };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Decrypting Manifest...</p>
    </div>
  );

  if (!order) return null;

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-2 group">
              <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> Return to Archives
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Order <span className="font-serif not-italic font-light text-amber-600">Insight</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Protocol #{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: ITEMS & TIMELINE */}
          <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
            
            {/* ITEM MANIFEST */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card}`}>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-3">
                <ShoppingBag size={16} /> Manifest Entities ({order.items?.length})
              </h2>
              <div className="space-y-8">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-6 items-center group">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0 shadow-lg">
                      <img src={item.image || item.product?.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h4 className="text-[11px] font-black uppercase tracking-widest leading-none">{item.name}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase italic">
                        {item.size && `S:${item.size}`} {item.color && `• C:${item.color}`}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/5 rounded border border-white/5">Qty: {item.quantity}</span>
                        <span className="text-xs font-black italic">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* KINETIC TIMELINE */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card}`}>
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-10 flex items-center gap-3">
                <Clock size={16} /> Progress Protocol
              </h2>
              <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                <TimelineStep status="Placed" date={order.createdAt} active />
                <TimelineStep status="Processing" active={['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus)} />
                <TimelineStep status="Shipped" active={['Shipped', 'Delivered'].includes(order.orderStatus)} />
                <TimelineStep status="Delivered" active={order.orderStatus === 'Delivered'} last />
                {order.orderStatus === 'Cancelled' && <TimelineStep status="Cancelled" active date={order.cancelledAt} isError last />}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SUMMARY & ACTIONS */}
          <aside className="lg:col-span-4 space-y-8 sticky top-32 h-fit animate-in fade-in slide-in-from-right-4 duration-700">
            
            {/* SETTLEMENT CARD */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-6 shadow-2xl`}>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/5 pb-4">Settlement Summary</h3>
              <div className="space-y-3">
                <SummaryRow label="Subtotal" value={`₹${order.subtotal.toLocaleString()}`} />
                <SummaryRow label="Duty (18%)" value={`₹${order.tax.toLocaleString()}`} />
                <SummaryRow label="Logistics" value={order.shippingCharge > 0 ? `₹${order.shippingCharge}` : 'FREE'} accent="text-green-500" />
                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Net Value</span>
                  <span className="text-3xl font-black tracking-tighter italic">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-60">
                 <CreditCard size={14} className="text-amber-500" /> {order.paymentMethod} • {order.paymentStatus}
              </div>
            </section>

            {/* LOGISTICS CARD */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-4`}>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <MapPin size={16} className="text-amber-500" /> Destination
              </h3>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-70">
                <p className="text-amber-500 font-black mb-1">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              </div>
            </section>

            {/* COMMAND BUTTONS */}
            <div className="flex flex-col gap-4">
              {(order.paymentStatus === 'Paid' || order.orderStatus === 'Delivered') && (
                <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-amber-500 active:scale-95 flex items-center justify-center gap-2">
                  <Download size={14} strokeWidth={3} /> Get Invoice
                </button>
              )}
              
              {['Pending', 'Processing'].includes(order.orderStatus) && !showCancelForm && (
                <button onClick={() => setShowCancelForm(true)} className="w-full py-5 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-red-500 hover:text-white active:scale-95 flex items-center justify-center gap-2">
                  <Trash2 size={14} strokeWidth={3} /> Terminate Order
                </button>
              )}
            </div>

          </aside>
        </div>
      </div>

      {/* TERMINATION MODAL */}
      {showCancelForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-md p-10 rounded-[3rem] border border-red-500/20 bg-[#0a0a0a] text-white animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 text-red-500 uppercase font-black text-[10px] tracking-widest">
                   <XCircle size={18} /> Termination protocol
                </div>
                <button onClick={() => setShowCancelForm(false)} className="opacity-40 hover:opacity-100"><X size={20}/></button>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Declare Reason</h3>
                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">By terminating this manifest, you void all logistical progress. This action is irreversible.</p>
                </div>
                <textarea 
                   value={cancelReason}
                   onChange={(e) => setCancelReason(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-500 transition-all min-h-[120px]"
                   placeholder="e.g. Change of intent, protocol violation..."
                />
                <button 
                   onClick={handleCancelOrder}
                   disabled={cancelling || !cancelReason.trim()}
                   className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-red-600/20 disabled:opacity-20"
                >
                   {cancelling ? 'Terminating...' : 'Execute Termination'}
                </button>
             </div>
          </div>
        </div>
      )}
    </main>
  );
};

// HELPER COMPONENTS
const SummaryRow = ({ label, value, accent = '' }) => (
  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
    <span>{label}</span>
    <span className={accent}>{value}</span>
  </div>
);

const TimelineStep = ({ status, date, active, isError, last }) => (
  <div className="relative flex items-start gap-6 group">
    <div className={`mt-1.5 w-6 h-6 rounded-full border-2 shrink-0 z-10 transition-all duration-700 flex items-center justify-center ${active ? (isError ? 'bg-red-500 border-red-500' : 'bg-amber-500 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]') : 'bg-black border-white/10'}`}>
       {active && !isError && <CheckCircle2 size={12} className="text-black" />}
       {isError && <X size={12} className="text-white" />}
    </div>
    <div className="space-y-1">
      <h4 className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-600'}`}>{status}</h4>
      {date && <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{new Date(date).toLocaleDateString()}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Shipped: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Delivered: 'bg-green-500 text-black border-green-500',
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${styles[status]}`}>
       {status}
    </div>
  );
};

export default OrderDetail;