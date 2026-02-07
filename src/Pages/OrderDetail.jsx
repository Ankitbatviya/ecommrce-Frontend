import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import {
  ChevronLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  Trash2,
  Download,
  Loader2,
  X,
  Clock,
  CheckCircle2,
  XCircle
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

  /* ---------------- FETCH ORDER ---------------- */
  const fetchOrder = useCallback(async () => {
    if (!id) {
      toast.error('Invalid Order ID');
      return navigate('/orders');
    }

    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);

      if (!res?.success || !res.data) {
        throw new Error('Order not found');
      }

      setOrder(res.data);
    } catch (err) {
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  /* ---------------- CANCEL ORDER ---------------- */
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      return toast.error('Cancellation reason required');
    }

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id, cancelReason);

      if (res?.success) {
        toast.success('Order cancelled');
        setOrder(res.data);
        setShowCancelForm(false);
      }
    } catch {
      toast.error('Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  /* ---------------- THEME ---------------- */
  const theme = isDark
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl' };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!order) return null;

  const safe = (n) => Number(n || 0).toLocaleString();

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20`}>
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100"
          >
            <ChevronLeft size={14} /> Back to Orders
          </button>

          <h1 className="text-4xl font-black uppercase italic mt-2">
            Order <span className="text-amber-600 font-light not-italic">Insight</span>
          </h1>

          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-12">

            {/* ITEMS */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card}`}>
              <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-8 flex gap-2">
                <ShoppingBag size={16} /> Items
              </h3>

              <div className="space-y-8">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <img
                      src={item.image || item.product?.images?.[0] || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-24 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest">
                        {item.name}
                      </h4>
                      <p className="text-xs italic opacity-60">
                        Qty {item.quantity} • ₹{safe(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TIMELINE */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card}`}>
              <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-8 flex gap-2">
                <Clock size={16} /> Status
              </h3>

              <div className="space-y-8">
                <TimelineStep label="Placed" active />
                {order.orderStatus !== 'Cancelled' && (
                  <>
                    <TimelineStep label="Processing" active={['Processing','Shipped','Delivered'].includes(order.orderStatus)} />
                    <TimelineStep label="Shipped" active={['Shipped','Delivered'].includes(order.orderStatus)} />
                    <TimelineStep label="Delivered" active={order.orderStatus === 'Delivered'} />
                  </>
                )}
                {order.orderStatus === 'Cancelled' && (
                  <TimelineStep label="Cancelled" active error />
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">

            {/* SUMMARY */}
            <section className={`p-8 rounded-[2.5rem] border ${theme.card}`}>
              <SummaryRow label="Subtotal" value={`₹${safe(order.subtotal)}`} />
              <SummaryRow label="Tax" value={`₹${safe(order.tax)}`} />
              <SummaryRow label="Shipping" value={order.shippingCharge ? `₹${safe(order.shippingCharge)}` : 'FREE'} />
              <div className="mt-6 text-3xl font-black italic">
                ₹{safe(order.totalAmount)}
              </div>
            </section>

            {/* ACTIONS */}
            {['Pending','Processing'].includes(order.orderStatus) && (
              <button
                onClick={() => setShowCancelForm(true)}
                className="w-full py-5 border border-red-500 text-red-500 rounded-2xl uppercase tracking-widest"
              >
                Cancel Order
              </button>
            )}
          </aside>
        </div>
      </div>

      {/* CANCEL MODAL */}
      {showCancelForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] p-10 rounded-[3rem] w-full max-w-md">
            <div className="flex justify-between mb-6">
              <span className="flex items-center gap-2 text-red-500 uppercase text-xs">
                <XCircle size={16} /> Cancel Order
              </span>
              <button onClick={() => setShowCancelForm(false)}>
                <X />
              </button>
            </div>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
              placeholder="Reason..."
            />

            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="w-full mt-6 py-4 bg-red-600 rounded-xl uppercase tracking-widest"
            >
              {cancelling ? 'Cancelling...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

/* ---------------- HELPERS ---------------- */
const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const TimelineStep = ({ label, active, error }) => (
  <div className="flex items-center gap-4">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${active ? (error ? 'bg-red-500' : 'bg-amber-500') : 'bg-gray-700'}`}>
      {active && !error && <CheckCircle2 size={12} />}
      {error && <X size={12} />}
    </div>
    <span className="text-xs uppercase tracking-widest">{label}</span>
  </div>
);

export default OrderDetail;
