import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';
import {
  ShieldAlert, Lock, Truck, RefreshCcw,
  ChevronRight, FileText, Loader2, Mail
} from 'lucide-react';

const TermsConditions = () => {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const [activeTab, setActiveTab] = useState(type || 'terms');
  const [termsContent, setTermsContent] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'terms', title: 'Terms of Service', icon: <FileText size={18} /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock size={18} /> },
    { id: 'shipping', title: 'Shipping Policy', icon: <Truck size={18} /> },
    { id: 'returns', title: 'Returns & Refunds', icon: <RefreshCcw size={18} /> },
  ];

  useEffect(() => {
    if (location.pathname === '/privacy-policy') navigate('/terms/privacy', { replace: true });
    if (location.pathname === '/shipping-policy') navigate('/terms/shipping', { replace: true });
    if (location.pathname === '/returns-policy') navigate('/terms/returns', { replace: true });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (type) setActiveTab(type);
  }, [type]);

  useEffect(() => {
    fetchTerms(activeTab);
  }, [activeTab]);

  const fetchTerms = async (tab) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/terms/${tab}`);
      if (res.data.success) {
        setTermsContent((prev) => ({ ...prev, [tab]: res.data.data }));
      }
    } catch {
      setTermsContent((prev) => ({ ...prev, [tab]: null }));
    } finally {
      setLoading(false);
    }
  };

  const theme = isDark
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', active: 'bg-amber-500 text-black' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-200 shadow-xl', active: 'bg-black text-white' };

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-32 pb-20`}>
      <div className="max-w-7xl mx-auto px-6">

        <header className="mb-20 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 italic">
            Legal Repository
          </span>
          <h1 className="text-6xl font-black uppercase italic">Corporate Protocol</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/terms/${tab.id}`)}
                className={`w-full p-6 rounded-2xl border flex justify-between
                  ${activeTab === tab.id ? theme.active : theme.card}`}
              >
                <div className="flex items-center gap-4">
                  {tab.icon}
                  <span className="text-[11px] font-black uppercase">{tab.title}</span>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}

            <div className="mt-10 p-8 rounded-3xl border border-dashed">
              <p className="text-xs uppercase opacity-60">Legal Inquiry</p>
              <a href="mailto:legal@essential.com" className="flex gap-2 mt-2">
                <Mail size={14} /> legal@essential.com
              </a>
            </div>
          </aside>

          <section className="lg:col-span-8">
            {loading ? (
              <div className="py-32 flex justify-center">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : termsContent[activeTab] ? (
              <div className={`p-12 rounded-3xl border ${theme.card}`}>
                <h2 className="text-3xl font-black mb-6">
                  {termsContent[activeTab].title}
                </h2>
                <div
                  className="prose prose-invert max-w-none opacity-70"
                  dangerouslySetInnerHTML={{
                    __html: termsContent[activeTab].content,
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-32">
                <ShieldAlert size={48} className="mx-auto opacity-20" />
                <button
                  onClick={() => fetchTerms(activeTab)}
                  className="mt-6 px-8 py-4 bg-amber-500 text-black rounded-xl"
                >
                  Retry
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsConditions;
