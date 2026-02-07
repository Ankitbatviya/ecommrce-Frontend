import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { 
  User, Package, ShieldCheck, Tag, Plus, 
  LogOut, ChevronRight, Loader2, Calendar,
  Mail, Briefcase, Camera, X
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);
  
  // App States
  const [userData, setUserData] = useState({ Fullname: '', Email: '', Role: '', CreatedAt: '' });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', brand: '', category: 'Apparel',
    gender: 'Unisex', price: '', discount: '0', sizes: [],
    colors: [], stock: '', images: ['']
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (userData.Role === 'partner' && activeTab === 'products') fetchPartnerProducts();
  }, [activeTab, userData.Role]);

  useEffect(() => {
    filterOrdersByStatus(orderFilter);
  }, [orders, orderFilter]);

  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get('authToken');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.success) setUserData(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session Expired');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = Cookies.get('authToken');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(res.data.data);
        setFilteredOrders(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPartnerProducts = async () => {
    try {
      const token = Cookies.get('authToken');
      const res = await axios.get('http://localhost:8000/api/products/partner', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.success) setPartnerProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === 'all') setFilteredOrders(orders);
    else setFilteredOrders(orders.filter(o => o.orderStatus?.toLowerCase().includes(status.toLowerCase())));
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('userInfo');
    toast.info('Session Terminated');
    navigate('/login');
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', sub: 'text-gray-500', activeTab: 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100 shadow-xl', sub: 'text-gray-400', activeTab: 'bg-black text-white' };

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme.bg}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Syncing Identity...</p>
    </div>
  );

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Profile Identity Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-amber-500/10 pb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-amber-500 flex items-center justify-center text-black text-4xl font-black shadow-2xl overflow-hidden">
                {userData.Fullname?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-xl shadow-lg border-4 border-[#050505] opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{userData.Fullname}</h1>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${userData.Role === 'partner' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {userData.Role}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-amber-500" /> {userData.Email}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={16} /> Terminate Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-3 sticky top-32">
            <TabBtn id="profile" icon={<User size={18}/>} label="Identity Manifest" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
            <TabBtn id="orders" icon={<Package size={18}/>} label="Acquisition History" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
            {userData.Role === 'partner' && (
              <TabBtn id="products" icon={<Tag size={18}/>} label="Merchant Archive" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
            )}
            <TabBtn id="security" icon={<ShieldCheck size={18}/>} label="Security Protocol" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          </aside>

          {/* Dynamic Content Area */}
          <section className="lg:col-span-9 animate-in fade-in slide-in-from-right-4 duration-700">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className={`p-8 md:p-12 rounded-[3rem] border ${theme.card} space-y-12`}>
                <div className="space-y-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500 border-b border-white/5 pb-4">Personal Metadata</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <InfoBlock label="Full Legal Name" value={userData.Fullname} />
                    <InfoBlock label="Digital Identifier" value={userData.Email} />
                    <InfoBlock label="Protocol Access" value={userData.Role} />
                    <InfoBlock label="Initialization Date" value={new Date(userData.CreatedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} />
                  </div>
                </div>
                <button className="px-8 py-4 bg-white text-black dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95">Update Identity</button>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black uppercase italic tracking-tighter">Manifest History ({orders.length})</h2>
                   <select 
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-amber-500 outline-none cursor-pointer"
                   >
                     <option value="all">All Status</option>
                     <option value="pending">Pending</option>
                     <option value="delivered">Delivered</option>
                   </select>
                </div>

                <div className="space-y-6">
                  {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div key={order._id} className={`p-6 rounded-[2.5rem] border ${theme.card} flex flex-col md:flex-row items-center justify-between gap-6 hover:border-amber-500/30 transition-all`}>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 border border-white/5">
                          <Package size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Protocol #{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-black italic uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Settlement</p>
                          <p className="text-lg font-black italic">₹{order.totalAmount?.toLocaleString()}</p>
                        </div>
                        <StatusBadge status={order.orderStatus} />
                        <button onClick={() => navigate(`/order/${order._id}`)} className="p-3 bg-white/5 rounded-full hover:bg-amber-500 hover:text-black transition-all">
                          <ChevronRight size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em]">Archive Empty</p></div>
                  )}
                </div>
              </div>
            )}

            {/* PARTNER PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">Inventory Control</h2>
                  <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 bg-amber-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 active:scale-95 shadow-xl shadow-amber-500/10">
                    <Plus size={14} strokeWidth={3} /> Create Entity
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {partnerProducts.map(product => (
                     <div key={product._id} className={`p-6 rounded-[2.5rem] border ${theme.card} flex gap-6 group hover:border-amber-500/30 transition-all`}>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-white/5">
                           <img src={product.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                           <div className="space-y-1">
                             <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">{product.brand}</p>
                             <h4 className="text-sm font-black uppercase truncate w-32">{product.name}</h4>
                             <p className="text-xs font-black italic tracking-tighter">₹{product.price}</p>
                           </div>
                           <div className="flex gap-2">
                              <button className="text-[8px] font-black uppercase underline decoration-amber-500/30 underline-offset-4 opacity-40 hover:opacity-100">Edit</button>
                              <button className="text-[8px] font-black uppercase underline decoration-red-500/30 underline-offset-4 text-red-500/60 hover:text-red-500">Delete</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ADD PRODUCT MODAL OVERLAY */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 rounded-[3rem] border border-white/5 bg-[#0a0a0a] text-white shadow-2xl relative custom-scrollbar`}>
              <button onClick={() => setShowAddProduct(false)} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
                <X size={24} strokeWidth={3} />
              </button>
              <div className="mb-10 space-y-2 text-center">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">New Product Entity</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Registering slow-fashion archive</p>
              </div>
              {/* Form placeholder - keep your form logic here */}
              <div className="py-10 text-center opacity-40 italic text-xs uppercase tracking-widest">Initialization Protocol UI Loading...</div>
           </div>
        </div>
      )}
    </main>
  );
};

// HELPER COMPONENTS
const TabBtn = ({ id, icon, label, activeTab, setActiveTab, theme }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`w-full p-5 rounded-2xl border transition-all duration-500 flex items-center gap-4 group 
      ${activeTab === id ? theme.activeTab : `${theme.card} opacity-50 hover:opacity-100 hover:border-amber-500/20`}`}
  >
    <div className={`${activeTab === id ? 'text-current' : 'text-amber-500 group-hover:scale-110 transition-transform'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{label}</p>
    <p className="text-sm font-bold uppercase tracking-tight">{value || 'UNAVAILABLE'}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${styles[status] || 'bg-white/5 text-gray-500 border-white/5'}`}>
      {status || 'LOGGED'}
    </span>
  );
};

export default UserProfile;