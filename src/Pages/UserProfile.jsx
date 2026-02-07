import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import api from '../api/api';

import {
  User, Package, ShieldCheck, Tag, Plus,
  LogOut, ChevronRight, Loader2,
  Mail, Camera, X
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const [userData, setUserData] = useState({ Fullname: '', Email: '', Role: '', CreatedAt: '' });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (userData.Role === 'partner' && activeTab === 'products') {
      fetchPartnerProducts();
    }
  }, [activeTab, userData.Role]);

  useEffect(() => {
    filterOrders(orderFilter);
  }, [orderFilter, orders]);

  const loadInitialData = async () => {
    try {
      await Promise.all([fetchUserProfile(), fetchUserOrders()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/api/users/profile');
      if (res.data.success) setUserData(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired');
        handleLogout();
      }
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      if (res.data.success) {
        setOrders(res.data.data);
        setFilteredOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPartnerProducts = async () => {
    try {
      const res = await api.get('/api/products/partner');
      if (res.data.success) setPartnerProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterOrders = (status) => {
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(o =>
          o.orderStatus?.toLowerCase().includes(status.toLowerCase())
        )
      );
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('userInfo');
    navigate('/login');
  };

  const theme = isDark
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', activeTab: 'bg-amber-500 text-black' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-100', activeTab: 'bg-black text-white' };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-28 pb-20`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <header className="mb-12 flex justify-between items-center border-b pb-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-amber-500 flex items-center justify-center text-black text-4xl font-black">
              {userData.Fullname?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic">{userData.Fullname}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Mail size={12} /> {userData.Email}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-red-500 flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3 space-y-3">
            <TabBtn id="profile" label="Profile" icon={<User />} {...{ activeTab, setActiveTab, theme }} />
            <TabBtn id="orders" label="Orders" icon={<Package />} {...{ activeTab, setActiveTab, theme }} />
            {userData.Role === 'partner' && (
              <TabBtn id="products" label="Products" icon={<Tag />} {...{ activeTab, setActiveTab, theme }} />
            )}
            <TabBtn id="security" label="Security" icon={<ShieldCheck />} {...{ activeTab, setActiveTab, theme }} />
          </aside>

          <section className="lg:col-span-9">

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <div key={order._id} className={`p-6 rounded-3xl border ${theme.card} flex justify-between`}>
                    <div>
                      <p className="text-xs opacity-50">#{order._id.slice(-8)}</p>
                      <p className="font-bold">{new Date(order.createdAt).toDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-black">₹{order.totalAmount}</p>
                      <StatusBadge status={order.orderStatus} />
                      <ChevronRight />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="bg-[#0a0a0a] p-10 rounded-3xl relative">
            <button onClick={() => setShowAddProduct(false)} className="absolute top-6 right-6">
              <X />
            </button>
            <p className="opacity-40">Add Product UI</p>
          </div>
        </div>
      )}
    </main>
  );
};

const TabBtn = ({ id, icon, label, activeTab, setActiveTab, theme }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full p-4 rounded-xl flex items-center gap-3 border
      ${activeTab === id ? theme.activeTab : theme.card}`}
  >
    {icon}
    <span className="text-xs font-black uppercase">{label}</span>
  </button>
);

const StatusBadge = ({ status }) => {
  const map = {
    Pending: 'text-amber-500',
    Delivered: 'text-green-500',
    Processing: 'text-blue-500',
  };
  return <span className={`text-xs font-black ${map[status] || ''}`}>{status}</span>;
};

export default UserProfile;
