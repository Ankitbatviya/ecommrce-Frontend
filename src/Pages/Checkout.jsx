import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { isAuthenticated } from '../utils/auth';
import { 
  ChevronLeft, Lock, ShieldCheck, MapPin, CreditCard, 
  User, Smartphone, Mail, ArrowRight, Loader2, 
  CheckCircle2, Cpu, Globe 
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  
  // States
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState('pending');
  const [finalOrderId, setFinalOrderId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '',
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
    country: 'India', paymentMethod: 'COD', orderNotes: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Identity Verification Required');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (!res.data || res.data.items.length === 0) {
        navigate(-1);
        return;
      }
      setCart(res.data);
    } catch (err) {
      toast.error('Failed to sync bag');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const rules = [
      { check: !formData.fullName.trim(), msg: 'Full Name required' },
      { check: !/^[6-9]\d{9}$/.test(formData.phone), msg: 'Invalid mobile sequence' },
      { check: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), msg: 'Invalid email' },
      { check: !formData.addressLine1.trim(), msg: 'Address required' },
      { check: !/^\d{6}$/.test(formData.pincode), msg: 'Invalid area code' }
    ];
    const failure = rules.find(r => r.check);
    if (failure) { toast.error(failure.msg); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // Map to your specific Backend Schema
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes
      };

      const response = await orderService.createOrder(orderData);
      setFinalOrderId(response.data._id);

      if (formData.paymentMethod === 'COD') {
        toast.success('Order Successfully Logged');
        setTimeout(() => navigate(`/order-confirmation/${response.data._id}`), 1500);
      } else {
        setShowGateway(true);
      }
    } catch (err) {
      toast.error(err.message || 'Transmission Error');
      setSubmitting(false);
    }
  };

  const handleFakePayment = () => {
    setGatewayStatus('processing');
    setTimeout(() => {
      setGatewayStatus('success');
      setTimeout(() => navigate(`/order-confirmation/${finalOrderId}`), 2000);
    }, 3500);
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', input: 'bg-gray-50 border-gray-200 text-black' };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}><Loader2 className="animate-spin text-amber-500" /></div>;

  const total = cart.totalPrice + (cart.totalPrice * 0.18);

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/10 pb-8">
          <div className="space-y-2 text-left">
            <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
              <ChevronLeft size={14} strokeWidth={3} /> Return to Bag
            </button>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Checkout</h1>
          </div>
          <div className="flex items-center gap-3 text-amber-500">
            <Lock size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure 256-bit Protocol</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form Fields */}
          <div className="lg:col-span-7 space-y-12 animate-in fade-in slide-in-from-left-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Legal Full Name" name="fullName" value={formData.fullName} onChange={handleChange} theme={theme} />
              <InputGroup label="Mobile Sequence" name="phone" value={formData.phone} onChange={handleChange} theme={theme} />
              <div className="md:col-span-2">
                <InputGroup label="Email Identifier" name="email" value={formData.email} onChange={handleChange} theme={theme} />
              </div>
              <div className="md:col-span-2">
                <InputGroup label="Address Line" name="addressLine1" value={formData.addressLine1} onChange={handleChange} theme={theme} />
              </div>
              <InputGroup label="City" name="city" value={formData.city} onChange={handleChange} theme={theme} />
              <InputGroup label="State" name="state" value={formData.state} onChange={handleChange} theme={theme} />
              <InputGroup label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} theme={theme} />
            </div>

            <div className="pt-8 border-t border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-6">Payment Strategy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['COD', 'UPI'].map(m => (
                  <label key={m} className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${formData.paymentMethod === m ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500' : `${theme.card} opacity-40 hover:opacity-100`}`}>
                    <input type="radio" name="paymentMethod" value={m} checked={formData.paymentMethod === m} onChange={handleChange} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 ${formData.paymentMethod === m ? 'border-amber-500 bg-amber-500' : 'border-gray-500'}`} />
                    <span className="text-[11px] font-black uppercase">{m === 'COD' ? 'Pay on Delivery' : 'Digital / UPI'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-5 space-y-8 sticky top-32 h-fit animate-in fade-in slide-in-from-right-4">
            <div className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-8`}>
              <h2 className="text-xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-4">Manifest</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map(item => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <img src={item.product.images[0]} className="w-14 h-14 rounded-xl object-cover grayscale" alt="" />
                    <div className="flex-grow">
                      <p className="text-[10px] font-black uppercase tracking-widest truncate w-32">{item.product.name}</p>
                      <p className="text-[9px] font-bold text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black italic">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-gray-400">Net Total (Inc. Tax)</span>
                  <span className="text-4xl font-black italic text-amber-500">₹{total.toLocaleString()}</span>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-amber-600 hover:bg-amber-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 shadow-xl mt-4">
                  {submitting ? 'Initializing...' : 'Confirm Protocol'}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>

      {/* GATEWAY MODAL */}
      {showGateway && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className={`w-full max-w-md p-10 rounded-[3rem] border bg-[#0a0a0a] text-white transition-all duration-700 ${gatewayStatus === 'success' ? 'border-green-500/50 scale-105' : 'border-white/10'}`}>
            <div className="flex justify-between items-center mb-10 text-amber-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="flex items-center gap-2"><Cpu size={18} /> CIPHER</div>
              <Globe size={14} className="opacity-20" />
            </div>
            {gatewayStatus === 'pending' ? (
              <div className="space-y-8 text-center animate-in fade-in">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Settlement Required</h2>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-amber-500">UPI Terminal</span>
                  <span className="text-xl font-black italic">₹{total.toLocaleString()}</span>
                </div>
                <button onClick={handleFakePayment} className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-amber-500 transition-all">Authenticate & Pay</button>
              </div>
            ) : gatewayStatus === 'processing' ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-8 text-center">
                <div className="relative"><Loader2 className="animate-spin text-amber-500" size={80} /><Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={24} /></div>
                <h2 className="text-xl font-black uppercase italic tracking-widest">Validating Ledger</h2>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in">
                <CheckCircle2 className="text-green-500" size={80} />
                <h2 className="text-2xl font-black uppercase italic text-green-500 tracking-widest">Authorized</h2>
              </div>
            )}
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-center gap-3 opacity-30 text-[8px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> SECURED PROTOCOL
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const InputGroup = ({ label, name, value, onChange, theme }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">{label}</label>
    <input name={name} value={value} onChange={onChange} className={`w-full py-4 px-6 rounded-2xl text-[11px] font-bold uppercase outline-none border transition-all ${theme.input} focus:border-amber-500`} />
  </div>
);

export default Checkout;