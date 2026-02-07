import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
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
    { id: 'terms', title: 'Terms of Service', icon: <FileText size={18}/> },
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock size={18}/> },
    { id: 'shipping', title: 'Shipping Policy', icon: <Truck size={18}/> },
    { id: 'returns', title: 'Returns & Refunds', icon: <RefreshCcw size={18}/> }
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path === '/privacy-policy') navigate('/terms/privacy', { replace: true });
    else if (path === '/shipping-policy') navigate('/terms/shipping', { replace: true });
    else if (path === '/returns-policy') navigate('/terms/returns', { replace: true });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (type && type !== activeTab) setActiveTab(type);
  }, [type]);

  useEffect(() => {
    fetchTerms(activeTab);
  }, [activeTab]);

  const fetchTerms = async (tabId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/terms/${tabId}`, { timeout: 5000 });
      if (response.data.success) {
        setTermsContent(prev => ({ ...prev, [tabId]: response.data.data }));
      }
    } catch (error) {
      console.error(error);
      setTermsContent(prev => ({ ...prev, [tabId]: null }));
    } finally {
      setLoading(false);
    }
  };

  const theme = isDark 
    ? { bg: 'bg-[#050505]', text: 'text-white', card: 'bg-[#111] border-white/5', active: 'bg-amber-500 text-black' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', card: 'bg-white border-gray-200 shadow-xl', active: 'bg-black text-white' };

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pt-32 pb-20 transition-colors duration-700 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="mb-20 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 italic">Legal Repository</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Corporate <span className="font-serif not-italic font-light text-amber-600">Protocol</span>
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-md">Documenting the governance and safety measures of the Essential narrative.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-4 sticky top-32">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/terms/${tab.id}`)}
                className={`w-full p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${activeTab === tab.id ? theme.active : `${theme.card} opacity-60 hover:opacity-100 hover:border-amber-500/30`}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${activeTab === tab.id ? 'text-current' : 'text-amber-500'}`}>{tab.icon}</div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{tab.title}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${activeTab === tab.id ? 'opacity-100' : 'opacity-20'}`} />
              </button>
            ))}

            <div className={`mt-10 p-8 rounded-[2.5rem] border border-dashed ${isDark ? 'border-white/10' : 'border-gray-300'} space-y-4`}>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Legal Inquiry</h4>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">For clarification regarding our protocols, reach out to our legal department.</p>
               <a href="mailto:legal@essential.com" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors">
                 <Mail size={14} /> legal@essential.com
               </a>
            </div>
          </aside>

          {/* Main Document Content */}
          <section className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-1000">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-amber-500" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Decrypting Protocol...</p>
              </div>
            ) : termsContent[activeTab] ? (
              <div className={`p-10 md:p-16 rounded-[3rem] border ${theme.card} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldAlert size={120} />
                </div>
                
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{termsContent[activeTab].title}</h2>
                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-gray-500 mb-12 pb-6 border-b border-white/5">
                   <span>Ver. {termsContent[activeTab].version || '1.0'}</span>
                   <span>Last Indexed: {new Date(termsContent[activeTab].lastUpdated).toLocaleDateString()}</span>
                </div>

                <div 
                  className="prose prose-sm prose-invert max-w-none 
                  text-sm font-medium leading-relaxed uppercase tracking-tight opacity-70 
                  space-y-6 [&>h1]:text-xl [&>h1]:font-black [&>h1]:text-white 
                  [&>h2]:text-lg [&>h2]:font-black [&>h2]:text-amber-500 [&>h2]:pt-6
                  [&>p]:mb-4 [&>br]:hidden"
                  dangerouslySetInnerHTML={{ 
                    __html: termsContent[activeTab].content.replace(/\n\n/g, '<br/><br/>')
                  }} 
                />
              </div>
            ) : (
              <div className="text-center py-32 space-y-6">
                 <ShieldAlert size={48} className="mx-auto text-red-500 opacity-20" />
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Protocol Void</h3>
                 <button onClick={() => fetchTerms(activeTab)} className="px-10 py-4 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest">Retry Retrieval</button>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
};

export default TermsConditions;