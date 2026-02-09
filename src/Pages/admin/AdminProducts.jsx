import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { PackagePlus, Edit3, Trash2, Search, X, Layers, ChevronRight, ChevronLeft } from 'lucide-react';
import AdminNav from '../../components/admin/AdminNav';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: '', description: '', brand: '', category: 'Apparel',
    gender: 'Unisex', price: '', discount: '0', sizes: [],
    colors: [], stock: '', images: [], author: 'Admin'
  });

  const fetchProducts = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { category: categoryFilter === 'all' ? '' : categoryFilter, search: searchTerm }
      });
      if (response.data.success) setProducts(response.data.data || []);
    } catch (e) { toast.error('Catalog sync failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [categoryFilter, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setNewProduct(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      const url = editingProduct ? `${import.meta.env.VITE_API_URL}/api/products/admin/${editingProduct._id}` : `${import.meta.env.VITE_API_URL}/api/products/admin`;
      const method = editingProduct ? 'put' : 'post';
      const response = await axios[method](url, newProduct, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        toast.success('Record Synchronized');
        handleCloseModal();
        fetchProducts();
      }
    } catch (e) { toast.error('Matrix error'); }
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setFormStep(1);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({ name: '', description: '', brand: '', category: 'Apparel', gender: 'Unisex', price: '', discount: '0', sizes: [], colors: [], stock: '', images: [], author: 'Admin' });
    setEditingProduct(null);
  };

  const theme = isDark
    ? { card: 'bg-[#111] border-white/5', input: 'bg-white/5 border-white/10 text-white', option: 'bg-[#1a1a1a] text-white' }
    : { card: 'bg-white border-slate-200 shadow-sm', input: 'bg-white border-slate-300 text-slate-900', option: 'bg-white text-slate-900' };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 pb-32 font-sans overflow-x-hidden`}>
      <AdminNav isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-7xl mx-auto pt-24 px-4 animate-in slide-in-from-right-10 duration-700">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600'}`}>
              <ChevronLeft size={14} strokeWidth={3} /> Hub
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic">Vault.Core</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Catalog Operations</p>
            </div>
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center gap-2 bg-amber-500 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all">
            <PackagePlus size={16} strokeWidth={3} /> New Entry
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input type="text" placeholder="Scan catalog..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full ${theme.input} rounded-2xl py-4 px-12 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all`} />
            <Search className="absolute left-4 top-4 text-slate-500" size={20} />
          </div>
          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`appearance-none w-full md:w-56 ${theme.input} rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest outline-none`}>
              <option className={theme.option} value="all">Global Catalog</option>
              <option className={theme.option} value="Apparel">Apparel</option>
              <option className={theme.option} value="Electronics">Electronics</option>
              <option className={theme.option} value="Footwear">Footwear</option>
            </select>
            <Layers className="absolute right-4 top-4 text-amber-500 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Table Area */}
        <div className={`${theme.card} rounded-[2rem] border overflow-hidden shadow-2xl`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                  <th className="px-6 py-5">Product Matrix</th>
                  <th className="px-6 py-5">Valuation</th>
                  <th className="px-6 py-5">Availability</th>
                  <th className="px-6 py-5 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-amber-500/[0.03] transition-colors group text-sm">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-white/5 border border-white/10" />
                        <div className="min-w-0">
                          <p className="font-black tracking-tight truncate">{p.name}</p>
                          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-black tracking-tighter">₹{(p.price * (1 - p.discount / 100)).toLocaleString()}</p>
                      {p.discount > 0 && <span className="text-[9px] line-through text-slate-500 italic">₹{p.price}</span>}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500 animate-pulse'}`}>
                        {p.stock} Units
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button onClick={() => { setEditingProduct(p); setNewProduct({ ...p }); setShowAddForm(true); }} className="p-2 text-slate-400 hover:text-amber-500"><Edit3 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* COMPACT MULTI-STEP MODAL (Prevents Scrollbar) */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-slate-200'} border w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden`}>

            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${formStep >= 1 ? 'bg-amber-500' : 'bg-white/10'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${formStep === 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
            </div>

            <button onClick={handleCloseModal} className="absolute right-8 top-12 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
            <h2 className="text-xl font-black tracking-tighter mb-6">{editingProduct ? 'Modding System' : 'Init System'} // {formStep === 1 ? 'Identity' : 'Market'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formStep === 1 ? (
                <div className="space-y-4 animate-in slide-in-from-left-5 duration-300">
                  <FormInput label="Identifier Name" name="name" value={newProduct.name} onChange={handleInputChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Brand" name="brand" value={newProduct.brand} onChange={handleInputChange} required />
                    <FormInput label="Author" name="author" value={newProduct.author} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Description</label>
                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows="2" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none text-white scrollbar-hide" required placeholder="Product description..." />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Image Stream</label>
                    <textarea value={newProduct.images.join('\n')} onChange={(e) => setNewProduct(prev => ({ ...prev, images: e.target.value.split('\n').filter(url => url.trim()) }))} rows="2" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none text-white scrollbar-hide" required placeholder="Paste URLs per line..." />
                  </div>
                  <button type="button" onClick={() => setFormStep(2)} className="w-full flex items-center justify-center gap-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                    Phase 02 <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect label="Category" name="category" value={newProduct.category} onChange={handleInputChange} options={['Apparel', 'Electronics', 'Footwear', 'Accessories']} required />
                    <FormSelect label="Gender" name="gender" value={newProduct.gender} onChange={handleInputChange} options={['Male', 'Female', 'Unisex']} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Base (₹)" type="number" name="price" value={newProduct.price} onChange={handleInputChange} required />
                    <FormInput label="Discount %" type="number" name="discount" value={newProduct.discount} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Stock" type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} required />
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Colors</label>
                      <input type="text" value={newProduct.colors.join(', ')} onChange={(e) => setNewProduct(prev => ({ ...prev, colors: e.target.value.split(',').map(item => item.trim()).filter(item => item) }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold outline-none text-white" placeholder="Red, Blue, Green" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Sizes</label>
                    <input type="text" value={newProduct.sizes.join(', ')} onChange={(e) => setNewProduct(prev => ({ ...prev, sizes: e.target.value.split(',').map(item => item.trim()).filter(item => item) }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold outline-none text-white" placeholder="S, M, L, XL" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setFormStep(1)} className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}><ChevronLeft size={20} /></button>
                    <button type="submit" className="flex-1 bg-amber-500 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                      {editingProduct ? 'Update Core' : 'Execute Entry'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, type = "text", ...props }) => (
  <div>
    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">{label}</label>
    <input type={type} {...props} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-bold outline-none text-white focus:border-amber-500 transition-all" />
  </div>
);

const FormSelect = ({ label, options, ...props }) => (
  <div>
    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">{label}</label>
    <select {...props} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs font-black uppercase outline-none text-amber-500 appearance-none">
      {options.map(opt => <option key={opt} value={opt} className="bg-[#1a1a1a]">{opt}</option>)}
    </select>
  </div>
);

export default AdminProducts;