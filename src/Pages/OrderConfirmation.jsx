import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { 
  CheckCircle2, ShoppingBag, MapPin, 
  CreditCard, ArrowRight, Printer, 
  Package, Mail, Loader2, 
  Smartphone
} from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        toast.error('Manifest Retrieval Failed');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', accent: 'text-amber-500' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', accent: 'text-amber-600' };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Syncing Manifest...</p>
    </div>
  );

  if (!order) return null;

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Success Header */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <CheckCircle2 className="text-green-500" size={48} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Protocol <span className="font-serif not-italic font-light text-amber-600">Finalized</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Transaction Authenticated // Manifest #{order.orderNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: ORDER ITEMS */}
          <section className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-8 animate-in slide-in-from-left-4 duration-700`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <ShoppingBag size={16} className="text-amber-500" /> Item Hierarchy
              </h2>
              <span className="text-[9px] font-black px-2 py-1 bg-amber-500 text-black rounded uppercase">
                {order.items.length} Entities
              </span>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center group">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black uppercase tracking-widest truncate w-40">{item.name}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase italic">
                      {item.size && `S:${item.size}`} {item.color && `• C:${item.color}`}
                    </p>
                    <p className="text-[9px] font-black uppercase mt-1 text-amber-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-black italic">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <SummaryRow label="Subtotal" value={`₹${order.subtotal.toLocaleString()}`} />
              <SummaryRow label="Duty (Tax)" value={`₹${order.tax.toLocaleString()}`} />
              <SummaryRow label="Logistics" value="FREE" accent="text-green-500" />
              <div className="flex justify-between items-end pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Net Value</span>
                <span className="text-3xl font-black tracking-tighter italic">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* RIGHT: LOGISTICS & ACTIONS */}
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
            
            {/* Shipping Info */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-6`}>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white/5 pb-4">
                <MapPin size={16} className="text-amber-500" /> Destination
              </h2>
              <div className="text-[11px] font-bold uppercase tracking-widest space-y-2 leading-relaxed opacity-70">
                <p className="text-white font-black text-xs">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <div className="flex items-center gap-2 pt-2 text-amber-500">
                  <Smartphone size={12} /> {order.shippingAddress.phone}
                </div>
              </div>
            </section>

            {/* Notification Card */}
            <section className={`p-8 rounded-[2.5rem] border border-dashed ${isDark ? 'border-white/10' : 'border-gray-300'} space-y-4`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-2xl text-black">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Protocol Email Dispatched</p>
                  <p className="text-[9px] font-bold text-gray-500 truncate w-48">{order.shippingAddress.email}</p>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full bg-white text-black dark:bg-amber-600 dark:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-amber-500 active:scale-95 flex items-center justify-center gap-3"
              >
                Track Progress <Package size={16} />
              </button>
              <button 
                onClick={() => navigate('/products')}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] border transition-all hover:bg-white/5 flex items-center justify-center gap-3 ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                Catalog Archive <ArrowRight size={16} />
              </button>
              <button className="text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Printer size={12} /> Generate Physical Manifest
              </button>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="mt-20 text-center opacity-20 py-10">
          <p className="text-[8px] font-black uppercase tracking-[0.8em]">Essential Concept Registry • Established 2026</p>
        </footer>
      </div>
    </main>
  );
};

const SummaryRow = ({ label, value, accent = '' }) => (
  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
    <span>{label}</span>
    <span className={accent}>{value}</span>
  </div>
);

export default OrderConfirmation;