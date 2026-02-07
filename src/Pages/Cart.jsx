import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { isAuthenticated } from '../utils/auth';
import { 
  ChevronLeft, Trash2, Minus, Plus, ShoppingBag, 
  ArrowRight, ShieldCheck, Truck, RefreshCcw, Loader2 
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Identity Verification Required');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      toast.error('Failed to index bag');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      const response = await cartService.updateCartItem(itemId, newQuantity);
      setCart(response.data);
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    try {
      const response = await cartService.removeFromCart(productId, size, color);
      setCart(response.data);
      toast.success('Entity Removed');
    } catch (err) {
      toast.error('De-indexing failed');
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', input: 'bg-white/5' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', input: 'bg-gray-100' };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Syncing Bag...</p>
    </div>
  );

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/10 pb-8">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-2">
              <ChevronLeft size={14} strokeWidth={3} /> Return
            </button>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Your <span className="font-serif not-italic font-light text-amber-600">Bag</span>
            </h1>
          </div>
          {!isEmpty && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
              Manifest Contains [{cart.totalItems}] Entities
            </p>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in zoom-in-95 duration-1000">
             <div className={`w-32 h-32 rounded-[3rem] ${theme.card} border flex items-center justify-center text-amber-500 shadow-2xl`}>
                <ShoppingBag size={48} strokeWidth={1} />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Bag Is Void</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-xs">Initialize your collection by indexing items from the catalog.</p>
             </div>
             <button onClick={() => navigate('/products')} className="bg-amber-600 text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-amber-600/20">
                Explore Catalog
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* ITEM LIST */}
            <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
              {cart.items.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-white/5 last:border-0 group">
                  {/* Image Section */}
                  <div className={`relative w-full sm:w-48 aspect-[3/4] rounded-3xl overflow-hidden border ${theme.card} shrink-0 cursor-pointer shadow-lg`} onClick={() => navigate(`/productdetail?id=${item.product._id}`)}>
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover " />
                  </div>

                  {/* Detail Section */}
                  <div className="flex flex-col justify-between flex-grow py-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">{item.product.brand}</span>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter cursor-pointer hover:text-amber-500 transition-colors" onClick={() => navigate(`/productdetail?id=${item.product._id}`)}>{item.product.name}</h3>
                        </div>
                        <span className="text-xl font-black tracking-tighter italic">₹{item.price.toLocaleString()}</span>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {item.size && (
                          <div className={`px-3 py-1 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} text-[10px] font-black uppercase`}>
                            Size: {item.size}
                          </div>
                        )}
                        {item.color && (
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} text-[10px] font-black uppercase`}>
                            Color: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.toLowerCase() }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <div className={`inline-flex items-center gap-8 px-4 py-2 rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || updatingItems[item._id]} className="hover:text-amber-500 transition-colors disabled:opacity-20"><Minus size={14} /></button>
                        <span className="text-xs font-black w-4 text-center">{updatingItems[item._id] ? '...' : item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock || updatingItems[item._id]} className="hover:text-amber-500 transition-colors disabled:opacity-20"><Plus size={14} /></button>
                      </div>

                      <button onClick={() => handleRemoveItem(item.product._id, item.size, item.color)} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-4 sticky top-32">
              <div className={`p-8 rounded-[2.5rem] border ${theme.card} space-y-8 animate-in fade-in slide-in-from-right-4 duration-700`}>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Manifest Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span className={theme.text}>₹{cart.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Global Logistics</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Duty (Estimated)</span>
                    <span className={theme.text}>₹{(cart.totalPrice * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Net Total</span>
                    <span className="text-4xl font-black tracking-tighter italic">₹{(cart.totalPrice * 1.12).toLocaleString()}</span>
                  </div>
                  
                  <button onClick={() => navigate('/checkout')} className="w-full bg-amber-600 hover:bg-amber-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 shadow-xl shadow-amber-600/20 flex items-center justify-center gap-3">
                    Proceed to Protocol <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>

                <div className="space-y-4 pt-4">
                   <FeatureRow icon={<ShieldCheck size={14}/>} text="Secured Cipher Payments" />
                   <FeatureRow icon={<Truck size={14}/>} text="Premium Express Delivery" />
                   <FeatureRow icon={<RefreshCcw size={14}/>} text="14-Day Aesthetic Return" />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
};

const FeatureRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 opacity-40 text-[9px] font-black uppercase tracking-widest">
    <span className="text-amber-500">{icon}</span>
    {text}
  </div>
);

export default Cart;