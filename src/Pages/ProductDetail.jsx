import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../config/api';
import { cartService } from '../services/cartService';
import { isAuthenticated } from '../utils/auth';
import { 
  ChevronLeft, ShoppingBag, Zap, ShieldCheck, 
  Minus, Plus, Info 
} from 'lucide-react';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const Id = searchParams.get("id");
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Id) { navigate('/products'); return; }
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${Id}`);
        if (res.data?.success && res.data?.data) {
          setProduct(res.data.data);
          if (res.data.data.sizes?.length > 0) setSelectedSize(res.data.data.sizes[0]);
          if (res.data.data.colors?.length > 0) setSelectedColor(res.data.data.colors[0]);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Identity fetch failed');
      } finally { setLoading(false); }
    };
    fetchDetail();
  }, [Id, navigate]);

  const handleAddToCart = async (btn = 'cart') => {
    if (!isAuthenticated()) { toast.warning('Authentication Required'); navigate('/login'); return; }
    try {
      setIsAdding(true);
      await cartService.addToCart(product._id, quantity, selectedSize, selectedColor);
      if(btn === 'shoping')
      {
        navigate('/checkout')
      }
      toast.success('Secured in Bag');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setIsAdding(false); }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl' };

  if (loading) return <div className={`h-screen w-full flex items-center justify-center ${theme.bg}`}><p className="animate-pulse text-amber-500 font-black uppercase text-[10px] tracking-[0.5em]">Loading Archive...</p></div>;
  if (!product) return null;

  const discountedPrice = product.price * (1 - (product.discount / 100));

  return (
    <main className={`relative w-full ${theme.bg} ${theme.text} transition-colors duration-700 font-sans overflow-x-hidden
      lg:h-screen lg:overflow-hidden` /* Lock screen on Laptop */
    }>
      
      {/* Scrollable Container for Mobile, Grid for Desktop */}
      <div className="flex flex-col lg:flex-row h-full w-full pt-24 lg:pt-0">
        
        {/* LEFT: IMAGE SECTION (Fixed 100vh on Laptop) */}
        <section className="w-full lg:w-1/2 h-[60vh] lg:h-full p-4 lg:p-12 flex items-center justify-center">
          <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden border ${theme.card}`}>
            <img 
              src={product.images?.[0]} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            <button 
              onClick={() => navigate(-1)} 
              className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-amber-600 transition-all"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
          </div>
        </section>

        {/* RIGHT: CONTENT SECTION (Scrollable internally on Laptop if needed) */}
        <section className="w-full  lg:w-1/2 h-auto lg:h-full  custom-scrollbar p-6 lg:p-20 flex flex-col justify-center">
          <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Edition 2026</span>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-3xl font-black tracking-tighter">
                <span>₹{discountedPrice.toLocaleString()}</span>
                {product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through opacity-40 italic">₹{product.price.toLocaleString()}</span>
                )}
              </div>
            </div>

            <p className="text-xs lg:text-sm font-medium leading-relaxed opacity-60 uppercase tracking-tight line-clamp-3">
              {product.description}
            </p>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-amber-500/10">
              {/* Sizes */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Size Hierarchy</h5>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedSize === size ? 'bg-amber-600 border-amber-600 text-black shadow-lg' : 'border-white/10 hover:border-white/40'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Volume</h5>
                <div className="inline-flex items-center gap-6 px-4 py-2 rounded-xl border border-white/10">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus size={14}/></button>
                  <span className="text-xs font-black">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))}><Plus size={14}/></button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-amber-500 transition-all active:scale-95"
              >
                Add to Bag
              </button>
              <button 
              onClick={()=>handleAddToCart('shoping')}
                className="flex-1 bg-amber-600 text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-amber-500 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap size={14} fill="currentColor" /> Direct Entry
              </button>
            </div>

            {/* Trust Footer */}
            <div className={`p-6 rounded-[2rem] border ${theme.card} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-500" size={18} />
                <span className="text-[9px] font-black uppercase tracking-widest">Genuine Archive</span>
              </div>
              <div className="flex items-center gap-3">
                <Info className="text-amber-500" size={18} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${product.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>
                   Stock: {product.stock}
                </span>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;